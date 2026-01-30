const db = require('../config/database');

class MinutesService {
    async getAll(filters = {}) {
        const { limit = 20, offset = 0, groupId, startDate, endDate, search } = filters;

        let query = `
            SELECT m.*, 
                   u.email as author_email,
                   mem.first_name, mem.last_name,
                   g.name as group_name
            FROM meeting_minutes m
            LEFT JOIN users u ON m.created_by = u.id
            LEFT JOIN members mem ON mem.user_id = u.id
            LEFT JOIN groups g ON m.group_id = g.id
            WHERE 1=1
        `;

        const params = [];
        let paramCount = 1;

        if (groupId) {
            query += ` AND m.group_id = $${paramCount}`;
            params.push(groupId);
            paramCount++;
        }

        if (startDate) {
            query += ` AND m.meeting_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND m.meeting_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        if (search) {
            query += ` AND (m.title ILIKE $${paramCount} OR m.content ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY m.meeting_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    async getById(id) {
        const result = await db.query(`
            SELECT m.*, g.name as group_name
            FROM meeting_minutes m
            LEFT JOIN groups g ON m.group_id = g.id
            WHERE m.id = $1
        `, [id]);

        return result.rows[0];
    }

    async create(data, userId) {
        const { title, meetingDate, content, groupId } = data;

        const result = await db.query(`
            INSERT INTO meeting_minutes (title, meeting_date, content, group_id, created_by)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [title, meetingDate || new Date(), content, groupId || null, userId]);

        return result.rows[0];
    }

    async update(id, data) {
        const { title, meetingDate, content, groupId } = data;

        const result = await db.query(`
            UPDATE meeting_minutes
            SET title = COALESCE($1, title),
                meeting_date = COALESCE($2, meeting_date),
                content = COALESCE($3, content),
                group_id = COALESCE($4, group_id),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `, [title, meetingDate, content, groupId, id]);

        return result.rows[0];
    }

    async delete(id) {
        await db.query('DELETE FROM meeting_minutes WHERE id = $1', [id]);
        return { message: 'Deleted successfully' };
    }
}

module.exports = new MinutesService();
