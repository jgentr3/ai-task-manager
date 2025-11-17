# Task Manager API - Backend Documentation

Complete API documentation for the Task Manager backend server.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Tasks](#task-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)

## Overview

RESTful API built with Express.js and SQLite for managing tasks with user authentication. Features JWT-based authentication with access and refresh tokens.

## Tech Stack

- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: Express Validator
- **Security**: CORS, Helmet (recommended)

## Getting Started

### Installation

```bash
cd backend
npm install
```

### Configuration

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Running the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected output:**
```
===========================================
🚀 Task Manager API Server
===========================================
📡 Server running on port: 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api
💾 Database: SQLite (Initialized)
===========================================
```

## Database Schema

### Users Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique user identifier |
| email | TEXT | NOT NULL, UNIQUE | User's email address |
| password_hash | TEXT | NOT NULL | Hashed password (bcrypt) |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |

**Indexes:**
- `idx_users_email` on `email` (UNIQUE)

### Tasks Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Unique task identifier |
| user_id | INTEGER | NOT NULL, FOREIGN KEY → users(id) | Task owner |
| title | TEXT | NOT NULL | Task title (3-200 chars) |
| description | TEXT | NULL | Task description (max 1000 chars) |
| status | TEXT | NOT NULL, DEFAULT 'pending' | pending, in-progress, completed |
| priority | TEXT | NOT NULL, DEFAULT 'medium' | low, medium, high |
| due_date | DATE | NULL | Task deadline |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Indexes:**
- `idx_tasks_user_id` on `user_id`
- `idx_tasks_status` on `status`
- `idx_tasks_priority` on `priority`
- `idx_tasks_due_date` on `due_date`

**Triggers:**
- `update_task_updated_at` - Automatically updates `updated_at` on task modification

**Constraints:**
- `status` must be one of: 'pending', 'in-progress', 'completed'
- `priority` must be one of: 'low', 'medium', 'high'
- Foreign key cascade: ON DELETE CASCADE

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port number |
| NODE_ENV | No | development | Environment (development/production) |
| FRONTEND_URL | Yes | - | Frontend URL for CORS |
| JWT_SECRET | Yes | - | Secret key for JWT signing |
| JWT_EXPIRES_IN | No | 7d | Access token expiration |
| JWT_REFRESH_EXPIRES_IN | No | 30d | Refresh token expiration |

**Security Notes:**
- Always use a strong, random `JWT_SECRET` in production
- Never commit `.env` file to version control
- Use environment-specific `.env` files for different deployments

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!"
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 characters, max 100 characters
- `confirmPassword`: Must match password

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is already in use"
    }
  ]
}
```

---

#### 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive tokens

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

#### 3. Refresh Token

**Endpoint:** `POST /api/auth/refresh`

**Description:** Get new access token using refresh token

**Authentication:** Refresh token required

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

---

#### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Description:** Get current authenticated user's profile

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### 5. Change Password

**Endpoint:** `PUT /api/auth/change-password`

**Description:** Update user's password

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### Task Endpoints

All task endpoints require authentication (access token).

#### 6. Get All Tasks

**Endpoint:** `GET /api/tasks`

**Description:** Get all tasks for the authenticated user with optional filters

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, completed)
- `priority` (optional): Filter by priority (low, medium, high)

**Examples:**
```
GET /api/tasks
GET /api/tasks?status=pending
GET /api/tasks?priority=high
GET /api/tasks?status=in-progress&priority=high
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "user_id": 1,
        "title": "Complete project documentation",
        "description": "Write comprehensive API docs",
        "status": "in-progress",
        "priority": "high",
        "due_date": "2024-12-31",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-16T14:20:00.000Z"
      },
      {
        "id": 2,
        "user_id": 1,
        "title": "Review pull requests",
        "description": null,
        "status": "pending",
        "priority": "medium",
        "due_date": null,
        "created_at": "2024-01-15T11:00:00.000Z",
        "updated_at": "2024-01-15T11:00:00.000Z"
      }
    ],
    "count": 2
  }
}
```

---

#### 7. Get Task by ID

**Endpoint:** `GET /api/tasks/:id`

**Description:** Get a specific task by ID

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "in-progress",
      "priority": "high",
      "due_date": "2024-12-31",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-16T14:20:00.000Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 8. Create Task

**Endpoint:** `POST /api/tasks`

**Description:** Create a new task

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs for all endpoints",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-12-31"
}
```

