# Frontend Testing Guide

Complete guide to testing the Task Manager frontend application.

## 📦 Prerequisites

1. **Backend must be running** on `http://localhost:5000`
2. **Node.js** installed (v14 or higher)
3. **Modern browser** (Chrome, Firefox, Safari, Edge)

## 🚀 Setup & Run Commands

### Install Dependencies

```bash
cd frontend
npm install
```

**Expected output:**
```
added 234 packages in 15s
```

### Run Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Open your browser:** http://localhost:5173

### Build for Production

```bash
npm run build
```

**Expected output:**
```
vite v5.0.8 building for production...
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     12.34 kB │ gzip:  3.45 kB
dist/assets/index-def456.js     156.78 kB │ gzip: 52.34 kB
✓ built in 2.34s
```

### Preview Production Build

```bash
npm run preview
```

**Expected output:**
```
  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
```

## ✅ Comprehensive Testing Checklist

### 🔐 User Registration Flow

#### Test 1: Successful Registration
- [ ] Navigate to http://localhost:5173
- [ ] Click "Create an account" link
- [ ] Verify you're on the registration page
- [ ] Fill in email: `test@example.com`
- [ ] Fill in password: `TestPassword123!`
- [ ] Fill in confirm password: `TestPassword123!`
- [ ] Click "Create Account" button
- [ ] Verify loading spinner appears
- [ ] Verify you're redirected to `/dashboard`
- [ ] Verify you see "Welcome, test@example.com" in navbar
- [ ] Verify you see empty task list or welcome message

**Expected Result:** ✅ Successfully registered and logged in

#### Test 2: Password Strength Indicator
- [ ] Navigate to `/register`
- [ ] Start typing a password
- [ ] Verify password strength bar appears
- [ ] Type weak password (e.g., "abc")
- [ ] Verify strength shows "Weak" in red/orange
- [ ] Type strong password (e.g., "TestPassword123!")
- [ ] Verify strength shows "Strong" or "Very Strong" in green

**Expected Result:** ✅ Password strength updates in real-time

#### Test 3: Registration Validation Errors
- [ ] Navigate to `/register`
- [ ] Leave email empty, click "Create Account"
- [ ] Verify error: "Email is required"
- [ ] Enter invalid email: `notanemail`
- [ ] Verify error: "Please enter a valid email address"
- [ ] Enter weak password: `abc123`
- [ ] Verify password strength errors
- [ ] Enter mismatched passwords
- [ ] Verify error: "Passwords do not match"

**Expected Result:** ✅ All validation errors display correctly

#### Test 4: Duplicate Email
- [ ] Register with email: `duplicate@test.com`
- [ ] Logout
- [ ] Try to register again with same email
- [ ] Verify error: "User with this email already exists"

**Expected Result:** ✅ Duplicate email is rejected

---

### 🔑 Login Flow

#### Test 5: Successful Login
- [ ] Navigate to http://localhost:5173
- [ ] Verify you're on the login page
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `TestPassword123!`
- [ ] Click "Sign In" button
- [ ] Verify loading spinner appears
- [ ] Verify redirect to `/dashboard`
- [ ] Verify user email in navbar

**Expected Result:** ✅ Successfully logged in

#### Test 6: Login Validation
- [ ] Navigate to `/login`
- [ ] Leave fields empty, click "Sign In"
- [ ] Verify errors appear
- [ ] Enter invalid email format
- [ ] Verify email validation error
- [ ] Enter password less than 8 characters
- [ ] Verify password validation error

**Expected Result:** ✅ Validation errors display

#### Test 7: Invalid Credentials
- [ ] Navigate to `/login`
- [ ] Enter email: `wrong@example.com`
- [ ] Enter password: `WrongPassword123!`
- [ ] Click "Sign In"
- [ ] Verify error message: "Invalid email or password"

**Expected Result:** ✅ Invalid credentials rejected

#### Test 8: Auto-Login on Page Refresh
- [ ] Login successfully
- [ ] Refresh the page (F5)
- [ ] Verify you remain logged in
- [ ] Verify you're still on dashboard

**Expected Result:** ✅ Session persists across page refresh

---

### ➕ Task Creation

