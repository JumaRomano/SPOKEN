import api from './api';

const financeService = {
    async getFunds() {
        const response = await api.get('/finance/funds');
        return response.data;
    },

    async createFund(fundData) {
        const response = await api.post('/finance/funds', fundData);
        return response.data;
    },

    async updateFund(id, fundData) {
        const response = await api.put(`/finance/funds/${id}`, fundData);
        return response.data;
    },

    async reassignFund(fromFundId, toFundId) {
        const response = await api.post('/finance/funds/reassign', { fromFundId, toFundId });
        return response.data;
    },

    async deleteFund(id) {
        const response = await api.delete(`/finance/funds/${id}`);
        return response.data;
    },

    async getAllPledges() {
        const response = await api.get('/finance/pledges');
        return response.data;
    },

    async createPledge(pledgeData) {
        const response = await api.post('/finance/pledges', pledgeData);
        return response.data;
    },

    async getContributions(params = {}) {
        const response = await api.get('/finance/contributions', { params });
        return response.data;
    },

    async recordContribution(contributionData) {
        const response = await api.post('/finance/contributions', contributionData);
        return response.data;
    },

    async getGivingReport(startDate, endDate) {
        const response = await api.get('/finance/reports/giving', {
            params: { startDate, endDate },
        });
        return response.data;
    },

    async getPledges(memberId) {
        const response = await api.get(`/finance/pledges`, {
            params: { memberId },
        });
        return response.data;
    },
};

export default financeService;
