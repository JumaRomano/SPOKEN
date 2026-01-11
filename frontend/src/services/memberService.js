import api from './api';

const memberService = {
    // Get all members with filters
    async getAll(params = {}) {
        const response = await api.get('/members', { params });
        return response.data;
    },

    // Get member by ID
    async getById(id) {
        const response = await api.get(`/members/${id}`);
        return response.data;
    },

    // Create new member
    async create(memberData) {
        const response = await api.post('/members', memberData);
        return response.data;
    },

    // Update member
    async update(id, memberData) {
        const response = await api.put(`/members/${id}`, memberData);
        return response.data;
    },

    // Delete member
    async delete(id) {
        const response = await api.delete(`/members/${id}`);
        return response.data;
    },

    // Get member contributions
    async getContributions(id, params = {}) {
        const response = await api.get(`/members/${id}/contributions`, { params });
        return response.data;
    },

    // Get member attendance
    async getAttendance(id, params = {}) {
        const response = await api.get(`/members/${id}/attendance`, { params });
        return response.data;
    },
};

export default memberService;
