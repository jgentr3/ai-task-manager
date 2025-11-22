# Backend - AI Task Manager API

## Overview

Express.js REST API with SQLite database for task management. Handles user authentication with JWT and provides CRUD operations for tasks.

## Directory Structure

```
backend/
├── config/
│   ├── database.js          # SQLite connection and initialization
│   └── jwt.js               # JWT configuration and helpers
│
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling
│   └── validation.js        # Request validation middleware
│
├── models/
│   ├── User.js              # User database operations
│   └── Task.js              # Task database operations
│
├── routes/
│   ├── auth.js              # Authentication endpoints
│   └── tasks.js             # Task CRUD endpoints
│
├── utils/
│   ├── hash.js              # bcrypt password hashing
│   └── tokens.js            # JWT token generation/verification
│
├── database.sqlite          # SQLite database file (gitignored)
├── .env                     # Environment variables (gitignored)
├── .env.example             # Environment template
├── package.json
├── server.js                # Main entry point
└── test-api.js              # API testing script
```

## Core Files

### server.js
Main application entry point that:
- Initializes Express app
- Configures middleware (CORS, JSON parsing, etc.)
- Registers routes
- Starts server on configured port
- Initializes database on startup

### config/database.js
- Creates SQLite database connection using sqlite3
- Defines database schema (users, tasks tables)
- Creates indexes for performance
- Sets up triggers (auto-update updated_at)
- Exports db instance and initialization function

**Important**: Changed from better-sqlite3 to sqlite3. Uses callback-based API, not synchronous.

### config/jwt.js
- Exports JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN from env
- Helper functions for token generation and verification
- Used by auth middleware and auth routes

## Models

### models/User.js

**Operations:**
- `create(email, passwordHash)` - Insert new user
- `findByEmail(email)` - Get user by email
- `findById(id)` - Get user by ID
- `updatePassword(userId, newPasswordHash)` - Change password

**Schema:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### models/Task.js

**Operations:**
- `create(userId, taskData)` - Insert new task
- `findByUserId(userId, filters)` - Get all user tasks with optional filters
- `findById(taskId)` - Get specific task
- `update(taskId, userId, taskData)` - Update task (verifies ownership)
- `updateStatus(taskId, userId, status)` - Quick status update
- `delete(taskId, userId)` - Delete task (verifies ownership)
- `findOverdue(userId)` - Get overdue tasks
- `getStats(userId)` - Get task count by status

**Schema:**
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK (status IN ('pending', 'in-progress', 'completed')),
  CHECK (priority IN ('low', 'medium', 'high'))
)
```

**Indexes:**
- idx_tasks_user_id
- idx_tasks_status
- idx_tasks_priority
- idx_tasks_due_date

## Middleware

### middleware/auth.js

Protects routes requiring authentication.

**Usage:**
```javascript
const { authenticate } = require('./middleware/auth');

router.get('/protected', authenticate, (req, res) => {
  // req.user is populated with { userId, email }
});
```

**Flow:**
1. Extract token from Authorization header (Bearer <token>)
2. Verify token using JWT_SECRET
3. Attach decoded payload to req.user
4. Call next()
5. On failure, return 401 Unauthorized

### middleware/validation.js

Express-validator rules for request validation.

**Exports:**
- `registerValidation` - Email and password rules for registration
- `loginValidation` - Email and password rules for login
- `taskValidation` - Rules for task creation/update
- `statusUpdateValidation` - Rules for status-only updates
- `passwordChangeValidation` - Rules for password change

**Usage:**
```javascript
const { taskValidation } = require('./middleware/validation');

router.post('/tasks', authenticate, taskValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  // Process valid request
});
```

### middleware/errorHandler.js

Global error handling middleware (should be last middleware).

Catches all errors and formats response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Stack trace (dev only)"
}
```

## Routes

### routes/auth.js

**POST /api/auth/register**
- Validates email and password
- Checks email not already in use
- Hashes password with bcrypt
- Creates user
- Returns access and refresh tokens

**POST /api/auth/login**
- Validates credentials
- Compares password hash
- Returns access and refresh tokens

**POST /api/auth/refresh**
- Validates refresh token
- Returns new access token

**GET /api/auth/me** (protected)
- Returns current user profile

**PUT /api/auth/change-password** (protected)
- Validates current password
- Updates to new password hash

### routes/tasks.js

All endpoints are protected (require authentication).

**GET /api/tasks**
- Query params: ?status=pending&priority=high
- Returns filtered tasks for user

**GET /api/tasks/:id**
- Returns specific task if owned by user

**POST /api/tasks**
- Creates new task for user
- Validates: title (3-200 chars), description (<1000 chars), status, priority, due_date

**PUT /api/tasks/:id**
- Updates task if owned by user
- All fields optional

**PATCH /api/tasks/:id/status**
- Quick status-only update
- Validates status enum

**DELETE /api/tasks/:id**
- Deletes task if owned by user

**GET /api/tasks/overdue**
- Returns tasks with due_date < today and status != completed

**GET /api/tasks/stats/summary**
- Returns task counts: { total, pending, in-progress, completed }

## Utilities

### utils/hash.js

