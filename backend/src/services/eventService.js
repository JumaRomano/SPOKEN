const db = require('../config/database');
const logger = require('../utils/logger');

class EventService {
    /**
     * Get all events
     */
    async getAll(filters = {}) {
        const { limit = 20, offset = 0, eventType = null, status = null, upcoming = false } = filters;

        let query = 'SELECT * FROM events WHERE 1=1';
        const params = [];
        let paramCount = 1;

        if (eventType) {
            query += ` AND event_type = $${paramCount}`;
            params.push(eventType);
            paramCount++;
        }

        if (upcoming) {
            query += ` AND start_date >= CURRENT_DATE`;
        }

        query += ` ORDER BY start_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
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
              (SELECT COUNT(*) FROM event_registrations WHERE event_id = e.id) as registration_count
       FROM events e WHERE e.id = $1`,
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
            title,
            description,
            event_type,
            start_date,
            end_date,
            location,
            max_participants,
            registration_required = false,
            registration_deadline = null,
        } = eventData;

        // Convert empty string to null for integer field
        const maxParticipants = max_participants === '' || max_participants === null || max_participants === undefined ? null : parseInt(max_participants);

        const result = await db.query(
            `INSERT INTO events 
       (event_name, description, event_type, start_date, end_date, location, 
        max_participants, registration_required, registration_deadline, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
            [title, description, event_type, start_date, end_date, location,
                maxParticipants, registration_required, registration_deadline, createdBy]
        );

        logger.info('Event created:', { eventId: result.rows[0].id, event_name: title });
        return result.rows[0];
    }

    /**
     * Update event
     */
    async update(id, eventData) {
        const { title, description, event_type, start_date, end_date, location, max_participants, registration_deadline } = eventData;

        // Convert empty string to null for integer field
        const maxParticipants = max_participants === '' || max_participants === null || max_participants === undefined ? null : parseInt(max_participants);

        const result = await db.query(
            `UPDATE events SET
        event_name = COALESCE($1, event_name),
        description = COALESCE($2, description),
        event_type = COALESCE($3, event_type),
        start_date = COALESCE($4, start_date),
        end_date = COALESCE($5, end_date),
        location = COALESCE($6, location),
        max_participants = COALESCE($7, max_participants),
        registration_deadline = COALESCE($8, registration_deadline),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
            [title, description, event_type, start_date, end_date, location, maxParticipants, registration_deadline, id]
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
        const result = await db.query(
            `DELETE FROM events WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            throw new Error('Event not found');
        }

        logger.info('Event deleted:', { eventId: id });
        return { message: 'Event cancelled successfully' };
    }

    /**
     * Register for event
     */
    async register(eventId, memberId, paymentAmount = null) {
        // Check if event exists and has space
        const event = await this.getById(eventId);

        if (event.max_participants) {
            if (event.registration_count >= event.max_participants) {
                throw new Error('Event is full');
            }
        }

        if (event.registration_deadline && new Date(event.registration_deadline) < new Date()) {
            throw new Error('Registration deadline has passed');
        }

        try {
            const result = await db.query(
                `INSERT INTO event_registrations (event_id, member_id, amount_paid, attendance_status, payment_status)
         VALUES ($1, $2, $3, 'registered', $4)
         RETURNING *`,
                [eventId, memberId, paymentAmount, paymentAmount ? 'pending' : 'waived']
            );

            logger.info('Event registration created:', { eventId, memberId });
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Already registered for this event');
            }
            throw error;
        }
    }

    /**
     * Cancel registration
     */
    async cancelRegistration(eventId, memberId) {
        const result = await db.query(
            `UPDATE event_registrations 
       SET attendance_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE event_id = $1 AND member_id = $2
       RETURNING *`,
            [eventId, memberId]
        );

        if (result.rows.length === 0) {
            throw new Error('Registration not found');
        }

        logger.info('Event registration cancelled:', { eventId, memberId });
        return { message: 'Registration cancelled successfully' };
    }

    /**
     * Get event registrations
     */
    async getRegistrations(eventId) {
        const result = await db.query(
            `SELECT er.*, m.first_name, m.last_name, m.email, m.phone
       FROM event_registrations er
       JOIN members m ON er.member_id = m.id
       WHERE er.event_id = $1
       ORDER BY er.registration_date`,
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
            [eventId, roleName, description, slotsNeeded]
        );

        return result.rows[0];
    }

    /**
     * Sign up for volunteer role
     */
    async volunteerSignup(roleId, memberId) {
        // Check if slots available
        const roleResult = await db.query(
            'SELECT slots_needed, slots_filled FROM volunteer_roles WHERE id = $1',
            [roleId]
        );

        if (roleResult.rows.length === 0) {
            throw new Error('Volunteer role not found');
        }

        const { slots_needed, slots_filled } = roleResult.rows[0];
        if (slots_filled >= slots_needed) {
            throw new Error('All volunteer slots filled');
        }

        try {
            const result = await db.query(
                `INSERT INTO volunteer_signups (role_id, member_id, status)
         VALUES ($1, $2, 'pending')
         RETURNING *`,
                [roleId, memberId]
            );

            logger.info('Volunteer signup created:', { roleId, memberId });
            return result.rows[0];
        } catch (error) {
            if (error.code === '23505') {
                throw new Error('Already signed up for this role');
            }
            throw error;
        }
    }

    /**
     * Get volunteer roles for event
     */
    async getVolunteerRoles(eventId) {
        const result = await db.query(
            'SELECT * FROM volunteer_roles WHERE event_id = $1 ORDER BY role_name',
            [eventId]
        );

        return result.rows;
    }
}

module.exports = new EventService();
