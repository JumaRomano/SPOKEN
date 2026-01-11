# System Architecture

**Spoken Word Of God Ministries - Church Management System**

## Overview

The Spoken Word ChMS is a modern, full-stack web application built using a three-tier architecture pattern. The system is designed for scalability, security, and maintainability with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                          │
├─────────────────────────────────────────────────────────────┤
│  React Single Page Application (SPA)                         │
│  • React 18+ with Hooks                                      │
│  • React Router v6 for navigation                            │
│  • Axios for HTTP requests                                   │
│  • Context API for state management                          │
│  • Responsive UI with modern CSS                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / REST API
                     │ JWT Authentication
┌────────────────────▼────────────────────────────────────────┐
│                      APPLICATION TIER                        │
├─────────────────────────────────────────────────────────────┤
│  Node.js + Express.js API Server                             │
│  ┌──────────┬──────────┬──────────┬──────────┐             │
│  │  Routes  │Controllers│ Services │Middleware│             │
│  └──────────┴──────────┴──────────┴──────────┘             │
│  • RESTful API endpoints                                     │
│  • Business logic layer                                      │
│  • JWT-based authentication                                  │
│  • Role-based access control (RBAC)                          │
│  • Input validation (Joi)                                    │
│  • Structured logging (Winston)                              │
└────────────────────┬────────────────────────────────────────┘
                     │ PostgreSQL Protocol
                     │ Connection Pooling
┌────────────────────▼────────────────────────────────────────┐
│                       DATABASE TIER                          │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL 14+ Relational Database                          │
│  • 20+ normalized tables                                     │
│  • Foreign key constraints                                   │
│  • Indexes for performance                                   │
│  • Triggers for data integrity                               │
│  • Transaction support                                       │
│  • Point-in-time recovery                                    │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Client Tier)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | React 18+ | Component-based UI |
| Build Tool | Vite | Fast development & bundling |
| Routing | React Router v6 | Client-side navigation |
| HTTP Client | Axios | API communication |
| State Management | Context API + Hooks | Global state |
| Forms | React Hook Form | Form validation |
| Charts | Recharts | Data visualization |
| Styling | CSS Modules / Styled Components | Component styling |

### Backend (Application Tier)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Runtime | Node.js 18+ | JavaScript runtime |
| Framework | Express.js | Web application framework |
| Authentication | JWT (JSON Web Tokens) | Stateless authentication |
| Password Hashing | bcryptjs | Secure password storage |
| Validation | Joi | Request data validation |
| Logging | Winston | Structured logging |
| Security | Helmet.js | HTTP security headers |
| Rate Limiting | express-rate-limit | API rate limiting |
| CORS | cors | Cross-origin requests |

### Database (Data Tier)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Database | PostgreSQL 14+ | Relational data storage |
| Driver | node-postgres (pg) | Node.js database driver |
| Schema Management | SQL migrations | Version-controlled schema |
| Connection Pooling | pg.Pool | Efficient connections |

### Supporting Services

| Service | Technology | Purpose |
|---------|------------|---------|
| Email | Nodemailer | Transactional emails |
| PDF Generation | PDFKit | Reports & receipts |
| Excel Export | ExcelJS | Financial exports |
| Task Scheduling | node-cron | Automated tasks |

## Component Architecture

### Backend Layer Structure

```
backend/src/
├── app.js                 # Application entry point
├── config/                # Configuration files
│   ├── database.js        # Database connection setup
│   ├── jwt.js             # JWT configuration
│   └── constants.js       # Global constants
├── middleware/            # Express middleware
│   ├── auth.js            # JWT authentication
│   ├── rbac.js            # Role-based access control
│   ├── validator.js       # Request validation
│   ├── errorHandler.js    # Error handling
│   └── auditLog.js        # Audit logging
├── routes/                # API route definitions
│   ├── auth.routes.js
│   ├── member.routes.js
│   ├── group.routes.js
│   ├── finance.routes.js
│   └── ...
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── memberController.js
│   └── ...
├── services/              # Business logic layer
│   ├── authService.js
│   ├── memberService.js
│   └── ...
├── models/                # (Optional) Data models
├── utils/                 # Utility functions
│   └── logger.js
└── database/              # Database scripts
    ├── migrations/        # Schema migrations
    ├── migrate.js         # Migration runner
    └── seed.js            # Seed data script
```

### Request Flow

```
1. HTTP Request (Client)
        ↓
2. Express Router (routes/)
        ↓
3. Middleware Chain
   - CORS check
   - Rate limiting
   - Authentication (JWT)
   - Authorization (RBAC)
   - Input validation
        ↓
4. Controller (controllers/)
   - Extract request data
   - Call service methods
   - Handle errors
        ↓
5. Service Layer (services/)
   - Business logic
   - Database queries
   - Data transformation
        ↓
6. Database (PostgreSQL)
   - Query execution
   - Transaction management
        ↓
7. Response (JSON)
   - Formatted data
   - Status codes
   - Error messages
```

## Security Architecture

### Authentication Flow

