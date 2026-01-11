const memberService = require('../services/memberService');

class MemberController {
    async getAll(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                status: req.query.status || 'active',
                search: req.query.search || '',
                familyId: req.query.familyId || null,
            };

            const result = await memberService.getAll(filters);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const member = await memberService.getById(id);
            res.json(member);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const member = await memberService.create(req.body);
            res.status(201).json(member);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const member = await memberService.update(id, req.body);
            res.json(member);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await memberService.delete(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getFamily(req, res, next) {
        try {
            const { id } = req.params;
            const family = await memberService.getFamily(id);
            res.json(family);
        } catch (error) {
            next(error);
        }
    }

    async getGroups(req, res, next) {
        try {
            const { id } = req.params;
            const groups = await memberService.getGroups(id);
            res.json(groups);
        } catch (error) {
            next(error);
        }
    }

    async getAttendance(req, res, next) {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const attendance = await memberService.getAttendance(id, limit);
            res.json(attendance);
        } catch (error) {
            next(error);
        }
    }

    async getContributions(req, res, next) {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;
            const contributions = await memberService.getContributions(id, startDate, endDate);
            res.json(contributions);
        } catch (error) {
            next(error);
        }
    }

    async getEvents(req, res, next) {
        try {
            const { id } = req.params;
            const events = await memberService.getEvents(id);
            res.json(events);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MemberController();
