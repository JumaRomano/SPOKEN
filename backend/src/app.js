require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth.routes');
const memberRoutes = require('./routes/member.routes');
const groupRoutes = require('./routes/group.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const eventRoutes = require('./routes/event.routes');
const financeRoutes = require('./routes/finance.routes');
const reportingRoutes = require('./routes/reporting.routes');
const communicationRoutes = require('./routes/communication.routes');
const sermonRoutes = require('./routes/sermon.routes');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS - Allow multiple origins for development
// CORS - Allow multiple origins for development and production
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
];

if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
}

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            logger.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

// Prevent favicon 404s
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Request logging
app.use((req, res, next) => {
    logger.info('Incoming request', {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    next();
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Spoken Word Of God Ministries ChMS API',
        status: 'active',
        documentation: '/api/docs' // Optional if we had docs
    });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Test database connection
        const db = require('./config/database');
        await db.query('SELECT 1');

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'Spoken Word Of God Ministries ChMS API',
            version: '1.0.0',
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
        });
    }
});

// TEMPORARY: Fix events table date columns
app.post('/api/fix-events-dates', async (req, res) => {
    try {
        const db = require('./config/database');

        await db.query(`
            ALTER TABLE events 
            ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::TIMESTAMP
        `);

        await db.query(`
            ALTER TABLE events 
            ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::TIMESTAMP
        `);

        res.json({ success: true, message: 'Events date columns fixed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/sermons', sermonRoutes);

// 404 handler
app.use(notFound);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`🚀 Spoken Word Of God Ministries ChMS API running on port ${PORT}`);
    logger.info(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
