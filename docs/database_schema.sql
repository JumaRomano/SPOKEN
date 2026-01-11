-- =====================================================
-- DATABASE SCHEMA DOCUMENTATION
-- Spoken Word Of God Ministries - Church Management System
-- PostgreSQL 14+
-- =====================================================

/*
    This document provides a comprehensive overview of the database schema
    for the Spoken Word ChMS. The system uses PostgreSQL with a normalized
    relational model to manage all church operations.

    ARCHITECTURE OVERVIEW:
    - 20+ tables organized into logical modules
    - UUID primary keys for all tables
    - Foreign key constraints for referential integrity
    - Optimized indexes for common queries
    - Timestamp triggers for audit trails
    - Role-based permissions system

    TABLE CATEGORIES:
    1. Core Tables: Users, Members, Families
    2. Group Management: Groups, Group Members, Group Finances
    3. Attendance: Services, Attendance Records, Group Attendance
    4. Events: Events, Registrations, Volunteers
    5. Finance: Funds, Contributions, Pledges, Levies, Expenses
    6. Communication: Announcements, Communication Logs
    7. Security: Audit Logs, Sessions, Permissions
*/

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

/*
    USERS TABLE
    Purpose: Authentication and authorization
    Used for: Login, role-based access control
    Key relationships: 1:1 with members, 1:many with audit_logs
*/
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,         -- bcrypt hashed password
    role VARCHAR(50) NOT NULL,                   -- member, leader, finance, admin, sysadmin
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_role CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin'))
);

/*
    FAMILIES TABLE
    Purpose: Group members by household
    Used for: Family reporting, joint communications
    Key relationships: 1:many with members
*/
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
    MEMBERS TABLE
    Purpose: Core member information and profile
    Used for: Member directory, attendance tracking, contribution records
    Key relationships: Many:1 with users, families
    
    DESIGN NOTES:
    - user_id is optional (allows non-login members like children)
    - family_id groups members by household
    - membership_status tracks active/inactive/deceased
*/
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    family_id UUID REFERENCES families(id) ON DELETE SET NULL,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    
    -- Membership Information
    membership_status VARCHAR(50) DEFAULT 'active',
    membership_date DATE,
    baptism_date DATE,
    marital_status VARCHAR(50),
    occupation VARCHAR(255),
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Additional
    notes TEXT,
    profile_photo_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_gender CHECK (gender IN ('male', 'female', 'other')),
    CONSTRAINT check_membership_status CHECK (membership_status IN ('active', 'inactive', 'deceased')),
    CONSTRAINT check_marital_status CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed'))
);

-- =====================================================
-- 2. GROUP MANAGEMENT
-- =====================================================

/*
    GROUPS TABLE
    Purpose: Manage ministries, departments, fellowships
    Used for: Ministry organization, group-specific activities
    
    GROUP TYPES:
    - ministry: Youth, Children, Music
    - fellowship: Men's, Women's, Couples
    - committee: Finance, Building, Outreach
    - department: Admin, Technical, Hospitality
*/
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_type VARCHAR(50) NOT NULL,
    leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
    meeting_schedule VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_group_type CHECK (group_type IN ('ministry', 'committee', 'fellowship', 'department', 'other'))
);

/*
    GROUP_MEMBERS TABLE
    Purpose: Junction table for member-group relationships
    Used for: Tracking group membership, roles within groups
    
    DESIGN NOTES:
    - Supports multiple roles per member across groups
    - Tracks join date for duration analysis
*/
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'member',           -- leader, secretary, treasurer, member
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_group_member UNIQUE(group_id, member_id)
);

/*
    GROUP_FINANCES TABLE
    Purpose: Track income and expenses for individual groups
    Used for: Group-level financial accountability
    
    EXAMPLES:
    - Youth ministry fundraising
    - Choir uniform purchases
    - Men's fellowship outing costs
*/
CREATE TABLE group_finances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL,        -- income or expense
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_transaction_type CHECK (transaction_type IN ('income', 'expense'))
);

-- =====================================================
-- 3. ATTENDANCE TRACKING
-- =====================================================

/*
    SERVICES TABLE
    Purpose: Record church services and events that track attendance
    Used for: Service scheduling, attendance reporting
    
    SERVICE TYPES:
    - sunday_service: Main worship service
    - midweek_service: Wednesday/Thursday service
    - prayer_meeting: Early morning/evening prayer
    - special_event: Crusades, conferences, etc.
*/
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    service_date DATE NOT NULL,
    service_time TIME,
    attendance_count INTEGER DEFAULT 0,           -- Calculated or manual
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_service_type CHECK (service_type IN ('sunday_service', 'midweek_service', 'prayer_meeting', 'special_event', 'other'))
);

/*
    ATTENDANCE_RECORDS TABLE
    Purpose: Track individual member attendance at services
    Used for: Member attendance history, engagement analytics
    
    DESIGN NOTES:
    - check_in_time allows for late tracking
    - Unique constraint prevents duplicate attendance per service
*/
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    attendance_status VARCHAR(50) DEFAULT 'present',
    check_in_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_service_attendance UNIQUE(service_id, member_id),
    CONSTRAINT check_attendance_status CHECK (attendance_status IN ('present', 'absent', 'late', 'excused'))
);

/*
    GROUP_ATTENDANCE TABLE
    Purpose: Track attendance at group meetings
    Used for: Group engagement metrics, participation tracking
*/
CREATE TABLE group_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    meeting_date DATE NOT NULL,
    attendance_status VARCHAR(50) DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_group_attendance_status CHECK (attendance_status IN ('present', 'absent', 'late', 'excused'))
);

