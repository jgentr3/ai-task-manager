# Task Manager - Quick Start Guide

Get your Task Manager application up and running in minutes!

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
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

### Step 3: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Browser

Navigate to: **http://localhost:5173**

## ✅ Test the API (Optional)

While the backend is running, open a new terminal:

```bash
cd backend
node test-api.js
```

This will run automated tests on all API endpoints.

## 📁 Project Structure

```
ai-task-manager/
├── backend/                 # Express API Server
│   ├── config/             # Database & JWT config
│   ├── models/             # Data models (User, Task)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   ├── utils/              # Helper functions
│   ├── server.js           # Entry point
│   ├── test-api.js         # API test script
│   └── .env                # Environment variables
│
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # Auth context
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
│
└── docs/                  # Documentation
```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
# Optional - defaults to /api (uses Vite proxy)
VITE_API_URL=/api
```

## 🎯 Default Credentials

There are no default credentials. You'll need to:
1. Click "Create an account" on the login page
2. Register with your email and password
3. Start managing tasks!

## 📊 Features

✅ **Authentication**
- User registration
- Login/Logout
- JWT-based auth
- Protected routes

✅ **Task Management**
- Create, Read, Update, Delete tasks
- Set priority (low, medium, high)
- Set status (pending, in-progress, completed)
- Add due dates
- Filter and search tasks

✅ **Dashboard**
- Task statistics
- Responsive grid layout
- Real-time updates
- Beautiful UI

## 🛠️ Available Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server (auto-reload)
node test-api.js   # Run API tests
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update status only
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats/summary` - Get statistics

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=5001
```

### Database Issues
```bash
# Delete and recreate database
cd backend
rm database.sqlite  # Mac/Linux
del database.sqlite  # Windows
npm run dev         # Restart server
```

### CORS Errors
Ensure backend `.env` has:
```env
FRONTEND_URL=http://localhost:5173
```

## 📚 Additional Documentation

- **API Testing Guide:** `backend/TESTING.md`
- **Backend README:** `backend/package.json`
- **Frontend README:** `frontend/package.json`

## 🎨 Tech Stack

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- Express Validator

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios

## 📞 Need Help?

1. Check server logs in terminal
2. Run `node test-api.js` to test backend
3. Check browser console for frontend errors
4. Review `TESTING.md` for detailed testing guide

## 🎉 Success!

If you see the login page at `http://localhost:5173`, you're all set!

Create an account and start managing your tasks! 🚀
