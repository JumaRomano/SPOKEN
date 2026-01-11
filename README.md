# Spoken Word Of God Ministries - Church Management System

> Enterprise-grade, full-stack Church Management System with Node.js, PostgreSQL, and React

## 🎯 Overview

A production-ready Church Management System (ChMS) designed for **Spoken Word Of God Ministries**, featuring:

- **Public Church Website**: Homepage, sermons, events, giving, ministries
- **Member Portal**: Personal dashboards, giving records, attendance history
- **Church Management**: Member, group, event, and financial management
- **Role-Based Access Control**: Member, Leader, Finance, Admin, SysAdmin roles
- **Financial Transparency**: Members view their giving, admins see full reports
- **Analytics & Reporting**: Attendance trends, giving analytics, growth metrics

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston

### Frontend  
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Forms**: React Hook Form

## 📁 Project Structure

```
SPOKEN/
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── database/       # Migrations & seeds
│   │   └── app.js          # Express app entry
│   ├── tests/              # Test files
│   ├── .env.example        # Environment template
│   └── package.json
│
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utilities
│   │   └── App.jsx
│   └── package.json
│
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download/))
- npm or yarn

### 1. Database Setup

```bash
# Create database
createdb spoken_word_chms

# Or using psql
psql -U postgres
CREATE DATABASE spoken_word_chms;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Seed initial data
npm run seed

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📊 Database Schema

The system uses PostgreSQL with 20+ normalized tables:

- **Core**: `users`, `members`, `families`
- **Groups**: `groups`, `group_members`, `group_finances`
- **Attendance**: `services`, `attendance_records`, `group_attendance`
- **Events**: `events`, `event_registrations`, `volunteer_roles`, `volunteer_signups`
- **Finance**: `funds`, `contributions`, `pledges`, `levies`, `levy_payments`
- **Communication**: `announcements`, `communication_logs`
- **Security**: `audit_logs`, `permissions`

See `docs/database_schema.sql` for complete schema.

## 🔐 Authentication & Authorization

### User Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| **Member** | Regular church member | Personal data, events, own giving |
| **Leader** | Group/Ministry leader | Group management, attendance, group finances |
| **Finance** | Finance officer | All contributions, financial reports |
| **Admin** | Church administrator | User management, system settings |
| **SysAdmin** | System administrator | Full access, audit logs |

### API Authentication

All protected endpoints require JWT in the Authorization header:

```bash
Authorization: Bearer <your_token_here>
```

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `POST /change-password` - Change password

### Members (`/api/members`)
- `GET /` - List members (paginated)
- `GET /:id` - Get member details
- `POST /` - Create member (Admin+)
- `PUT /:id` - Update member
- `DELETE /:id` - Delete member (Admin+)
- `GET /:id/contributions` - Member's giving records
- `GET /:id/attendance` - Member's attendance history

### Groups (`/api/groups`)
- `GET /` - List groups
- `GET /:id` - Get group details
- `POST /` - Create group (Admin+)
- `PUT /:id` - Update group
- `GET /:id/members` - Group members
- `POST /:id/members` - Add member to group
- `GET /:id/finances` - Group financial records (Leader+)
- `POST /:id/finances` - Record group transaction (Leader+)

### Finance (`/api/finance`)
- `GET /funds` - List funds
- `POST /contributions` - Record contribution (Finance+)
- `GET /contributions` - List contributions (filtered by role)
- `GET /contributions/member/:id` - Member contributions
- `GET /reports/giving` - Giving report (Finance+)
- `POST /levies` - Create levy (Leader+)
- `GET /levies/:id/payments` - Levy payments

[... more endpoints - see API documentation]

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# With coverage
npm run test:coverage

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Production Build

```bash
# Backend (runs with PM2 or Node.js directly)
cd backend
NODE_ENV=production node src/app.js

# Frontend (build static files)
cd frontend
npm run build
# Serve build/ folder with Nginx or CDN
```

### Environment Variables (Production)

```bash
NODE_ENV=production
PORT=5000
DB_HOST=your-db-host
DB_NAME=spoken_word_chms
DB_USER=your-db-user
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://yourchurch.com
```

### Docker (Optional)

```bash
docker-compose up -d
```

## 📖 Documentation

- [System Architecture](docs/system_architecture.md)
- [Database Schema](docs/database_schema.sql)
- [API Documentation](docs/api_documentation.md)
- [Deployment Guide](docs/deployment_guide.md)

## 🛡️ Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing (bcrypt, 12 rounds)
- ✅ Role-based access control (RBAC)
- ✅ Input validation (Joi)
- ✅ SQL injection protection (parameterized queries)
- ✅ Rate limiting
- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Audit logging

## 📝 License

Proprietary - Spoken Word Of God Ministries

## 👥 Support

For support, contact: support@spokenword.com

---

**Built with ❤  for Spoken Word Of God Ministries**
