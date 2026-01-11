const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET, JWT_EXPIRATION, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = require('../config/jwt');
const logger = require('../utils/logger');

class AuthService {
    /**
     * Register a new user
     */
    async register(userData) {
        const { email, password, role = 'member' } = userData;

        // Check if user exists
        const existing = await db.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existing.rows.length > 0) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const hash = await bcrypt.hash(password, 12);

        // Create user
        const result = await db.query(
            `INSERT INTO users (email, password_hash, role, is_active)
       VALUES ($1, $2, $3, true)
       RETURNING id, email, role, is_active, created_at`,
            [email, hash, role]
        );

        const user = result.rows[0];
        logger.info('User registered:', { userId: user.id, email: user.email });

        return user;
    }

    /**
     * Login user
     */
    async login(email, password) {
        // Get user
        const result = await db.query(
            'SELECT id, email, password_hash, role, is_active FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
            throw new Error('Account is inactive');
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate tokens
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);

        logger.info('User logged in:', { userId: user.id, email: user.email });

        return {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

            // Get user
            const result = await db.query(
                'SELECT id, email, role, is_active FROM users WHERE id = $1',
                [decoded.userId]
            );

            if (result.rows.length === 0 || !result.rows[0].is_active) {
                throw new Error('Invalid refresh token');
            }

            const user = result.rows[0];
            const newAccessToken = this.generateAccessToken(user);

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    /**
     * Change password
     */
    async changePassword(userId, currentPassword, newPassword) {
        // Get user
        const result = await db.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const hash = await bcrypt.hash(newPassword, 12);

        // Update password
        await db.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hash, userId]
        );

        logger.info('Password changed:', { userId });

        return { message: 'Password changed successfully' };
    }

    /**
     * Generate access token
     */
    generateAccessToken(user) {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );
    }

    /**
     * Generate refresh token
     */
    generateRefreshToken(user) {
        return jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            JWT_REFRESH_SECRET,
            { expiresIn: JWT_REFRESH_EXPIRATION }
        );
    }
}

module.exports = new AuthService();
