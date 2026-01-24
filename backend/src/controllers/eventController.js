const eventService = require('../services/eventService');

class EventController {
    async getAll(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                eventType: req.query.eventType || null,
                status: req.query.status || null,
                upcoming: req.query.upcoming === 'true',
                search: req.query.search || '',
            };

            const events = await eventService.getAll(filters);
            res.json(events);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const event = await eventService.getById(id);
            res.json(event);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const createdBy = req.user.id;
            const event = await eventService.create(req.body, createdBy);
            res.status(201).json(event);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const event = await eventService.update(id, req.body);
            res.json(event);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await eventService.delete(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async register(req, res, next) {
        try {
            const { id: eventId } = req.params;
            const { memberId, paymentAmount, notes } = req.body;
            const registration = await eventService.register(eventId, memberId, paymentAmount, notes);
            res.status(201).json(registration);
        } catch (error) {
            next(error);
        }
    }

    async cancelRegistration(req, res, next) {
        try {
            const { id: eventId, memberId } = req.params;
            const result = await eventService.cancelRegistration(eventId, memberId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getRegistrations(req, res, next) {
        try {
            const { id: eventId } = req.params;
            const registrations = await eventService.getRegistrations(eventId);
            res.json(registrations);
        } catch (error) {
            next(error);
        }
    }

    async createVolunteerRole(req, res, next) {
        try {
            const { id: eventId } = req.params;
            const role = await eventService.createVolunteerRole(eventId, req.body);
            res.status(201).json(role);
        } catch (error) {
            next(error);
        }
    }

    async volunteerSignup(req, res, next) {
        try {
            const { roleId } = req.params;
            const { memberId } = req.body;
            const signup = await eventService.volunteerSignup(roleId, memberId);
            res.status(201).json(signup);
        } catch (error) {
            next(error);
        }
    }

    async getVolunteerRoles(req, res, next) {
        try {
            const { id: eventId } = req.params;
            const roles = await eventService.getVolunteerRoles(eventId);
            res.json(roles);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new EventController();
