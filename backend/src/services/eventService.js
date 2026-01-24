const db = require('../config/database');
const logger = require('../utils/logger');

class EventService {
    /**
     * Get all events
     */
    async getAll(filters = {}) {
        const { limit = 20, offset = 0, eventType = null, upcoming = false, search = '' } = filters;

        let query = `
            SELECT e.*, 
                   COUNT(er.id) as registration_count,
                   json_agg(DISTINCT vr.*) FILTER (WHERE vr.id IS NOT NULL) as volunteer_roles
            FROM events e
            LEFT JOIN event_registrations er ON e.id = er.event_id AND er.attendance_status != 'cancelled'
            LEFT JOIN volunteer_roles vr ON e.id = vr.event_id
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

        query += ` GROUP BY e.id ORDER BY e.start_date ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get event by ID
     */
    async getById(id) {
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
            throw new Error('Event not found');
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

        // Sanitize: empty strings to null
        const sanitized = {
            end_date: end_date || null,
            deadline: registration_deadline || null,
            max: max_participants ? parseInt(max_participants) : null,
            cost: cost ? parseFloat(cost) : 0
        };

        const result = await db.query(
            `INSERT INTO events 
       (event_name, description, event_type, start_date, end_date, location, 
        max_participants, registration_required, registration_deadline, cost, banner_url, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
            [event_name, description, event_type, start_date, sanitized.end_date, location,
                sanitized.max, registration_required, sanitized.deadline, sanitized.cost, banner_url, createdBy]
        );

        logger.info('Event created:', { eventId: result.rows[0].id, event_name });
        return result.rows[0];
    }

    /**
     * Update event
     */
    async update(id, eventData) {
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
            [event_name, description, event_type, start_date, end_date || null, location,
                max_participants ? parseInt(max_participants) : null, registration_required,
                registration_deadline || null, cost ? parseFloat(cost) : null, banner_url || null, id]
        );

        if (result.rows.length === 0) {
            throw new Error('Event not found');
        }

        return result.rows[0];
    }

    /**
     * Delete event
     */
    async delete(id) {
        // Cascade delete is handled by database references (ON DELETE CASCADE)
        const result = await db.query(`DELETE FROM events WHERE id = $1 RETURNING *`, [id]);
        if (result.rows.length === 0) throw new Error('Event not found');
        return { message: 'Event deleted successfully' };
    }

    /**
     * Register for event
     */
    async register(eventId, memberId, paymentAmount = 0, notes = '') {
        const event = await this.getById(eventId);

        if (event.max_participants && event.registration_count >= event.max_participants) {
            throw new Error('Event is full');
        }

        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
            throw new Error('Registration deadline has passed');
        }

        const result = await db.query(
            `INSERT INTO event_registrations (event_id, member_id, amount_paid, payment_status, notes)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (event_id, member_id) DO UPDATE 
             SET attendance_status = 'registered', amount_paid = EXCLUDED.amount_paid, updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [eventId, memberId, paymentAmount || 0, paymentAmount > 0 ? 'paid' : 'waived', notes]
        );

        return result.rows[0];
    }

    /**
     * Volunteer signup
     */
    async volunteerSignup(roleId, memberId, notes = '') {
        const roleQuery = await db.query(
            `SELECT vr.*, (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as filled
             FROM volunteer_roles vr WHERE id = $1`,
            [roleId]
        );

        if (roleQuery.rows.length === 0) throw new Error('Role not found');
        const role = roleQuery.rows[0];

        if (role.filled >= role.slots_needed) {
            throw new Error('This volunteer role is already full');
        }

        const result = await db.query(
            `INSERT INTO volunteer_signups (role_id, member_id, notes)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [roleId, memberId, notes]
        );

        return result.rows[0];
    }

    /**
     * Get registrations for an event
     */
    async getRegistrations(eventId) {
        const result = await db.query(
            `SELECT er.*, m.first_name || ' ' || m.last_name as member_name, m.email, m.phone
             FROM event_registrations er
             JOIN members m ON er.member_id = m.id
             WHERE er.event_id = $1
             ORDER BY er.registration_date DESC`,
            [eventId]
        );
        return result.rows;
    }

    /**
     * Create volunteer role
     */
    async createVolunteerRole(eventId, roleData) {
        const { roleName, description, slotsNeeded } = roleData;
        const result = await db.query(
            `INSERT INTO volunteer_roles (event_id, role_name, description, slots_needed)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [eventId, roleName, description, slotsNeeded || 1]
        );
        return result.rows[0];
    }

    /**
     * Get volunteer roles for event
     */
    async getVolunteerRoles(eventId) {
        const result = await db.query(
            `SELECT vr.*, 
                   (SELECT COUNT(*) FROM volunteer_signups WHERE role_id = vr.id AND status != 'cancelled') as slots_filled
             FROM volunteer_roles vr
             WHERE vr.event_id = $1
             ORDER BY vr.role_name ASC`,
            [eventId]
        );
        return result.rows;
    }
}

module.exports = new EventService();
