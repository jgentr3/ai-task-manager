# Task Manager

A modern, full-stack task management application built with React and Node.js. Create, organize, and track your tasks with an intuitive interface and powerful features.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Management
- 🔐 **Secure Authentication** - JWT-based authentication with access and refresh tokens
- 👤 **User Registration** - Create account with email and password
- 🔑 **Password Validation** - Strong password requirements with real-time strength indicator
- 🔄 **Auto-login** - Persistent sessions across page refreshes
- 🚪 **Logout** - Secure session termination

### Task Management
- ➕ **Create Tasks** - Add tasks with title, description, priority, status, and due date
- ✏️ **Edit Tasks** - Update any task field with a clean modal interface
- 🗑️ **Delete Tasks** - Remove tasks with confirmation dialog
- 📊 **Task Statistics** - Real-time dashboard showing task counts by status
- 🏷️ **Priority Levels** - Low, Medium, and High priority with color indicators
- 📅 **Due Dates** - Set and track task deadlines
- ⚠️ **Overdue Alerts** - Visual warnings for past-due tasks

### Organization
- 🔍 **Search** - Find tasks by title or description
- 🎯 **Filter by Status** - View pending, in-progress, or completed tasks
- 🎨 **Filter by Priority** - Focus on high, medium, or low priority tasks
- 🔄 **Quick Status Updates** - Change task status with one click
- 📈 **Multiple Filters** - Combine search and filters for precise results

### User Interface
- 🎨 **Modern Design** - Clean, professional interface with Tailwind CSS
- 📱 **Responsive Layout** - Works seamlessly on desktop, tablet, and mobile
- 🌈 **Color-coded Cards** - Visual priority indicators (red, yellow, green)
- ⚡ **Smooth Animations** - Polished transitions and hover effects
- 🎯 **Empty States** - Helpful messages when no tasks exist
- 🔄 **Loading States** - Skeleton loaders and spinners for better UX

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Next-generation frontend tooling
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SQLite** (better-sqlite3) - Embedded database
- **JWT** (jsonwebtoken) - Authentication tokens
- **bcryptjs** - Password hashing
- **Express Validator** - Request validation
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📸 Screenshots

<!-- Add screenshots here when available -->

### Login Page
```
[Screenshot placeholder - Login page with gradient background]
```

### Dashboard
```
[Screenshot placeholder - Dashboard with task cards and statistics]
```

### Task Creation
```
[Screenshot placeholder - Modal form for creating tasks]
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Quick Start (3 Steps)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-task-manager.git
   cd ai-task-manager
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the application**
   ```bash
   # Terminal 1: Start backend (from backend folder)
   npm run dev

   # Terminal 2: Start frontend (from frontend folder)
   npm run dev
   ```

4. **Open your browser**
   - Navigate to: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 💻 Installation

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# The server will start on port 5000 by default

# Start development server
npm run dev
```

**Expected Output:**
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

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 523 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## 🎮 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

**Frontend:**
```bash
cd frontend
npm run dev  # Hot module replacement enabled
```

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | Yes (Refresh Token) |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Tasks

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks` | Get all user tasks | Yes |
| GET | `/api/tasks/:id` | Get task by ID | Yes |
| POST | `/api/tasks` | Create new task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| PATCH | `/api/tasks/:id/status` | Update task status | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| GET | `/api/tasks/overdue` | Get overdue tasks | Yes |
| GET | `/api/tasks/stats/summary` | Get task statistics | Yes |

### Query Parameters

**GET /api/tasks**
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)

For complete API documentation, see [backend/README.md](backend/README.md)

## 📁 Project Structure

```
ai-task-manager/
├── backend/                    # Express API Server
│   ├── config/                # Configuration files
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx            # Main app
│   └── package.json
│
└── README.md                   # This file
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
node test-api.js
```

### Frontend Tests

See `frontend/TESTING.md` for comprehensive testing guide.

## 🔐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

### Frontend (.env)

```env
VITE_API_URL=/api
```

## 📚 Additional Documentation

- **Backend API**: [backend/README.md](backend/README.md)
- **Frontend Components**: [frontend/README.md](frontend/README.md)
- **API Testing**: [backend/TESTING.md](backend/TESTING.md)
- **Frontend Testing**: [frontend/TESTING.md](frontend/TESTING.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- Tailwind CSS team

---

**Built with ❤️ using React and Node.js**
