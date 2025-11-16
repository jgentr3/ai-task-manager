# Quick Start: Building with Claude Code (No claude-flow Required)

**Build a full-stack Task Manager app using just Claude Code's native multi-agent capabilities.**

---

## 🎯 What You're Building

A complete Task Manager with:
- Backend API (Express.js + SQLite)
- Frontend (React + Tailwind CSS)
- Authentication (JWT)
- CRUD operations for tasks

**Time: 1-2 hours**

---

## ✅ Prerequisites

- [x] Claude Pro subscription
- [x] Claude Code installed: `npm install -g @anthropic-ai/claude-code`
- [x] Node.js v18+ installed
- [x] Git installed
- [x] GitHub repository created

---

## 🚀 Setup (5 minutes)

### 1. Create Your Project Directory

**Windows PowerShell:**
```powershell
cd ~\Documents
mkdir ai-task-manager
cd ai-task-manager
git init
```

**Mac/Linux/WSL:**
```bash
cd ~/Documents
mkdir ai-task-manager
cd ai-task-manager
git init
```

### 2. Launch Claude Code

```bash
claude
```

You'll see Claude's interface open in your terminal.

---

## 🏗️ Phase 1: Project Setup (10 minutes)

### Step 1: Create Project Structure

In Claude, type:

```
Create a professional folder structure for a full-stack task management application:

- backend/ folder with:
  - models/ for database schemas
  - routes/ for API endpoints
  - middleware/ for auth and validation
  - config/ for database and JWT setup
  - utils/ for helper functions
  - server.js as entry point

- frontend/ folder with:
  - src/components/ for React components
  - src/pages/ for page components
  - src/services/ for API calls
  - src/context/ for state management
  - public/ for static assets

- tests/ folder for test files
- docs/ folder for documentation

Create package.json files for both backend and frontend with appropriate dependencies.
```

**Claude will:**
- Create all folders
- Generate package.json with correct dependencies
- Set up basic configuration files

### Step 2: Review What Was Created

```
List all the files and folders you just created with a brief description of each.
```

---

## 💾 Phase 2: Backend Development (20 minutes)

### Step 3: Database Setup

```
In the backend folder, create:

1. Database configuration in config/database.js that:
   - Sets up SQLite connection
   - Creates tables on initialization
   - Exports the database instance

2. User model in models/User.js with fields:
   - id (primary key, auto-increment)
   - email (unique, required)
   - password_hash (required)
   - created_at (timestamp)

3. Task model in models/Task.js with fields:
   - id (primary key, auto-increment)
   - user_id (foreign key to users)
   - title (required)
   - description (optional)
   - status (enum: 'pending', 'in-progress', 'completed')
   - priority (enum: 'low', 'medium', 'high')
   - due_date (date, optional)
   - created_at (timestamp)
   - updated_at (timestamp)

Include initialization SQL statements.
```

### Step 4: Authentication System

```
Create JWT-based authentication:

1. In config/jwt.js:
   - JWT secret configuration
   - Token generation function
   - Token verification function

2. In middleware/auth.js:
   - Authentication middleware that:
     * Extracts token from Authorization header
     * Verifies token validity
     * Attaches user info to request
     * Returns 401 for invalid/missing tokens

3. In utils/hash.js:
   - Password hashing function using bcrypt
   - Password comparison function
```

### Step 5: API Endpoints

```
Create RESTful API routes:

1. In routes/auth.js:
   - POST /api/auth/register
     * Validate email and password
     * Hash password
     * Create user
     * Return JWT token
   
   - POST /api/auth/login
     * Validate credentials
     * Compare password hash
     * Return JWT token

2. In routes/tasks.js (all protected with auth middleware):
   - GET /api/tasks
     * Get all tasks for logged-in user
     * Support query params for filtering (status, priority)
   
   - POST /api/tasks
     * Create new task
     * Validate required fields
   
   - PUT /api/tasks/:id
     * Update existing task
     * Verify task belongs to user
   
   - DELETE /api/tasks/:id
     * Delete task
     * Verify task belongs to user

Include proper error handling and validation for all endpoints.
```

### Step 6: Express Server

```
Create backend/server.js that:
- Sets up Express app
- Configures CORS for frontend requests
- Parses JSON bodies
- Registers auth and task routes
- Initializes database on startup
- Includes error handling middleware
- Starts server on port 5000
```

---

## 🎨 Phase 3: Frontend Development (20 minutes)

### Step 7: React App Setup

