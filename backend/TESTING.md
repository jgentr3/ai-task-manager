# API Testing Guide

This guide will help you test the Task Manager API endpoints.

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **npm** or **yarn** package manager

## Setup Instructions

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# OR production mode
npm start
```

You should see:
```
===========================================
🚀 Task Manager API Server
===========================================
📡 Server running on port: 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api
🏥 Health check: http://localhost:5000/api/health
💾 Database: SQLite (Initialized)
🔐 CORS enabled for: http://localhost:5173
===========================================
```

### 3. Run the Automated Test Script

In a **new terminal** (keep the server running):

```bash
cd backend
node test-api.js
```

## What the Test Script Does

The automated test script performs the following operations:

1. ✅ **Health Check** - Verifies server is running
2. ✅ **Register User** - Creates a new user account
3. ✅ **Login** - Authenticates with credentials
4. ✅ **Get Current User** - Retrieves user profile
5. ✅ **Create Task** - Creates a new task
6. ✅ **Get All Tasks** - Retrieves all user tasks
7. ✅ **Get Task by ID** - Retrieves specific task
8. ✅ **Update Task** - Updates task details
9. ✅ **Update Task Status** - Changes task status
10. ✅ **Get Task Statistics** - Retrieves task stats
11. ✅ **Delete Task** - Removes a task
12. ✅ **Filter Tasks** - Tests query parameters

## Manual Testing with cURL

If you prefer to test manually, here are the cURL commands:

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "confirmPassword": "TestPassword123!"
  }'
```

**Save the `accessToken` from the response!**

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### 4. Get Current User
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "My First Task",
    "description": "This is a test task",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-12-31"
  }'
```

**Save the task `id` from the response!**

### 6. Get All Tasks
```bash
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 7. Get Task by ID
```bash
curl http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 8. Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Updated Task Title",
    "status": "in-progress",
    "priority": "medium"
  }'
```

### 9. Update Task Status
```bash
curl -X PATCH http://localhost:5000/api/tasks/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "status": "completed"
  }'
```

### 10. Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 11. Filter Tasks by Status
```bash
curl "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 12. Filter Tasks by Priority
```bash
curl "http://localhost:5000/api/tasks?priority=high" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 13. Get Task Statistics
```bash
curl http://localhost:5000/api/tasks/stats/summary \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Import → Paste this base URL: `http://localhost:5000/api`

2. **Set Environment Variables:**
   - Create variable `baseUrl` = `http://localhost:5000/api`
   - Create variable `accessToken` (will be set after login)

3. **Test Endpoints:**
   - Use the same endpoints listed above
   - Set Authorization header: `Bearer {{accessToken}}`

## Testing with Thunder Client (VS Code)

1. **Install Thunder Client** extension in VS Code
2. **Create new request**
3. **Use the same endpoints** as listed above
4. **Set Authorization** to Bearer Token

## Expected Responses

### Successful Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Common Issues

### Issue: Server won't start
**Solution:** Check if port 5000 is already in use
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Issue: 401 Unauthorized
**Solution:** Check your access token is correct and not expired

### Issue: Database errors
**Solution:** Delete `database.sqlite` and restart server to recreate

### Issue: CORS errors
**Solution:** Ensure `FRONTEND_URL` in `.env` matches your frontend URL

## Database Location

The SQLite database is created at:
```
backend/database.sqlite
```

You can view it with:
- **DB Browser for SQLite** (https://sqlitebrowser.org/)
- **SQLite Viewer** VS Code extension
- Command line: `sqlite3 database.sqlite`

## Cleanup

To reset the database:
```bash
# Stop the server (Ctrl+C)
# Delete the database file
rm database.sqlite  # Mac/Linux
del database.sqlite  # Windows

# Restart the server - database will be recreated
npm run dev
```

## Next Steps

Once the API tests pass:
1. Start the frontend: `cd frontend && npm run dev`
2. Open browser: `http://localhost:5173`
3. Test the full application

## Troubleshooting

### Check Server Logs
Look at the terminal where the server is running for detailed error messages.

### Enable Debug Mode
Set in `.env`:
```
NODE_ENV=development
```

This will show detailed error messages and stack traces.

### Test Individual Endpoints
If a test fails, try testing that specific endpoint manually with cURL to see the exact error.

## Support

If you encounter issues:
1. Check the server is running
2. Verify `.env` file exists with correct values
3. Check database file was created
4. Look at server logs for errors
5. Try the automated test script: `node test-api.js`
