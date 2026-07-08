# FatakPay TMS Backend API Documentation

## 🔗 Base URL
```
Production: https://api.yourdomain.com
Development: http://localhost:8000
```

## 🔐 Authentication

### JWT Token Authentication
All protected endpoints require JWT token in the Authorization header:
```http
Authorization: Bearer <your_jwt_token>
```

### Login
```http
POST /api/v1/auth/login/
Content-Type: application/json

{
    "email": "admin@fatakpay.com",
    "password": "Admin@1234"
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "admin@fatakpay.com",
        "first_name": "Vikram",
        "last_name": "Mehta",
        "role": "SUPER_ADMIN",
        "department": null
    }
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh/
Content-Type: application/json

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Logout
```http
POST /api/v1/auth/logout/
Authorization: Bearer <access_token>

{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 🎫 Tickets API

### List Tickets
```http
GET /api/v1/tickets/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` - Filter by status (open, assigned, in_progress, resolved, closed, escalated, on_hold)
- `priority` - Filter by priority (critical, high, medium, low)
- `department` - Filter by department ID
- `assignee` - Filter by assignee ID
- `search` - Search in title and description
- `page` - Page number for pagination
- `page_size` - Number of results per page (default: 20)

**Response:**
```json
{
    "count": 72,
    "next": "https://api.yourdomain.com/api/v1/tickets/?page=2",
    "previous": null,
    "results": [
        {
            "id": 1,
            "ticket_number": "TKT-0001",
            "subject": "VPN not connecting for WFH users",
            "description": "Multiple employees unable to connect...",
            "status": "open",
            "priority": "critical",
            "ticket_type": "internal",
            "department": {
                "id": 1,
                "name": "IT",
                "code": "IT"
            },
            "created_by": {
                "id": 2,
                "full_name": "Admin User",
                "email": "admin@fatakpay.com"
            },
            "assignee": null,
            "created_at": "2026-07-03T10:30:00Z",
            "updated_at": "2026-07-03T10:30:00Z",
            "sla_deadline": "2026-07-03T12:30:00Z",
            "sla_breached": false,
            "attachment_count": 0,
            "comment_count": 0
        }
    ]
}
```

### Create Ticket
```http
POST /api/v1/tickets/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "subject": "New ticket subject",
    "description": "Detailed description of the issue",
    "priority": "high",
    "ticket_type": "internal",
    "department": 1,
    "problem_category": "System Issue",
    "sub_problem": "Server not responding",
    "tags": ["urgent", "server"]
}
```

### Get Ticket Details
```http
GET /api/v1/tickets/{id}/
Authorization: Bearer <access_token>
```

### Update Ticket
```http
PUT /api/v1/tickets/{id}/
Authorization: Bearer <access_token>
Content-Type: application/json

{
    "status": "assigned",
    "assignee": 5,
    "priority": "medium"
}
```

### Assign Ticket
```http
POST /api/v1/tickets/{id}/assign/
Authorization: Bearer <access_token>

{
    "assignee": 5
}
```

### Escalate Ticket
```http
POST /api/v1/tickets/{id}/escalate/
Authorization: Bearer <access_token>

{
    "reason": "Issue requires senior review"
}
```

---

## 👥 Users API

### List Users
```http
GET /api/v1/users/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `role` - Filter by role (SUPER_ADMIN, DEPT_HEAD, CALLER, MEMBER)
- `department` - Filter by department ID
- `is_active` - Filter by active status (true/false)
- `search` - Search in name and email

**Response:**
```json
{
    "count": 61,
    "results": [
        {
            "id": 1,
            "email": "admin@fatakpay.com",
            "first_name": "Vikram",
            "last_name": "Mehta",
            "full_name": "Vikram Mehta",
            "role": "SUPER_ADMIN",
            "department": null,
            "is_active": true,
            "date_joined": "2026-07-03T10:00:00Z"
        }
    ]
}
```

### Get Current User
```http
GET /api/v1/users/me/
Authorization: Bearer <access_token>
```

### Update Profile
```http
PATCH /api/v1/users/me/
Authorization: Bearer <access_token>

{
    "first_name": "Updated Name",
    "last_name": "Updated Lastname"
}
```

---

## 🏢 Departments API

### List Departments
```http
GET /api/v1/departments/
Authorization: Bearer <access_token>
```

**Response:**
```json
{
    "count": 12,
    "results": [
        {
            "id": 1,
            "name": "IT",
            "code": "IT",
            "head": {
                "id": 3,
                "full_name": "Arjun Sharma",
                "email": "arjun.sharma@fatakpay.com"
            },
            "sla_critical_hours": 2,
            "sla_high_hours": 8,
            "is_active": true,
            "member_count": 4,
            "ticket_count": 6
        }
    ]
}
```

### Get Department Details
```http
GET /api/v1/departments/{id}/
Authorization: Bearer <access_token>
```

---

## 💬 Comments API

### List Comments for Ticket
```http
GET /api/v1/tickets/{ticket_id}/comments/
Authorization: Bearer <access_token>
```

### Add Comment
```http
POST /api/v1/tickets/{ticket_id}/comments/
Authorization: Bearer <access_token>

{
    "content": "This is a comment on the ticket",
    "is_internal": false
}
```

**Response:**
```json
{
    "id": 1,
    "content": "This is a comment on the ticket",
    "is_internal": false,
    "created_by": {
        "id": 2,
        "full_name": "Admin User"
    },
    "created_at": "2026-07-03T10:45:00Z"
}
```

---

## 📎 Attachments API

### Upload Attachment
```http
POST /api/v1/tickets/{ticket_id}/attachments/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

file: <binary_file>
```

### List Attachments
```http
GET /api/v1/tickets/{ticket_id}/attachments/
Authorization: Bearer <access_token>
```

### Download Attachment
```http
GET /api/v1/attachments/{id}/download/
Authorization: Bearer <access_token>
```

---

## 🔔 Notifications API

### List Notifications
```http
GET /api/v1/notifications/
Authorization: Bearer <access_token>
```

### Mark as Read
```http
POST /api/v1/notifications/{id}/mark_read/
Authorization: Bearer <access_token>
```

### Mark All as Read
```http
POST /api/v1/notifications/mark_all_read/
Authorization: Bearer <access_token>
```

---

## 🤖 AI Engine API

### Analyze Ticket
```http
POST /api/v1/ai/analyze/
Authorization: Bearer <access_token>

{
    "ticket_id": 1
}
```

**Response:**
```json
{
    "analysis": {
        "category": "System Performance Issue",
        "priority_suggestion": "high",
        "estimated_resolution_time": "4 hours",
        "similar_tickets": [2, 5, 8],
        "confidence": 0.85
    }
}
```

### Get Resolution Suggestions
```http
POST /api/v1/ai/suggest/
Authorization: Bearer <access_token>

{
    "ticket_id": 1
}
```

### AI Chat
```http
POST /api/v1/ai/chat/
Authorization: Bearer <access_token>

{
    "message": "How do I fix VPN connection issues?",
    "context": {
        "ticket_id": 1,
        "department": "IT"
    }
}
```

### Submit Feedback
```http
POST /api/v1/ai/feedback/
Authorization: Bearer <access_token>

{
    "ticket_id": 1,
    "ai_suggestion": "Restart VPN service",
    "was_helpful": true,
    "feedback": "This suggestion resolved the issue"
}
```

---

## 📊 Reports API

### Ticket Statistics
```http
GET /api/v1/reports/stats/
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `period` - Time period (today, week, month, quarter, year)
- `department` - Filter by department ID
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)

