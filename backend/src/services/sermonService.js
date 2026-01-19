const db = require('../config/database');
const logger = require('../utils/logger');

class SermonService {
    async getAll(filters = {}) {
        let query = 'SELECT * FROM sermons';
        const params = [];
        const conditions = [];

        if (filters.series) {
            params.push(filters.series);
            conditions.push(`series = $${params.length}`);
        }

        if (filters.speaker) {
            params.push(filters.speaker);
            conditions.push(`speaker = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY date DESC';

        if (filters.limit) {
            params.push(filters.limit);
            query += ` LIMIT $${params.length}`;
        }

        const result = await db.query(query, params);
        return result.rows;
    }

    async create(data) {
        const { title, video_url, speaker, series, description, date } = data;
        const result = await db.query(
            `INSERT INTO sermons (title, video_url, speaker, series, description, date)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [title, video_url, speaker, series, description, date]
        );
        logger.info('Sermon created:', { id: result.rows[0].id, title });
        return result.rows[0];
    }

    async delete(id) {
        const result = await db.query('DELETE FROM sermons WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new Error('Sermon not found');
        }
        logger.info('Sermon deleted:', { id });
        return { message: 'Sermon deleted successfully' };
    }
}

module.exports = new SermonService();
