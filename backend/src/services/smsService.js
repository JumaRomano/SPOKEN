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
            logger.warn('SMS service simulation: Sending message to', to, ':', message);
            return {
                status: 'simulated',
                recipients: Array.isArray(to) ? to : [to],
                message
            };
        }

        try {
            // Africa's Talking expects recipients as a comma-separated string or array
            const options = {
                to: Array.isArray(to) ? to : [to],
                message: message,
            };

            // Add Sender ID if available
            if (process.env.AT_SENDER_ID) {
                options.from = process.env.AT_SENDER_ID;
            }

            const response = await sms.send(options);
            logger.info('SMS sent successfully:', response);
            return response;
        } catch (error) {
            logger.error('Error sending SMS via Africa\'s Talking:', error);
            throw error;
        }
    }
}

module.exports = new SMSService();
