# Task Manager - Frontend Documentation

Complete documentation for the Task Manager React frontend application.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [Components](#components)
- [Pages](#pages)
- [Services](#services)
- [Styling](#styling)
- [Available Scripts](#available-scripts)
- [Testing](#testing)

## Overview

Modern, responsive React application built with Vite for managing tasks. Features JWT-based authentication, real-time filtering, and a beautiful user interface powered by Tailwind CSS.

## Tech Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

### Installation

```bash
cd frontend
npm install
```

### Configuration

Create a `.env` file (optional - uses defaults):

```env
# Optional - defaults to /api (uses Vite proxy)
VITE_API_URL=/api
```

### Running the Application

```bash
# Development mode (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── TaskCard.jsx       # Individual task display
│   │   ├── TaskList.jsx       # Task grid container
│   │   ├── TaskForm.jsx       # Create/Edit modal
│   │   └── TaskFilter.jsx     # Search and filters
│   │
│   ├── pages/             # Page components
│   │   ├── Login.jsx          # Login page
│   │   ├── Register.jsx       # Registration page
│   │   └── Dashboard.jsx      # Main dashboard
│   │
│   ├── services/          # API service layer
│   │   ├── api.js             # Axios instance with interceptors
│   │   ├── authService.js     # Authentication API calls
│   │   └── taskService.js     # Task API calls
│   │
│   ├── context/           # React Context providers
│   │   └── AuthContext.jsx    # Authentication state
│   │
│   ├── App.jsx            # Main app with routes
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
│
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## State Management

### Authentication State (Context API)

The application uses React Context API for managing global authentication state.

**Location:** `src/context/AuthContext.jsx`

**Provided State:**
```javascript
{
  user: {
    id: 1,
    email: "user@example.com",
    created_at: "2024-01-15T10:30:00.000Z"
  },
  loading: false,
  error: null
}
```

**Provided Methods:**
- `login(email, password)` - Authenticate user
- `register(email, password, confirmPassword)` - Create account
- `logout()` - Clear session
- `updateUser(userData)` - Update user state
- `changePassword(currentPassword, newPassword, confirmPassword)` - Change password
- `isAuthenticated()` - Check if user is logged in
- `getToken()` - Get current access token

**Usage Example:**
```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    const result = await login('user@example.com', 'password');
    if (result.success) {
      // Handle success
    }
  };

  return isAuthenticated() ? (
    <div>Welcome, {user.email}</div>
  ) : (
    <button onClick={handleLogin}>Login</button>
  );
}
```

### Local Component State

Components use `useState` and `useCallback` hooks for local state management:

- Form inputs and validation
- UI states (modals, loading, errors)
- Filtered/searched data

## Components

### TaskCard

**Location:** `src/components/TaskCard.jsx`

**Description:** Displays an individual task with priority indicators, status badges, and action buttons.

**Props:**
```javascript
{
  task: {
    id: 1,
    title: "Task title",
    description: "Task description",
    status: "pending" | "in-progress" | "completed",
    priority: "low" | "medium" | "high",
    due_date: "2024-12-31",
    created_at: "2024-01-15T10:30:00.000Z",
    updated_at: "2024-01-15T10:30:00.000Z"
  },
  onEdit: (task) => void,           // Called when edit button clicked
  onDelete: (taskId) => void,        // Called when delete confirmed
  onStatusChange: (taskId, newStatus) => void  // Called when status changed
}
```

**Features:**
- Color-coded priority indicators (left border)
  - High: Red border
  - Medium: Yellow border
  - Low: Green border
- Status and priority badges
- Formatted due dates (Today, Tomorrow, specific dates, Overdue)
- Hover effects revealing edit/delete buttons
- Quick status change buttons
- Delete confirmation modal

**Visual States:**
- Default: White background with colored left border
- Hover: Shadow effect, buttons appear
- Overdue: Warning icon and red text for due date

---

### TaskList

**Location:** `src/components/TaskList.jsx`

**Description:** Container component that displays tasks in a responsive grid.

**Props:**
```javascript
{
  tasks: Array,                  // Array of task objects
  loading: Boolean,              // Show loading skeleton
  onEdit: (task) => void,
  onDelete: (taskId) => void,
  onStatusChange: (taskId, newStatus) => void
}
```

**Features:**
- Responsive grid layout
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Loading skeleton state (6 placeholders)
- Empty state with helpful message
- Smooth animations for task cards

---

### TaskForm

**Location:** `src/components/TaskForm.jsx`

**Description:** Modal form for creating and editing tasks.

**Props:**
```javascript
{
  isOpen: Boolean,                // Control modal visibility
  onClose: () => void,            // Called when modal should close
  onSubmit: (taskData) => void,   // Called with form data on submit
  initialData: Object | null,     // Pre-fill form for editing
  mode: "create" | "edit"         // Form mode
}
```

**Form Fields:**
- `title` (required): 3-200 characters
- `description` (optional): Max 1000 characters
- `status`: Dropdown (pending, in-progress, completed)
- `priority`: Dropdown (low, medium, high)
- `due_date`: Date picker (cannot be in the past)

**Features:**
- Real-time character counters
- Client-side validation
- Error messages with animations
- Loading state during submission
- Auto-focus on title field
- Escape key to close
- Click outside to close

**Validation Rules:**
```javascript
{
  title: {
    required: true,
    minLength: 3,
    maxLength: 200
  },
  description: {
    maxLength: 1000
  },
  due_date: {
    cannotBePast: true  // For new tasks
  }
}
```

---

### TaskFilter

**Location:** `src/components/TaskFilter.jsx`

**Description:** Search and filter controls for tasks.

**Props:**
```javascript
{
  filters: {
    search: "",
    status: "all" | "pending" | "in-progress" | "completed",
    priority: "all" | "low" | "medium" | "high"
  },
  onFilterChange: (filters) => void,  // Called when filters change
  onClearFilters: () => void          // Called when clear all clicked
}
```

**Features:**
- Search input with clear button
- Status dropdown filter
- Priority dropdown filter
- Active filter chips with individual remove buttons
- Clear all filters button
- Responsive layout (stacks on mobile)

**Filter Behavior:**
- All filters work together (AND logic)
- Search is case-insensitive
- Search matches both title and description
- Filters update immediately (no submit button)

---

## Pages

### Login

**Location:** `src/pages/Login.jsx`

**Route:** `/login`

**Description:** User authentication page.

**Features:**
- Email and password inputs
- Real-time validation
- Loading spinner during submission
- Error message display
- Link to registration page
- Auto-redirect if already logged in
- Gradient background design

**Form Validation:**
- Email: Valid format required
- Password: Min 8 characters

---

### Register

**Location:** `src/pages/Register.jsx`

**Route:** `/register`

**Description:** User registration page.

**Features:**
- Email, password, and confirm password inputs
- Password strength indicator (6 levels)
  - Very Weak (< 6 chars)
  - Weak (6-7 chars)
  - Fair (8-9 chars)
  - Good (10-11 chars, includes numbers/special)
  - Strong (12+ chars, mixed case, numbers, special)
  - Very Strong (15+ chars, all requirements)
- Real-time validation
- Password requirements list
- Character counters
- Link to login page
- Gradient background matching login

**Password Strength Calculation:**
```javascript
{
  length: true/false,           // >= 8 characters
  lowercase: true/false,        // Contains lowercase
  uppercase: true/false,        // Contains uppercase
  number: true/false,           // Contains number
  special: true/false           // Contains special char
}
```

---

### Dashboard

**Location:** `src/pages/Dashboard.jsx`

**Route:** `/dashboard`

**Description:** Main application page with task management.

**Features:**
- Sticky navigation bar
  - User email display
  - Logout button
- Statistics cards
  - Total tasks
  - Pending tasks
  - In-progress tasks
  - Completed tasks
  - Overdue tasks (warning style)
- Task filtering (search, status, priority)
- Task list with CRUD operations
- Add task button (floating on mobile)
- Results count display
- Error handling with dismissible alerts

**State Management:**
```javascript
{
  tasks: [],                    // All tasks
  filteredTasks: [],           // After filters applied
  loading: true/false,
  error: null,
  showTaskForm: false,
  editingTask: null,
  filters: {
    search: "",
    status: "all",
    priority: "all"
  }
}
```

**CRUD Operations:**
- **Create**: Opens modal → submits → refreshes list
- **Read**: Loads on mount → displays in grid
- **Update**: Opens modal with data → submits → refreshes list
- **Delete**: Confirms → deletes → refreshes list

---

## Services

### API Service

**Location:** `src/services/api.js`

**Description:** Axios instance with request/response interceptors.

**Features:**
- Base URL configuration (proxy to backend)
- Automatic Authorization header injection
- Automatic token refresh on 401 errors
- Request/response error handling

**Request Interceptor:**
```javascript
// Automatically adds access token to headers
headers.Authorization = `Bearer ${accessToken}`
```

**Response Interceptor:**
```javascript
// On 401 error:
1. Attempt token refresh
2. Retry original request with new token
3. If refresh fails, redirect to login
```

**Helper Methods:**
```javascript
api.get(url, config)
api.post(url, data, config)
api.put(url, data, config)
api.patch(url, data, config)
api.del(url, config)
```

---

### Auth Service

**Location:** `src/services/authService.js`

**Description:** Authentication-related API calls and token management.

**Methods:**

**`login(email, password)`**
- Returns: `{ success, data: { user, accessToken, refreshToken } }`
- Stores tokens in localStorage
- Throws error on failure

**`register(email, password, confirmPassword)`**
- Returns: `{ success, data: { user, accessToken, refreshToken } }`
- Stores tokens in localStorage
- Throws error on failure

**`logout()`**
- Clears all tokens from localStorage
- Returns: `{ success: true }`

**`refreshToken(refreshToken)`**
- Returns: `{ success, data: { accessToken } }`
- Updates access token in localStorage
- Throws error on failure

**`getCurrentUser()`**
- Returns: `{ success, data: { user } }`
- Requires valid access token
- Throws error on failure

**`changePassword(currentPassword, newPassword, confirmPassword)`**
- Returns: `{ success, message }`
- Requires valid access token
- Throws error on failure

**Token Management:**
```javascript
setToken(accessToken, refreshToken)    // Store tokens
getToken()                              // Get access token
getRefreshToken()                       // Get refresh token
clearTokens()                           // Remove all tokens
isAuthenticated()                       // Check if logged in
getUser()                               // Get user from localStorage
```

---

### Task Service

**Location:** `src/services/taskService.js`

**Description:** Task-related API calls.

**Methods:**

**`getAllTasks(filters = {})`**
- Parameters: `{ status?, priority? }`
- Returns: `{ success, data: { tasks, count } }`

**`getTaskById(taskId)`**
- Returns: `{ success, data: { task } }`

**`createTask(taskData)`**
- Parameters: `{ title, description?, status?, priority?, due_date? }`
- Returns: `{ success, data: { task } }`

**`updateTask(taskId, taskData)`**
- Parameters: Same as createTask
- Returns: `{ success, data: { task } }`

**`updateTaskStatus(taskId, status)`**
- Parameters: `status` (pending, in-progress, completed)
- Returns: `{ success, data: { task } }`

**`deleteTask(taskId)`**
- Returns: `{ success, message }`

**`getOverdueTasks()`**
- Returns: `{ success, data: { tasks, count } }`

**`getTaskStats()`**
- Returns: `{ success, data: { stats: { total, pending, in-progress, completed } } }`

---

## Styling

### Tailwind CSS

The application uses Tailwind CSS for all styling with custom configurations.

**Configuration:** `tailwind.config.js`

**Custom Theme Extensions:**

**Colors:**
```javascript
{
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... full scale
    900: '#1e3a8a'
  },
  secondary: { /* gray scale */ },
  success: { /* green scale */ },
  warning: { /* yellow scale */ },
  danger: { /* red scale */ }
}
```

**Animations:**
```javascript
{
  'fade-in': 'fadeIn 0.3s ease-in',
  'slide-up': 'slideUp 0.3s ease-out',
  'slide-down': 'slideDown 0.3s ease-out'
}
```

**Custom Shadows:**
```javascript
{
  'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
  'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1)'
}
```

### Global Styles

**Location:** `src/index.css`

**Custom Component Classes:**

**Buttons:**
```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
  @apply hover:shadow-md active:scale-95;
}

.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
```

**Inputs:**
```css
.input {
  @apply w-full px-4 py-2 border rounded-lg;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply transition-all outline-none;
}
```

**Cards:**
```css
.card {
  @apply bg-white rounded-lg shadow-md p-6;
  @apply hover:shadow-lg transition-shadow;
}
```

**Badges:**
```css
.badge {
  @apply inline-flex items-center px-2.5 py-0.5;
  @apply text-xs font-medium rounded-full;
}

.badge-pending {
  @apply bg-gray-100 text-gray-800;
}

.badge-in-progress {
  @apply bg-blue-100 text-blue-800;
}

.badge-completed {
  @apply bg-green-100 text-green-800;
}
```

### Responsive Design

**Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablets)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)
- `2xl`: 1536px (extra large)

**Grid Layout:**
```javascript
// Task grid
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

// Stats cards
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4

// Filters
flex flex-col md:flex-row gap-4
```

---

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement (HMR).
- Opens at: http://localhost:5173
- Auto-reloads on file changes
- Fast refresh for React components

### Build

```bash
npm run build
```
Creates optimized production build.
- Output: `dist/` directory
- Minifies JavaScript and CSS
- Optimizes assets
- Generates source maps

### Preview

```bash
npm run preview
```
Preview the production build locally.
- Opens at: http://localhost:4173
- Tests production build before deployment

### Lint

```bash
npm run lint
```
Run ESLint to check code quality.
- Checks for common errors
- Enforces code style
- Configured in `.eslintrc.js`

---

## Testing

### Manual Testing

Follow the comprehensive testing guide:
- **Quick Test (5 min):** See [QUICK-TEST.md](QUICK-TEST.md)
- **Full Test Suite (1 hour):** See [TESTING.md](TESTING.md)

### Test Checklist

**Essential Tests:**
1. User registration with validation
2. User login with error handling
3. Create task with all fields
4. Edit task and verify changes
5. Delete task with confirmation
6. Search tasks by title/description
7. Filter by status (pending, in-progress, completed)
8. Filter by priority (low, medium, high)
9. Quick status change buttons
10. Logout and session clearing

### Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Chrome (iOS/Android)
- Mobile Safari (iOS)

### Responsive Testing

Test at breakpoints:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)

---

## Development Guidelines

### Component Creation

1. **Use functional components** with hooks
2. **Extract reusable logic** into custom hooks
3. **Props validation** with PropTypes or TypeScript
4. **Memoization** for expensive calculations (useMemo, useCallback)
5. **Accessibility** - use semantic HTML and ARIA labels

### State Management Rules

1. **Local state** for UI and form data
2. **Context** for global auth state only
3. **Derive state** when possible (don't duplicate)
4. **Minimize re-renders** with proper memo/callback usage

### API Call Patterns

```javascript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.get('/endpoint');
    setData(response.data);
  } catch (err) {
    setError(err.response?.data?.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

1. **Always use try-catch** for async operations
2. **Display user-friendly messages** (not technical errors)
3. **Log errors to console** in development
4. **Clear errors** when user retries

---

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

For production, set:
```env
VITE_API_URL=https://your-api-domain.com/api
```

### Static Hosting

The built app can be deployed to:
- **Vercel** (recommended for Vite apps)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Any static hosting service**

### Deployment Checklist

- [ ] Set production API URL
- [ ] Test production build locally (`npm run preview`)
- [ ] Verify all environment variables
- [ ] Check browser console for errors
- [ ] Test on multiple devices
- [ ] Verify API connectivity
- [ ] Test authentication flow
- [ ] Enable HTTPS
- [ ] Configure caching headers

---

## Performance Optimization

### Current Optimizations

1. **Code Splitting** - Routes are lazy loaded
2. **Image Optimization** - Use WebP format when possible
3. **Bundle Size** - Vite automatically optimizes chunks
4. **Lazy Loading** - Components loaded on demand

### Future Improvements

1. **Virtual scrolling** for large task lists (react-window)
2. **Debounce search input** to reduce API calls
3. **Optimistic UI updates** for better perceived performance
4. **Service worker** for offline support (PWA)
5. **Image lazy loading** with intersection observer

---

## Troubleshooting

### Common Issues

**White screen on load:**
- Check browser console for errors
- Verify backend is running
- Check API URL configuration
- Clear browser cache

**Tasks not loading:**
- Verify access token in localStorage
- Check network tab for failed requests
- Ensure backend is running on correct port

**Styles not applying:**
- Restart dev server
- Check Tailwind configuration
- Verify PostCSS is configured

**Routes not working:**
- Verify React Router is installed
- Check route definitions in App.jsx
- Ensure BrowserRouter wraps app

---

## Additional Resources

- **Vite Documentation:** https://vitejs.dev
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **React Router:** https://reactrouter.com

## Support

For testing instructions: [TESTING.md](TESTING.md)

For quick testing: [QUICK-TEST.md](QUICK-TEST.md)

For backend API: [../backend/README.md](../backend/README.md)

For project overview: [../README.md](../README.md)

---

**Frontend Version:** 1.0.0
**Last Updated:** January 2024
