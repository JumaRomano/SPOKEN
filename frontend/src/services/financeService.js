import api from './api';

const financeService = {
    async getFunds() {
        const response = await api.get('/finance/funds');
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
