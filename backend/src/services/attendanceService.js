const db = require('../config/database');
const logger = require('../utils/logger');

class AttendanceService {
    /**
     * Get all services
     */
    async getServices(filters = {}) {
        const { limit = 20, offset = 0, serviceType = null, startDate = null, endDate = null } = filters;

        let query = 'SELECT * FROM services WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (serviceType) {
            query += ` AND service_type = $${paramCount}`;
            params.push(serviceType);
            paramCount++;
        }

        if (startDate) {
            query += ` AND service_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND service_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY service_date DESC, service_time DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get service by ID
     */
    async getServiceById(id) {
        const result = await db.query('SELECT * FROM services WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            throw new Error('Service not found');
        }

        return result.rows[0];
    }

    /**
     * Create service
     */
    async createService(serviceData, createdBy) {
        const { serviceType, serviceDate, serviceTime, description } = serviceData;

        const result = await db.query(
            `INSERT INTO services (service_type, service_date, service_time, description, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [serviceType, serviceDate, serviceTime, description, createdBy]
        );

        logger.info('Service created:', { serviceId: result.rows[0].id, serviceType, serviceDate });
        return result.rows[0];
    }

    /**
     * Update service
     */
    async updateService(id, serviceData) {
        const { serviceType, serviceDate, serviceTime, description } = serviceData;

        const result = await db.query(
            `UPDATE services SET
        service_type = COALESCE($1, service_type),
        service_date = COALESCE($2, service_date),
        service_time = COALESCE($3, service_time),
        description = COALESCE($4, description),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
            [serviceType, serviceDate, serviceTime, description, id]
        );

        if (result.rows.length === 0) {
            throw new Error('Service not found');
        }

        return result.rows[0];
    }

    /**
     * Delete service
     */
    async deleteService(id) {
        const result = await db.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            throw new Error('Service not found');
        }

        logger.info('Service deleted:', { serviceId: id });
        return { message: 'Service deleted successfully' };
    }

    /**
     * Record attendance for a service
     */
    async recordAttendance(serviceId, attendanceData, recordedBy) {
        const { memberId, groupId = null, status = 'present', notes = null } = attendanceData;

        try {
            const result = await db.query(
                `INSERT INTO attendance_records (service_id, member_id, attendance_status, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
                [serviceId, memberId, status, notes]
            );

            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Attendance already recorded for this member');
            }
            throw error;
        }
    }

    /**
     * Bulk record attendance
     */
    async bulkRecordAttendance(serviceId, memberIds, recordedBy) {
        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return { message: 'No members to record attendance for', count: 0 };
        }

        const values = memberIds.map((memberId, i) =>
            `($1, $${i + 2}, 'present')`
        ).join(',');

        const params = [serviceId, ...memberIds];

        await db.query(
            `INSERT INTO attendance_records (service_id, member_id, attendance_status)
       VALUES ${values}
       ON CONFLICT (service_id, member_id) DO NOTHING`,
            params
        );

        logger.info('Bulk attendance recorded:', { serviceId, count: memberIds.length });
        return { message: `Attendance recorded for ${memberIds.length} members` };
    }

    /**
     * Get attendance records for a service
     */
    async getServiceAttendance(serviceId) {
        const result = await db.query(
            `SELECT ar.*, m.first_name, m.last_name, m.email
       FROM attendance_records ar
       JOIN members m ON ar.member_id = m.id
       WHERE ar.service_id = $1
       ORDER BY m.last_name, m.first_name`,
            [serviceId]
        );

        return result.rows;
    }

    /**
     * Get attendance statistics
     */
    async getStatistics(startDate = null, endDate = null) {
        let whereClause = "WHERE ar.attendance_status = 'present'";
        const params = [];
        let paramCount = 1;

        if (startDate) {
            whereClause += ` AND s.service_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            whereClause += ` AND s.service_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        const query = `
            SELECT 
                COUNT(DISTINCT ar.member_id) as unique_attendees,
                COUNT(ar.id) as total_attendance_records,
                COUNT(DISTINCT ar.service_id) as services_count,
                COALESCE(AVG(service_counts.count), 0) as avg_attendance_per_service
            FROM attendance_records ar
            JOIN services s ON ar.service_id = s.id
            LEFT JOIN (
                SELECT service_id, COUNT(*) as count 
                FROM attendance_records 
                WHERE attendance_status = 'present' 
                GROUP BY service_id
            ) service_counts ON ar.service_id = service_counts.service_id
            ${whereClause}
        `;

        const result = await db.query(query, params);
        return {
            unique_attendees: parseInt(result.rows[0].unique_attendees || 0),
            total_attendance_records: parseInt(result.rows[0].total_attendance_records || 0),
            services_count: parseInt(result.rows[0].services_count || 0),
            avg_attendance_per_service: parseFloat(result.rows[0].avg_attendance_per_service || 0).toFixed(2)
        };
    }

    /**
     * Record group attendance
     */
    async recordGroupAttendance(groupId, attendanceData, recordedBy) {
        const { meetingDate, totalPresent, notes = null, memberId = null } = attendanceData;

        // If memberId is provided, it's an individual record. If not, it's a summary.
        // We'll support both by checking if columns exist (added in fix_production.js)
        const result = await db.query(
            `INSERT INTO group_attendance (group_id, member_id, meeting_date, total_present, recorded_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [groupId, memberId, meetingDate, totalPresent || null, recordedBy, notes]
        );

        logger.info('Group attendance recorded:', { groupId, meetingDate, totalPresent });
        return result.rows[0];
    }

    /**
     * Get member attendance trends
     */
    async getMemberTrend(memberId, months = 6) {
        const result = await db.query(
            `SELECT 
        DATE_TRUNC('month', s.service_date) as month,
        COUNT(*) as attendance_count
       FROM attendance_records ar
       JOIN services s ON ar.service_id = s.id
       WHERE ar.member_id = $1 
         AND ar.attendance_status = 'present'
         AND s.service_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', s.service_date)
       ORDER BY month`,
            [memberId]
        );

        return result.rows;
    }
}

module.exports = new AttendanceService();
