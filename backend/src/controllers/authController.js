const authService = require('../services/authService');
const logger = require('../utils/logger');

class AuthController {
    /**
     * Register new user
     */
    async register(req, res, next) {
        try {
            const { email, password, role } = req.body;
            const user = await authService.register({ email, password, role });

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login
     */
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const result = await authService.refreshToken(refreshToken);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Change password
     */
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            const result = await authService.changePassword(userId, currentPassword, newPassword);

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout (client-side - just return success)
     */
    async logout(req, res) {
        res.json({ message: 'Logged out successfully' });
    }
}

module.exports = new AuthController();
