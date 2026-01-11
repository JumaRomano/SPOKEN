const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    /**
     * Send email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email body (HTML)
     */
    async sendEmail(to, subject, html) {
        if (!process.env.SMTP_USER) {
            logger.warn('SMTP credentials not configured. Email not sent.', { to, subject });
            return false;
        }

        try {
            const info = await this.transporter.sendMail({
                from: `"${process.env.APP_NAME || 'Spoken Word ChMS'}" <${process.env.SMTP_USER}>`,
                to,
                subject,
                html,
            });

            logger.info('Email sent:', { messageId: info.messageId, to });
            return true;
        } catch (error) {
            logger.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = new EmailService();
