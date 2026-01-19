-- =====================================================
-- Spoken Word Of God Ministries - Church Management System
-- Database Schema - Initial Migration
-- PostgreSQL 14+
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('member', 'leader', 'finance', 'admin', 'sysadmin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Families table
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    family_id UUID REFERENCES families(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other')),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    membership_status VARCHAR(50) DEFAULT 'active' CHECK (membership_status IN ('active', 'inactive', 'deceased')),
    membership_date DATE,
    baptism_date DATE,
    marital_status VARCHAR(50) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
    occupation VARCHAR(255),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    notes TEXT,
    profile_photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- GROUP MANAGEMENT
-- =====================================================

-- Groups table (ministries, departments, committees)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    group_type VARCHAR(50) NOT NULL CHECK (group_type IN ('ministry', 'committee', 'fellowship', 'department', 'other')),
    leader_id UUID REFERENCES members(id) ON DELETE SET NULL,
    meeting_schedule VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group members junction table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    role VARCHAR(100) DEFAULT 'member',
    joined_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, member_id)
);

-- Group finances
CREATE TABLE group_finances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ATTENDANCE TRACKING
-- =====================================================

-- Services table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(100) NOT NULL CHECK (service_type IN ('sunday_service', 'midweek_service', 'prayer_meeting', 'special_event', 'other')),
    service_date DATE NOT NULL,
    service_time TIME,
    attendance_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records (individual member attendance)
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    attendance_status VARCHAR(50) DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late', 'excused')),
    check_in_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(service_id, member_id)
);

-- Group attendance (for group meetings)
CREATE TABLE group_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    meeting_date DATE NOT NULL,
    attendance_status VARCHAR(50) DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late', 'excused')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- EVENTS MANAGEMENT
-- =====================================================

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100) CHECK (event_type IN ('conference', 'retreat', 'outreach', 'social', 'training', 'other')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    max_participants INTEGER,
    registration_deadline TIMESTAMP,
    cost DECIMAL(10, 2) DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived')),
    amount_paid DECIMAL(10, 2) DEFAULT 0,
    attendance_status VARCHAR(50) DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'attended', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, member_id)
);

-- Volunteer roles for events
CREATE TABLE volunteer_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    role_name VARCHAR(255) NOT NULL,
    description TEXT,
    slots_needed INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volunteer signups
CREATE TABLE volunteer_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES volunteer_roles(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    UNIQUE(role_id, member_id)
);

-- =====================================================
-- FINANCIAL MANAGEMENT
-- =====================================================

-- Funds table (different funds for church finances)
CREATE TABLE funds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    fund_type VARCHAR(50) CHECK (fund_type IN ('general', 'building', 'missions', 'benevolence', 'special', 'other')),
    target_amount DECIMAL(12, 2) DEFAULT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contributions (tithes, offerings, donations)
CREATE TABLE contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    fund_id UUID NOT NULL REFERENCES funds(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    contribution_type VARCHAR(50) NOT NULL CHECK (contribution_type IN ('tithe', 'offering', 'donation', 'pledge_payment', 'other')),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'check', 'mobile_money', 'bank_transfer', 'card', 'other')),
    reference_number VARCHAR(100),
    contribution_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pledges
CREATE TABLE pledges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    fund_id UUID NOT NULL REFERENCES funds(id),
    pledge_amount DECIMAL(12, 2) NOT NULL CHECK (pledge_amount > 0),
    amount_paid DECIMAL(12, 2) DEFAULT 0,
    pledge_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Levies (group-specific financial obligations)
CREATE TABLE levies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    levy_name VARCHAR(255) NOT NULL,
    description TEXT,
    amount_per_member DECIMAL(10, 2) NOT NULL CHECK (amount_per_member > 0),
    due_date DATE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Levy payments
CREATE TABLE levy_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    levy_id UUID NOT NULL REFERENCES levies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10, 2) NOT NULL CHECK (amount_paid > 0),
    payment_method VARCHAR(50) CHECK (payment_method IN ('cash', 'mobile_money', 'bank_transfer', 'other')),
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(levy_id, member_id)
);

-- Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fund_id UUID REFERENCES funds(id),
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor VARCHAR(255),
    receipt_number VARCHAR(100),
    approved_by UUID REFERENCES users(id),
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNICATION
-- =====================================================

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    announcement_type VARCHAR(50) CHECK (announcement_type IN ('general', 'event', 'urgent', 'celebration')),
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'members', 'leaders', 'specific_group')),
    target_group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Communication logs (SMS, Email tracking)
CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_type VARCHAR(50) NOT NULL CHECK (recipient_type IN ('member', 'group', 'all')),
    recipient_id UUID,
    communication_type VARCHAR(50) NOT NULL CHECK (communication_type IN ('email', 'sms', 'notification')),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
    sent_by UUID REFERENCES users(id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SECURITY & AUDIT
-- =====================================================

-- Audit logs (track all important actions)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions (for refresh token management)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions (optional - for fine-grained access control)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    is_allowed BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, resource, action)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Members
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_family_id ON members(family_id);
CREATE INDEX idx_members_status ON members(membership_status);
CREATE INDEX idx_members_name ON members(last_name, first_name);

-- Groups
CREATE INDEX idx_groups_leader_id ON groups(leader_id);
CREATE INDEX idx_groups_type ON groups(group_type);

-- Group members
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_member_id ON group_members(member_id);

-- Attendance
CREATE INDEX idx_attendance_service_id ON attendance_records(service_id);
CREATE INDEX idx_attendance_member_id ON attendance_records(member_id);
CREATE INDEX idx_services_date ON services(service_date);

-- Events
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_member_id ON event_registrations(member_id);

-- Contributions
CREATE INDEX idx_contributions_member_id ON contributions(member_id);
CREATE INDEX idx_contributions_fund_id ON contributions(fund_id);
CREATE INDEX idx_contributions_date ON contributions(contribution_date);
CREATE INDEX idx_contributions_type ON contributions(contribution_type);

-- Pledges
CREATE INDEX idx_pledges_member_id ON pledges(member_id);
CREATE INDEX idx_pledges_status ON pledges(status);

-- Levies
CREATE INDEX idx_levies_group_id ON levies(group_id);
CREATE INDEX idx_levy_payments_levy_id ON levy_payments(levy_id);
CREATE INDEX idx_levy_payments_member_id ON levy_payments(member_id);

-- Audit logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_funds_updated_at BEFORE UPDATE ON funds
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pledges_updated_at BEFORE UPDATE ON pledges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_levies_updated_at BEFORE UPDATE ON levies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA (Default Permissions)
-- =====================================================

-- System Admin permissions (full access)
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('sysadmin', '*', '*', true);

-- Admin permissions
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('admin', 'members', 'create', true),
('admin', 'members', 'read', true),
('admin', 'members', 'update', true),
('admin', 'members', 'delete', true),
('admin', 'groups', 'create', true),
('admin', 'groups', 'read', true),
('admin', 'groups', 'update', true),
('admin', 'groups', 'delete', true),
('admin', 'events', 'create', true),
('admin', 'events', 'read', true),
('admin', 'events', 'update', true),
('admin', 'users', 'create', true),
('admin', 'users', 'read', true),
('admin', 'users', 'update', true),
('admin', 'funds', 'create', true),
('admin', 'funds', 'read', true),
('admin', 'funds', 'update', true),
('admin', 'funds', 'delete', true);

-- Finance permissions
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('finance', 'funds', 'create', true),
('finance', 'funds', 'read', true),
('finance', 'funds', 'update', true),
('finance', 'funds', 'delete', true),
('finance', 'contributions', 'create', true),
('finance', 'contributions', 'read', true),
('finance', 'expenses', 'create', true),
('finance', 'expenses', 'read', true),
('finance', 'reports', 'read', true),
('finance', 'pledges', 'create', true),
('finance', 'pledges', 'read', true),
('finance', 'members', 'read', true),
('finance', 'groups', 'read', true);

-- Leader permissions
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('leader', 'groups', 'read', true),
('leader', 'groups', 'update', true),
('leader', 'group_members', 'create', true),
('leader', 'group_members', 'read', true),
('leader', 'group_finances', 'create', true),
('leader', 'group_finances', 'read', true),
('leader', 'levies', 'create', true),
('leader', 'levies', 'read', true),
('leader', 'members', 'read', true),
('leader', 'events', 'create', true),
('leader', 'events', 'read', true);

-- Secretary permissions
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('secretary', 'events', 'create', true),
('secretary', 'events', 'read', true),
('secretary', 'events', 'update', true),
('secretary', 'members', 'read', true),
('secretary', 'groups', 'read', true);

-- Member permissions (basic)
INSERT INTO permissions (role, resource, action, is_allowed) VALUES
('member', 'profile', 'read', true),
('member', 'profile', 'update', true),
('member', 'contributions', 'read_own', true),
('member', 'attendance', 'read_own', true),
('member', 'events', 'read', true),
('member', 'events', 'register', true);

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
