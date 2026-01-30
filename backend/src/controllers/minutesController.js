const minutesService = require('../services/minutesService');

class MinutesController {
    async getAll(req, res, next) {
        try {
            const filters = {
                limit: req.query.limit,
                offset: req.query.offset,
                groupId: req.query.groupId,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                search: req.query.search
            };
            const result = await minutesService.getAll(filters);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const result = await minutesService.getById(req.params.id);
            if (!result) return res.status(404).json({ error: 'Minute not found' });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const result = await minutesService.create(req.body, req.user.id);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const result = await minutesService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ error: 'Minute not found' });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await minutesService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MinutesController();
