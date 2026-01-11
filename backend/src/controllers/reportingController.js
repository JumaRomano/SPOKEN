const reportingService = require('../services/reportingService');

class ReportingController {
    async getDashboardStats(req, res, next) {
        try {
            const userId = req.user.id;
            const role = req.user.role;
            const stats = await reportingService.getDashboardStats(userId, role);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async getAttendanceTrends(req, res, next) {
        try {
            const months = parseInt(req.query.months) || 6;
            const trends = await reportingService.getAttendanceTrends(months);
            res.json(trends);
        } catch (error) {
            next(error);
        }
    }

    async getGivingTrends(req, res, next) {
        try {
            const months = parseInt(req.query.months) || 6;
            const trends = await reportingService.getGivingTrends(months);
            res.json(trends);
        } catch (error) {
            next(error);
        }
    }

    async getMembershipGrowth(req, res, next) {
        try {
            const months = parseInt(req.query.months) || 12;
            const growth = await reportingService.getMembershipGrowth(months);
            res.json(growth);
        } catch (error) {
            next(error);
        }
    }

    async getGroupHealth(req, res, next) {
        try {
            const health = await reportingService.getGroupHealth();
            res.json(health);
        } catch (error) {
            next(error);
        }
    }

    async getMemberEngagement(req, res, next) {
        try {
            const engagement = await reportingService.getMemberEngagement();
            res.json(engagement);
        } catch (error) {
            next(error);
        }
    }

    async generateCustomReport(req, res, next) {
        try {
            const report = await reportingService.generateCustomReport(req.body);
            res.json(report);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ReportingController();
