const db = require('../config/database');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

class EventService {
    /**
     * Get all events with filters
     */
    async getAll(filters = {}) {
        const {
            limit = 20,
            offset = 0,
            eventType = null,
            status = null,
            upcoming = false,
            search = '',
        } = filters;

        let query = `
            SELECT e.*, 
                   (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND attendance_status != 'cancelled') as registration_count,
                   (SELECT json_agg(roles) FROM (
                       SELECT vr.*, 
                              (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as slots_filled
                       FROM volunteer_roles vr 
                       WHERE vr.event_id = e.id
                   ) roles) as volunteer_roles
            FROM events e 
            WHERE 1=1
        `;
        const params = [];
        let paramCount = 1;

        if (eventType) {
            query += ` AND e.event_type = $${paramCount}`;
            params.push(eventType);
            paramCount++;
        }

        if (upcoming) {
            query += ` AND e.start_date >= CURRENT_TIMESTAMP`;
        }

        if (search) {
            query += ` AND (e.event_name ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        query += ` ORDER BY e.start_date ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get event by ID
     */
    async getById(id) {
        if (!id) throw new AppError('Event ID is required', 400);

        const result = await db.query(
            `SELECT e.*,
                    (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id AND attendance_status != 'cancelled') as registration_count,
                    (SELECT json_agg(roles) FROM (
                        SELECT vr.*, 
                               (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as slots_filled
                        FROM volunteer_roles vr 
                        WHERE vr.event_id = e.id
                    ) roles) as volunteer_roles
             FROM events e 
             WHERE e.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new AppError('Event not found', 404);
        }

        return result.rows[0];
    }

    /**
     * Create event
     */
    async create(eventData, createdBy) {
        const {
            event_name,
            description,
            event_type,
            start_date,
            end_date,
            location,
            max_participants,
            registration_required = false,
            registration_deadline,
            cost = 0,
            banner_url = null
        } = eventData;

        // Extreme sanitization for Postgres compatibility
        const sanitized = {
            start: !start_date || start_date === '' ? new Date() : start_date,
            end: !end_date || end_date === '' ? null : end_date,
            deadline: !registration_deadline || registration_deadline === '' ? null : registration_deadline,
            max: !max_participants || max_participants === '' ? null : parseInt(max_participants),
            costValue: isNaN(parseFloat(cost)) ? 0 : parseFloat(cost)
        };

        try {
            const result = await db.query(
                `INSERT INTO events 
           (event_name, description, event_type, start_date, end_date, location, 
            max_participants, registration_required, registration_deadline, cost, banner_url, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING *`,
                [
                    event_name || 'Untitled Event',
                    description || '',
                    event_type || 'other',
                    sanitized.start,
                    sanitized.end,
                    location || 'Spoken Word Ministry',
                    sanitized.max,
                    registration_required || false,
                    sanitized.deadline,
                    sanitized.costValue,
                    banner_url,
                    createdBy
                ]
            );

            logger.info('Event created:', { eventId: result.rows[0].id, name: event_name });
            return result.rows[0];
        } catch (error) {
            logger.error('Error in EventService.create:', error);
            throw error; // Let global error handler handle status codes (e.g., 400 for undefined columns)
        }
    }

    /**
     * Update event
     */
    async update(id, eventData) {
        if (!id) throw new AppError('Event ID is required', 400);

        const {
            event_name,
            description,
            event_type,
            start_date,
            end_date,
            location,
            max_participants,
            registration_required,
            registration_deadline,
            cost,
            banner_url
        } = eventData;

        const sanitized = {
            max: max_participants === '' ? null : (max_participants ? parseInt(max_participants) : undefined),
            costValue: cost === '' ? 0 : (cost ? parseFloat(cost) : undefined),
            end: end_date === '' ? null : end_date,
            deadline: registration_deadline === '' ? null : registration_deadline
        };

        const result = await db.query(
            `UPDATE events SET
                event_name = COALESCE($1, event_name),
                description = COALESCE($2, description),
                event_type = COALESCE($3, event_type),
                start_date = COALESCE($4, start_date),
                end_date = COALESCE($5, end_date),
                location = COALESCE($6, location),
                max_participants = COALESCE($7, max_participants),
                registration_required = COALESCE($8, registration_required),
                registration_deadline = COALESCE($9, registration_deadline),
                cost = COALESCE($10, cost),
                banner_url = COALESCE($11, banner_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $12
            RETURNING *`,
            [
                event_name, description, event_type, start_date, sanitized.end,
                location, sanitized.max, registration_required, sanitized.deadline,
                sanitized.costValue, banner_url, id
            ]
        );

        if (result.rows.length === 0) {
            throw new AppError('Event not found', 404);
        }

        return result.rows[0];
    }

    async delete(id) {
        if (!id) throw new AppError('Event ID is required', 400);
        const result = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) throw new AppError('Event not found', 404);
        return { message: 'Event deleted successfully' };
    }

    async register(eventId, memberId, paymentAmount = 0, notes = null) {
        // Use ON CONFLICT to handle re-registration or updates
        const result = await db.query(
            `INSERT INTO event_registrations (event_id, member_id, amount_paid, payment_status, notes)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (event_id, member_id) 
             DO UPDATE SET 
                amount_paid = EXCLUDED.amount_paid,
                payment_status = EXCLUDED.payment_status,
                notes = EXCLUDED.notes,
                attendance_status = 'registered',
                updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [eventId, memberId, paymentAmount, paymentAmount > 0 ? 'paid' : 'pending', notes]
        );
        return result.rows[0];
    }

    async cancelRegistration(eventId, memberId) {
        const result = await db.query(
            `UPDATE event_registrations 
             SET attendance_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
             WHERE event_id = $1 AND member_id = $2
             RETURNING *`,
            [eventId, memberId]
        );
        if (result.rows.length === 0) throw new AppError('Registration not found', 404);
        return { message: 'Registration cancelled' };
    }

    async getRegistrations(eventId) {
        const result = await db.query(
            `SELECT er.*, 
                    m.first_name, m.last_name, m.email, m.phone,
                    CONCAT(m.first_name, ' ', m.last_name) as member_name
             FROM event_registrations er
             JOIN members m ON er.member_id = m.id
             WHERE er.event_id = $1
             ORDER BY er.created_at DESC`,
            [eventId]
        );
        return result.rows;
    }

    async checkIn(eventId, memberId, status = 'attended') {
        const result = await db.query(
            `UPDATE event_registrations 
             SET attendance_status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE event_id = $2 AND member_id = $3
             RETURNING *`,
            [status, eventId, memberId]
        );

        if (result.rows.length === 0) {
            // Check if member exists but isn't registered
            const memberCheck = await db.query('SELECT id FROM members WHERE id = $1', [memberId]);
            if (memberCheck.rows.length === 0) throw new AppError('Member not found', 404);

            // Auto-register and check-in
            return this.register(eventId, memberId, 0, 'Walk-in Check-in');
        }

        return result.rows[0];
    }

    async createVolunteerRole(eventId, roleData) {
        const { roleName, description, slotsNeeded = 1 } = roleData;
        const result = await db.query(
            `INSERT INTO volunteer_roles (event_id, role_name, description, slots_needed)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [eventId, roleName, description, slotsNeeded]
        );
        return result.rows[0];
    }

    async getVolunteerRoles(eventId) {
        const result = await db.query(
            `SELECT vr.*, 
                    (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as slots_filled
             FROM volunteer_roles vr
             WHERE vr.event_id = $1`,
            [eventId]
        );
        return result.rows;
    }

    async volunteerSignup(roleId, memberId, notes = null) {
        // Check if slots are available
        const slotsCheck = await db.query(
            `SELECT vr.slots_needed, 
                    (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as filled
             FROM volunteer_roles vr WHERE vr.id = $1`,
            [roleId]
        );

        if (slotsCheck.rows.length === 0) throw new AppError('Role not found', 404);
        // Allow over-signup but warn? For now enforcing limit strict for this "Sacred" quality.
        if (slotsCheck.rows[0].filled >= slotsCheck.rows[0].slots_needed) {
            throw new AppError('This volunteer role is already full', 400);
        }

        const result = await db.query(
            `INSERT INTO volunteer_signups (role_id, member_id, notes)
             VALUES ($1, $2, $3)
             ON CONFLICT (role_id, member_id) DO UPDATE SET status = 'confirmed', notes = EXCLUDED.notes
             RETURNING *`,
            [roleId, memberId, notes]
        );
        return result.rows[0];
    }

    async getVolunteerSignups(eventId) {
        const result = await db.query(
            `SELECT vs.*, 
                    vr.role_name, 
                    m.first_name, m.last_name, m.email, m.phone,
                     CONCAT(m.first_name, ' ', m.last_name) as member_name
             FROM volunteer_signups vs
             JOIN volunteer_roles vr ON vs.role_id = vr.id
             JOIN members m ON vs.member_id = m.id
             WHERE vr.event_id = $1 AND vs.status != 'cancelled'`,
            [eventId]
        );
        return result.rows;
    }

    async getEventStats(eventId) {
        const stats = await db.query(
            `SELECT 
                (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1 AND attendance_status != 'cancelled') as total_registrations,
                (SELECT COUNT(*) FROM event_registrations WHERE event_id = $1 AND attendance_status = 'attended') as checked_in,
                (SELECT COALESCE(SUM(amount_paid), 0) FROM event_registrations WHERE event_id = $1 AND payment_status = 'paid') as total_revenue,
                 (SELECT COUNT(*) FROM volunteer_signups vs JOIN volunteer_roles vr ON vs.role_id = vr.id WHERE vr.event_id = $1 AND vs.status != 'cancelled') as total_volunteers
            `,
            [eventId]
        );

        return stats.rows[0];
    }
}

module.exports = new EventService();
