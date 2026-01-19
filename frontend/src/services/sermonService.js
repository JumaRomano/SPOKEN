import api from './api';

const sermonService = {
    getAll: async (params) => {
        const response = await api.get('/sermons', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/sermons', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/sermons/${id}`);
        return response.data;
    },
};

export default sermonService;
