const logger = require('../utils/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id,
    });

    // Database errors
    if (err.code === '23505') { // Unique violation
        return res.status(409).json({
            error: 'Resource already exists',
            message: err.message,
            details: err.detail,
        });
    }

    if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({
            error: 'Referenced resource does not exist',
            message: err.message,
            details: err.detail,
        });
    }

    if (err.code === '23502') { // Not null violation
        return res.status(400).json({
            error: 'Required field missing',
            message: err.message,
            details: err.detail,
        });
    }

    if (err.code === '42703') { // Undefined column
        return res.status(400).json({
            error: 'Database column error',
            message: err.message,
            details: err.detail,
        });
    }

    if (err.code === '22P02') { // Invalid text representation
        return res.status(400).json({
            error: 'Invalid data format',
            message: err.message,
            details: err.detail,
        });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            message: err.message,
            details: err.details,
        });
    }

    // JWT errors
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: 'Invalid or expired token',
        });
    }

    // Default error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

/**
 * 404 Not Found handler
 */
const notFound = (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
    });
};

module.exports = {
    errorHandler,
    notFound,
};