#### Test 9: Create Basic Task
- [ ] Login and navigate to dashboard
- [ ] Click "Add Task" button
- [ ] Verify modal opens
- [ ] Fill in title: "My First Task"
- [ ] Click "Create Task" button
- [ ] Verify modal closes
- [ ] Verify new task appears in the list
- [ ] Verify task has "Pending" status
- [ ] Verify task has "Medium" priority

**Expected Result:** ✅ Task created successfully

#### Test 10: Create Task with All Fields
- [ ] Click "Add Task"
- [ ] Fill in title: "Complete Project"
- [ ] Fill in description: "Finish the task manager app"
- [ ] Select status: "In Progress"
- [ ] Select priority: "High"
- [ ] Set due date: Tomorrow's date
- [ ] Click "Create Task"
- [ ] Verify task appears with all details
- [ ] Verify priority badge is red (high)
- [ ] Verify status badge is blue (in-progress)
- [ ] Verify due date shows "Tomorrow"

**Expected Result:** ✅ Task created with all fields

#### Test 11: Task Creation Validation
- [ ] Click "Add Task"
- [ ] Leave title empty
- [ ] Click "Create Task"
- [ ] Verify error: "Title is required"
- [ ] Enter title: "ab" (too short)
- [ ] Verify error: "Title must be at least 3 characters"
- [ ] Enter very long description (>1000 characters)
- [ ] Verify character counter and error

**Expected Result:** ✅ Validation works correctly

#### Test 12: Character Counters
- [ ] Click "Add Task"
- [ ] Type in title field
- [ ] Verify counter shows: "X/200 characters"
- [ ] Type in description field
- [ ] Verify counter shows: "X/1000 characters"

**Expected Result:** ✅ Character counters update in real-time

---

### ✏️ Task Editing

#### Test 13: Open Edit Modal
- [ ] Hover over a task card
- [ ] Verify edit and delete buttons appear
- [ ] Click edit button (pencil icon)
- [ ] Verify modal opens
- [ ] Verify modal title is "Edit Task"
- [ ] Verify all fields are pre-filled with task data

**Expected Result:** ✅ Edit modal opens with correct data

#### Test 14: Update Task Details
- [ ] Open edit modal for a task
- [ ] Change title to "Updated Task Title"
- [ ] Change description
- [ ] Change status to "Completed"
- [ ] Change priority to "Low"
- [ ] Click "Save Changes"
- [ ] Verify modal closes
- [ ] Verify task updates in the list
- [ ] Verify all changes are reflected

**Expected Result:** ✅ Task updates successfully

#### Test 15: Cancel Edit
- [ ] Open edit modal
- [ ] Make some changes
- [ ] Click "Cancel" button
- [ ] Verify modal closes
- [ ] Verify task remains unchanged

**Expected Result:** ✅ Cancel discards changes

#### Test 16: Quick Status Change
- [ ] Find a task with "Pending" status
- [ ] Click "Start Task" button at bottom of card
- [ ] Verify status changes to "In Progress"
- [ ] Verify status badge updates
- [ ] Click "Mark Complete" button
- [ ] Verify status changes to "Completed"
- [ ] Verify checkmark icon appears

**Expected Result:** ✅ Quick status change works

---

### 🗑️ Task Deletion

#### Test 17: Delete Confirmation Modal
- [ ] Hover over a task
- [ ] Click delete button (trash icon)
- [ ] Verify confirmation modal appears
- [ ] Verify modal shows task title
- [ ] Verify "Cancel" and "Delete" buttons

**Expected Result:** ✅ Confirmation modal displays

#### Test 18: Cancel Deletion
- [ ] Click delete button
- [ ] In confirmation modal, click "Cancel"
- [ ] Verify modal closes
- [ ] Verify task is NOT deleted

**Expected Result:** ✅ Cancel prevents deletion

#### Test 19: Confirm Deletion
- [ ] Click delete button
- [ ] In confirmation modal, click "Delete"
- [ ] Verify modal closes
- [ ] Verify task is removed from list
- [ ] Verify task count decreases

**Expected Result:** ✅ Task deleted successfully

---

### 🔍 Filtering and Search

