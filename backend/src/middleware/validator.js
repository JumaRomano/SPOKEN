const Joi = require('joi');

/**
 * Validation middleware factory
 * @param {Object} schema - Joi schema object with keys: body, query, params
 */
const validate = (schema) => {
    return (req, res, next) => {
        const validationOptions = {
            abortEarly: false, // Return all errors
            allowUnknown: true, // Allow unknown keys (they will be stripped)
            stripUnknown: true, // Actually strip unknown keys
        };

        // Create object to validate
        const toValidate = {};
        if (schema.body) toValidate.body = req.body;
        if (schema.query) toValidate.query = req.query;
        if (schema.params) toValidate.params = req.params;

        // Create validation schema
        const fullSchema = Joi.object(schema);

        // Validate
        const { error, value } = fullSchema.validate(toValidate, validationOptions);

        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        // Replace req properties with validated values
        if (value.body) req.body = value.body;
        if (value.query) req.query = value.query;
        if (value.params) req.params = value.params;

        next();
    };
};

module.exports = validate;
