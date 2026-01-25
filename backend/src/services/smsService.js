const africastalking = require('africastalking');
const logger = require('../utils/logger');

// Initialize Africa's Talking
const rawUsername = process.env.AT_USERNAME || 'sandbox';
const rawApiKey = process.env.AT_API_KEY;

// Trim credentials to prevent whitespace authentication errors
const username = rawUsername.trim();
const apiKey = rawApiKey ? rawApiKey.trim() : null;

// Log configuration status (masked)
console.log('🏗️ Initializing SMS Service...');
console.log(`👤 AT Username (Trimmed): '${username}'`);
console.log(`🔑 AT API Key Status: ${apiKey ? 'Present' : 'MISSING'}`);



class SMSService {
    /**
     * Send SMS to one or more recipients
     * @param {string|string[]} to - Phone number(s) in international format (e.g. +254XXXXXXXXX)
     * @param {string} message - Message content
     * @returns {Promise<any>}
     */
    async sendSMS(to, message) {
        // Re-read credentials at runtime to ensure they are fresh
        const currentUsername = (process.env.AT_USERNAME || 'sandbox').trim();
        const currentApiKey = (process.env.AT_API_KEY || '').trim();

        if (!currentApiKey) {
            logger.warn('⚠️ SMS service in simulation mode - API key not configured');
            logger.warn('SMS simulation: Sending message to', to, ':', message);
            return {
                status: 'simulated',
                recipients: Array.isArray(to) ? to : [to],
                message
            };
        }

        try {
            // Initialize SDK on demand
            const at = africastalking({
                username: currentUsername,
                apiKey: currentApiKey,
            });
            const sms = at.SMS;

            // Validate inputs
            if (!to || (Array.isArray(to) && to.length === 0)) {
                throw new Error('No recipient phone number provided');
            }
            if (!message || message.trim() === '') {
                throw new Error('Message content is empty');
            }

            // Africa's Talking expects recipients as a comma-separated string or array
            const options = {
                to: Array.isArray(to) ? to : [to],
                message: message.trim(),
            };

            // Add Sender ID if available
            if (process.env.AT_SENDER_ID) {
                options.from = process.env.AT_SENDER_ID;
            }

            logger.info('📤 Sending SMS via Africa\'s Talking...');
            logger.info(`Recipients: ${JSON.stringify(options.to)}`);
            logger.info(`Message: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`);
            logger.info(`Username: ${currentUsername}`);

            const response = await sms.send(options);

            logger.info('✅ SMS API Response:', JSON.stringify(response, null, 2));

            // Check for failures in response
            if (response.SMSMessageData && response.SMSMessageData.Recipients) {
                const recipients = response.SMSMessageData.Recipients;
                const failed = recipients.filter(r => r.status !== 'Success');
                const successful = recipients.filter(r => r.status === 'Success');

                if (failed.length > 0) {
                    logger.warn('⚠️ Some SMS failed to send:', failed);
                }
                if (successful.length > 0) {
                    logger.info('✅ SMS sent successfully to:', successful.map(r => r.number).join(', '));
                }
            }

            return response;
        } catch (error) {
            logger.error('❌ Error sending SMS via Africa\'s Talking:');
            logger.error('Error message:', error.message);
            if (error.response) {
                logger.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
                logger.error('API Response Status:', error.response.status);
            }
            throw error;
        }
    }
}

module.exports = new SMSService();
