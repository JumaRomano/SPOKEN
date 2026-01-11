const db = require('../config/database');
const logger = require('../utils/logger');

class ReportingService {
    /**
     * Get dashboard statistics (role-based)
     */
    async getDashboardStats(userId, role) {
        const stats = {};

        // Common stats for all roles
        stats.totalMembers = await this.getTotalMembers();
        stats.upcomingEvents = await this.getUpcomingEventsCount();

        // Role-specific stats
        if (role === 'admin' || role === 'sysadmin') {
            stats.totalGroups = await this.getTotalGroups();
            stats.totalContributions = await this.getTotalContributions();
            stats.thisMonthGiving = await this.getMonthlyGiving();
            stats.thisMonthAttendance = await this.getMonthlyAttendance();
        }

        if (role === 'finance') {
            stats.totalContributions = await this.getTotalContributions();
            stats.thisMonthGiving = await this.getMonthlyGiving();
            stats.pendingPledges = await this.getPendingPledges();
        }

        if (role === 'leader') {
            stats.myGroups = await this.getMemberGroups(userId);
        }

        return stats;
    }

    async getTotalMembers() {
        const result = await db.query('SELECT COUNT(*) FROM members WHERE status = $1', ['active']);
        return parseInt(result.rows[0].count);
    }

    async getTotalGroups() {
        const result = await db.query('SELECT COUNT(*) FROM groups WHERE status = $1', ['active']);
        return parseInt(result.rows[0].count);
    }

    async getUpcomingEventsCount() {
        const result = await db.query(
            'SELECT COUNT(*) FROM events WHERE start_date >= CURRENT_DATE AND status != $1',
            ['cancelled']
        );
        return parseInt(result.rows[0].count);
    }

    async getTotalContributions() {
        const result = await db.query('SELECT COALESCE(SUM(amount), 0) as total FROM contributions');
        return parseFloat(result.rows[0].total);
    }

    async getMonthlyGiving() {
        const result = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM contributions
       WHERE contribution_date >= DATE_TRUNC('month', CURRENT_DATE)`
        );
        return parseFloat(result.rows[0].total);
    }

    async getMonthlyAttendance() {
        const result = await db.query(
            `SELECT COALESCE(AVG(total_attendance), 0) as avg_attendance
       FROM services
       WHERE service_date >= DATE_TRUNC('month', CURRENT_DATE)`
        );
        return parseFloat(result.rows[0].avg_attendance);
    }

    async getPendingPledges() {
        const result = await db.query(
            `SELECT COUNT(*) FROM pledges WHERE status = $1 AND total_paid < pledge_amount`,
            ['active']
        );
        return parseInt(result.rows[0].count);
    }

    async getMemberGroups(userId) {
        const memberResult = await db.query('SELECT id FROM members WHERE user_id = $1', [userId]);
        if (memberResult.rows.length === 0) return 0;

        const memberId = memberResult.rows[0].id;
        const result = await db.query(
            'SELECT COUNT(*) FROM group_members WHERE member_id = $1 AND status = $2',
            [memberId, 'active']
        );
        return parseInt(result.rows[0].count);
    }

    /**
     * Get attendance trends
     */
    async getAttendanceTrends(months = 6) {
        const result = await db.query(
            `SELECT 
        DATE_TRUNC('month', service_date) as month,
        AVG(total_attendance) as avg_attendance,
        COUNT(DISTINCT id) as service_count
       FROM services
       WHERE service_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', service_date)
       ORDER BY month`
        );

        return result.rows;
    }

    /**
     * Get giving trends
     */
    async getGivingTrends(months = 6) {
        const result = await db.query(
            `SELECT 
        DATE_TRUNC('month', contribution_date) as month,
        SUM(amount) as total_amount,
        COUNT(*) as transaction_count,
        COUNT(DISTINCT member_id) as unique_donors
       FROM contributions
       WHERE contribution_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', contribution_date)
       ORDER BY month`
        );

        return result.rows;
    }

    /**
     * Get membership growth
     */
    async getMembershipGrowth(months = 12) {
        const result = await db.query(
            `SELECT 
        DATE_TRUNC('month', member_since) as month,
        COUNT(*) as new_members
       FROM members
       WHERE member_since >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', member_since)
       ORDER BY month`
        );

        return result.rows;
    }

    /**
     * Get group health metrics
     */
    async getGroupHealth() {
        const result = await db.query(
            `SELECT 
        g.id,
        g.name,
        g.group_type as category,
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id AND status = 'active') as member_count,
        (SELECT COUNT(*) FROM group_attendance WHERE group_id = g.id AND meeting_date >= CURRENT_DATE - INTERVAL '3 months') as recent_meetings,
        (SELECT COALESCE(SUM(amount), 0) FROM group_finances WHERE group_id = g.id AND transaction_type = 'income') as total_income
       FROM groups g
       WHERE g.status = 'active'
       ORDER BY member_count DESC`
        );

        return result.rows;
    }

    /**
     * Get member engagement metrics
     */
    async getMemberEngagement() {
        const result = await db.query(
            `SELECT 
        m.id,
        m.first_name || ' ' || m.last_name as name,
        (SELECT COUNT(*) FROM attendance_records ar JOIN services s ON ar.service_id = s.id 
         WHERE ar.member_id = m.id AND ar.status = 'present' AND s.service_date >= CURRENT_DATE - INTERVAL '3 months') as attendance_count,
        (SELECT COUNT(*) FROM event_registrations WHERE member_id = m.id AND status != 'cancelled') as event_count,
        (SELECT COUNT(*) FROM group_members WHERE member_id = m.id AND status = 'active') as group_count,
        (SELECT COALESCE(SUM(amount), 0) FROM contributions WHERE member_id = m.id 
         AND contribution_date >= CURRENT_DATE - INTERVAL '1 year') as annual_giving
       FROM members m
       WHERE m.status = 'active'
       ORDER BY attendance_count DESC, annual_giving DESC
       LIMIT 100`
        );

        return result.rows;
    }

    /**
     * Generate custom report
     */
    async generateCustomReport(reportConfig) {
        // This is a placeholder for complex custom reporting
        // In production, this would support dynamic query building based on reportConfig
        logger.info('Custom report requested:', reportConfig);
        return { message: 'Custom reporting not yet implemented' };
    }
}

module.exports = new ReportingService();
