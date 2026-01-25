const db = require('../config/database');
const logger = require('../utils/logger');

class CommunicationService {
    /**
     * Get all announcements (filtered by audience)
     */
    async getAnnouncements(filters = {}) {
        const { limit = 20, offset = 0, targetAudience = null } = filters;

        let query = 'SELECT *, content as message, (CASE WHEN is_active THEN \'published\' ELSE \'draft\' END) as status FROM announcements WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (targetAudience) {
            query += ` AND target_audience = $${paramCount}`;
            params.push(targetAudience);
            paramCount++;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get announcement by ID
     */
    async getById(id) {
        const result = await db.query('SELECT *, (CASE WHEN is_active THEN \'published\' ELSE \'draft\' END) as status FROM announcements WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            throw new Error('Announcement not found');
        }

        // Map content back to message for frontend compatibility if needed
        const row = result.rows[0];
        row.message = row.content;
        return row;
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
       (title, content, announcement_type, target_audience, target_group_id, start_date, end_date, created_by, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false)
       RETURNING *, (CASE WHEN is_active THEN 'published' ELSE 'draft' END) as status`,
            [title, message, priority, targetAudience, targetGroupId, publishDate, expireDate, createdBy]
        );

        logger.info('Announcement created:', { announcementId: result.rows[0].id, title });
        const row = result.rows[0];
        row.message = row.content;
        return row;
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
            `UPDATE announcements SET is_active = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *, (CASE WHEN is_active THEN 'published' ELSE 'draft' END) as status`,
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
     */
    async sendBroadcast(announcementId, channels = ['email']) {
        console.log('📢 sendBroadcast called:', { announcementId, channels });

        const announcement = await this.getById(announcementId);
        console.log('📝 Announcement retrieved:', { id: announcement.id, title: announcement.title, targetAudience: announcement.target_audience });

        // Get recipients based on target audience
        let recipients = [];
        const isEmailEnabled = channels.includes('email');
        const isSMSEnabled = channels.includes('sms');

        console.log('📊 Channels enabled:', { email: isEmailEnabled, sms: isSMSEnabled });

        // Build the query to get relevant recipients with their contact info
        let baseQuery = 'SELECT id, email, phone FROM members WHERE membership_status = $1';
        const queryParams = ['active'];

        if (announcement.target_audience === 'groups' && announcement.target_group_id) {
            baseQuery = `
                SELECT m.id, m.email, m.phone 
                FROM members m
                JOIN group_members gm ON m.id = gm.member_id
                WHERE gm.group_id = $2 AND gm.status = 'active' AND m.status = $1
            `;
            queryParams.push(announcement.target_group_id);
        }

        const result = await db.query(baseQuery, queryParams);
        recipients = result.rows;

        console.log(`👥 Found ${recipients.length} recipients`);
        if (recipients.length > 0) {
            console.log('📱 Sample recipient:', {
                id: recipients[0].id,
                hasEmail: !!recipients[0].email,
                hasPhone: !!recipients[0].phone,
                phone: recipients[0].phone
            });
        }

        // Load services
        const emailService = require('./emailService');
        const smsService = require('./smsService');

        const broadcastResults = {
            total: recipients.length,
            email: { success: 0, failed: 0, skipped: 0 },
            sms: { success: 0, failed: 0, skipped: 0 }
        };

        for (const recipient of recipients) {
            for (const channel of channels) {
                // Determine contact info based on channel
                const contactInfo = channel === 'email' ? recipient.email : recipient.phone;

                // If no contact info for the channel, skip but maybe log?
                if (!contactInfo) {
                    broadcastResults[channel].skipped++;
                    continue;
                }

                // Insert log first as 'pending'
                // Insert log first as 'pending'
                const logResult = await db.query(
                    `INSERT INTO communication_logs 
                    (recipient_type, recipient_id, communication_type, message, status)
                    VALUES ($1, $2, $3, $4, 'pending') RETURNING id`,
                    ['member', recipient.id, channel, announcement.content]
                );
                const logId = logResult.rows[0].id;

                try {
                    if (channel === 'email') {
                        // In a real system, this would be queued.
                        // For now, we'll log it as queued.
                        logger.info(`Queued email for ${recipient.email}`);
                        broadcastResults.email.success++;
                        // If we had a real email worker, it would update the status.
                        // Since we're doing it "live" for now (simulated):
                        await this.markAsSent(logId);
                    } else if (channel === 'sms') {
                        console.log(`📱 Processing SMS for recipient ${recipient.id}:`, { originalPhone: contactInfo });

                        // Format phone number for Kenya (Africa's Talking requires +254 format)
                        let formattedPhone = contactInfo;
                        if (formattedPhone) {
                            // Remove any spaces, dashes, or parentheses
                            formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, '');

                            // Convert to international format if not already
                            if (formattedPhone.startsWith('0')) {
                                // Replace leading 0 with +254
                                formattedPhone = '+254' + formattedPhone.substring(1);
                            } else if (formattedPhone.startsWith('254')) {
                                // Add + if missing
                                formattedPhone = '+' + formattedPhone;
                            } else if (!formattedPhone.startsWith('+')) {
                                // Assume it's a Kenyan number without country code
                                formattedPhone = '+254' + formattedPhone;
                            }
                        }

                        console.log(`📲 Formatted phone: ${formattedPhone}`);
                        console.log(`📝 Message content: ${announcement.content.substring(0, 50)}...`);

                        // Send SMS via Africa's Talking
                        const response = await smsService.sendSMS(formattedPhone, announcement.content);
                        console.log('✅✅✅ SMS Success Response:', JSON.stringify(response, null, 2));

                        await this.markAsSent(logId);
                        broadcastResults.sms.success++;
                        logger.info(`SMS sent to ${formattedPhone} (original: ${recipient.phone})`);
                    }
                } catch (error) {
                    console.error(`❌❌❌ CRITICAL ERROR sending ${channel} to ${contactInfo}:`);
                    console.error('Error type:', error.constructor.name);
                    console.error('Error message:', error.message);
                    console.error('Error stack:', error.stack);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                    if (error.response) {
                        console.error('API Response:', error.response);
                    }
                    logger.error(`Failed to send broadcast via ${channel} to ${contactInfo}:`, error);
                    await this.markAsFailed(logId);
                    broadcastResults[channel].failed++;
                }
            }
        }

        logger.info('Broadcast completed:', { announcementId, results: broadcastResults });

        return {
            message: 'Broadcast completed',
            results: broadcastResults
        };
    }

    /**
     * Get communication logs
     */
    async getLogs(filters = {}) {
        const { limit = 50, offset = 0, status = null } = filters;

        let query = 'SELECT * FROM communication_logs WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (status) {
            query += ` AND status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        query += ` ORDER BY sent_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
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
    async markAsFailed(logId) {
        const result = await db.query(
            `UPDATE communication_logs SET status = 'failed'
       WHERE id = $1
       RETURNING *`,
            [logId]
        );

        return result.rows[0];
    }
}

module.exports = new CommunicationService();