```
In the frontend folder, set up a React application with Vite:

1. Create vite.config.js with:
   - React plugin
   - Proxy configuration to backend (localhost:5000)

2. Create tailwind.config.js with:
   - Content paths for src folder
   - Basic theme configuration

3. Create src/main.jsx:
   - React app entry point
   - Router setup

4. Create src/App.jsx:
   - Route definitions for Login, Register, Dashboard
   - Protected route wrapper
```

### Step 8: Authentication Service

```
Create src/services/authService.js with functions for:
- login(email, password) - calls /api/auth/login
- register(email, password) - calls /api/auth/register
- logout() - clears stored token
- getToken() - retrieves stored JWT
- isAuthenticated() - checks if user is logged in

Also create src/services/api.js with:
- Axios instance configured with:
  * Base URL pointing to backend
  * Automatic Authorization header from stored token
  * Response interceptor for handling 401 errors
```

### Step 9: Authentication Context

```
Create src/context/AuthContext.jsx:
- AuthProvider component that:
  * Manages authentication state (user, token)
  * Provides login function
  * Provides logout function
  * Provides register function
  * Checks authentication on mount
  * Wraps children with context

- useAuth() hook for consuming the context
```

### Step 10: Authentication UI

```
Create authentication components:

1. src/pages/Login.jsx:
   - Email and password input fields
   - Form validation (show errors)
   - Login button
   - Link to registration page
   - Redirect to dashboard on success
   - Clean, modern design with Tailwind CSS

2. src/pages/Register.jsx:
   - Email, password, and confirm password fields
   - Form validation
   - Register button
   - Link to login page
   - Redirect to dashboard on success
   - Matching design with Login

Use card layout, gradient backgrounds, and smooth transitions.
```

### Step 11: Task Management UI

```
Create task management components:

1. src/components/TaskCard.jsx:
   - Display task title, description, status, priority, due date
   - Edit button (opens modal)
   - Delete button (with confirmation)
   - Priority color indicator (red=high, yellow=medium, green=low)
   - Status badge
   - Responsive card design

2. src/components/TaskList.jsx:
   - Maps over tasks array
   - Renders TaskCard for each task
   - Shows "No tasks" message when empty
   - Grid layout that's responsive

3. src/components/TaskForm.jsx:
   - Modal component for create/edit
   - Form fields: title, description, status, priority, due date
   - Save button
   - Cancel button
   - Form validation
   - Works for both create and edit modes

4. src/components/TaskFilter.jsx:
   - Dropdown for status filter (all, pending, in-progress, completed)
   - Dropdown for priority filter (all, low, medium, high)
   - Search input for title/description
   - Clear filters button
```

### Step 12: Dashboard Page

```
Create src/pages/Dashboard.jsx:
- Navbar with:
  * App title
  * User email display
  * Logout button
  
- Main content area with:
  * "Add Task" button (opens TaskForm modal)
  * TaskFilter component
  * TaskList component
  * Loading state while fetching
  * Error handling display

- Fetch tasks on mount
- Refresh tasks after create/update/delete
- Clean, professional layout with Tailwind CSS
```

---

## 🧪 Phase 4: Testing & Integration (10 minutes)

### Step 13: Test the Backend

```
Help me test the backend API:

1. Create a simple test script that:
   - Registers a new user
   - Logs in with those credentials
   - Creates a task
   - Retrieves all tasks
   - Updates a task
   - Deletes a task

2. Show me how to run the backend server and test these endpoints.
```

### Step 14: Test the Frontend

```
Help me test the frontend:

1. Show me the commands to:
   - Install dependencies
   - Run the development server
   - Build for production

2. Create a testing checklist covering:
   - User registration flow
   - Login flow
   - Task creation
   - Task editing
   - Task deletion
   - Filtering and search
   - Logout
```

---

## 📝 Phase 5: Documentation (10 minutes)

### Step 15: Generate Documentation

```
Create comprehensive documentation:

1. README.md in the root with:
   - Project overview
   - Features list
   - Tech stack
   - Installation instructions
   - How to run the app
   - API endpoint documentation
   - Screenshots section (placeholder)

2. backend/README.md with:
   - API documentation for each endpoint
   - Request/response examples
   - Database schema
   - Environment variables needed

3. frontend/README.md with:
   - Component documentation
   - State management explanation
   - Available scripts
   - Styling approach
```

---

## 🎯 Pro Tips for Working with Claude Code

### Multi-File Operations

Claude Code can work on multiple files at once. For example:

```
Update both the backend Task model and frontend TaskCard component to add a 'category' field. Make sure they're consistent.
```

