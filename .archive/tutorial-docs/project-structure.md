# AI Task Manager - Project Structure Template

This file documents the recommended folder structure for your project. Use this as a guide when setting up your repository.

## 📁 Complete Directory Structure

```
ai-task-manager/
│
├── .devcontainer/              # GitHub Codespaces configuration
│   └── devcontainer.json       # VS Code dev container settings
│
├── .github/                    # GitHub-specific files
│   ├── workflows/              # GitHub Actions (optional)
│   └── ISSUE_TEMPLATE/         # Issue templates
│
├── backend/                    # Backend API (AI-generated)
│   ├── config/                 # Configuration files
│   │   ├── database.js         # Database connection
│   │   └── jwt.js              # JWT configuration
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js             # Authentication middleware
│   │   ├── errorHandler.js    # Error handling
│   │   └── validation.js      # Request validation
│   │
│   ├── models/                 # Database models
│   │   ├── User.js             # User model
│   │   └── Task.js             # Task model
│   │
│   ├── routes/                 # API routes
│   │   ├── auth.js             # Authentication routes
│   │   └── tasks.js            # Task CRUD routes
│   │
│   ├── controllers/            # Route controllers
│   │   ├── authController.js  # Auth logic
│   │   └── taskController.js  # Task logic
│   │
│   ├── utils/                  # Utility functions
│   │   ├── hash.js             # Password hashing
│   │   └── tokens.js           # JWT helpers
│   │
│   ├── database/               # Database files
│   │   ├── migrations/         # Database migrations
│   │   ├── seeds/              # Seed data
│   │   └── dev.db              # SQLite database (dev)
│   │
│   ├── .env.example            # Environment variables template
│   ├── .env                    # Environment variables (gitignored)
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server entry point
│
├── frontend/                   # React frontend (AI-generated)
│   ├── public/                 # Static files
│   │   ├── index.html          # HTML template
│   │   └── favicon.ico         # Favicon
│   │
│   ├── src/                    # Source code
│   │   ├── components/         # React components
│   │   │   ├── common/         # Shared components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   │
│   │   │   ├── auth/           # Authentication components
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   │
│   │   │   └── tasks/          # Task components
│   │   │       ├── TaskCard.jsx
│   │   │       ├── TaskList.jsx
│   │   │       ├── TaskForm.jsx
│   │   │       └── TaskFilter.jsx
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Registration page
│   │   │   ├── Dashboard.jsx   # Main dashboard
│   │   │   └── NotFound.jsx    # 404 page
│   │   │
│   │   ├── context/            # React Context
│   │   │   ├── AuthContext.jsx # Authentication state
│   │   │   └── TaskContext.jsx # Task state
│   │   │
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useAuth.js      # Authentication hook
│   │   │   └── useTasks.js     # Tasks hook
│   │   │
│   │   ├── services/           # API services
│   │   │   ├── api.js          # Axios configuration
│   │   │   ├── authService.js  # Auth API calls
│   │   │   └── taskService.js  # Task API calls
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── validation.js   # Form validation
│   │   │   └── formatters.js   # Data formatting
│   │   │
│   │   ├── App.jsx             # Main App component
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles
│   │
│   ├── .env.example            # Frontend env template
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   ├── vite.config.js          # Vite configuration
│   └── index.html              # Vite HTML template
│
├── tests/                      # Test files (AI-generated)
│   ├── unit/                   # Unit tests
│   │   ├── backend/            # Backend unit tests
│   │   │   ├── models.test.js
│   │   │   └── utils.test.js
│   │   │
│   │   └── frontend/           # Frontend unit tests
│   │       └── components.test.jsx
│   │
│   ├── integration/            # Integration tests
│   │   └── api.test.js         # API endpoint tests
│   │
│   └── e2e/                    # End-to-end tests
│       └── user-flow.test.js   # Full user flows
│
├── docs/                       # Documentation
│   ├── setup-guide.md          # Setup instructions
│   ├── commands-used.md        # Claude-flow commands
│   ├── lessons-learned.md      # Tips and insights
│   ├── troubleshooting.md      # Common issues
│   ├── api-documentation.md    # API endpoints
│   └── component-library.md    # Frontend components
│
├── journey/                    # Development journal
│   ├── day-01.md               # Day 1 progress
│   ├── day-02.md               # Day 2 progress
│   ├── screenshots/            # Visual progress
│   │   ├── login-page.png
│   │   └── dashboard.png
│   │
│   └── iterations/             # Code evolution
│       ├── v1-basic-layout/
│       └── v2-styled-ui/
│
├── .hive-mind/                 # Claude-flow hive-mind data
│   ├── config.json             # Hive configuration
│   └── sessions/               # Session data (SQLite)
│
├── .swarm/                     # Claude-flow swarm data
│   └── memory.db               # Swarm memory (SQLite)
│
├── memory/                     # Agent memories
│   ├── architect/              # Architect agent memory
│   ├── coder/                  # Coder agent memory
│   └── tester/                 # Tester agent memory
│
├── coordination/               # Active workflows
│   └── current-task.json       # Current task state
│
├── .gitignore                  # Git ignore rules
├── .env.example                # Environment template
├── README.md                   # Project README
├── LICENSE                     # License file
└── package.json                # Root package.json (optional)
```