**Response:**
```json
{
    "total_tickets": 72,
    "open_tickets": 18,
    "resolved_tickets": 35,
    "sla_breached": 5,
    "by_priority": {
        "critical": 8,
        "high": 15,
        "medium": 32,
        "low": 17
    },
    "by_department": {
        "IT": 12,
        "Product": 8,
        "Sales": 10
    },
    "resolution_time_avg": "4.2 hours"
}
```

### SLA Report
```http
GET /api/v1/reports/sla/
Authorization: Bearer <access_token>
```

### Agent Performance
```http
GET /api/v1/reports/performance/
Authorization: Bearer <access_token>
```

---

## 🏥 Health & Monitoring

### Health Check
```http
GET /api/v1/health/
```

**Response:**
```json
{
    "status": "healthy",
    "database": "connected",
    "timestamp": "2026-07-03T10:30:00Z",
    "version": "1.0.0"
}
```

### System Status
```http
GET /api/v1/status/
Authorization: Bearer <access_token>
```

---

## 📄 API Schema

### OpenAPI Documentation
```http
GET /api/v1/schema/
```

### Interactive API Docs
```http
GET /api/v1/docs/
```

---

## ⚠️ Error Responses

### Standard Error Format
```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": {
            "email": ["This field is required."]
        }
    }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

### Common Error Codes
- `AUTHENTICATION_FAILED` - Invalid credentials
- `PERMISSION_DENIED` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## 📝 Example Workflows

### Create and Assign Ticket
```bash
# 1. Login
curl -X POST https://api.yourdomain.com/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fatakpay.com","password":"Admin@1234"}'

# 2. Create ticket
curl -X POST https://api.yourdomain.com/api/v1/tickets/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Server down",
    "description": "Production server not responding",
    "priority": "critical",
    "department": 1
  }'

# 3. Assign ticket
curl -X POST https://api.yourdomain.com/api/v1/tickets/73/assign/ \
  -H "Authorization: Bearer <token>" \
  -d '{"assignee": 5}'
```

### Upload Attachment and Add Comment
```bash
# 1. Upload file
curl -X POST https://api.yourdomain.com/api/v1/tickets/1/attachments/ \
  -H "Authorization: Bearer <token>" \
  -F "file=@screenshot.png"

# 2. Add comment
curl -X POST https://api.yourdomain.com/api/v1/tickets/1/comments/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Attached screenshot of the error"}'
```

---

## 🔒 Rate Limiting

- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **AI Endpoints**: 20 requests per minute per user
- **File Uploads**: 10 requests per minute per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

**API Documentation Version: 1.0.0**