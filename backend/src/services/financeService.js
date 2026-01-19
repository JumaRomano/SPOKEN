const db = require('../config/database');
const logger = require('../utils/logger');

class FinanceService {
    /**
     * Get all funds
     */
    async getFunds() {
        const result = await db.query(
            `SELECT f.*,
              COALESCE((SELECT SUM(amount) FROM contributions WHERE fund_id = f.id), 0) as total_received
       FROM funds f
       WHERE f.is_active = true
       ORDER BY f.fund_name`
        );

        return result.rows;
    }

    /**
     * Create fund
     */
    async createFund(fundData) {
        // Accept both camelCase and snake_case
        const fundName = fundData.fundName || fundData.fund_name;
        const fundType = fundData.fundType || fundData.fund_type;
        const targetAmount = fundData.targetAmount || fundData.target_amount || null;
        const description = fundData.description;
        const isActive = fundData.isActive !== undefined ? fundData.isActive : (fundData.is_active !== undefined ? fundData.is_active : true);

        const result = await db.query(
            `INSERT INTO funds (fund_name, description, fund_type, target_amount, is_active)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [fundName, description, fundType, targetAmount, isActive]
        );

        logger.info('Fund created:', { fundId: result.rows[0].id, fundName });
        return result.rows[0];
    }

    /**
     * Update fund
     */
    async updateFund(id, fundData) {
        const fundName = fundData.fundName || fundData.fund_name;
        const fundType = fundData.fundType || fundData.fund_type;
        const targetAmount = fundData.targetAmount || fundData.target_amount || null;
        const description = fundData.description;
        const isActive = fundData.isActive !== undefined ? fundData.isActive : (fundData.is_active !== undefined ? fundData.is_active : true);

        const result = await db.query(
            `UPDATE funds 
       SET fund_name = $1, description = $2, fund_type = $3, target_amount = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
            [fundName, description, fundType, targetAmount, isActive, id]
        );

        if (result.rows.length === 0) {
            throw new Error('Fund not found');
        }

        logger.info('Fund updated:', { fundId: id });
        return result.rows[0];
    }

    /**
     * Reassign fund (move contributions and pledges to another fund)
     */
    async reassignFund(fromFundId, toFundId) {
        // First verify both funds exist
        const fromFund = await db.query('SELECT * FROM funds WHERE id = $1', [fromFundId]);
        const toFund = await db.query('SELECT * FROM funds WHERE id = $1', [toFundId]);

        if (fromFund.rows.length === 0) {
            const error = new Error('Source fund not found');
            error.statusCode = 404;
            throw error;
        }

        if (toFund.rows.length === 0) {
            const error = new Error('Target fund not found');
            error.statusCode = 404;
            throw error;
        }

        // Reassign contributions
        const contributionsResult = await db.query(
            'UPDATE contributions SET fund_id = $1 WHERE fund_id = $2 RETURNING id',
            [toFundId, fromFundId]
        );

        // Reassign pledges
        const pledgesResult = await db.query(
            'UPDATE pledges SET fund_id = $1 WHERE fund_id = $2 RETURNING id',
            [toFundId, fromFundId]
        );

        logger.info('Fund reassigned:', {
            fromFundId,
            toFundId,
            contributionsReassigned: contributionsResult.rows.length,
            pledgesReassigned: pledgesResult.rows.length
        });

        return {
            contributionsReassigned: contributionsResult.rows.length,
            pledgesReassigned: pledgesResult.rows.length
        };
    }

    /**
     * Delete fund
     */
    async deleteFund(id) {
        // First check if fund has contributions
        const contributionsCheck = await db.query(
            'SELECT COUNT(*) as count FROM contributions WHERE fund_id = $1',
            [id]
        );

        if (parseInt(contributionsCheck.rows[0].count) > 0) {
            const error = new Error('Cannot delete fund with existing contributions. Please remove or reassign contributions first.');
            error.statusCode = 400;
            throw error;
        }

        // Check if fund has pledges
        const pledgesCheck = await db.query(
            'SELECT COUNT(*) as count FROM pledges WHERE fund_id = $1',
            [id]
        );

        if (parseInt(pledgesCheck.rows[0].count) > 0) {
            const error = new Error('Cannot delete fund with existing pledges. Please remove or reassign pledges first.');
            error.statusCode = 400;
            throw error;
        }

        const result = await db.query('DELETE FROM funds WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            const error = new Error('Fund not found');
            error.statusCode = 404;
            throw error;
        }

        logger.info('Fund deleted:', { fundId: id });
        return result.rows[0];
    }

