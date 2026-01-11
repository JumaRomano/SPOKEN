import api from './api';

const groupService = {
    async getAll(params = {}) {
        const response = await api.get('/groups', { params });
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/groups/${id}`);
        return response.data;
    },

    async getMembers(id) {
        const response = await api.get(`/groups/${id}/members`);
        return response.data;
    },

    async getFinances(id) {
        const response = await api.get(`/groups/${id}/finances`);
        return response.data;
    },

    async create(groupData) {
        const response = await api.post('/groups', groupData);
        return response.data;
    },

    async update(id, groupData) {
        const response = await api.put(`/groups/${id}`, groupData);
        return response.data;
    },
};

export default groupService;
