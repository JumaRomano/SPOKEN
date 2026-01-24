const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Role-Based Access Control Middleware
 * Usage: rbac('resource_name', 'action_name')
 */
const rbac = (resource, action) => {
    return async (req, res, next) => {
        try {
            const { role, id: userId } = req.user;

            // 1. Get member ID associated with this user (for self-access checks)
            let userMemberId = null;
            if (role !== 'admin' && role !== 'sysadmin') {
                const memberResult = await db.query(
                    'SELECT id FROM members WHERE user_id = $1',
                    [userId]
                );
                if (memberResult.rows.length > 0) {
                    userMemberId = memberResult.rows[0].id;
                }
            }

            // 2. Special cases for self-access
            const targetMemberId = req.params.id || req.params.memberId;

            // If the user is accessing their own member record or sub-resources of their member record
            if (userMemberId && targetMemberId === userMemberId) {
                const allowedSelfResources = ['members', 'contributions', 'attendance', 'groups', 'events', 'family'];
                if (allowedSelfResources.includes(resource) && action === 'read') {
                    return next();
                }
                if (resource === 'members' && action === 'update') {
                    return next();
                }
            }

            // Check if permission exists in database (exact match or wildcard)
            const result = await db.query(
                `SELECT is_allowed FROM permissions 
                 WHERE role = $1 
                 AND (
                    (resource = $2 AND action = $3) 
                    OR (resource = '*' AND action = '*')
                 )
                 ORDER BY (resource = '*' AND action = '*') ASC 
                 LIMIT 1`,
                [role, resource, action]
            );

            // If no permission record found, deny by default
            if (result.rows.length === 0) {
                logger.warn('Permission not found', { role, resource, action });
                return res.status(403).json({ error: 'Access denied' });
            }

            const { is_allowed } = result.rows[0];

            if (!is_allowed) {
                logger.warn('Access denied', { userId, role, resource, action });
                return res.status(403).json({ error: 'Insufficient permissions' });
            }

            next();
        } catch (error) {
            logger.error('RBAC error:', error);
            return res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};

module.exports = rbac;