    /**
     * Record contribution
     */
    async recordContribution(contributionData, recordedBy) {
        // Handle both camelCase and snake_case
        const memberId = contributionData.memberId || contributionData.member_id || null;
        const fundId = contributionData.fundId || contributionData.fund_id;
        const amount = contributionData.amount;
        const contributionType = contributionData.contributionType || contributionData.contribution_type || 'offering';
        const paymentMethod = contributionData.paymentMethod || contributionData.payment_method;
        const transactionRef = contributionData.transactionRef || contributionData.transaction_ref || null;
        const contributionDate = contributionData.contributionDate || contributionData.contribution_date || new Date();
        const notes = contributionData.notes || null;

        const result = await db.query(
            `INSERT INTO contributions 
       (member_id, fund_id, amount, contribution_type, payment_method, reference_number, 
        contribution_date, recorded_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [memberId, fundId, amount, contributionType, paymentMethod, transactionRef, contributionDate, recordedBy, notes]
        );

        logger.info('Contribution recorded:', { contributionId: result.rows[0].id, amount, fundId });
        return result.rows[0];
    }

    /**
     * Get all contributions with filters
     */
    async getContributions(filters = {}) {
        const { limit = 20, offset = 0, memberId = null, fundId = null, startDate = null, endDate = null } = filters;

        let query = `
      SELECT c.*, f.fund_name, f.fund_type,
             CASE WHEN c.member_id IS NULL THEN 'Anonymous' ELSE m.first_name || ' ' || m.last_name END as donor_name
      FROM contributions c
      JOIN funds f ON c.fund_id = f.id
      LEFT JOIN members m ON c.member_id = m.id
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (memberId) {
            query += ` AND c.member_id = $${paramCount}`;
            params.push(memberId);
            paramCount++;
        }

        if (fundId) {
            query += ` AND c.fund_id = $${paramCount}`;
            params.push(fundId);
            paramCount++;
        }

        if (startDate) {
            query += ` AND c.contribution_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND c.contribution_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        query += ` ORDER BY c.contribution_date DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        params.push(limit, offset);

        const result = await db.query(query, params);
        return result.rows;
    }

    /**
     * Get contribution statistics
     */
    async getStatistics(startDate = null, endDate = null) {
        let query = `
      SELECT 
        SUM(amount) as total_contributions,
        COUNT(DISTINCT member_id) as unique_donors,
        COUNT(*) as transaction_count,
        AVG(amount) as average_contribution
      FROM contributions
      WHERE 1=1
    `;
        const params = [];
        let paramCount = 1;

        if (startDate) {
            query += ` AND contribution_date >= $${paramCount}`;
            params.push(startDate);
            paramCount++;
        }

        if (endDate) {
            query += ` AND contribution_date <= $${paramCount}`;
            params.push(endDate);
            paramCount++;
        }

        const result = await db.query(query, params);

        // Get by fund
        let fundQuery = `
      SELECT f.fund_name, f.fund_type, SUM(c.amount) as total
      FROM contributions c
      JOIN funds f ON c.fund_id = f.id
      WHERE 1=1
    `;

        if (startDate) {
            fundQuery += ` AND c.contribution_date >= $1`;
        }
        if (endDate) {
            fundQuery += ` AND c.contribution_date <= $${startDate ? 2 : 1}`;
        }

        fundQuery += ` GROUP BY f.fund_name, f.fund_type ORDER BY total DESC`;

        const fundResult = await db.query(fundQuery, params);

        return {
            ...result.rows[0],
            byFund: fundResult.rows,
        };
    }

    /**
     * Create pledge
     */
    async createPledge(pledgeData) {
        // Handle both camelCase and snake_case
        const memberId = pledgeData.memberId || pledgeData.member_id;
        const fundId = pledgeData.fundId || pledgeData.fund_id;
        const pledgeAmount = pledgeData.pledgeAmount || pledgeData.pledge_amount;
        const pledgeDate = pledgeData.pledgeDate || pledgeData.pledge_date || new Date();
        const dueDate = pledgeData.dueDate || pledgeData.due_date || null;
        const notes = pledgeData.notes || null;

        const result = await db.query(
            `INSERT INTO pledges (member_id, fund_id, pledge_amount, pledge_date, due_date, status, notes)
       VALUES ($1, $2, $3, $4, $5, 'active', $6)
       RETURNING *`,
            [memberId, fundId, pledgeAmount, pledgeDate, dueDate, notes]
        );

        logger.info('Pledge created:', { pledgeId: result.rows[0].id, memberId, pledgeAmount });
        return result.rows[0];
    }

    /**
     * Get all pledges
     */
    async getAllPledges() {
        const result = await db.query(
            `SELECT p.*, f.fund_name, m.first_name, m.last_name,
              COALESCE((SELECT SUM(amount) FROM contributions 
                        WHERE member_id = p.member_id AND fund_id = p.fund_id 
                        AND contribution_date >= p.pledge_date), 0) as total_paid
       FROM pledges p
       JOIN funds f ON p.fund_id = f.id
       JOIN members m ON p.member_id = m.id
       WHERE p.status = 'active'
       ORDER BY p.pledge_date DESC`
        );

        return result.rows;
    }

    /**
     * Get member pledges
     */
    async getMemberPledges(memberId) {
        const result = await db.query(
            `SELECT p.*, f.fund_name,
              COALESCE((SELECT SUM(amount) FROM contributions 
                        WHERE member_id = p.member_id AND fund_id = p.fund_id 
                        AND contribution_date >= p.start_date), 0) as total_paid
       FROM pledges p
       JOIN funds f ON p.fund_id = f.id
       WHERE p.member_id = $1 AND p.status = 'active'
       ORDER BY p.start_date DESC`,
            [memberId]
        );

        return result.rows;
    }

    /**
     * Create levy
     */
    async createLevy(levyData, createdBy) {
        const { groupId, title, description, amountPerMember, dueDate } = levyData;

        const result = await db.query(
            `INSERT INTO levies (group_id, levy_name, description, amount_per_member, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [groupId, title, description, amountPerMember, dueDate, createdBy]
        );

        logger.info('Levy created:', { levyId: result.rows[0].id, groupId, title });
        return result.rows[0];
    }

    /**
     * Record levy payment
     */
    async recordLevyPayment(levyId, paymentData, recordedBy) {
        const { memberId, amountPaid, paymentMethod, paymentDate = new Date(), notes = null } = paymentData;

        const result = await db.query(
            `INSERT INTO levy_payments (levy_id, member_id, amount_paid, payment_method, payment_date, recorded_by, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [levyId, memberId, amountPaid, paymentMethod, paymentDate, recordedBy, notes]
        );

        logger.info('Levy payment recorded:', { levyId, memberId, amountPaid });
        return result.rows[0];
    }

    /**
     * Get levy payments
     */
    async getLevyPayments(levyId) {
        const result = await db.query(
            `SELECT lp.*, m.first_name, m.last_name, m.email
       FROM levy_payments lp
       JOIN members m ON lp.member_id = m.id
       WHERE lp.levy_id = $1
       ORDER BY lp.payment_date DESC`,
            [levyId]
        );

        // Get levy details
        const levyResult = await db.query('SELECT * FROM levies WHERE id = $1', [levyId]);

        if (levyResult.rows.length === 0) {
            throw new Error('Levy not found');
        }

        const levy = levyResult.rows[0];
        const totalCollected = result.rows.reduce((sum, payment) => sum + parseFloat(payment.amount_paid), 0);

        return {
            levy,
            payments: result.rows,
            totalCollected,
        };
    }

    /**
     * Generate giving report
     */
    async generateGivingReport(startDate, endDate) {
        // Summary
        const summaryResult = await db.query(
            `SELECT 
        SUM(amount) as total,
        COUNT(*) as transaction_count,
        COUNT(DISTINCT member_id) as unique_donors
       FROM contributions
       WHERE contribution_date >= $1 AND contribution_date <= $2`,
            [startDate, endDate]
        );

        // By fund
        const fundResult = await db.query(
            `SELECT f.fund_name, f.fund_type, SUM(c.amount) as total, COUNT(*) as count
       FROM contributions c
       JOIN funds f ON c.fund_id = f.id
       WHERE c.contribution_date >= $1 AND c.contribution_date <= $2
       GROUP BY f.fund_name, f.fund_type
       ORDER BY total DESC`,
            [startDate, endDate]
        );

        // By payment method
        const methodResult = await db.query(
            `SELECT payment_method, SUM(amount) as total, COUNT(*) as count
       FROM contributions
       WHERE contribution_date >= $1 AND contribution_date <= $2
       GROUP BY payment_method
       ORDER BY total DESC`,
            [startDate, endDate]
        );

        return {
            period: { startDate, endDate },
            summary: summaryResult.rows[0],
            byFund: fundResult.rows,
            byPaymentMethod: methodResult.rows,
        };
    }
}

module.exports = new FinanceService();
