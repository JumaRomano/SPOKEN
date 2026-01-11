const db = require('../config/database');
const logger = require('../utils/logger');

class CommunicationService {
    /**
     * Get all announcements (filtered by audience)
     */
    async getAnnouncements(filters = {}) {
        const { limit = 20, offset = 0, targetAudience = null, status = 'published' } = filters;

        let query = 'SELECT * FROM announcements WHERE status = $1';
        const params = [status];
        let paramCount = 2;

        if (targetAudience) {
            query += ` AND target_audience = $${paramCount}`;
            params.push(targetAudience);
            paramCount++;
        }

        query += ` ORDER BY publish_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get announcement by ID
     */
    async getById(id) {
        const result = await db.query('SELECT * FROM announcements WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            throw new Error('Announcement not found');
        }

        return result.rows[0];
    }

    /**
     * Create announcement
     */
    async create(announcementData, createdBy) {
        const {
            title,
            message,
            priority = 'normal',
            targetAudience = 'all',
            targetGroupId = null,
            publishDate = new Date(),
            expireDate = null,
        } = announcementData;

        const result = await db.query(
            `INSERT INTO announcements 
       (title, message, priority, target_audience, target_group_id, publish_date, expire_date, created_by, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       RETURNING *`,
            [title, message, priority, targetAudience, targetGroupId, publishDate, expireDate, createdBy]
        );

        logger.info('Announcement created:', { announcementId: result.rows[0].id, title });
        return result.rows[0];
    }

    /**
     * Update announcement
     */
    async update(id, announcementData) {
        const { title, message, priority, targetAudience, publishDate, expireDate, status } = announcementData;

        const result = await db.query(
            `UPDATE announcements SET
        title = COALESCE($1, title),
        message = COALESCE($2, message),
        priority = COALESCE($3, priority),
        target_audience = COALESCE($4, target_audience),
        publish_date = COALESCE($5, publish_date),
        expire_date = COALESCE($6, expire_date),
        status = COALESCE($7, status),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
            [title, message, priority, targetAudience, publishDate, expireDate, status, id]
        );

        if (result.rows.length === 0) {
            throw new Error('Announcement not found');
        }

        return result.rows[0];
    }

    /**
     * Delete announcement
     */
    async delete(id) {
        const result = await db.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            throw new Error('Announcement not found');
        }

        logger.info('Announcement deleted:', { announcementId: id });
        return { message: 'Announcement deleted successfully' };
    }

    /**
     * Publish announcement
     */
    async publish(id) {
        const result = await db.query(
            `UPDATE announcements SET status = 'published', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Announcement not found');
        }

        logger.info('Announcement published:', { announcementId: id });
        return result.rows[0];
    }

    /**
     * Send broadcast message (email/SMS)
     * This is a placeholder - actual email/SMS sending would be implemented separately
     */
    async sendBroadcast(announcementId, channels = ['email']) {
        const announcement = await this.getById(announcementId);

        // Get recipients based on target audience
        let recipients = [];

        if (announcement.target_audience === 'all') {
            const result = await db.query(
                'SELECT id, email FROM members WHERE status = $1 AND email IS NOT NULL',
                ['active']
            );
            recipients = result.rows;
        } else if (announcement.target_audience === 'groups' && announcement.target_group_id) {
            const result = await db.query(
                `SELECT m.id, m.email FROM members m
         JOIN group_members gm ON m.id = gm.member_id
         WHERE gm.group_id = $1 AND gm.status = 'active' AND m.email IS NOT NULL`,
                [announcement.target_group_id]
            );
            recipients = result.rows;
        }

        // Log communication attempts
        const emailService = require('./emailService'); // Late require to avoid circular dependency if any, or just easy refactor

        for (const recipient of recipients) {
            for (const channel of channels) {
                // Insert log first as 'pending'
                const logResult = await db.query(
                    `INSERT INTO communication_logs 
           (announcement_id, recipient_type, recipient_id, recipient_email, status, communication_type)
           VALUES ($1, $2, $3, $4, 'pending', $5) RETURNING id`,
                    [announcementId, channel, recipient.id, recipient.email, channel]
                );

                // If channel is email, try sending
                if (channel === 'email') {
                    // Fire and forget, or await? For broadcast, usually queue. 
                    // For now, we'll just simulate processing or call the service if we wanted to block (bad idea for broadcast).
                    // In a real system, this would push to a queue (Bull/RabbitMQ).
                    // We'll leave it as pending and assume a worker picks it up, or call emailService if it's a single message.
                    logger.info(`Queued email for ${recipient.email}`);
                }
            }
        }

        logger.info('Broadcast queued:', { announcementId, recipientCount: recipients.length, channels });

        return {
            message: 'Broadcast queued successfully',
            recipientCount: recipients.length,
            channels,
        };
    }

    /**
     * Get communication logs
     */
    async getLogs(filters = {}) {
        const { limit = 50, offset = 0, announcementId = null, status = null } = filters;

        let query = 'SELECT * FROM communication_logs WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (announcementId) {
            query += ` AND announcement_id = $${paramCount}`;
            params.push(announcementId);
            paramCount++;
        }

        if (status) {
            query += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Mark communication as sent
     */
    async markAsSent(logId) {
        const result = await db.query(
            `UPDATE communication_logs SET status = 'sent', sent_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
            [logId]
        );

        return result.rows[0];
    }

    /**
     * Mark communication as failed
     */
    async markAsFailed(logId, errorMessage) {
        const result = await db.query(
            `UPDATE communication_logs SET status = 'failed', error_message = $1
       WHERE id = $2
       RETURNING *`,
            [errorMessage, logId]
        );

        return result.rows[0];
    }
}

module.exports = new CommunicationService();
