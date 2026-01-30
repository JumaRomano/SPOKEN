import api from './api';

const minutesService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.limit) params.append('limit', filters.limit);

        const response = await api.get('/minutes', { params });
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/minutes/${id}`);
        return response.data;
    },

    async create(data) {
        const response = await api.post('/minutes', data);
        return response.data;
    },

    async update(id, data) {
        const response = await api.put(`/minutes/${id}`, data);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/minutes/${id}`);
        return response.data;
    }
};

export default minutesService;
