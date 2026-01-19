const db = require('../config/database');
const logger = require('../utils/logger');

class GroupService {
    /**
     * Get all groups
     */
    async getAll(filters = {}) {
        const {
            limit = 20,
            offset = 0,
            category = null,
            status = 'active',
            search = '',
        } = filters;

        // Note: category filter maps to group_type column
        let query = `
      SELECT g.*, 
             m.first_name || ' ' || m.last_name as leader_name,
             (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
      FROM groups g
      LEFT JOIN members m ON g.leader_id = m.id
      WHERE g.is_active = $1
    `;
        const isActive = status === 'active';
        const params = [isActive];
        let paramCount = 2;

        if (category) {
            query += ` AND g.group_type = $${paramCount}`;
            params.push(category);
            paramCount++;
        }

        if (search) {
            query += ` AND g.name ILIKE $${paramCount}`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY g.name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        const countResult = await db.query(
            'SELECT COUNT(*) FROM groups WHERE is_active = $1',
            [isActive]
        );

        return {
            groups: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset,
        };
    }

    /**
     * Get group by ID
     */
    async getById(id) {
        const result = await db.query(
            `SELECT g.*, 
              m.first_name || ' ' || m.last_name as leader_name,
              m.email as leader_email,
              m.phone as leader_phone,
              (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count
       FROM groups g
       LEFT JOIN members m ON g.leader_id = m.id
       WHERE g.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Group not found');
        }

        return result.rows[0];
    }

    /**
     * Create group
     */
    async create(groupData) {
        const {
            name,
            description,
            category,
            groupType,
            leaderId = null,
            parentGroupId = null,
            meetingSchedule,
        } = groupData;

        // Support both groupType and category fields
        const type = groupType || category;

        const result = await db.query(
            `INSERT INTO groups (name, description, group_type, leader_id, parent_group_id, meeting_schedule, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
            [name, description, type, leaderId, parentGroupId, meetingSchedule]
        );

        logger.info('Group created:', { groupId: result.rows[0].id, name });
        return result.rows[0];
    }

    /**
     * Update group
     */
    async update(id, groupData) {
        const {
            name,
            description,
            category,
            groupType,
            leaderId,
            parentGroupId,
            meetingSchedule,
            status
        } = groupData;

        const type = groupType || category;

        const result = await db.query(
            `UPDATE groups SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        group_type = COALESCE($3, group_type),
        leader_id = COALESCE($4, leader_id),
        parent_group_id = COALESCE($5, parent_group_id),
        meeting_schedule = COALESCE($6, meeting_schedule),
        is_active = COALESCE($7, is_active),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
            [name, description, type, leaderId, parentGroupId, meetingSchedule, status === 'active', id]
        );

        if (result.rows.length === 0) {
            throw new Error('Group not found');
        }

        logger.info('Group updated:', { groupId: id });
        return result.rows[0];
    }

    /**
     * Delete group
     */
    async delete(id) {
        const result = await db.query(
            `UPDATE groups SET is_active = false, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Group not found');
        }

        logger.info('Group deleted:', { groupId: id });
        return { message: 'Group deleted successfully' };
    }

    /**
     * Get group members
     */
    async getMembers(groupId) {
        const result = await db.query(
            `SELECT m.*, gm.role as group_role, gm.joined_date as joined_at
       FROM members m
       JOIN group_members gm ON m.id = gm.member_id
       WHERE gm.group_id = $1
       ORDER BY gm.role, m.last_name, m.first_name`,
            [groupId]
        );

        return result.rows;
    }

    /**
     * Add member to group
     */
    async addMember(groupId, memberId, role = 'member') {
        try {
            const result = await db.query(
                `INSERT INTO group_members (group_id, member_id, role)
         VALUES ($1, $2, $3)
         RETURNING *`,
                [groupId, memberId, role]
            );

            logger.info('Member added to group:', { groupId, memberId, role });
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Member already in this group');
            }
            throw error;
        }
    }

    /**
     * Remove member from group
     */
    async removeMember(groupId, memberId) {
        const result = await db.query(
            `DELETE FROM group_members 
       WHERE group_id = $1 AND member_id = $2
       RETURNING *`,
            [groupId, memberId]
        );

        if (result.rows.length === 0) {
            throw new Error('Member not found in this group');
        }

        logger.info('Member removed from group:', { groupId, memberId });
        return { message: 'Member removed from group' };
    }

    /**
     * Get group finances
     */
    async getFinances(groupId, startDate = null, endDate = null) {
        let query = `
      SELECT * FROM group_finances
      WHERE group_id = $1
    `;
        const params = [groupId];
        let paramCount = 2;

        if (startDate) {
            query += ` AND transaction_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND transaction_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY transaction_date DESC`;

        const result = await db.query(query, params);

        // Calculate totals
        const totalsResult = await db.query(
            `SELECT 
        SUM(CASE WHEN transaction_type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN transaction_type = 'expense' THEN amount ELSE 0 END) as total_expenses
       FROM group_finances WHERE group_id = $1`,
            [groupId]
        );

        return {
            transactions: result.rows,
            totalIncome: parseFloat(totalsResult.rows[0].total_income || 0),
            totalExpenses: parseFloat(totalsResult.rows[0].total_expenses || 0),
            balance: parseFloat(totalsResult.rows[0].total_income || 0) - parseFloat(totalsResult.rows[0].total_expenses || 0),
        };
    }

    /**
     * Record group transaction
     */
    async recordTransaction(groupId, transactionData, recordedBy) {
        const { transactionType, amount, description, transactionDate } = transactionData;

        const result = await db.query(
            `INSERT INTO group_finances 
       (group_id, transaction_type, amount, description, transaction_date, recorded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [groupId, transactionType, amount, description, transactionDate || new Date(), recordedBy]
        );

        logger.info('Group transaction recorded:', { groupId, transactionType, amount });
        return result.rows[0];
    }

    /**
     * Get group attendance history
     */
    async getAttendance(groupId, limit = 20) {
        const result = await db.query(
            `SELECT * FROM group_attendance
       WHERE group_id = $1
       ORDER BY meeting_date DESC
       LIMIT $2`,
            [groupId, limit]
        );

        return result.rows;
    }
}

module.exports = new GroupService();
