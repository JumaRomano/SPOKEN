import api from './api';

const attendanceService = {
    // Service Management
    async getServices(params = {}) {
        const response = await api.get('/attendance/services', { params });
        return response.data;
    },

    async getServiceById(id) {
        const response = await api.get(`/attendance/services/${id}`);
        return response.data;
    },

    async createService(serviceData) {
        const response = await api.post('/attendance/services', serviceData);
        return response.data;
    },

    async updateService(id, data) {
        const response = await api.put(`/attendance/services/${id}`, data);
        return response.data;
    },

    async deleteService(id) {
        const response = await api.delete(`/attendance/services/${id}`);
        return response.data;
    },

    // Attendance Recording
    async recordAttendance(serviceId, attendanceData) {
        const response = await api.post(`/attendance/services/${serviceId}/records`, attendanceData);
        return response.data;
    },

    async bulkRecordAttendance(serviceId, memberIds) {
        const response = await api.post(`/attendance/services/${serviceId}/records/bulk`, { memberIds });
        return response.data;
    },

    async getServiceAttendance(serviceId) {
        const response = await api.get(`/attendance/services/${serviceId}/records`);
        return response.data;
    },

    // Group Attendance
    async recordGroupAttendance(groupId, attendanceData) {
        const response = await api.post(`/attendance/groups/${groupId}/attendance`, attendanceData);
        return response.data;
    },

    // Statistics
    async getStatistics(startDate = null, endDate = null) {
        const response = await api.get('/attendance/statistics', {
            params: { startDate, endDate }
        });
        return response.data;
    },
};

export default attendanceService;
