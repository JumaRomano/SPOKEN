const db = require('../config/database');
const logger = require('../utils/logger');

/**
 * Audit log middleware
 * Logs user actions for compliance and security
 */
const auditLog = (actionType, tableName = null) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send;

        // Override send function to capture response
        res.send = function (data) {
            // Only log successful operations (2xx status codes)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                // Don't await - log asynchronously to not block response
                setImmediate(async () => {
                    try {
                        const recordId = req.params.id || null;
                        const table = tableName || extractTableFromPath(req.baseUrl);

                        await db.query(
                            `INSERT INTO audit_logs 
               (user_id, action_type, table_name, record_id, new_values, ip_address, user_agent)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                            [
                                req.user?.id || null,
                                actionType,
                                table,
                                recordId,
                                JSON.stringify(req.body),
                                req.ip,
                                req.get('user-agent'),
                            ]
                        );
                    } catch (error) {
                        logger.error('Audit log error:', error);
                    }
                });
            }

            // Call original send
            originalSend.call(this, data);
        };

        next();
    };
};

/**
 * Extract table name from route path
 * Example: /api/members -> members
 */
const extractTableFromPath = (path) => {
    const match = path.match(/\/api\/([^\/]+)/);
    return match ? match[1] : 'unknown';
};

module.exports = auditLog;
