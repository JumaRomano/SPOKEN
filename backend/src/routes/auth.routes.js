const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const validate = require('../middleware/validator');
const Joi = require('joi');

// Validation schemas
const registerSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('member', 'leader', 'finance', 'admin').optional(),
    }),
};

const loginSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),
};

const changePasswordSchema = {
    body: Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required(),
    }),
};

// Routes
// Routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

const createLoginSchema = {
    body: Joi.object({
        memberId: Joi.string().uuid().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        role: Joi.string().valid('member', 'leader', 'finance', 'admin', 'sysadmin').default('member'),
    }),
};

const adminResetPasswordSchema = {
    body: Joi.object({
        userId: Joi.string().uuid().required(),
        newPassword: Joi.string().min(8).required(),
    }),
};

router.post('/create-member-login', authenticate, validate(createLoginSchema), authController.createMemberLogin);
router.post('/admin-reset-password', authenticate, validate(adminResetPasswordSchema), authController.adminResetPassword);

module.exports = router;
