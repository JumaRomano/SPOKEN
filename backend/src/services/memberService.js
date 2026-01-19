const db = require('../config/database');
const logger = require('../utils/logger');


class MemberService {
    /**
     * Get all members with pagination and filters
     */
    async getAll(filters = {}) {
        const {
            limit = 20,
            offset = 0,
            status = 'active',
            search = '',
            familyId = null,
        } = filters;

        let query = `
      SELECT m.*, f.family_name, u.email as user_email, u.role as user_role
      FROM members m
      LEFT JOIN families f ON m.family_id = f.id
      LEFT JOIN users u ON m.user_id = u.id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (status) {
            query += ` AND m.membership_status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (search) {
            query += ` AND (m.first_name ILIKE $${paramCount} OR m.last_name ILIKE $${paramCount} OR m.email ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        if (familyId) {
            query += ` AND m.family_id = $${paramCount}`;
            params.push(familyId);
            paramCount++;
        }

        query += ` ORDER BY m.last_name, m.first_name LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);

        // Get total count
        const countResult = await db.query(
            'SELECT COUNT(*) FROM members WHERE membership_status = $1',
            [status]
        );

        return {
            members: result.rows,
            total: parseInt(countResult.rows[0].count),
            limit,
            offset,
        };
    }

    /**
     * Get member by ID
     */
    async getById(id) {
        const result = await db.query(
            `SELECT m.*, f.family_name,
              u.email as user_email, u.role as user_role, u.is_active as user_status
       FROM members m
       LEFT JOIN families f ON m.family_id = f.id
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Member not found');
        }

        return result.rows[0];
    }

    /**
     * Create new member
     */
    async create(memberData) {
        const {
            userId = null,
            familyId = null,
            firstName,
            lastName,
            phone,
            email,
            dateOfBirth = null,
            gender,
            address = null,
            photoUrl = null,
            memberSince = new Date(),
        } = memberData;

        const result = await db.query(
            `INSERT INTO members 
       (user_id, family_id, first_name, last_name, phone, email, date_of_birth, 
        gender, address, profile_photo_url, membership_date, membership_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'active')
       RETURNING *`,
            [userId, familyId, firstName, lastName, phone, email, dateOfBirth,
                gender, address, photoUrl, memberSince]
        );

        logger.info('Member created:', { memberId: result.rows[0].id, firstName, lastName });
        return result.rows[0];
    }

    /**
     * Update member
     */
    async update(id, memberData) {
        const {
            familyId,
            firstName,
            lastName,
            phone,
            email,
            dateOfBirth,
            gender,
            address,
            photoUrl,
            status,
        } = memberData;

        const result = await db.query(
            `UPDATE members SET
        family_id = COALESCE($1, family_id),
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        phone = COALESCE($4, phone),
        email = COALESCE($5, email),
        date_of_birth = COALESCE($6, date_of_birth),
        gender = COALESCE($7, gender),
        address = COALESCE($8, address),
        profile_photo_url = COALESCE($9, profile_photo_url),
        membership_status = COALESCE($10, membership_status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
            [familyId, firstName, lastName, phone, email, dateOfBirth,
                gender, address, photoUrl, status, id]
        );

        if (result.rows.length === 0) {
            throw new Error('Member not found');
        }

        logger.info('Member updated:', { memberId: id });
        return result.rows[0];
    }

    /**
     * Delete member (soft delete)
     */
    async delete(id) {
        const result = await db.query(
            `UPDATE members SET membership_status = 'inactive', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Member not found');
        }

        logger.info('Member deleted:', { memberId: id });
        return { message: 'Member deleted successfully' };
    }

    /**
     * Get member's family
     */
    async getFamily(memberId) {
        const member = await this.getById(memberId);

        if (!member.family_id) {
            return { members: [] };
        }

        const result = await db.query(
            `SELECT * FROM members WHERE family_id = $1 AND membership_status = 'active'
       ORDER BY date_of_birth`,
            [member.family_id]
        );

        return {
            familyId: member.family_id,
            familyName: member.family_name,
            members: result.rows,
        };
    }

    /**
     * Get member's groups
     */
    async getGroups(memberId) {
        const result = await db.query(
            `SELECT g.*, gm.role as member_role, gm.joined_at
       FROM groups g
       JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.member_id = $1 AND gm.status = 'active'
       ORDER BY g.name`,
            [memberId]
        );

        return result.rows;
    }

    /**
     * Get member's attendance history
     */
    async getAttendance(memberId, limit = 20) {
        const result = await db.query(
            `SELECT s.service_date, s.service_type, ar.attendance_status as status
       FROM attendance_records ar
       JOIN services s ON ar.service_id = s.id
       WHERE ar.member_id = $1
       ORDER BY s.service_date DESC
       LIMIT $2`,
            [memberId, limit]
        );

        return result.rows;
    }

    /**
     * Get member's contributions
     */
    async getContributions(memberId, startDate = null, endDate = null) {
        let query = `
      SELECT c.*, f.fund_name, f.fund_type
      FROM contributions c
      JOIN funds f ON c.fund_id = f.id
      WHERE c.member_id = $1
    `;
        const params = [memberId];
        let paramCount = 2;

        if (startDate) {
            query += ` AND c.contribution_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND c.contribution_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY c.contribution_date DESC`;

        const result = await db.query(query, params);

        // Calculate totals
        const totalResult = await db.query(
            `SELECT SUM(amount) as total FROM contributions WHERE member_id = $1`,
            [memberId]
        );

        return {
            contributions: result.rows,
            total: parseFloat(totalResult.rows[0].total || 0),
        };
    }

    /**
     * Get member's event registrations
     */
    async getEvents(memberId) {
        const result = await db.query(
            `SELECT e.*, er.status as registration_status, er.registration_date
       FROM events e
       JOIN event_registrations er ON e.id = er.event_id
       WHERE er.member_id = $1
       ORDER BY e.start_date DESC`,
            [memberId]
        );

        return result.rows;
    }
}

module.exports = new MemberService();