Claude will modify both files in a coordinated way.

### Iterative Refinement

If something isn't quite right:

```
The login form validation isn't working properly. It should:
- Show error message for invalid email format
- Show error if password is less than 8 characters
- Clear errors when user starts typing
- Disable submit button while submitting

Please fix these issues.
```

### Asking for Explanations

```
Explain how the JWT authentication flow works in this application, from login to making authenticated requests.
```

### Code Review

```
Review the authentication middleware for security issues and suggest improvements.
```

### Incremental Features

```
Add a feature to mark tasks as favorites. This should:
- Add a 'favorite' boolean field to the database
- Update the API to support toggling favorites
- Add a star icon to TaskCard
- Add a filter to show only favorites
```

---

## 🔄 Working in Sessions

Claude Code maintains context throughout your session. You can:

### Save Your Progress

```
/checkpoint save "completed backend authentication"
```

### Review What You've Built

```
Summarize everything we've built so far and what's left to complete.
```

### Plan Next Steps

```
What features should we add next to make this a production-ready application?
```

---

## 🚀 Going Further

### Additional Features to Add

Once your basic app works, try:

```
Add these features:
1. Email verification on registration
2. Password reset via email
3. Task categories/tags
4. Task attachments
5. Collaborative tasks (share with other users)
6. Dark mode toggle
7. Export tasks to CSV
8. Calendar view of tasks
9. Task notifications/reminders
10. Activity log/history
```

### Deployment

```
Help me deploy this application:
1. What do I need to configure for production?
2. Show me how to deploy to [Vercel/Netlify/Heroku]
3. What environment variables do I need?
4. How do I handle database in production?
```

---

## 💡 Key Advantages of Claude Code

### 1. **Natural Conversation**
Just describe what you want in plain English. No special syntax needed.

### 2. **Context Awareness**
Claude remembers what you've built and maintains consistency across files.

### 3. **Explanations**
Ask Claude to explain any code it generates.

### 4. **Debugging**
Share error messages and Claude will help fix them.

### 5. **Best Practices**
Claude applies modern best practices automatically.

### 6. **Iteration**
Refine features until they're exactly what you want.

---

## 📋 Common Patterns

### Pattern 1: Build → Test → Refine

```
1. "Create a user profile page with edit functionality"
2. [Test it out]
3. "The save button isn't working properly. Fix the API call."
4. [Test again]
5. "Add form validation before saving"
```

### Pattern 2: Feature Expansion

```
1. "Add basic task filtering"
2. [Works!]
3. "Add search functionality to the filters"
4. [Works!]
5. "Add sorting options (by date, priority, title)"
```

### Pattern 3: Cross-Stack Updates

```
"Add a 'notes' field to tasks that allows rich text. Update both the backend model and frontend components."
```

---

## 🎓 Learning Outcomes

By completing this tutorial, you'll have:

✅ Built a full-stack application  
✅ Learned how to work with AI for development  
✅ Created production-ready code  
✅ Understood modern web architecture  
✅ Gained experience with React, Express, SQLite, JWT  
✅ Practiced iterative development  

---

## 🆘 Troubleshooting

### "Claude isn't creating files"

Make sure you're in your project directory:
```bash
pwd  # Check current directory
cd ~/Documents/ai-task-manager  # Navigate if needed
```

### "Backend won't start"

```
Help me debug why the backend server won't start. Here's the error: [paste error]
```

### "Frontend API calls failing"

```
The frontend is getting CORS errors when calling the backend. Here's the error: [paste error]
```

### "Authentication not working"

```
Users can register but login fails. Here are the relevant files: [describe what's happening]
```

---

## 📞 Getting Help

When stuck, ask Claude:

```
I'm getting this error: [paste error]

What's causing it and how do I fix it?
```

Or:

```
Review my authentication flow and explain why tokens aren't being saved properly.
```

---

## 🎉 You're Ready!

**Start with Phase 1 and work through each phase sequentially.**

Remember:
- Be specific in your requests
- Test after each phase
- Ask questions when unsure
- Iterate until features work perfectly
- Document your progress

**Open Claude Code and let's build!**

```bash
cd ~/Documents/ai-task-manager
claude
```

Then start with: *"Create a professional folder structure for a full-stack task management application..."*

---

## 📚 Additional Resources

- Your progress journal: Create a `JOURNEY.md` file to track what you build
- Screenshots: Take screenshots as you build for your portfolio
- Git commits: Commit after each phase completes
- README updates: Keep documenting as you add features

**Happy building!** 🚀
