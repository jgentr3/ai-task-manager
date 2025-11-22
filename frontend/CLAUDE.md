# Frontend - AI Task Manager React App

## Overview

Modern React application built with Vite, featuring task management with authentication, filtering, and a responsive UI powered by Tailwind CSS.

## Directory Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── TaskCard.jsx        # Individual task display card
│   │   ├── TaskList.jsx        # Task grid container
│   │   ├── TaskForm.jsx        # Create/Edit modal form
│   │   └── TaskFilter.jsx      # Search and filter controls
│   │
│   ├── pages/                   # Page components (routes)
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page with password strength
│   │   └── Dashboard.jsx       # Main app dashboard
│   │
│   ├── context/                 # React Context providers
│   │   └── AuthContext.jsx     # Authentication state management
│   │
│   ├── services/                # API communication layer
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── authService.js      # Authentication API calls
│   │   └── taskService.js      # Task CRUD API calls
│   │
│   ├── App.jsx                  # Main app with router setup
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles and Tailwind
│
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration with proxy
├── tailwind.config.js          # Tailwind customization
├── postcss.config.js           # PostCSS configuration
└── package.json
```

## Tech Stack

- **React 18** - Hooks-based functional components
- **Vite** - Build tool with HMR (hot module replacement)
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **Context API** - Global auth state management

## Core Concepts

### Component Architecture

**Pages** (route-level components):
- Handle page-level state
- Fetch data on mount
- Compose smaller components
- Manage side effects

**Components** (reusable UI):
- Receive props
- Emit events via callbacks
- Minimal state (UI only)
- Reusable and composable

### State Management

**AuthContext (Global)**:
- User authentication state
- Login/logout functions
- Token management
- Auto-refresh logic

**Local State (Component)**:
- Form inputs
- UI states (modals, loading)
- Filtered/derived data
- Error messages

**No Redux** - Context + local state is sufficient for this app size.

## Key Files

### src/main.jsx

Entry point that:
- Imports React and ReactDOM
- Wraps App in StrictMode
- Mounts to #root element
- Imports global CSS

### src/App.jsx

Main application component:
- Sets up BrowserRouter
- Wraps Routes in AuthProvider
- Defines route structure:
  - `/login` → Login page
  - `/register` → Register page
  - `/dashboard` → Dashboard (protected)
  - `/` → Redirects to dashboard or login
- Implements ProtectedRoute wrapper

**ProtectedRoute Pattern:**
```javascript
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
```

### src/index.css

Global styles:
- Tailwind directives (@tailwind base/components/utilities)
- Custom component classes (.btn, .input, .card, .badge)
- Animation keyframes
- CSS variables (if any)

## Context & State

### AuthContext

**Location:** `src/context/AuthContext.jsx`

**Provided State:**
```javascript
{
  user: {
    id: 1,
    email: "user@example.com",
    created_at: "2024-01-15T10:30:00.000Z"
  } | null,
  loading: false,
  error: null
}
```

**Provided Methods:**
- `login(email, password)` - Authenticate and store tokens
- `register(email, password, confirmPassword)` - Create account
- `logout()` - Clear tokens and user state
- `updateUser(userData)` - Update user object
- `changePassword(current, new, confirm)` - Change password
- `isAuthenticated()` - Boolean check for logged-in state
- `getToken()` - Get current access token

**Usage:**
```javascript
import { useAuth } from '../context/AuthContext';

