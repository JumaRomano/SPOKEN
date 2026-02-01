const db = require('../config/database');
const logger = require('../utils/logger');

class ReportingService {
    /**
     * Get dashboard statistics (role-based)
     */
    async getDashboardStats(userId, role) {
        const stats = {
            totalMembers: 0,
            upcomingEvents: 0,
            totalGroups: 0,
            totalContributions: 0,
            thisMonthGiving: 0,
            thisMonthAttendance: 0,
            pendingPledgesCount: 0,
            pendingPledgesAmount: 0,
            monthlyGrowth: 0
        };

        // Common stats for all roles
        stats.totalMembers = await this.getTotalMembers();
        stats.upcomingEvents = await this.getUpcomingEventsCount();

        // Role-specific stats
        if (role === 'admin' || role === 'sysadmin' || role === 'finance') {
            stats.totalGroups = await this.getTotalGroups();
            stats.totalContributions = await this.getTotalContributions();
            stats.thisMonthGiving = await this.getMonthlyGiving();
            stats.thisMonthAttendance = await this.getMonthlyAttendance();

            const pledges = await this.getPendingPledgeStats();
            stats.pendingPledgesCount = pledges.count;
            stats.pendingPledgesAmount = pledges.amount;

            stats.monthlyGrowth = await this.calculateMonthlyGrowth();
        }

        if (role === 'leader') {
            stats.myGroups = await this.getMemberGroups(userId);
        }

        return stats;
    }

    async getTotalMembers() {
        const result = await db.query('SELECT COUNT(*) FROM members WHERE membership_status = $1', ['active']);
        return parseInt(result.rows[0].count);
    }

    async getTotalGroups() {
        // Schema uses is_active boolean
        const result = await db.query('SELECT COUNT(*) FROM groups WHERE is_active = $1', [true]);
        return parseInt(result.rows[0].count);
    }

    async getUpcomingEventsCount() {
        // Schema doesn't have status for events
        const result = await db.query(
            'SELECT COUNT(*) FROM events WHERE start_date >= CURRENT_DATE'
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
        // Schema uses attendance_count
        const result = await db.query(
            `SELECT COALESCE(AVG(attendance_count), 0) as avg_attendance
       FROM services
       WHERE service_date >= DATE_TRUNC('month', CURRENT_DATE)`
        );
        return parseFloat(result.rows[0].avg_attendance);
    }

    async getPendingPledgeStats() {
        const result = await db.query(
            `SELECT 
                COUNT(*) as count, 
                COALESCE(SUM(pledge_amount - amount_paid), 0) as total_pending 
             FROM pledges 
             WHERE status = $1 AND amount_paid < pledge_amount`,
            ['active']
        );
        return {
            count: parseInt(result.rows[0].count),
            amount: parseFloat(result.rows[0].total_pending)
        };
    }

    async calculateMonthlyGrowth() {
        const currentMonth = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM contributions
             WHERE contribution_date >= DATE_TRUNC('month', CURRENT_DATE)`
        );
        const lastMonth = await db.query(
            `SELECT COALESCE(SUM(amount), 0) as total FROM contributions
             WHERE contribution_date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
             AND contribution_date < DATE_TRUNC('month', CURRENT_DATE)`
        );

        const current = parseFloat(currentMonth.rows[0].total);
        const last = parseFloat(lastMonth.rows[0].total);

        if (last === 0) return current > 0 ? 100 : 0;
        return parseFloat(((current - last) / last * 100).toFixed(1));
    }

    async getMemberGroups(userId) {
        const memberResult = await db.query('SELECT id FROM members WHERE user_id = $1', [userId]);
        if (memberResult.rows.length === 0) return 0;

        const memberId = memberResult.rows[0].id;
        // Schema group_members doesn't have status
        const result = await db.query(
            'SELECT COUNT(*) FROM group_members WHERE member_id = $1',
            [memberId]
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
        AVG(attendance_count) as avg_attendance,
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
        DATE_TRUNC('month', membership_date) as month,
        COUNT(*) as new_members
       FROM members
       WHERE membership_date >= CURRENT_DATE - INTERVAL '${months} months'
       GROUP BY DATE_TRUNC('month', membership_date)
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
        (SELECT COUNT(*) FROM group_members WHERE group_id = g.id) as member_count,
        (SELECT COUNT(*) FROM group_attendance WHERE group_id = g.id AND meeting_date >= CURRENT_DATE - INTERVAL '3 months') as recent_meetings,
        (SELECT COALESCE(SUM(amount), 0) FROM group_finances WHERE group_id = g.id AND transaction_type = 'income') as total_income
       FROM groups g
       WHERE g.is_active = true
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
         WHERE ar.member_id = m.id AND ar.attendance_status = 'present' AND s.service_date >= CURRENT_DATE - INTERVAL '3 months') as attendance_count,
        (SELECT COUNT(*) FROM event_registrations WHERE member_id = m.id AND attendance_status != 'cancelled') as event_count,
        (SELECT COUNT(*) FROM group_members WHERE member_id = m.id) as group_count,
        (SELECT COALESCE(SUM(amount), 0) FROM contributions WHERE member_id = m.id 
         AND contribution_date >= CURRENT_DATE - INTERVAL '1 year') as annual_giving
       FROM members m
       WHERE m.membership_status = 'active'
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