## 🎯 Key Directories Explained

### Backend (`/backend`)
Contains your Express.js API server, database models, and business logic.

**Created by:**
```bash
npx claude-flow@alpha swarm "create backend structure with Express, SQLite, and JWT authentication"
```

---

### Frontend (`/frontend`)
Contains your React application with Tailwind CSS styling.

**Created by:**
```bash
npx claude-flow@alpha swarm "create React frontend with Tailwind, routing, and component structure"
```

---

### Tests (`/tests`)
All automated tests for both backend and frontend.

**Created by:**
```bash
npx claude-flow@alpha swarm "set up testing infrastructure with Jest and React Testing Library"
```

---

### Docs (`/docs`)
Human-readable documentation for your project.

**You create these** to document your learning journey!

---

### Journey (`/journey`)
Your personal development journal and progress tracking.

**Example structure:**
```markdown
# Day 1 - Initial Setup

## What I built today
- Project structure
- Backend API with authentication
- Database models

## Commands used
1. npx claude-flow@alpha init --force
2. npx claude-flow@alpha swarm "create backend structure"

## What I learned
- How to structure a full-stack app
- JWT authentication basics

## Tomorrow's plan
- Build frontend login/register
- Connect to backend API
```

---

### Claude-flow Directories
These are created automatically by Claude-flow:
- `.hive-mind/` - Persistent session data
- `.swarm/` - Memory for swarm coordination
- `memory/` - Individual agent memories
- `coordination/` - Active workflow state

**Don't manually edit these** - Claude-flow manages them.

---

## 📝 .gitignore Template

Create a `.gitignore` file with:

```gitignore
# Dependencies
node_modules/
frontend/node_modules/
backend/node_modules/

# Environment variables
.env
.env.local
backend/.env
frontend/.env

# Database
backend/database/dev.db
*.db
*.sqlite

# Build outputs
frontend/dist/
frontend/build/
backend/dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Claude-flow (optional - keep these if you want to preserve memory)
# .hive-mind/
# .swarm/
# memory/
# coordination/

# Testing
coverage/
.nyc_output/
```

---

## 🚀 Creating This Structure

### Option 1: Let AI Create It
```bash
npx claude-flow@alpha swarm "create this exact folder structure with all directories and placeholder files"
```

### Option 2: Create Manually
```bash
# Backend
mkdir -p backend/{config,middleware,models,routes,controllers,utils,database/{migrations,seeds}}

# Frontend  
mkdir -p frontend/{public,src/{components/{common,auth,tasks},pages,context,hooks,services,utils}}

# Tests
mkdir -p tests/{unit/{backend,frontend},integration,e2e}

# Documentation
mkdir -p docs

# Journey
mkdir -p journey/screenshots journey/iterations
```

---

## 💡 Tips for Organization

1. **Keep it Clean** - Don't create folders until you need them
2. **Be Consistent** - Follow the naming conventions
3. **Document as You Go** - Update docs when structure changes
4. **Use .gitkeep** - For empty folders you want in git: `touch folder/.gitkeep`

---

## 🔄 Evolution of Structure

Your structure will grow over time:

**Phase 1: Initial Setup**
```
backend/
frontend/
docs/
README.md
```

**Phase 2: Adding Features**
```
+ backend/models/
+ backend/routes/
+ frontend/components/
+ tests/
```

**Phase 3: Refinement**
```
+ backend/middleware/
+ frontend/context/
+ journey/
+ docs/api-documentation.md
```

This is normal! Let the structure evolve with your project.

---

**Next:** See `setup-guide.md` for instructions on getting started!
