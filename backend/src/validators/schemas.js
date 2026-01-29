const Joi = require('joi');

const memberSchemas = {
    create: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().allow(null, ''),
        phone: Joi.string().allow(null, ''),
        gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
        maritalStatus: Joi.string().valid('single', 'married', 'divorced', 'widowed').allow(null, ''),
        dateOfBirth: Joi.date().iso().allow(null),
        address: Joi.string().allow(null, ''),
        familyId: Joi.number().integer().allow(null),
        // Allow snake_case alternatives for robustness
        first_name: Joi.string(),
        last_name: Joi.string(),
        marital_status: Joi.string(),
        date_of_birth: Joi.date().iso(),
        family_id: Joi.number().integer(),
    }).unknown(true), // Allow other fields to pass through but validated known ones

    update: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email().allow(null, ''),
        phone: Joi.string().allow(null, ''),
        gender: Joi.string().valid('male', 'female', 'other').allow(null, ''),
        status: Joi.string().valid('active', 'inactive', 'archived'),
        // snake_case
        first_name: Joi.string(),
        last_name: Joi.string(),
        membership_status: Joi.string(),
    }).unknown(true)
};

const eventSchemas = {
    create: Joi.object({
        event_name: Joi.string().required(),
        event_type: Joi.string().required(),
        start_date: Joi.date().iso().required(),
        end_date: Joi.date().iso().allow(null),
        location: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        max_participants: Joi.number().allow(null),
        cost: Joi.number().min(0).allow(null),
        registration_required: Joi.boolean(),
        // CamelCase support
        eventName: Joi.string(),
        eventType: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        maxParticipants: Joi.number(),
        registrationRequired: Joi.boolean()
    }).unknown(true)
};

const serviceSchemas = {
    create: Joi.object({
        service_date: Joi.date().iso().required(),
        service_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        service_type: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        // CamelCase support
        serviceDate: Joi.date().iso(),
        serviceTime: Joi.string(),
        serviceType: Joi.string()
    }).unknown(true)
};

module.exports = {
    memberSchemas,
    eventSchemas,
    serviceSchemas
};
