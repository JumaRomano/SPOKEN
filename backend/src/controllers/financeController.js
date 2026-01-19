const financeService = require('../services/financeService');

class FinanceController {
    async getFunds(req, res, next) {
        try {
            const funds = await financeService.getFunds();
            res.json(funds);
        } catch (error) {
            next(error);
        }
    }

    async createFund(req, res, next) {
        try {
            console.log('=== CREATE FUND REQUEST ===');
            console.log('Request body:', JSON.stringify(req.body, null, 2));
            console.log('User:', req.user);

            const fund = await financeService.createFund(req.body);

            console.log('Fund created successfully:', fund);
            res.status(201).json(fund);
        } catch (error) {
            console.error('CREATE FUND ERROR:', error);
            next(error);
        }
    }

    async updateFund(req, res, next) {
        try {
            const { id } = req.params;
            const fund = await financeService.updateFund(id, req.body);
            res.json(fund);
        } catch (error) {
            next(error);
        }
    }

    async reassignFund(req, res, next) {
        try {
            const { fromFundId, toFundId } = req.body;
            const result = await financeService.reassignFund(fromFundId, toFundId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteFund(req, res, next) {
        try {
            const { id } = req.params;
            await financeService.deleteFund(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getAllPledges(req, res, next) {
        try {
            const pledges = await financeService.getAllPledges();
            res.json(pledges);
        } catch (error) {
            next(error);
        }
    }

    async recordContribution(req, res, next) {
        try {
            const recordedBy = req.user.id;
            const contribution = await financeService.recordContribution(req.body, recordedBy);
            res.status(201).json(contribution);
        } catch (error) {
            next(error);
        }
    }

    async getContributions(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                memberId: req.query.memberId || null,
                fundId: req.query.fundId || null,
                startDate: req.query.startDate || null,
                endDate: req.query.endDate || null,
            };

            const contributions = await financeService.getContributions(filters);
            res.json(contributions);
        } catch (error) {
            next(error);
        }
    }

    async getStatistics(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await financeService.getStatistics(startDate, endDate);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async createPledge(req, res, next) {
        try {
            const pledge = await financeService.createPledge(req.body);
            res.status(201).json(pledge);
        } catch (error) {
            next(error);
        }
    }

    async getMemberPledges(req, res, next) {
        try {
            const { memberId } = req.params;
            const pledges = await financeService.getMemberPledges(memberId);
            res.json(pledges);
        } catch (error) {
            next(error);
        }
    }

    async createLevy(req, res, next) {
        try {
            const createdBy = req.user.id;
            const levy = await financeService.createLevy(req.body, createdBy);
            res.status(201).json(levy);
        } catch (error) {
            next(error);
        }
    }

    async recordLevyPayment(req, res, next) {
        try {
            const { levyId } = req.params;
            const recordedBy = req.user.id;
            const payment = await financeService.recordLevyPayment(levyId, req.body, recordedBy);
            res.status(201).json(payment);
        } catch (error) {
            next(error);
        }
    }

    async getLevyPayments(req, res, next) {
        try {
            const { levyId } = req.params;
            const result = await financeService.getLevyPayments(levyId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async generateGivingReport(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const report = await financeService.generateGivingReport(startDate, endDate);
            res.json(report);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new FinanceController();