```
1. User Login
   ├── POST /api/auth/login
   ├── Validate credentials (bcrypt)
   ├── Generate JWT access token (24h)
   └── Generate refresh token (7d)
        ↓
2. Authenticated Request
   ├── Include JWT in Authorization header
   ├── Middleware verifies token
   ├── Extract user ID and role
   └── Attach to request object
        ↓
3. Authorization Check
   ├── Check user role
   ├── Verify resource permissions
   └── Allow or deny access
        ↓
4. Token Refresh
   ├── POST /api/auth/refresh-token
   ├── Validate refresh token
   └── Issue new access token
```

### Security Layers

1. **Transport Security**
   - HTTPS/TLS in production
   - Secure cookie flags
   - HSTS headers

2. **Application Security**
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting (100 req/15min)
   - Input sanitization
   - SQL injection prevention (parameterized queries)

3. **Authentication Security**
   - bcrypt password hashing (12 rounds)
   - JWT with secret key rotation
   - Refresh token mechanism
   - Session management

4. **Authorization Security**
   - Role-based access control (RBAC)
   - Resource-level permissions
   - Audit logging for sensitive operations

5. **Data Security**
   - Field-level access control
   - Members see only their own financial data
   - Leaders access only their group data
   - Admins have full access

## Database Design Principles

### Normalization

The database follows **Third Normal Form (3NF)** to ensure:
- No redundant data
- Data integrity through foreign keys
- Efficient updates and inserts

### Key Relationships

```
users ──1:1── members ──M:1── families
  │              │
  │              ├──1:M── contributions
  │              ├──1:M── attendance_records
  │              └──M:N── groups (via group_members)
  │
  └──1:M── audit_logs
```

### Indexes Strategy

- **Primary Keys**: UUID for distributed systems
- **Foreign Keys**: Automatic relationship indexes
- **Composite Indexes**: For multi-column queries
- **Date Indexes**: For time-range queries
- **Text Indexes**: For search functionality

### Data Integrity

- Foreign key constraints for referential integrity
- Check constraints for valid values
- Unique constraints for duplicate prevention
- NOT NULL constraints for required fields
- Triggers for automatic timestamp updates

## Scalability Considerations

### Current Architecture (Single Server)

Suitable for:
- Up to 1,000 members
- 10,000 transactions/day
- Single church deployment

### Scaling Path

**Phase 1: Vertical Scaling**
- Increase server resources (CPU, RAM)
- Optimize database queries
- Add caching layer (Redis)

**Phase 2: Horizontal Scaling**
- Load balancer (Nginx/HAProxy)
- Multiple API server instances
- Database read replicas
- Session storage (Redis)

**Phase 3: Microservices**
- Separate services by domain
  - Member Service
  - Finance Service
  - Event Service
- Message queue (RabbitMQ/Kafka)
- API Gateway

## Performance Optimization

### Database Level

- Connection pooling (max 20 connections)
- Query optimization with EXPLAIN ANALYZE
- Proper indexing strategy
- Materialized views for complex reports
- Database query caching

### Application Level

- Response compression (gzip)
- Pagination for large datasets
- Lazy loading of related data
- Background jobs for heavy tasks
- Request/response caching

### Client Level

- Code splitting and lazy loading
- Image optimization
- Browser caching
- CDN for static assets
- Minification and bundling

## Monitoring & Observability

### Logging

- **Winston**: Structured application logs
- Log levels: error, warn, info, debug
- Separate log files by severity
- Log rotation (daily, max 14 days)

### Metrics to Monitor

- API response times
- Database query performance
- Error rates
- Authentication failures
- Resource utilization (CPU, memory, disk)
- Active user sessions

### Recommended Tools

- **Application Monitoring**: PM2, New Relic
- **Database Monitoring**: pgAdmin, PostgreSQL stats
- **Log Aggregation**: ELK Stack, Graylog
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot, Pingdom

## Backup & Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Automated daily backups at 2 AM
   - Point-in-time recovery enabled
   - 30-day retention policy
   - Offsite backup storage

2. **Application Backups**
   - Source code in Git repository
   - Environment configurations
   - SSL certificates

3. **File Backups**
   - User uploaded files
   - Generated reports
   - Profile photos

### Recovery Time Objectives (RTO)

- Critical failure: < 1 hour
- Data loss tolerance (RPO): < 24 hours
- Regular disaster recovery testing: Quarterly

## Development Workflow

### Environments

1. **Development**: Local developer machines
2. **Staging**: Pre-production testing
3. **Production**: Live church system

### Deployment Pipeline

```
Code Commit (Git)
    ↓
Automated Tests
    ↓
Build & Package
    ↓
Deploy to Staging
    ↓
Manual Testing
    ↓
Deploy to Production
    ↓
Health Check
    ↓
Monitor
```

## Future Enhancements

### Planned Features

- Mobile applications (React Native)
- Real-time notifications (WebSocket)
- Advanced analytics dashboard
- Integration with payment gateways
- Multi-language support
- Mobile app for check-ins (QR codes)
- Automated SMS/email campaigns
- Calendar integration (Google Calendar)

### Technical Improvements

- GraphQL API alongside REST
- Server-side rendering (Next.js)
- Enhanced caching strategies
- Progressive Web App (PWA)
- Automated testing (Jest, Cypress)
- CI/CD pipeline (GitHub Actions)

---

**Document Version**: 1.0  
**Last Updated**: January 8, 2026  
**Maintained By**: Development Team
