const Joi = require('joi');
const logger = require('../utils/logger');

const validate = (schema, property = 'body') => {
    return (req, res, next) => {
        // Allow optional property (body, query, params)
        const data = req[property];

        const { error, value } = schema.validate(data, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields
            allowUnknown: true  // Allow unknown for now to prevent breaking changes, switch to false later for strictness
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            logger.warn(`Validation Error: ${errorMessage}`, {
                path: req.path,
                method: req.method,
                ip: req.ip
            });

            return res.status(400).json({
                status: 'error',
                message: `Validation failed: ${error.details[0].message}`,
                errors: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }

        // Replace request data with validated (and potentially stripped) data
        req[property] = value;
        next();
    };
};

module.exports = validate;