function Component() {
  const { user, login, logout, isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <div>Welcome {user.email}</div>;
  }
  return <LoginButton onClick={() => login(email, password)} />;
}
```

**Auto-Refresh Logic:**
- On mount, checks for existing token in localStorage
- If found, verifies with `/api/auth/me`
- On 401 error in api interceptor, auto-refreshes token
- If refresh fails, logs out user

## Pages

### pages/Login.jsx

**Route:** `/login`

**State:**
- email, password (form inputs)
- loading (submission state)
- error (error message)

**Features:**
- Email and password inputs
- Real-time validation (email format, password length)
- Loading spinner during submission
- Error message display
- Link to registration
- Auto-redirect if already authenticated
- Gradient background design

**Form Submit Flow:**
1. Prevent default
2. Validate inputs
3. Set loading true
4. Call authContext.login()
5. On success: navigate to /dashboard
6. On error: display error message
7. Set loading false

### pages/Register.jsx

**Route:** `/register`

**State:**
- email, password, confirmPassword
- loading
- error
- passwordStrength (object with checks)

**Features:**
- Password strength indicator (6 levels)
  - Very Weak (< 6 chars)
  - Weak (6-7 chars)
  - Fair (8-9 chars)
  - Good (10-11 chars, mixed)
  - Strong (12+ chars, all requirements)
  - Very Strong (15+ chars, all requirements)
- Password requirements checklist (✓/✗)
- Character counter for password fields
- Email validation
- Password match validation
- Link to login

**Password Strength Calculation:**
```javascript
{
  length: password.length >= 8,
  lowercase: /[a-z]/.test(password),
  uppercase: /[A-Z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*]/.test(password)
}
```

### pages/Dashboard.jsx

**Route:** `/dashboard` (protected)

**State:**
- tasks (all tasks array)
- filteredTasks (after search/filters)
- loading
- error
- showTaskForm (modal visibility)
- editingTask (task being edited or null)
- filters: { search, status, priority }
- stats: { total, pending, in-progress, completed }

**Features:**
- Sticky navbar (user email, logout)
- Statistics cards (5 cards: total, pending, in-progress, completed, overdue)
- Add Task button (opens modal)
- Search and filter controls
- Task grid with cards
- Edit/Delete operations
- Quick status change
- Loading skeletons
- Empty states
- Error alerts (dismissible)

**Data Flow:**
1. Mount → fetch tasks and stats
2. User filters → update filteredTasks
3. User creates/edits → open modal
4. Modal submit → API call → refresh tasks
5. User deletes → confirm → API call → refresh tasks
6. Status change → API call → refresh tasks

**Filtering Logic:**
```javascript
useEffect(() => {
  let filtered = tasks;

  // Search filter
  if (filters.search) {
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  // Status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter(task => task.status === filters.status);
  }

  // Priority filter
  if (filters.priority !== 'all') {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  setFilteredTasks(filtered);
}, [tasks, filters]);
```

## Components

### components/TaskCard.jsx

**Props:**
```javascript
{
  task: {
    id, title, description, status, priority, due_date,
    created_at, updated_at
  },
  onEdit: (task) => void,
  onDelete: (taskId) => void,
  onStatusChange: (taskId, newStatus) => void
}
```

**Features:**
- Color-coded left border by priority:
  - High: Red (border-l-4 border-red-500)
  - Medium: Yellow (border-l-4 border-yellow-500)
  - Low: Green (border-l-4 border-green-500)
- Status badge (color-coded)
- Priority badge
- Due date formatting:
  - "Today" if due today
  - "Tomorrow" if due tomorrow
  - "Overdue" (red) if past due
  - Formatted date otherwise
- Hover effect reveals action buttons
- Quick status change buttons (Pending, In Progress, Completed)
- Edit button (pencil icon)
- Delete button with confirmation modal

**Visual States:**
- Default: White bg, colored border, subtle shadow
- Hover: Elevated shadow, buttons appear
- Overdue: Warning icon, red text for date

### components/TaskList.jsx

**Props:**
```javascript
{
  tasks: Array,
  loading: Boolean,
  onEdit: (task) => void,
  onDelete: (taskId) => void,
  onStatusChange: (taskId, newStatus) => void
}
```

**Features:**
- Responsive grid:
  - Mobile: 1 column
  - Tablet (md): 2 columns
  - Desktop (lg): 3 columns
- Loading state: 6 skeleton cards
- Empty state: Centered message + icon
- Smooth fade-in animations

### components/TaskForm.jsx

**Props:**
```javascript
{
  isOpen: Boolean,
  onClose: () => void,
  onSubmit: (taskData) => void,
  initialData: Object | null,
  mode: "create" | "edit"
}
```

**Form Fields:**
- title (required, 3-200 chars)
- description (optional, max 1000 chars)
- status (dropdown: pending, in-progress, completed)
- priority (dropdown: low, medium, high)
- due_date (date picker, cannot be past)

**Features:**
- Modal overlay with backdrop blur
- Character counters (title, description)
- Real-time validation
- Error messages below fields
- Loading state during submission
- Auto-focus on title field
- Escape key to close
- Click outside to close
- Pre-filled values in edit mode

**Validation:**
```javascript
const validate = () => {
  const errors = {};

  if (!formData.title || formData.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (formData.title && formData.title.length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  }
  if (formData.description && formData.description.length > 1000) {
    errors.description = 'Description must not exceed 1000 characters';
  }
  if (mode === 'create' && formData.due_date) {
    if (new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0)) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }

  return errors;
};
```

### components/TaskFilter.jsx

**Props:**
```javascript
{
  filters: {
    search: string,
    status: "all" | "pending" | "in-progress" | "completed",
    priority: "all" | "low" | "medium" | "high"
  },
  onFilterChange: (filters) => void,
  onClearFilters: () => void
}
```

**Features:**
- Search input with clear button (X icon)
- Status dropdown (All, Pending, In Progress, Completed)
- Priority dropdown (All, Low, Medium, High)
- Active filter chips with individual remove buttons
- Clear all filters button (visible when filters active)
- Responsive layout (stacks on mobile)

**Filter Behavior:**
- All filters work together (AND logic)
- Search is case-insensitive
- Matches both title and description
- Updates trigger immediate re-filter (no submit button)

## Services

### services/api.js

**Axios instance with configuration:**

**Base Configuration:**
```javascript
{
  baseURL: '/api',  // Proxied to http://localhost:5000/api
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
}
```

**Request Interceptor:**
- Automatically adds Authorization header with access token
- Format: `Bearer <token>`
- Skipped for login/register endpoints

**Response Interceptor:**
- On 401 error: Attempts token refresh
- If refresh succeeds: Retries original request
- If refresh fails: Logs out user, redirects to login
- Returns response.data for successful requests
- Throws formatted error for failures

**Usage:**
```javascript
import api from './api';

// GET request
const response = await api.get('/tasks');

// POST request
const response = await api.post('/tasks', { title: 'New task' });

// With query params
const response = await api.get('/tasks', {
  params: { status: 'pending', priority: 'high' }
});
```

### services/authService.js

**Authentication API calls:**

**`login(email, password)`**
- POST /api/auth/login
- Stores accessToken and refreshToken in localStorage
- Returns: `{ success, data: { user, accessToken, refreshToken } }`

**`register(email, password, confirmPassword)`**
- POST /api/auth/register
- Stores tokens in localStorage
- Returns: `{ success, data: { user, accessToken, refreshToken } }`

**`logout()`**
- Clears tokens from localStorage
- Returns: `{ success: true }`

**`refreshToken(refreshToken)`**
- POST /api/auth/refresh
- Updates access token in localStorage
- Returns: `{ success, data: { accessToken } }`

**`getCurrentUser()`**
- GET /api/auth/me
- Returns: `{ success, data: { user } }`

**`changePassword(currentPassword, newPassword, confirmPassword)`**
- PUT /api/auth/change-password
- Returns: `{ success, message }`

**Token Management Helpers:**
```javascript
setToken(accessToken, refreshToken)
getToken() // Returns access token
getRefreshToken()
clearTokens()
isAuthenticated() // Check if token exists
getUser() // Get user from localStorage
setUser(user)
clearUser()
```

### services/taskService.js

**Task API calls:**

**`getAllTasks(filters = {})`**
- GET /api/tasks?status=X&priority=Y
- Returns: `{ success, data: { tasks, count } }`

**`getTaskById(taskId)`**
- GET /api/tasks/:id
- Returns: `{ success, data: { task } }`

**`createTask(taskData)`**
- POST /api/tasks
- Body: `{ title, description, status, priority, due_date }`
- Returns: `{ success, data: { task } }`

**`updateTask(taskId, taskData)`**
- PUT /api/tasks/:id
- Returns: `{ success, data: { task } }`

**`updateTaskStatus(taskId, status)`**
- PATCH /api/tasks/:id/status
- Body: `{ status }`
- Returns: `{ success, data: { task } }`

**`deleteTask(taskId)`**
- DELETE /api/tasks/:id
- Returns: `{ success, message }`

**`getOverdueTasks()`**
- GET /api/tasks/overdue
- Returns: `{ success, data: { tasks, count } }`

**`getTaskStats()`**
- GET /api/tasks/stats/summary
- Returns: `{ success, data: { stats } }`

## Styling

### Tailwind Configuration

**Custom Colors:**
- primary (blue scale for main actions)
- secondary (gray scale)
- success (green for completed)
- warning (yellow for in-progress)
- danger (red for high priority/delete)

**Custom Animations:**
- fade-in (0.3s ease-in)
- slide-up (0.3s ease-out)
- slide-down (0.3s ease-out)

**Responsive Breakpoints:**
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Custom Component Classes

Defined in `src/index.css`:

**Buttons:**
```css
.btn - base button styles
.btn-primary - blue background
.btn-secondary - gray background
.btn-danger - red background
.btn-sm - smaller padding
.btn-lg - larger padding
```

**Inputs:**
```css
.input - standard input with focus states
.input-error - red border for errors
```

**Cards:**
```css
.card - white bg, shadow, rounded
.card-hover - hover effect
```

**Badges:**
```css
.badge - small rounded label
.badge-pending - gray
.badge-in-progress - blue
.badge-completed - green
.badge-low - green priority
.badge-medium - yellow priority
.badge-high - red priority
```

## Routing

### Route Configuration

```javascript
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route path="/" element={<Navigate to="/dashboard" />} />
</Routes>
```

### Navigation

**Programmatic:**
```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
navigate('/login', { replace: true });
```

**Link Component:**
```javascript
import { Link } from 'react-router-dom';

<Link to="/register">Create account</Link>
```

## Error Handling

### API Error Pattern

```javascript
try {
  setLoading(true);
  setError(null);
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err) {
  const message = err.response?.data?.message || 'An error occurred';
  setError(message);
  console.error('API Error:', err);
} finally {
  setLoading(false);
}
```

### Form Validation Pattern

```javascript
const [errors, setErrors] = useState({});

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // Clear errors
  setErrors({});

  // Submit
  try {
    await submitForm();
  } catch (err) {
    setErrors({ submit: err.message });
  }
};
```

## Development Workflow

### Running the App

```bash
npm run dev
# Opens at http://localhost:5173
# Auto-reloads on file changes
```

### Building for Production

```bash
npm run build
# Output: dist/ folder
# Minified and optimized
```

### Vite Proxy Configuration

In `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true
    }
  }
}
```

This allows frontend to call `/api/tasks` which proxies to `http://localhost:5000/api/tasks`.

