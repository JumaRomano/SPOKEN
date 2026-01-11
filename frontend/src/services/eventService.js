import api from './api';

const eventService = {
    async getAll(params = {}) {
        const response = await api.get('/events', { params });
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    async create(eventData) {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    async register(eventId, memberData) {
        const response = await api.post(`/events/${eventId}/register`, memberData);
        return response.data;
    },

    async getRegistrations(id) {
        const response = await api.get(`/events/${id}/registrations`);
        return response.data;
    },
};

export default eventService;
