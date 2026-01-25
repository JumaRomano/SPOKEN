const africastalking = require('africastalking');
const logger = require('../utils/logger');

// Initialize Africa's Talking
const username = process.env.AT_USERNAME || 'sandbox';
const apiKey = process.env.AT_API_KEY;

let sms;

if (apiKey) {
    try {
        const at = africastalking({
            username,
            apiKey,
        });
        sms = at.SMS;
        logger.info('Africa\'s Talking SDK initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize Africa\'s Talking SDK:', error);
    }
} else {
    logger.warn('AT_API_KEY not found in environment variables. SMS service will be in simulated mode.');
}

class SMSService {
    /**
     * Send SMS to one or more recipients
     * @param {string|string[]} to - Phone number(s) in international format (e.g. +254XXXXXXXXX)
     * @param {string} message - Message content
     * @returns {Promise<any>}
     */
    async sendSMS(to, message) {
        if (!sms) {
            logger.warn('⚠️ SMS service in simulation mode - API key not configured');
            logger.warn('SMS simulation: Sending message to', to, ':', message);
            return {
                status: 'simulated',
                recipients: Array.isArray(to) ? to : [to],
                message
            };
        }

        try {
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
            logger.info(`Username: ${username}`);
            logger.info(`Sender ID: ${options.from || 'Default'}`);

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
            logger.error('Error details:', error.response?.data || error);
            logger.error('Stack trace:', error.stack);
            throw error;
        }
    }
}

module.exports = new SMSService();
