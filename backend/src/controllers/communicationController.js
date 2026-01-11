const communicationService = require('../services/communicationService');

class CommunicationController {
    async getAnnouncements(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                targetAudience: req.query.targetAudience || null,
                status: req.query.status || 'published',
            };

            const announcements = await communicationService.getAnnouncements(filters);
            res.json(announcements);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const announcement = await communicationService.getById(id);
            res.json(announcement);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const createdBy = req.user.id;
            const announcement = await communicationService.create(req.body, createdBy);
            res.status(201).json(announcement);
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const announcement = await communicationService.update(id, req.body);
            res.json(announcement);
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const result = await communicationService.delete(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async publish(req, res, next) {
        try {
            const { id } = req.params;
            const announcement = await communicationService.publish(id);
            res.json(announcement);
        } catch (error) {
            next(error);
        }
    }

    async sendBroadcast(req, res, next) {
        try {
            const { id } = req.params;
            const { channels } = req.body;
            const result = await communicationService.sendBroadcast(id, channels);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getLogs(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 50,
                offset: parseInt(req.query.offset) || 0,
                announcementId: req.query.announcementId || null,
                status: req.query.status || null,
            };

            const logs = await communicationService.getLogs(filters);
            res.json(logs);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CommunicationController();
