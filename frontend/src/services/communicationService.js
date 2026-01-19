import api from './api';

const communicationService = {
    // Announcements
    async getAnnouncements(params = {}) {
        const response = await api.get('/communication/announcements', { params });
        return response.data;
    },

    async getAnnouncementById(id) {
        const response = await api.get(`/communication/announcements/${id}`);
        return response.data;
    },

    async createAnnouncement(announcementData) {
        const response = await api.post('/communication/announcements', announcementData);
        return response.data;
    },

    async updateAnnouncement(id, data) {
        const response = await api.put(`/communication/announcements/${id}`, data);
        return response.data;
    },

    async deleteAnnouncement(id) {
        const response = await api.delete(`/communication/announcements/${id}`);
        return response.data;
    },

    // Publishing and Broadcasting
    async publishAnnouncement(id) {
        const response = await api.post(`/communication/announcements/${id}/publish`);
        return response.data;
    },

    async sendBroadcast(id, channels) {
        const response = await api.post(`/communication/announcements/${id}/broadcast`, { channels });
        return response.data;
    },

    // Logs
    async getCommunicationLogs(params = {}) {
        const response = await api.get('/communication/logs', { params });
        return response.data;
    },
};

export default communicationService;
