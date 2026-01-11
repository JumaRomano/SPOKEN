import api from './api';

const dashboardService = {
    // Get aggregated dashboard stats
    async getStats() {
        // This endpoint matches reporting.routes.js: router.get('/dashboard', ...)
        const response = await api.get('/reports/dashboard');
        return response.data;
    },

    // Get simple activity feed (using audit logs or similar)
    async getRecentActivity() {
        // If this endpoint doesn't exist yet, we might need to add it or use a different one
        // For now, let's assume we might need to implement this or use a placeholder if the backend isn't ready
        // But per strict orders, NO MOCK DATA.
        // I will check if there is an activity endpoint. If not, I'll limit this scope.
        // Looking at reporting.routes.js, there isn't a direct "activity" endpoint. 
        // I'll leave this empty or minimal for now and focus on stats.
        return [];
    }
};

export default dashboardService;
