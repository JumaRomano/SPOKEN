module.exports = {
    USER_ROLES: {
        MEMBER: 'member',
        LEADER: 'leader',
        FINANCE: 'finance',
        ADMIN: 'admin',
        SYSADMIN: 'sysadmin',
    },

    USER_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUSPENDED: 'suspended',
    },

    MEMBER_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        TRANSFERRED: 'transferred',
        DECEASED: 'deceased',
    },

    GROUP_CATEGORY: {
        MINISTRY: 'ministry',
        SMALL_GROUP: 'small_group',
        COMMITTEE: 'committee',
        SERVICE_TEAM: 'service_team',
        CHOIR: 'choir',
        YOUTH: 'youth',
        OTHER: 'other',
    },

    PAYMENT_METHOD: {
        CASH: 'cash',
        MPESA: 'mpesa',
        BANK_TRANSFER: 'bank_transfer',
        CARD: 'card',
        CHECK: 'check',
        OTHER: 'other',
    },

    EVENT_TYPE: {
        CONFERENCE: 'conference',
        RETREAT: 'retreat',
        OUTREACH: 'outreach',
        SOCIAL: 'social',
        TRAINING: 'training',
        WORKSHOP: 'workshop',
        SEMINAR: 'seminar',
        OTHER: 'other',
    },

    SERVICE_TYPE: {
        SUNDAY_SERVICE: 'sunday_service',
        MIDWEEK: 'midweek',
        PRAYER: 'prayer',
        SPECIAL: 'special',
        GROUP_MEETING: 'group_meeting',
        OTHER: 'other',
    },

    FUND_TYPE: {
        TITHE: 'tithe',
        OFFERING: 'offering',
        MISSIONS: 'missions',
        BUILDING: 'building',
        SPECIAL: 'special',
        WELFARE: 'welfare',
        OTHER: 'other',
    },

    PAGINATION: {
        DEFAULT_LIMIT: 20,
        MAX_LIMIT: 100,
    },
};
