# Quick Testing Reference

## 🚀 Quick Start Commands

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev
# Opens at: http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

## ✅ 5-Minute Quick Test

### 1️⃣ Registration (1 min)
- [ ] Go to http://localhost:5173
- [ ] Click "Create an account"
- [ ] Register: `test@example.com` / `TestPassword123!`
- [ ] Should redirect to dashboard

### 2️⃣ Create Task (1 min)
- [ ] Click "Add Task"
- [ ] Title: "Test Task"
- [ ] Priority: High
- [ ] Click "Create Task"
- [ ] Task should appear with red indicator

### 3️⃣ Filter & Search (1 min)
- [ ] Type "Test" in search box
- [ ] Task should filter
- [ ] Select "High" priority filter
- [ ] Should show only high-priority tasks

### 4️⃣ Edit Task (1 min)
- [ ] Hover over task, click edit
- [ ] Change status to "Completed"
- [ ] Click "Save Changes"
- [ ] Should show green completed badge

### 5️⃣ Delete & Logout (1 min)
- [ ] Click delete button
- [ ] Confirm deletion
- [ ] Task should disappear
- [ ] Click "Logout"
- [ ] Should redirect to login

**If all 5 steps work, your app is working! ✅**

## 🎯 Essential Tests Only (20 min)

### Authentication (5 min)
- [ ] Register new user
- [ ] Login with credentials
- [ ] Refresh page (should stay logged in)
- [ ] Logout (should redirect to login)

### CRUD Operations (10 min)
- [ ] Create task with all fields
- [ ] View task list
- [ ] Edit a task
- [ ] Delete a task
- [ ] Verify changes persist

### Filters (5 min)
- [ ] Search by title
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Clear all filters

## 🐛 Quick Troubleshooting

### Backend not connecting?
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

### White screen?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Styles not loading?
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

## 📊 Visual Checklist

```
┌─────────────────────────────────────┐
│  FRONTEND TESTING CHECKLIST         │
├─────────────────────────────────────┤
│                                     │
│  🔐 AUTHENTICATION                  │
│  ☐ Register                         │
│  ☐ Login                           │
│  ☐ Logout                          │
│  ☐ Auto-login on refresh           │
│                                     │
│  ➕ TASK CREATION                   │
│  ☐ Create basic task               │
│  ☐ Create with all fields          │
│  ☐ Validation errors show          │
│                                     │
│  ✏️ TASK EDITING                    │
│  ☐ Edit task details               │
│  ☐ Quick status change             │
│  ☐ Cancel edit                     │
│                                     │
│  🗑️ TASK DELETION                   │
│  ☐ Delete confirmation             │
│  ☐ Successful deletion             │
│                                     │
│  🔍 FILTERS & SEARCH                │
│  ☐ Search by title                 │
│  ☐ Filter by status                │
│  ☐ Filter by priority              │
│  ☐ Clear filters                   │
│                                     │
│  📱 RESPONSIVE                      │
│  ☐ Mobile view                     │
│  ☐ Tablet view                     │
│  ☐ Desktop view                    │
│                                     │
│  ✨ UX                              │
│  ☐ Loading states                  │
│  ☐ Error messages                  │
│  ☐ Animations smooth               │
│                                     │
└─────────────────────────────────────┘
```

## 🎨 Color Indicators to Check

- 🔴 **Red** = High priority tasks
- 🟡 **Yellow** = Medium priority tasks
- 🟢 **Green** = Low priority tasks
- 🔵 **Blue** = In-progress status
- ⚫ **Gray** = Pending status
- 🟢 **Green** = Completed status

## 📈 Success Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Page Load | < 3s | ☐ |
| Task Creation | < 1s | ☐ |
| Filter Response | Instant | ☐ |
| No Console Errors | 0 | ☐ |
| Responsive | All sizes | ☐ |
| Cross-browser | 4+ browsers | ☐ |

## 🔥 Most Common Issues

1. **Can't connect to backend**
   - Backend not running? `cd backend && npm run dev`

2. **Tasks not showing**
   - Check browser console
   - Verify token in localStorage

3. **Styles broken**
   - Restart: `npm run dev`
   - Check Tailwind config

4. **Routes not working**
   - Clear browser cache
   - Check React Router setup

5. **Form validation not working**
   - Check browser console
   - Verify form state

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build

# Troubleshooting
rm -rf node_modules  # Clean install
npm install          # Reinstall
npm run dev          # Restart

# Browser
Ctrl+Shift+I        # Open DevTools
Ctrl+Shift+Delete   # Clear cache
Ctrl+Shift+N        # Incognito mode
F5                  # Refresh
Ctrl+F5             # Hard refresh
```

## 📱 Test on Real Devices

### Desktop
- [ ] Chrome
- [ ] Firefox
- [ ] Safari (Mac)
- [ ] Edge

### Mobile
- [ ] iPhone Safari
- [ ] Android Chrome

### Tablet
- [ ] iPad Safari
- [ ] Android Chrome

## ⚡ Performance Checklist

- [ ] Initial load < 3 seconds
- [ ] No layout shift
- [ ] Smooth scrolling
- [ ] Instant filter updates
- [ ] No janky animations

---

**Pro Tip:** Keep this file open during testing for quick reference! 📋
