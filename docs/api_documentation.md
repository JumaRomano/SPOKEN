# API Documentation

**Spoken Word Of God Ministries - Church Management System**

Version: 1.0.0  
Base URL: `http://localhost:5000/api`  
Production URL: `https://api.spokenword.com/api`

## Table of Contents

- [Authentication](#authentication)
- [Members](#members)
- [Groups](#groups)
- [Finance](#finance)
- [Attendance](#attendance)
- [Events](#events)
- [Communication](#communication)
- [Reporting](#reporting)
- [Error Handling](#error-handling)

---

## Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via JWT token.

### Include Token in Requests

```http
Authorization: Bearer <your_jwt_token>
```

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Smith",
  "role": "member"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "member"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/login

Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "admin@spokenword.com",
  "password": "Admin123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@spokenword.com",
      "role": "sysadmin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/refresh-token

Get a new access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/change-password

Change user password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Members

### GET /members

List all members with pagination and filters.

**Access:** All authenticated users  
**Query Parameters:**
- `limit` (default: 20) - Number of records per page
- `offset` (default: 0) - Number of records to skip
- `status` (default: 'active') - Filter by status: active, inactive, deceased
- `search` - Search by name or email
- `familyId` - Filter by family

**Example Request:**
```http
GET /api/members?limit=10&offset=0&status=active&search=mwangi
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "members": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "firstName": "John",
        "lastName": "Mwangi",
        "email": "john.mwangi@example.com",
        "phone": "+254712345678",
        "membershipStatus": "active",
        "membershipDate": "2020-01-10",
        "familyId": "660e8400-e29b-41d4-a716-446655440001",
        "familyName": "Mwangi Family"
      }
    ],
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

### GET /members/:id

Get detailed information about a specific member.

**Access:** All authenticated users  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "770e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Mwangi",
    "middleName": "Kamau",
    "dateOfBirth": "1980-05-15",
    "gender": "male",
    "phone": "+254712345678",
    "email": "john.mwangi@example.com",
    "address": "Nairobi, Karen Estate",
    "membershipStatus": "active",
    "membershipDate": "2020-01-10",
    "baptismDate": "2020-03-15",
    "maritalStatus": "married",
    "occupation": "Engineer",
    "emergencyContactName": "Mary Mwangi",
    "emergencyContactPhone": "+254712345679",
    "familyId": "660e8400-e29b-41d4-a716-446655440001",
    "profilePhotoUrl": null,
    "notes": null,
    "createdAt": "2020-01-10T10:30:00Z",
    "updatedAt": "2025-12-01T15:20:00Z"
  }
}
```

### POST /members

Create a new member record.

**Access:** Admin+ required  
**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+254700000000",
  "dateOfBirth": "1990-06-15",
  "gender": "female",
  "membershipStatus": "active",
  "membershipDate": "2026-01-08",
  "familyId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "membershipStatus": "active"
  }
}
```

### PUT /members/:id

Update member information.

**Access:** Admin+ or own profile  
**Request Body:** (all fields optional)
```json
{
  "phone": "+254700111111",
  "address": "New Address",
  "occupation": "Software Developer"
}
```

**Response:** `200 OK`

### DELETE /members/:id

Soft delete a member (sets status to inactive).

**Access:** Admin+ required  
**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Member deleted successfully"
}
```

### GET /members/:id/contributions

Get all contributions for a specific member.

**Access:** Finance+ or own records  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "contributions": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440000",
        "amount": 5000.00,
        "contributionType": "tithe",
        "fundName": "General Fund",
        "paymentMethod": "mobile_money",
        "contributionDate": "2026-01-01",
        "referenceNumber": "MPX123456"
      }
    ],
    "total": 52000.00,
    "count": 12
  }
}
```

### GET /members/:id/attendance

Get attendance history for a member.

**Access:** All authenticated users  
**Query Parameters:**
- `limit` (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "serviceName": "Sunday Service",
        "serviceDate": "2026-01-05",
        "serviceTime": "09:00",
        "attendanceStatus": "present",
        "checkInTime": "2026-01-05T08:45:00Z"
      }
    ],
    "attendanceRate": 85.5,
    "totalServices": 48,
    "attended": 41
  }
}
```

---

## Groups

### GET /groups

List all groups.

**Access:** All authenticated users  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "name": "Youth Ministry",
      "description": "Ministry for young people aged 18-35",
      "groupType": "ministry",
      "leaderId": "550e8400-e29b-41d4-a716-446655440000",
      "leaderName": "David Ochieng",
      "meetingSchedule": "Every Saturday 4:00 PM",
      "memberCount": 25,
      "isActive": true
    }
  ]
}
```

### GET /groups/:id

Get detailed group information.

**Access:** All authenticated users  
**Response:** `200 OK`

### POST /groups

Create a new group.

**Access:** Admin+ required  
**Request Body:**
```json
{
  "name": "Tech Ministry",
  "description": "Audio, video, and online streaming",
  "groupType": "ministry",
  "leaderId": "550e8400-e29b-41d4-a716-446655440000",
  "meetingSchedule": "Sundays before service"
}
```

**Response:** `201 Created`

### GET /groups/:id/members

Get all members of a specific group.

**Access:** All authenticated users  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "memberId": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "John",
      "lastName": "Mwangi",
      "role": "member",
      "joinedDate": "2025-01-15"
    }
  ]
}
```

