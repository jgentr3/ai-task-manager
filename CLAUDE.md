# AI Task Manager - Project Context

## Project Overview

A modern, full-stack task management application built with React and Node.js. Users can create, organize, and track tasks with authentication, filtering, and a responsive UI.

## Current Status

- **Branch**: completed
- **State**: Production-ready with recent bug fixes
- Recent commits:
  - Fix task management errors from F12
  - Fix login issue for 401 error
  - Back End bug fixes
  - Front End bug fixes
  - Changed better-sqlite3 to sqlite3

## Tech Stack

### Frontend
- **React 18** with Vite
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for auth state management

### Backend
- **Node.js** with Express
- **SQLite** (sqlite3) for database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for validation
- **CORS** for cross-origin requests

## Project Structure

```
ai-task-manager/
├── backend/              # Express API (see backend/CLAUDE.md)
│   ├── config/          # Database and JWT config
│   ├── middleware/      # Auth and validation
│   ├── models/          # User and Task models
│   ├── routes/          # API endpoints
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
│
├── frontend/             # React app (see frontend/CLAUDE.md)
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── context/     # AuthContext
│   │   ├── services/    # API services
│   │   └── App.jsx      # Main app with routes
│   └── vite.config.js
│
└── Documentation files (for tutorials, to be archived)
```

## Key Features

### Authentication
- User registration with password strength validation
- JWT-based login (access + refresh tokens)
- Persistent sessions with auto-refresh
- Protected routes

### Task Management
- CRUD operations (Create, Read, Update, Delete)
- Priority levels: Low, Medium, High
- Status tracking: Pending, In-Progress, Completed
- Due dates with overdue indicators
- Search by title/description
- Filter by status and priority

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Color-coded priority indicators
- Real-time statistics dashboard
- Modal forms for create/edit
- Loading skeletons
- Error handling with user-friendly messages

## Architecture

### Authentication Flow
1. User registers/logs in
2. Backend returns access token + refresh token
3. Frontend stores tokens in localStorage
4. Access token sent in Authorization header for all API calls
5. On 401 error, frontend auto-refreshes using refresh token
6. If refresh fails, redirects to login

### Data Flow
1. User interacts with UI (components)
2. Component calls service function (taskService/authService)
3. Service makes HTTP request via Axios instance
4. Axios interceptor adds auth token
5. Backend validates token, processes request
6. Response returns through interceptor
7. Component updates state and re-renders

### Database Schema

**Users Table:**
- id, email (unique), password_hash, created_at

**Tasks Table:**
- id, user_id (FK), title, description, status, priority, due_date, created_at, updated_at
- Constraints: status enum, priority enum
- Indexes: user_id, status, priority, due_date
- Trigger: auto-update updated_at timestamp

## Development Conventions

### Code Style
- Use functional components with hooks (no class components)
- Async/await for promises
- Try-catch for error handling
- Descriptive variable names
- Extract reusable logic

### API Patterns
- RESTful endpoints (/api/auth, /api/tasks)
- Consistent response format: `{ success, message?, data?, errors? }`
- HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found
- Query params for filtering (?status=pending&priority=high)

### State Management
- Context API for auth (global state)
- Local state (useState) for UI and forms
- Derive state when possible (filtered tasks)
- Minimize re-renders with useCallback

### Error Handling
- Always use try-catch with async operations
- Display user-friendly error messages
- Log technical errors to console in development
- Clear errors when user retries

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Frontend (.env)
```
VITE_API_URL=/api
```

## Running the Application

### Development Mode
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev  # Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Testing
- Backend: `cd backend && node test-api.js`
- Frontend: Manual testing guide in `frontend/TESTING.md`

## Important Notes

### Recent Changes
- **Database Migration**: Changed from better-sqlite3 to sqlite3
  - Update any database-related code to use sqlite3 API
  - Synchronous operations may need adjustment

### Known Issues/Considerations
- Tokens stored in localStorage (consider httpOnly cookies for production)
- No rate limiting (add express-rate-limit for production)
- SQLite is single-file (consider PostgreSQL for scale)

### Security
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens signed with secret
- CORS configured for specific frontend URL
- SQL injection protected via parameterized queries
- Input validation on all endpoints

## Working with This Project

### When Adding Features
1. Start with backend (model → route → test)
2. Then frontend (service → component → page)
3. Test integration end-to-end
4. Update relevant documentation

### When Debugging
1. Check browser console for frontend errors
2. Check terminal for backend errors
3. Verify tokens in localStorage
4. Check Network tab for API calls
5. Review database state if needed

### When Refactoring
- Maintain existing API contracts
- Update both frontend and backend together
- Test authentication flow after changes
- Verify all filters and search still work

## API Endpoints Summary

### Authentication
- POST /api/auth/register - Create account
- POST /api/auth/login - Get tokens
- POST /api/auth/refresh - Refresh access token
- GET /api/auth/me - Get current user
- PUT /api/auth/change-password - Update password

### Tasks
- GET /api/tasks - Get all user tasks (with filters)
- GET /api/tasks/:id - Get specific task
- POST /api/tasks - Create task
- PUT /api/tasks/:id - Update task
- PATCH /api/tasks/:id/status - Quick status update
- DELETE /api/tasks/:id - Delete task
- GET /api/tasks/overdue - Get overdue tasks
- GET /api/tasks/stats/summary - Get statistics

See `backend/README.md` for detailed API documentation.

## Documentation Structure

- **This file (CLAUDE.md)**: Project-level context
- **backend/CLAUDE.md**: Backend-specific details
- **frontend/CLAUDE.md**: Frontend-specific details
- **README.md**: User-facing documentation
- **backend/README.md**: API documentation
- **frontend/README.md**: Component documentation

## Tutorial Files (To Be Archived)

The following files are tutorial documentation that should be archived:
- 00-START-HERE-CLAUDE.md
- MASTER-INDEX-CLAUDE.md
- CLAUDE-CODE-COMMANDS.md
- CLAUDE-CODE-QUICKSTART.md
- LESSONS-LEARNED-CLAUDE.md
- project-structure.md
- PACKAGE-CONTENTS.md
- journey-template.md

These are valuable for learning but not needed for day-to-day development.
