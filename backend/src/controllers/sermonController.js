const sermonService = require('../services/sermonService');

class SermonController {
    async getAll(req, res, next) {
        try {
            const filters = {
                series: req.query.series,
                speaker: req.query.speaker,
                limit: req.query.limit
            };
            const sermons = await sermonService.getAll(filters);
            res.json(sermons);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const sermon = await sermonService.create(req.body);
            res.status(201).json(sermon);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            await sermonService.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SermonController();