### POST /groups/:id/members

Add a member to a group.

**Access:** Leader of group or Admin+  
**Request Body:**
```json
{
  "memberId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "member"
}
```

**Response:** `201 Created`

### GET /groups/:id/finances

Get financial records for a group.

**Access:** Leader of group or Finance+  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "bb0e8400-e29b-41d4-a716-446655440000",
        "transactionType": "income",
        "amount": 50000.00,
        "description": "Fundraising event",
        "transactionDate": "2026-01-05"
      }
    ],
    "totalIncome": 150000.00,
    "totalExpense": 75000.00,
    "balance": 75000.00
  }
}
```

### POST /groups/:id/finances

Record a group transaction.

**Access:** Leader of group or Finance+  
**Request Body:**
```json
{
  "transactionType": "expense",
  "amount": 15000.00,
  "description": "Purchase of microphones",
  "transactionDate": "2026-01-08"
}
```

**Response:** `201 Created`

---

## Finance

### GET /finance/funds

Get all financial funds.

**Access:** All authenticated users  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440000",
      "fundName": "General Fund",
      "description": "Main church operations",
      "fundType": "general",
      "isActive": true,
      "currentBalance": 2500000.00
    }
  ]
}
```

### POST /finance/contributions

Record a contribution.

**Access:** Finance+ required  
**Request Body:**
```json
{
  "memberId": "550e8400-e29b-41d4-a716-446655440000",
  "fundId": "cc0e8400-e29b-41d4-a716-446655440000",
  "amount": 10000.00,
  "contributionType": "tithe",
  "paymentMethod": "mobile_money",
  "referenceNumber": "MPX789012",
  "contributionDate": "2026-01-08"
}
```

**Response:** `201 Created`

### GET /finance/contributions

List all contributions with filters.

**Access:** Finance+ (all), Members (own only)  
**Query Parameters:**
- `memberId` - Filter by member
- `fundId` - Filter by fund
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `contributionType` - Filter by type
- `limit` - Records per page
- `offset` - Pagination offset

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "contributions": [...],
    "total": 1250,
    "totalAmount": 15500000.00
  }
}
```

### GET /finance/reports/giving

Generate giving report.

**Access:** Finance+ required  
**Query Parameters:**
- `startDate` - YYYY-MM-DD
- `endDate` - YYYY-MM-DD
- `groupBy` - fund, member, type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalContributions": 5500000.00,
      "totalTithes": 3200000.00,
      "totalOfferings": 1800000.00,
      "totalDonations": 500000.00,
      "numberOfContributors": 85
    },
    "byFund": [
      {
        "fundName": "General Fund",
        "amount": 4000000.00
      }
    ],
    "byType": [...],
    "topContributors": [...]
  }
}
```

### POST /finance/levies

Create a group levy.

**Access:** Leader+ required  
**Request Body:**
```json
{
  "groupId": "aa0e8400-e29b-41d4-a716-446655440000",
  "levyName": "Choir Uniform",
  "description": "New uniform for all choir members",
  "amountPerMember": 5000.00,
  "dueDate": "2026-02-28"
}
```

**Response:** `201 Created`

### GET /finance/levies/:id/payments

Get payment status for a levy.