## Common Development Tasks

### Add New Component

1. Create file in `src/components/ComponentName.jsx`
2. Use functional component with hooks
3. Define props with JSDoc or PropTypes
4. Export default
5. Import and use in parent

Example:
```javascript
/**
 * Button component
 * @param {Object} props
 * @param {Function} props.onClick - Click handler
 * @param {string} props.children - Button text
 * @param {string} props.variant - Style variant (primary, secondary, danger)
 */
const Button = ({ onClick, children, variant = 'primary' }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
```

### Add New Page

1. Create file in `src/pages/PageName.jsx`
2. Add route in `App.jsx`
3. Add navigation link if needed
4. Protect route if authentication required

### Add New API Call

1. Add function in appropriate service file
2. Use api instance (not direct axios)
3. Handle errors consistently
4. Return consistent format

### Update Styling

1. Use Tailwind classes first
2. Add custom classes to `index.css` if reusable
3. Update `tailwind.config.js` for theme extensions
4. Avoid inline styles unless dynamic

## Performance Considerations

### React Optimization

**Use useCallback for functions:**
```javascript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

**Use useMemo for expensive calculations:**
```javascript
const filteredData = useMemo(() => {
  return data.filter(/* expensive filter */);
}, [data, filters]);
```

**Lazy load routes** (if needed):
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### Current Optimizations

- Vite provides code splitting automatically
- API calls debounced where appropriate
- Images optimized (use WebP when possible)
- Minimal dependencies

## Testing

### Manual Testing Checklist

1. Registration flow with validation
2. Login with correct/incorrect credentials
3. Token refresh on 401 error
4. Create task with all fields
5. Edit task and verify changes
6. Delete task with confirmation
7. Search tasks
8. Filter by status
9. Filter by priority
10. Quick status change
11. Logout and verify token cleared

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Responsive Testing

Test at:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)

## Troubleshooting

### White Screen

- Check browser console for errors
- Verify backend is running
- Check API proxy configuration
- Clear cache and reload

### API Calls Failing

- Check Network tab in DevTools
- Verify token in localStorage
- Check Authorization header
- Verify backend endpoint exists

### Styles Not Applying

- Restart dev server
- Check Tailwind config
- Verify class names are correct
- Check for typos in className

### Routes Not Working

- Verify BrowserRouter wraps app
- Check route paths match exactly
- Ensure Routes component wraps Route components

## Additional Resources

- Project overview: `../CLAUDE.md`
- Backend API docs: `../backend/CLAUDE.md`
- Vite docs: https://vitejs.dev
- React docs: https://react.dev
- Tailwind docs: https://tailwindcss.com
- React Router docs: https://reactrouter.com