-- =====================================================
-- 4. EVENTS MANAGEMENT
-- =====================================================
-- See full schema file for complete events tables documentation
-- Tables: events, event_registrations, volunteer_roles, volunteer_signups

-- =====================================================
-- 5. FINANCIAL MANAGEMENT
-- =====================================================

/*
    FUNDS TABLE
    Purpose: Define different funds for church finances
    Used for: Categorizing contributions and expenses
    
    COMMON FUND TYPES:
    - general: Day-to-day operations
    - building: Construction/facilities
    - missions: Outreach and missions
    - benevolence: Member assistance
    - special: One-time projects
*/
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    fund_type VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_fund_type CHECK (fund_type IN ('general', 'building', 'missions', 'benevolence', 'special', 'other'))
);

/*
    CONTRIBUTIONS TABLE
    Purpose: Record all member giving (tithes, offerings, donations)
    Used for: Financial reports, member giving statements
    
    DESIGN NOTES:
    - member_id can be null for anonymous giving
    - reference_number for mobile money/bank transfers
    - recorded_by tracks who entered the record
    
    CONTRIBUTION TYPES:
    - tithe: 10% of income
    - offering: Regular giving
    - donation: Special/one-time gifts
    - pledge_payment: Toward a pledge
*/
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    fund_id UUID NOT NULL REFERENCES funds(id),
    amount DECIMAL(12, 2) NOT NULL,
    contribution_type VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),                -- M-PESA, bank ref, check #
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_amount CHECK (amount > 0),
    CONSTRAINT check_contribution_type CHECK (contribution_type IN ('tithe', 'offering', 'donation', 'pledge_payment', 'other')),
    CONSTRAINT check_payment_method CHECK (payment_method IN ('cash', 'check', 'mobile_money', 'bank_transfer', 'card', 'other'))
);

/*
    PLEDGES TABLE
    Purpose: Track member commitments to give specific amounts
    Used for: Building fund campaigns, special projects
    
    WORKFLOW:
    1. Member makes pledge
    2. Payments recorded as contributions with type='pledge_payment'
    3. amount_paid updated via trigger or application logic
    4. Status changes to 'completed' when fully paid
*/
CREATE TABLE pledges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    fund_id UUID NOT NULL REFERENCES funds(id),
    pledge_amount DECIMAL(12, 2) NOT NULL,
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    pledge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_pledge_amount CHECK (pledge_amount > 0),
    CONSTRAINT check_pledge_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

/*
    LEVIES TABLE
    Purpose: Group-specific financial obligations (uniform fees, event costs)
    Used for: Group fundraising, member contribution tracking
    
    EXAMPLE:
    - Choir levy KES 5,000 for new robes
    - Youth ministry KES 2,000 for retreat
*/
CREATE TABLE levies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    levy_name VARCHAR(255) NOT NULL,
    description TEXT,
    amount_per_member DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_levy_amount CHECK (amount_per_member > 0)
);

/*
    LEVY_PAYMENTS TABLE
    Purpose: Track individual member payments toward group levies
    Used for: Levy payment status, outstanding balances
    
    DESIGN NOTES:
    - Unique constraint allows only one payment per member per levy
    - For multiple payments, update the existing record
*/
CREATE TABLE levy_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    levy_id UUID NOT NULL REFERENCES levies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_levy_payment UNIQUE(levy_id, member_id),
    CONSTRAINT check_payment_amount CHECK (amount_paid > 0),
    CONSTRAINT check_levy_payment_method CHECK (payment_method IN ('cash', 'mobile_money', 'bank_transfer', 'other'))
);

-- =====================================================
-- INDEXES
-- =====================================================

/*
    INDEXING STRATEGY:
    - Foreign keys: Automatically indexed for joins
    - Frequent filters: Status, dates, types
    - Search fields: Names, emails
    - Sort fields: Dates, names
    
    PERFORMANCE NOTES:
    - Composite indexes for common multi-column queries
    - Date indexes support range queries
    - Name indexes enable fast directory searches
*/

-- User and member lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_members_name ON members(last_name, first_name);
CREATE INDEX idx_members_status ON members(membership_status);

-- Financial queries
CREATE INDEX idx_contributions_member_date ON contributions(member_id, contribution_date);
CREATE INDEX idx_contributions_fund_date ON contributions(fund_id, contribution_date);

-- Attendance queries
CREATE INDEX idx_attendance_service_date ON attendance_records(service_id);
CREATE INDEX idx_services_date_type ON services(service_date, service_type);

-- =====================================================
-- RELATIONSHIPS DIAGRAM (ASCII)
-- =====================================================

/*
    users ----1:1---- members ----M:1---- families
      |                 |
      |                 +------M:N------ groups
      |                 |
      |                 +------1:M------ attendance_records
      |                 |
      |                 +------1:M------ contributions
      |
      +----------1:M------ audit_logs

    LEGEND:
    1:1 = One-to-one
    1:M = One-to-many
    M:N = Many-to-many (via junction table)
*/

-- =====================================================
-- SECURITY NOTES
-- =====================================================

/*
    1. PASSWORDS: Never store plain text. Use bcrypt with 12+ rounds
    2. FINANCIAL DATA: Audit all changes to contributions/expenses
    3. PERSONAL DATA: Encrypt sensitive fields (SSN, financial details) if stored
    4. ACCESS CONTROL: Use row-level security for multi-church deployments
    5. BACKUP: Daily automated backups with point-in-time recovery
*/