**Functions:**
- `hashPassword(password)` - Hash password with bcrypt (10 rounds)
- `comparePassword(password, hash)` - Verify password against hash

**Usage:**
```javascript
const { hashPassword, comparePassword } = require('./utils/hash');

// Registration
const hash = await hashPassword(plainPassword);

// Login
const isValid = await comparePassword(plainPassword, storedHash);
```

### utils/tokens.js

**Functions:**
- `generateAccessToken(payload)` - Create access token (7d default)
- `generateRefreshToken(payload)` - Create refresh token (30d default)
- `verifyToken(token)` - Decode and verify token

**Payload Format:**
```javascript
{
  userId: 1,
  email: "user@example.com"
}
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional success message",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error"
    }
  ]
}
```

## Database Operations

### Querying with sqlite3

**Pattern for callbacks:**
```javascript
db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
  if (err) return reject(err);
  resolve(row);
});

db.all("SELECT * FROM tasks WHERE user_id = ?", [userId], (err, rows) => {
  if (err) return reject(err);
  resolve(rows);
});

db.run("INSERT INTO tasks (...) VALUES (?, ?)", [val1, val2], function(err) {
  if (err) return reject(err);
  resolve(this.lastID); // Use this.lastID for inserted ID
});
```

**Always use parameterized queries** (never string concatenation) to prevent SQL injection.

## Environment Variables

Required in `.env`:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

## Security Considerations

### Authentication
- JWTs signed with secret from environment
- Refresh tokens separate from access tokens
- Tokens include minimal payload (user ID and email only)
- No sensitive data in tokens

### Password Security
- bcrypt with 10 salt rounds
- Never log or expose plain passwords
- Password strength validated on frontend and backend

### SQL Injection
- All queries use parameterized statements
- sqlite3 handles escaping automatically

### CORS
- Configured to accept requests from FRONTEND_URL only
- Credentials allowed for cookies (if used)

### Input Validation
- Express-validator on all endpoints
- Sanitize inputs (trim, lowercase email)
- Enum constraints in database

## Testing

### Run Test Script
```bash
node test-api.js
```

Tests all endpoints automatically:
1. Register user
2. Login
3. Create tasks
4. Get tasks with filters
5. Update task
6. Delete task
7. Get statistics

### Manual Testing with curl

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","confirmPassword":"Test123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test Task","priority":"high","status":"pending"}'
```

## Common Development Tasks

### Add New Endpoint
1. Define route in appropriate routes file
2. Add validation middleware if needed
3. Implement controller logic
4. Update model if database access needed
5. Test with curl or test script
6. Document in README.md

### Add New Database Field
1. Update schema in config/database.js
2. Delete database.sqlite (dev only)
3. Restart server (recreates database)
4. Update model functions
5. Update validation rules
6. Update API documentation

### Debug Issues
- Check server console for errors
- Enable verbose logging in development
- Use `console.log` for debugging (remove after)
- Check database state: `sqlite3 database.sqlite`
- Verify token validity with jwt.io

## Performance Considerations

### Database Indexes
- Indexes on user_id, status, priority, due_date
- Significantly speeds up filtered queries
- Minimal impact on write performance

### Connection Pooling
- sqlite3 uses single connection
- Consider connection limits for concurrent requests
- For scale, migrate to PostgreSQL with proper pooling

### Caching
- No caching currently implemented
- Consider Redis for session storage in production
- Cache task statistics if needed

## Error Handling Patterns

### In Models
```javascript
return new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});
```

### In Routes
```javascript
try {
  const result = await Model.operation();
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
}
```

### In Middleware
```javascript
if (!condition) {
  return res.status(400).json({
    success: false,
    message: 'Error description'
  });
}
next();
```

## Deployment Notes

### Production Checklist
- [ ] Set strong JWT_SECRET (32+ chars, random)
- [ ] Set NODE_ENV=production
- [ ] Configure proper FRONTEND_URL
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add Helmet.js for security headers
- [ ] Set up database backups
- [ ] Configure logging (Winston/Morgan)
- [ ] Use HTTPS
- [ ] Consider PostgreSQL over SQLite

### Database Migration
When switching to PostgreSQL:
- Replace sqlite3 with pg
- Update connection in config/database.js
- Adjust SQL syntax (AUTOINCREMENT → SERIAL)
- Test all queries thoroughly

## Troubleshooting

### Server Won't Start
- Check if port 5000 is available
- Verify .env file exists with required variables
- Check for syntax errors in recent changes
- Ensure all dependencies installed (`npm install`)

### Database Errors
- Ensure database.sqlite is not locked by another process
- Check file permissions
- Verify schema in config/database.js
- Try deleting and recreating database (dev only)

### Authentication Errors
- Verify JWT_SECRET is set
- Check token format in Authorization header
- Ensure token hasn't expired
- Verify user exists in database

### CORS Errors
- Check FRONTEND_URL matches exactly
- Ensure CORS middleware is before routes
- Verify credentials configuration

## Key Dependencies

- **express**: Web framework
- **sqlite3**: Database driver
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **nodemon**: Auto-restart in development

## Additional Resources

- Full API documentation: `README.md` in this directory
- Testing guide: `TESTING.md`
- Project overview: `../CLAUDE.md`
