import api from './api';

const reportingService = {
    // Dashboard Stats
    async getDashboardStats() {
        const response = await api.get('/reports/dashboard');
        return response.data;
    },

    // Attendance Trends
    async getAttendanceTrends(params = {}) {
        const response = await api.get('/reports/attendance/trends', { params });
        return response.data;
    },

    // Giving Trends
    async getGivingTrends(params = {}) {
        const response = await api.get('/reports/giving/trends', { params });
        return response.data;
    },

    // Membership Growth
    async getMembershipGrowth(params = {}) {
        const response = await api.get('/reports/membership/growth', { params });
        return response.data;
    },

    // Group Health
    async getGroupHealth(params = {}) {
        const response = await api.get('/reports/groups/health', { params });
        return response.data;
    },

    // Member Engagement
    async getMemberEngagement(params = {}) {
        const response = await api.get('/reports/engagement', { params });
        return response.data;
    },

    // Custom Reports
    async generateCustomReport(reportConfig) {
        const response = await api.post('/reports/custom', reportConfig);
        return response.data;
    },
};

export default reportingService;