**Validation Rules:**
- `title` (required): 3-200 characters
- `description` (optional): Max 1000 characters
- `status` (optional): One of: pending, in-progress, completed (default: pending)
- `priority` (optional): One of: low, medium, high (default: medium)
- `due_date` (optional): Valid date (YYYY-MM-DD)

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": 3,
      "user_id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs for all endpoints",
      "status": "pending",
      "priority": "high",
      "due_date": "2024-12-31",
      "created_at": "2024-01-17T09:15:00.000Z",
      "updated_at": "2024-01-17T09:15:00.000Z"
    }
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters long"
    }
  ]
}
```

---

#### 9. Update Task

**Endpoint:** `PUT /api/tasks/:id`

**Description:** Update an existing task (all fields)

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "in-progress",
  "priority": "medium",
  "due_date": "2024-12-25"
}
```

**Note:** All fields are optional; only provided fields will be updated.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Updated task title",
      "description": "Updated description",
      "status": "in-progress",
      "priority": "medium",
      "due_date": "2024-12-25",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-17T10:00:00.000Z"
    }
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 10. Update Task Status

**Endpoint:** `PATCH /api/tasks/:id/status`

**Description:** Update only the status of a task (lightweight operation)

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed"
}
```

**Validation Rules:**
- `status` (required): One of: pending, in-progress, completed

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "task": {
      "id": 1,
      "user_id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API docs",
      "status": "completed",
      "priority": "high",
      "due_date": "2024-12-31",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-17T10:30:00.000Z"
    }
  }
}
```

---

#### 11. Delete Task

**Endpoint:** `DELETE /api/tasks/:id`

**Description:** Delete a task permanently

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

#### 12. Get Overdue Tasks

**Endpoint:** `GET /api/tasks/overdue`

**Description:** Get all overdue tasks for the authenticated user

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 5,
        "user_id": 1,
        "title": "Overdue task",
        "description": "This task is past its due date",
        "status": "pending",
        "priority": "high",
        "due_date": "2024-01-10",
        "created_at": "2024-01-05T10:30:00.000Z",
        "updated_at": "2024-01-05T10:30:00.000Z"
      }
    ],
    "count": 1
  }
}
```

---

#### 13. Get Task Statistics

**Endpoint:** `GET /api/tasks/stats/summary`

**Description:** Get task count statistics by status for the authenticated user

**Authentication:** Access token required

**Headers:**
```
Authorization: Bearer <access_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 10,
      "pending": 3,
      "in-progress": 5,
      "completed": 2
    }
  }
}
```

---

## Error Handling

### Standard Error Response Format

All errors follow this consistent format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific field error"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, malformed request |
| 401 | Unauthorized | Missing, invalid, or expired token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server error |

### Common Errors

**Missing Authorization Header:**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

**Expired Token:**
```json
{
  "success": false,
  "message": "Token expired"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

## Testing

### Automated Testing

Run the comprehensive test script:

```bash
node test-api.js
```

This script tests all endpoints automatically and provides detailed output.

### Manual Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Create Task (replace TOKEN):**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Test Task",
    "priority": "high",
    "status": "pending"
  }'
```

**Get All Tasks:**
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

For complete testing guide, see [TESTING.md](TESTING.md)

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Plain passwords are never stored or logged

2. **JWT Tokens**
   - Access tokens expire in 7 days (configurable)
   - Refresh tokens expire in 30 days (configurable)
   - Tokens include user ID and email in payload

3. **CORS**
   - Configured to accept requests from frontend URL only
   - Set `FRONTEND_URL` in `.env` file

4. **SQL Injection**
   - Protected by using parameterized queries with better-sqlite3

5. **Rate Limiting**
   - Consider implementing rate limiting for production (e.g., express-rate-limit)

## Database Management

### View Database

```bash
# Using sqlite3 CLI
sqlite3 database.sqlite

# Inside sqlite3
.tables
.schema users
.schema tasks
SELECT * FROM users;
SELECT * FROM tasks;
```

### Reset Database

```bash
# Stop the server (Ctrl+C)
# Delete database file
rm database.sqlite   # Mac/Linux
del database.sqlite  # Windows

# Restart server - database will be recreated
npm run dev
```

## Development Tips

1. **Enable detailed logging** by setting `NODE_ENV=development`
2. **Use a strong JWT_SECRET** in production (32+ random characters)
3. **Monitor database file size** - SQLite stores everything in one file
4. **Backup database regularly** in production by copying `database.sqlite`
5. **Check server logs** for debugging - all errors are logged with details

## Production Deployment

Before deploying to production:

1. Set strong `JWT_SECRET` (use a random generator)
2. Set `NODE_ENV=production`
3. Configure proper `FRONTEND_URL`
4. Implement rate limiting
5. Add Helmet.js for security headers
6. Set up database backups
7. Configure proper logging (e.g., Winston)
8. Use HTTPS in production
9. Consider using a process manager (PM2)

## Support

For detailed testing instructions, see [TESTING.md](TESTING.md)

For quick start guide, see [../QUICKSTART.md](../QUICKSTART.md)

---

**API Version:** 1.0.0
**Last Updated:** January 2024