#### Test 20: Search by Title
- [ ] Create tasks with different titles
- [ ] In search box, type part of a task title
- [ ] Verify only matching tasks appear
- [ ] Verify task count updates
- [ ] Clear search
- [ ] Verify all tasks reappear

**Expected Result:** ✅ Search filters tasks correctly

#### Test 21: Search by Description
- [ ] Create task with specific description
- [ ] Search for text from description
- [ ] Verify task appears in results
- [ ] Verify search is case-insensitive

**Expected Result:** ✅ Description search works

#### Test 22: Filter by Status
- [ ] Click status dropdown
- [ ] Select "Pending"
- [ ] Verify only pending tasks show
- [ ] Verify active filter chip appears
- [ ] Select "In Progress"
- [ ] Verify only in-progress tasks show
- [ ] Select "Completed"
- [ ] Verify only completed tasks show

**Expected Result:** ✅ Status filter works

#### Test 23: Filter by Priority
- [ ] Click priority dropdown
- [ ] Select "High"
- [ ] Verify only high-priority tasks show
- [ ] Select "Medium"
- [ ] Verify only medium-priority tasks show
- [ ] Select "Low"
- [ ] Verify only low-priority tasks show

**Expected Result:** ✅ Priority filter works

#### Test 24: Combined Filters
- [ ] Set search text
- [ ] Set status filter
- [ ] Set priority filter
- [ ] Verify all filters apply together
- [ ] Verify active filter chips show
- [ ] Click X on a filter chip
- [ ] Verify that filter is removed

**Expected Result:** ✅ Multiple filters work together

#### Test 25: Clear All Filters
- [ ] Apply multiple filters
- [ ] Click "Clear Filters" button
- [ ] Verify all filters reset
- [ ] Verify all tasks reappear
- [ ] Verify filter chips disappear

**Expected Result:** ✅ Clear filters works

#### Test 26: Results Count
- [ ] Apply various filters
- [ ] Verify results count shows: "Showing X of Y tasks"
- [ ] Verify count updates with each filter change

**Expected Result:** ✅ Results count is accurate

---

### 📊 Dashboard Features

#### Test 27: Statistics Cards
- [ ] Create tasks with different statuses
- [ ] Verify "Total" card shows correct count
- [ ] Verify "Pending" card shows pending count
- [ ] Verify "In Progress" card shows in-progress count
- [ ] Verify "Completed" card shows completed count
- [ ] Create overdue task
- [ ] Verify "Overdue" card shows overdue count

**Expected Result:** ✅ Statistics update correctly

#### Test 28: Task Card Display
- [ ] Verify high-priority tasks have red indicator
- [ ] Verify medium-priority tasks have yellow indicator
- [ ] Verify low-priority tasks have green indicator
- [ ] Verify status badges show correct colors
- [ ] Verify due dates display correctly
- [ ] Verify overdue tasks show warning (⚠️)

**Expected Result:** ✅ Visual indicators work

#### Test 29: Empty State
- [ ] Delete all tasks
- [ ] Verify empty state message appears
- [ ] Verify message: "No tasks found"
- [ ] Verify helpful description text
- [ ] Create a task
- [ ] Verify empty state disappears

**Expected Result:** ✅ Empty state displays correctly

#### Test 30: Responsive Design
- [ ] Resize browser window to mobile size
- [ ] Verify task grid shows 1 column
- [ ] Verify filters stack vertically
- [ ] Verify navbar adapts (email hidden, icon-only logout)
- [ ] Resize to tablet size
- [ ] Verify 2-column grid
- [ ] Resize to desktop
- [ ] Verify 3-column grid

**Expected Result:** ✅ Responsive design works

---

### 🚪 Logout Flow

#### Test 31: Logout from Dashboard
- [ ] Login to dashboard
- [ ] Click "Logout" button in navbar
- [ ] Verify redirect to `/login`
- [ ] Try to navigate to `/dashboard`
- [ ] Verify redirect back to `/login`

**Expected Result:** ✅ Logout clears session

#### Test 32: Token Persistence
- [ ] Logout
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Verify `accessToken` is removed
- [ ] Verify `refreshToken` is removed
- [ ] Verify `user` is removed