**Access:** Leader of group or Finance+  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "levy": {
      "id": "dd0e8400-e29b-41d4-a716-446655440000",
      "levyName": "Choir Uniform",
      "amountPerMember": 5000.00,
      "dueDate": "2026-02-28"
    },
    "payments": [
      {
        "memberId": "550e8400-e29b-41d4-a716-446655440000",
        "memberName": "John Mwangi",
        "amountPaid": 5000.00,
        "paymentDate": "2026-01-10",
        "status": "paid"
      }
    ],
    "totalExpected": 125000.00,
    "totalCollected": 85000.00,
    "percentageCollected": 68.0
  }
}
```

---

## Attendance

### POST /attendance/services

Create a service record.

**Access:** Admin or Leader  
**Request Body:**
```json
{
  "serviceName": "Sunday Service",
  "serviceType": "sunday_service",
  "serviceDate": "2026-01-12",
  "serviceTime": "09:00"
}
```

**Response:** `201 Created`

### POST /attendance/record

Record member attendance.

**Access:** Admin or Leader  
**Request Body:**
```json
{
  "serviceId": "ee0e8400-e29b-41d4-a716-446655440000",
  "memberId": "550e8400-e29b-41d4-a716-446655440000",
  "attendanceStatus": "present",
  "checkInTime": "2026-01-12T09:05:00Z"
}
```

**Response:** `201 Created`

### GET /attendance/reports

Generate attendance reports.

**Access:** Admin or Leader  
**Query Parameters:**
- `startDate`
- `endDate`
- `serviceType`
- `groupBy` - service, member, date

**Response:** `200 OK`

---

## Events

### GET /events

List all events.

**Access:** All authenticated users  
**Response:** `200 OK`

### POST /events

Create a new event.

**Access:** Admin+ required  
**Request Body:**
```json
{
  "eventName": "Church Retreat 2026",
  "description": "Annual spiritual retreat",
  "eventType": "retreat",
  "startDate": "2026-03-15T08:00:00Z",
  "endDate": "2026-03-17T18:00:00Z",
  "location": "Mombasa Beach Resort",
  "maxParticipants": 150,
  "cost": 20000.00,
  "registrationDeadline": "2026-03-01T23:59:59Z"
}
```

**Response:** `201 Created`

### POST /events/:id/register

Register for an event.

**Access:** All authenticated members  
**Request Body:**
```json
{
  "memberId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `201 Created`

---

## Communication

### GET /communication/announcements

Get active announcements.

**Access:** All authenticated users  
**Response:** `200 OK`

### POST /communication/announcements

Create an announcement.

**Access:** Admin+ required  
**Request Body:**
```json
{
  "title": "Service Time Change",
  "content": "Starting next week, Sunday service begins at 10:00 AM",
  "announcementType": "general",
  "targetAudience": "all",
  "startDate": "2026-01-10",
  "endDate": "2026-01-31"
}
```

**Response:** `201 Created`

### POST /communication/send

Send bulk communication (SMS/Email).

**Access:** Admin+ required  
**Request Body:**
```json
{
  "recipientType": "group",
  "recipientId": "aa0e8400-e29b-41d4-a716-446655440000",
  "communicationType": "sms",
  "subject": "Meeting Reminder",
  "message": "Youth ministry meeting this Saturday at 4 PM"
}
```

**Response:** `200 OK`

---

## Reporting

### GET /reporting/dashboard

Get dashboard statistics.

**Access:** Admin+ required  
**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "members": {
      "total": 245,
      "active": 230,
      "new_this_month": 5
    },
    "attendance": {
      "last_service": 185,
      "average_monthly": 172,
      "trend": "up"
    },
    "finance": {
      "total_this_month": 850000.00,
      "total_this_year": 9500000.00,
      "average_monthly": 790000.00
    },
    "events": {
      "upcoming": 3,
      "total_registrations": 87
    }
  }
}
```

---

## Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { }
  }
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (duplicate)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Common Error Codes

- `AUTH_INVALID_CREDENTIALS` - Invalid email or password
- `AUTH_TOKEN_EXPIRED` - JWT token has expired
- `AUTH_INSUFFICIENT_PERMISSIONS` - User lacks required role
- `VALIDATION_ERROR` - Request validation failed
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `DUPLICATE_ENTRY` - Unique constraint violation

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "amount": "Amount must be greater than 0"
    }
  }
}
```

---

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP
- Returns `429 Too Many Requests` when exceeded

---

## Pagination

List endpoints support pagination via query parameters:
- `limit` - Number of records per page (max: 100, default: 20)
- `offset` - Number of records to skip (default: 0)

Response includes pagination metadata:
```json
{
  "data": [...],
  "total": 250,
  "limit": 20,
  "offset": 0
}
```
