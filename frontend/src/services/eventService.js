import api from './api';

const eventService = {
    async getAll(params = {}) {
        const response = await api.get('/events', { params });
        return response.data;
    },

    async getPublicEvents(params = {}) {
        const response = await api.get('/events/public', { params });
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

    async update(id, eventData) {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/events/${id}`);
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

    // Volunteer Management
    async getVolunteerRoles(eventId) {
        const response = await api.get(`/events/${eventId}/volunteers`);
        return response.data;
    },

    async createVolunteerRole(eventId, roleData) {
        const response = await api.post(`/events/${eventId}/volunteers`, roleData);
        return response.data;
    },

    async volunteerSignup(roleId, memberId) {
        const response = await api.post(`/events/volunteers/${roleId}/signup`, { memberId });
        return response.data;
    },
};

export default eventService;