**Expected Result:** ✅ Tokens are cleared

---

### 🔄 Route Protection

#### Test 33: Protected Routes
- [ ] Logout (or use incognito mode)
- [ ] Try to access: http://localhost:5173/dashboard
- [ ] Verify redirect to `/login`
- [ ] Login
- [ ] Try to access: http://localhost:5173/login
- [ ] Verify redirect to `/dashboard`

**Expected Result:** ✅ Route protection works

---

### ⚡ Performance & UX

#### Test 34: Loading States
- [ ] During login, verify spinner appears
- [ ] During registration, verify spinner appears
- [ ] During task creation, verify button shows "Saving..."
- [ ] On initial dashboard load, verify skeleton loaders

**Expected Result:** ✅ Loading states display

#### Test 35: Error Handling
- [ ] Stop backend server
- [ ] Try to create a task
- [ ] Verify error message appears
- [ ] Try to login
- [ ] Verify error message appears
- [ ] Restart backend
- [ ] Verify operations work again

**Expected Result:** ✅ Errors are handled gracefully

#### Test 36: Animations
- [ ] Login/Register pages show fade-in animation
- [ ] Task cards have hover effects
- [ ] Modals slide up when opening
- [ ] Filter chips animate when appearing
- [ ] Buttons have hover effects

**Expected Result:** ✅ Animations are smooth

---

### 🎨 Visual Design

#### Test 37: Consistent Styling
- [ ] Verify color scheme is consistent
- [ ] Verify fonts are consistent (Inter)
- [ ] Verify spacing is consistent
- [ ] Verify shadows on cards
- [ ] Verify rounded corners

**Expected Result:** ✅ Design is consistent

#### Test 38: Accessibility
- [ ] Tab through all forms
- [ ] Verify focus states are visible
- [ ] Verify all buttons are keyboard accessible
- [ ] Verify form labels are present
- [ ] Verify error messages are announced

**Expected Result:** ✅ Accessibility features work

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch tasks"
**Solution:**
- Ensure backend is running on port 5000
- Check backend terminal for errors
- Verify CORS is configured correctly

### Issue: "Token expired" errors
**Solution:**
- Logout and login again
- Clear browser local storage
- Check JWT_EXPIRES_IN in backend .env

### Issue: Blank white screen
**Solution:**
- Check browser console for errors
- Verify all dependencies installed: `npm install`
- Clear browser cache
- Try incognito mode

### Issue: Styles not loading
**Solution:**
- Verify Tailwind CSS is configured
- Check postcss.config.js exists
- Restart dev server: `npm run dev`

### Issue: Routes not working
**Solution:**
- Check React Router is installed
- Verify BrowserRouter in main.jsx
- Check App.jsx route definitions

## 📋 Testing Summary Template

Use this template to track your testing progress:

```
Frontend Testing Session: [Date]
Tester: [Name]
Browser: [Chrome/Firefox/Safari/Edge]
Version: [Browser version]

✅ Passed Tests: __/38
❌ Failed Tests: __/38
⚠️  Issues Found: [List]

Notes:
-
-
-
```

## 🎯 Production Testing

Before deploying to production:

### Build Test
```bash
npm run build
npm run preview
```

### Test on Production Build
- [ ] Run all tests above on preview server
- [ ] Verify bundle size is acceptable
- [ ] Check for console errors
- [ ] Test on different browsers
- [ ] Test on mobile devices

### Performance Check
- [ ] Open DevTools → Network
- [ ] Verify initial load < 3 seconds
- [ ] Check bundle sizes are optimized
- [ ] Verify images are optimized

## 📱 Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## 🎉 Success Criteria

Your frontend is ready when:
- ✅ All 38 tests pass
- ✅ No console errors
- ✅ Responsive on all screen sizes
- ✅ Works on all major browsers
- ✅ Loading states display correctly
- ✅ Error handling works
- ✅ Authentication flow is secure
- ✅ All features work as expected

## 📞 Need Help?

1. Check browser console for errors
2. Check backend logs
3. Verify backend is running
4. Clear browser cache and local storage
5. Try incognito mode
6. Review TESTING.md

---

**Happy Testing! 🚀**
