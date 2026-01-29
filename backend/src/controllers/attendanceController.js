const attendanceService = require('../services/attendanceService');

class AttendanceController {
    async getServices(req, res, next) {
        try {
            const filters = {
                limit: parseInt(req.query.limit) || 20,
                offset: parseInt(req.query.offset) || 0,
                serviceType: req.query.serviceType || null,
                startDate: req.query.startDate || null,
                endDate: req.query.endDate || null,
                groupId: req.query.groupId || null,
            };

            const services = await attendanceService.getServices(filters);
            res.json(services);
        } catch (error) {
            next(error);
        }
    }

    async getServiceById(req, res, next) {
        try {
            const { id } = req.params;
            const service = await attendanceService.getServiceById(id);
            res.json(service);
        } catch (error) {
            next(error);
        }
    }

    async createService(req, res, next) {
        try {
            const createdBy = req.user.id;
            const service = await attendanceService.createService(req.body, createdBy);
            res.status(201).json(service);
        } catch (error) {
            next(error);
        }
    }

    async updateService(req, res, next) {
        try {
            const { id } = req.params;
            const service = await attendanceService.updateService(id, req.body);
            res.json(service);
        } catch (error) {
            next(error);
        }
    }

    async deleteService(req, res, next) {
        try {
            const { id } = req.params;
            const result = await attendanceService.deleteService(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async recordAttendance(req, res, next) {
        try {
            const { id: serviceId } = req.params;
            const recordedBy = req.user.id;
            const record = await attendanceService.recordAttendance(serviceId, req.body, recordedBy);
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    }

    async bulkRecordAttendance(req, res, next) {
        try {
            const { id: serviceId } = req.params;
            const { memberIds } = req.body;
            const recordedBy = req.user.id;
            const result = await attendanceService.bulkRecordAttendance(serviceId, memberIds, recordedBy);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    async getServiceAttendance(req, res, next) {
        try {
            const { id: serviceId } = req.params;
            const attendance = await attendanceService.getServiceAttendance(serviceId);
            res.json(attendance);
        } catch (error) {
            next(error);
        }
    }

    async getStatistics(req, res, next) {
        try {
            const { startDate, endDate } = req.query;
            const stats = await attendanceService.getStatistics(startDate, endDate);
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    async recordGroupAttendance(req, res, next) {
        try {
            const { groupId } = req.params;
            const recordedBy = req.user.id;
            const record = await attendanceService.recordGroupAttendance(groupId, req.body, recordedBy);
            res.status(201).json(record);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AttendanceController();
