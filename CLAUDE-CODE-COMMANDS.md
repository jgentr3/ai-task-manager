# Claude Code Command Patterns

**Effective prompts and conversation patterns for building with Claude Code**

---

## 🎯 Core Principle

**Be conversational and specific.** Describe what you want as if talking to an experienced developer.

---

## 📋 Command Categories

1. [Project Setup](#project-setup)
2. [Feature Development](#feature-development)
3. [Debugging](#debugging)
4. [Code Review](#code-review)
5. [Refactoring](#refactoring)
6. [Testing](#testing)
7. [Documentation](#documentation)

---

## Project Setup

### Create Initial Structure

```
Create a professional folder structure for a full-stack task management application with:

Backend folder containing:
- models/ for database schemas
- routes/ for API endpoints  
- middleware/ for authentication and validation
- config/ for configuration
- utils/ for helper functions
- server.js as the entry point

Frontend folder containing:
- src/components/ for reusable React components
- src/pages/ for page-level components
- src/services/ for API integration
- src/context/ for state management
- public/ for static assets

Also create package.json files with appropriate dependencies for both.
```

### Initialize Database

```
Set up SQLite database with:

1. Connection configuration in config/database.js
2. User table with: id, email, password_hash, created_at
3. Tasks table with: id, user_id, title, description, status, priority, due_date, created_at, updated_at
4. Initialization function that creates tables if they don't exist
```

### Configure Development Environment

```
Create configuration files:
- .gitignore with common exclusions
- .env.example showing required environment variables
- README with setup instructions
- ESLint configuration for code quality
```

---

## Feature Development

### Backend Features

#### Authentication System

```
Implement JWT-based authentication:

1. User registration endpoint:
   - Validate email format and password strength
   - Hash password with bcrypt
   - Create user in database
   - Return JWT token

2. Login endpoint:
   - Verify email exists
   - Compare password with hash
   - Return JWT token

3. Authentication middleware:
   - Extract token from Authorization header
   - Verify token validity
   - Attach user info to request
   - Return 401 for invalid tokens

Include proper error handling and validation.
```

#### CRUD Operations

```
Create RESTful API for tasks:

GET /api/tasks
- Return all tasks for authenticated user
- Support query parameters: ?status=completed&priority=high
- Sort by created_at descending

POST /api/tasks
- Validate required fields (title)
- Set default status to 'pending'
- Associate with authenticated user
- Return created task

PUT /api/tasks/:id
- Verify task belongs to user
- Update only provided fields
- Return updated task

DELETE /api/tasks/:id
- Verify task belongs to user
- Delete task
- Return success message

Include validation and error handling for all.
```

### Frontend Features

#### Component Creation

```
Create a TaskCard component:

Props: task object, onEdit, onDelete

Display:
- Task title (large, bold)
- Description (truncated to 100 chars)
- Status badge with colored background
- Priority indicator (color-coded dot)
- Due date with formatting
- Edit button (pencil icon)
- Delete button (trash icon)

Styling:
- Card with shadow and hover effect
- Responsive layout
- Smooth transitions
- Tailwind CSS classes

Handle:
- Click edit calls onEdit(task)
- Click delete calls onDelete(task.id)
```

#### Form Handling

```
Create a TaskForm component for creating/editing tasks:

Features:
- Modal overlay
- Form fields: title (required), description, status dropdown, priority dropdown, due date picker
- Save button
- Cancel button
- Validation with error display
- Works in both create and edit modes

Behavior:
- If task prop provided, populate fields (edit mode)
- If no task prop, empty form (create mode)
- Validate before submit
- Show loading state while saving
- Close modal on success
- Show error message on failure

Use Tailwind for styling.
```

#### State Management

```
Create AuthContext for managing authentication state:

Context should provide:
- user object (email, id)
- isAuthenticated boolean
- login function (email, password)
- logout function
- register function (email, password)

Implementation:
- Store token in localStorage
- Check for existing token on mount
- Clear token on logout
- Provide context to entire app
- Include loading state while checking auth
```

### Multi-Component Features

```
Add task filtering feature across backend and frontend:

Backend:
- Update GET /api/tasks to accept status, priority, search query params
- Implement filtering logic in database query
- Return filtered results

Frontend:
- Create TaskFilter component with:
  * Status dropdown (all, pending, in-progress, completed)
  * Priority dropdown (all, low, medium, high)
  * Search input for title/description
  * Clear filters button
- Update TaskList to use filters
- Pass filter state to API call
- Show active filter count
```

---

## Debugging

### Error Investigation

```
I'm getting this error when trying to login:

[paste full error message with stack trace]

What's causing this and how do I fix it?
```

### API Issues

```
The frontend is making requests to the backend but getting 404 errors. 

Backend is running on port 5000.
Frontend is on port 3000.
I'm calling: axios.get('/api/tasks')

What's wrong?
```

### Authentication Problems

```
Users can register successfully but login fails with "Invalid credentials" even with correct password.

Here's my login route:
[paste relevant code]

And password comparison:
[paste relevant code]

Debug this for me.
```

### CORS Issues

```
Getting CORS error when frontend calls backend:

Error: Access to XMLHttpRequest blocked by CORS policy

Backend: http://localhost:5000
Frontend: http://localhost:3000

How do I fix this?
```

---

## Code Review

### Security Review

```
Review my authentication system for security vulnerabilities:

[describe or paste relevant code]

Check for:
- Password storage security
- Token security
- SQL injection risks
- XSS vulnerabilities
- CSRF protection
- Input validation

Suggest improvements.
```

### Performance Review

```
Review my task list component for performance issues:

[paste component code]

It's slow when showing 100+ tasks. How can I optimize it?
```

### Best Practices

```
Review my Express server setup:

[paste server.js]

Does it follow best practices? What should I improve for production?
```

---

## Refactoring

### Component Splitting

```
My Dashboard component is 300 lines and hard to maintain:

[paste component]

Break it into smaller, focused components. Suggest a good structure.
```

### Code Organization

```
My routes file is getting messy with all the logic inline:

[paste routes]

Refactor to use controller functions in a separate file.
```

### DRY Principle

```
I'm repeating this pattern in multiple components:

[paste repeated code]

Create a reusable solution.
```

---

## Testing

### Unit Tests

```
Create unit tests for the authentication middleware:

[paste middleware code]

Test cases:
- Valid token should authenticate user
- Invalid token should return 401
- Missing token should return 401
- Expired token should return 401

Use Jest.
```

### Integration Tests

```
Create integration tests for the tasks API:

Test scenarios:
- Create task with valid data
- Create task with missing required fields
- Get tasks returns only user's tasks
- Update task that doesn't belong to user fails
- Delete task that doesn't belong to user fails

Use Jest and supertest.
```

### Frontend Tests

```
Create tests for the LoginForm component:

Test:
- Renders all form fields
- Shows validation errors for invalid input
- Calls onSubmit with correct data
- Disables button while submitting
- Shows error message on failure

Use React Testing Library.
```

---

## Documentation

### API Documentation

```
Create API documentation for all endpoints:

Format:
- Endpoint and method
- Description
- Request parameters
- Request body (if applicable)
- Response format
- Possible error codes
- Example request/response

Make it clear and comprehensive.
```

### Component Documentation

```
Document the TaskCard component:

Include:
- Purpose and usage
- Props with types and descriptions
- Example usage
- Styling approach
- Dependencies
```

### Setup Instructions

```
Create comprehensive setup instructions for new developers:

Cover:
- Prerequisites (Node version, etc)
- Clone and setup
- Environment variables needed
- How to run backend
- How to run frontend
- How to run tests
- Common issues and solutions
```

---

## Advanced Patterns

### Progressive Feature Building

**Start Simple:**
```
Create a basic task list that shows task titles.
```

**Add Details:**
```
Update the task list to show descriptions, status, and priority.
```

**Add Interactions:**
```
Add edit and delete buttons to each task.
```

**Add Filtering:**
```
Add filters for status and priority above the task list.
```

**Add Search:**
```
Add a search bar that filters by title and description.
```

### Cross-Stack Features

```
Add a "notes" feature to tasks:

Requirements:
- Tasks can have multiple notes
- Notes have text content and timestamp
- Backend: new notes table and API endpoints
- Frontend: notes section in task detail view
- Frontend: add/edit/delete notes UI

Implement this feature across the entire stack.
```

### Architecture Changes

```
I want to switch from SQLite to PostgreSQL:

What needs to change?
Update all the necessary files.
Explain any differences I need to know about.
```

---

## Iteration Patterns

### Style Improvements

```
The login page works but looks bland. Make it modern and appealing:
- Gradient background
- Card with shadow
- Smooth animations
- Better spacing
- Professional feel
```

### Functionality Enhancement

```
The task form is working but could be better:
- Add real-time validation
- Show character count for description
- Add keyboard shortcuts (Enter to save, Esc to cancel)
- Improve date picker UX
- Add field descriptions/hints
```

### Error Handling

```
Add comprehensive error handling:

Backend:
- Catch all errors
- Return consistent error format
- Log errors appropriately
- Handle database errors gracefully

Frontend:
- Show user-friendly error messages
- Handle network failures
- Validate before sending requests
- Retry failed requests
```

---

## Pro Tips

### Tip 1: Be Specific About Style

❌ "Make it look better"  
✅ "Add a modern gradient background (blue to purple), increase card shadows, add smooth hover animations, and improve spacing between elements"

### Tip 2: Specify All Requirements

❌ "Add validation"  
✅ "Add validation that shows inline error messages: email must be valid format, password must be 8+ characters with at least one number, show errors on blur, clear errors on typing"

### Tip 3: Reference Existing Code

✅ "Update the TaskCard component we created earlier to include a favorite button"

### Tip 4: Ask for Options

✅ "What are 3 different ways I could implement real-time updates for tasks? Explain pros and cons of each."

### Tip 5: Request Explanations

✅ "Explain how this authentication flow works and why it's secure"

---

## Common Workflows

### Feature Development Workflow

1. **Plan**
   ```
   I want to add [feature]. What's the best approach?
   ```

2. **Backend First**
   ```
   Implement the backend API for [feature]
   ```

3. **Frontend**
   ```
   Create the UI components for [feature]
   ```

4. **Integration**
   ```
   Connect the frontend to the backend API
   ```

5. **Test**
   ```
   Create tests for [feature]
   ```

6. **Refine**
   ```
   [specific improvements needed]
   ```

### Bug Fix Workflow

1. **Report**
   ```
   [describe bug and paste error]
   ```

2. **Investigate**
   ```
   Why is this happening?
   ```

3. **Fix**
   ```
   Here's my attempted fix: [paste code]
   Is this correct? Any issues?
   ```

4. **Verify**
   ```
   How can I test that this is fixed?
   ```

---

## 🎯 Remember

- **Be conversational** - talk like you would to a colleague
- **Be specific** - details lead to better results
- **Iterate freely** - refine until it's right
- **Ask questions** - understand what's being built
- **Test incrementally** - verify each piece works

**Happy building!** 🚀
