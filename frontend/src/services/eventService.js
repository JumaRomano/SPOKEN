import api from './api';

const eventService = {
    // Get all events
    async getAll(filters = {}) {
        const { eventType, status, upcoming, search } = filters;

        // Safety net: If requesting upcoming events, redirect to public endpoint
        if (upcoming) {
            return this.getPublicEvents(filters);
        }

        const params = new URLSearchParams();
        if (eventType) params.set('eventType', eventType);
        if (status) params.set('status', status);
        if (upcoming) params.set('upcoming', upcoming);
        if (search) params.set('search', search);

        const response = await api.get(`/events?${params.toString()}`);
        return response.data;
    },

    // Get public events
    async getPublicEvents(filters = {}) {
        const { eventType, upcoming } = filters;
        const params = new URLSearchParams();
        if (eventType) params.set('eventType', eventType);
        if (upcoming) params.set('upcoming', upcoming);

        const response = await api.get('/events/public', { params });
        return response.data;
    },

    // Get event by ID
    async getById(id) {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },

    // Create event
    async create(eventData) {
        const response = await api.post('/events', eventData);
        return response.data;
    },

    // Update event
    async update(id, eventData) {
        const response = await api.put(`/events/${id}`, eventData);
        return response.data;
    },

    // Delete event
    async delete(id) {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    // Register for event
    async register(eventId, data) {
        const response = await api.post(`/events/${eventId}/register`, data);
        return response.data;
    },

    // Cancel registration
    async cancelRegistration(eventId, memberId) {
        const response = await api.delete(`/events/${eventId}/register/${memberId}`);
        return response.data;
    },

    // Get event registrations
    async getRegistrations(eventId) {
        const response = await api.get(`/events/${eventId}/registrations`);
        return response.data;
    },

    // Volunteer roles
    async getVolunteerRoles(eventId) {
        const response = await api.get(`/events/${eventId}/volunteers`);
        return response.data;
    },

    // Create volunteer role
    async createVolunteerRole(eventId, roleData) {
        const response = await api.post(`/events/${eventId}/volunteers`, roleData);
        return response.data;
    },

    // Volunteer signup
    async volunteerSignup(roleId, data) {
        const response = await api.post(`/events/volunteers/${roleId}/signup`, data);
        return response.data;
    }
};

export default eventService;
