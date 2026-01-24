const groupService = require('../services/groupService');

class GroupController {
    async getAll(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                category: req.query.category || null,
                status: req.query.status || 'active',
                search: req.query.search || '',
                userId: req.user.id,  // Pass user ID for filtering
                userRole: req.user.role,  // Pass user role for admin check
            };

            const result = await groupService.getAll(filters);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const group = await groupService.getById(id);
            res.json(group);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const group = await groupService.create(req.body);
            res.status(201).json(group);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const group = await groupService.update(id, req.body);
            res.json(group);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await groupService.delete(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getMembers(req, res, next) {
        try {
            const { id } = req.params;
            const members = await groupService.getMembers(id);
            res.json(members);
        } catch (error) {
            next(error);
        }
    }

    async addMember(req, res, next) {
        try {
            const { id } = req.params;
            const { memberId, role } = req.body;
            const result = await groupService.addMember(id, memberId, role);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async removeMember(req, res, next) {
        try {
            const { id, memberId } = req.params;
            const result = await groupService.removeMember(id, memberId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getFinances(req, res, next) {
        try {
            const { id } = req.params;
            const { startDate, endDate } = req.query;
            const finances = await groupService.getFinances(id, startDate, endDate);
            res.json(finances);
        } catch (error) {
            next(error);
        }
    }

    async recordTransaction(req, res, next) {
        try {
            const { id } = req.params;
            const recordedBy = req.user.id;
            const transaction = await groupService.recordTransaction(id, req.body, recordedBy);
            res.status(201).json(transaction);
        } catch (error) {
            next(error);
        }
    }

    async getAttendance(req, res, next) {
        try {
            const { id } = req.params;
            const limit = parseInt(req.query.limit) || 20;
            const attendance = await groupService.getAttendance(id, limit);
            res.json(attendance);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new GroupController();
