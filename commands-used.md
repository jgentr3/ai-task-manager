# Commands Used - Claude-flow Reference Guide

This document catalogs all the Claude-flow commands used in building the AI Task Manager, with explanations and tips for each.

## 🎯 Command Categories

1. [Setup & Initialization](#setup--initialization)
2. [Swarm Commands](#swarm-commands)
3. [Hive-Mind Commands](#hive-mind-commands)
4. [Memory Management](#memory-management)
5. [GitHub Integration](#github-integration)
6. [Monitoring & Status](#monitoring--status)

---

## Setup & Initialization

### Install Claude Code
```bash
npm install -g @anthropic-ai/claude-code
```
**What it does:** Installs the Claude Code CLI tool globally on your system

**When to use:** First-time setup only

---

### Authenticate
```bash
claude --dangerously-skip-permissions
```
**What it does:** Links Claude Code to your Claude Pro account

**When to use:** 
- First-time setup
- After clearing credentials
- When switching accounts

**Note:** The flag name sounds scary but it just skips extra permission confirmations - it's safe to use

---

### Initialize Claude-flow
```bash
npx claude-flow@alpha init --force
```
**What it does:** 
- Sets up memory systems
- Configures MCP servers
- Creates project structure
- Initializes agent coordination

**When to use:**
- At the start of every new project
- When you want to reset project configuration

**Flags:**
- `--force` - Overwrites existing configuration
- Without `--force` - Preserves existing settings

---

## Swarm Commands

Swarms are temporary groups of AI agents that coordinate to complete a specific task.

### Basic Swarm
```bash
npx claude-flow@alpha swarm "your task description here"
```

**Real examples from this project:**

#### 1. Create Project Structure
```bash
npx claude-flow@alpha swarm "create a professional folder structure for a full-stack task management application with separate frontend, backend, docs, and tests directories"
```
**Result:** AI agents create organized folders with proper naming conventions

---

#### 2. Backend Setup
```bash
npx claude-flow@alpha swarm "build an Express.js REST API with the following features:
- SQLite database with users and tasks tables
- JWT authentication middleware
- CRUD endpoints for tasks
- User registration and login
- Input validation
- Error handling"
```
**Result:** Complete backend with routes, models, middleware, and database schema

**Tip:** Break down complex requirements into bullet points for better results

---

#### 3. Database Schema
```bash
npx claude-flow@alpha swarm "design database schema for tasks with fields: title, description, status, priority, due date, user_id, created_at, updated_at"
```
**Result:** Properly designed SQLite migrations and model definitions

---

#### 4. Frontend Foundation
```bash
npx claude-flow@alpha swarm "create React application with:
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management
- Login and Register components
- Dashboard layout"
```
**Result:** Modern React app with all dependencies configured

---

#### 5. UI Components
```bash
npx claude-flow@alpha swarm "build these React components:
- TaskCard: displays individual task with edit/delete buttons
- TaskList: shows all tasks with filtering
- TaskForm: modal for creating/editing tasks
- Navbar: navigation with user menu
Make them responsive and use Tailwind CSS"
```
**Result:** Reusable, styled components ready to use

---

### Advanced Swarm Options

#### With Max Agents
```bash
npx claude-flow@alpha swarm "complex task" --max-agents 10
```
**What it does:** Limits the number of AI agents working on the task

**When to use:**
- Simple tasks: 5 agents
- Medium tasks: 10 agents  
- Complex tasks: 15+ agents

---

#### With Strategy
```bash
npx claude-flow@alpha swarm "build feature" --strategy development
```
**Strategies available:**
- `development` - Full SPARC methodology
- `quick` - Faster, less thorough
- `review` - Focus on code review

---

#### Parallel Execution
```bash
npx claude-flow@alpha swarm "multi-part task" --parallel
```
**What it does:** Agents work on different parts simultaneously

**When to use:** When tasks can be split into independent pieces

---

#### With Monitoring
```bash
npx claude-flow@alpha swarm "build API" --monitor
```
**What it does:** Shows real-time progress of agents

**When to use:** Long-running tasks where you want to see what's happening

---

## Hive-Mind Commands

Hive-Mind creates persistent development sessions with memory across tasks.

### Start a Hive-Mind Session
```bash
npx claude-flow@alpha hive-mind spawn "build complete user authentication system"
```
**What it does:** 
- Creates a persistent AI development team
- Maintains context across multiple tasks
- Queen agent coordinates worker agents

**Use case:** Multi-step projects where agents need to remember previous work

---

### Interactive Wizard
```bash
npx claude-flow@alpha hive-mind wizard
```
**What it does:** Guides you through creating a hive-mind with prompts

**When to use:** When you're not sure how to structure your request

---

### Check Status
```bash
npx claude-flow@alpha hive-mind status
```
**What it does:** Shows active sessions, agents, and progress

---

### Resume Session
```bash
npx claude-flow@alpha hive-mind resume session-xxxxx
```
**What it does:** Continues a previous hive-mind session

**Tip:** Get session ID from `hive-mind status` command

---

### List Sessions
```bash
npx claude-flow@alpha hive-mind sessions
```
**What it does:** Shows all hive-mind sessions (active and paused)

---

## Memory Management

Claude-flow maintains memory so agents remember context.

### View Memory Stats
```bash
npx claude-flow@alpha memory stats
```
**What it does:** Shows memory usage, namespaces, and stored items

---

### Store Information
```bash
npx claude-flow@alpha memory store "important context" --namespace project
```
**What it does:** Saves information for agents to reference later

**Namespaces:**
- `project` - Project-wide information
- `user` - User preferences
- `semantic` - For vector search
- Custom namespaces

---

### Query Memory
```bash
npx claude-flow@alpha memory query "authentication" --namespace project
```
**What it does:** Searches memory for relevant information

**Options:**
- `--recent` - Show recent items only
- `--limit 10` - Limit results
- `--namespace` - Search specific namespace

---

### List Namespaces
```bash
npx claude-flow@alpha memory list
```
**What it does:** Shows all memory namespaces in the project

---

### Clear Memory
```bash
npx claude-flow@alpha memory clear --namespace semantic
```
**What it does:** Removes memory from a namespace

**Warning:** This action cannot be undone!

---

## GitHub Integration

Claude-flow includes GitHub-specific skills and commands.

### Code Review
```bash
npx claude-flow@alpha github review PR-123
```
**What it does:** AI agents review a pull request for:
- Security issues
- Code quality
- Best practices
- Performance concerns

---

### Create Branch
```bash
npx claude-flow@alpha github branch feature/user-auth
```
**What it does:** Creates and checks out a new branch

---

### Repository Analysis
```bash
npx claude-flow@alpha github analyze
```
**What it does:** Analyzes repository structure, dependencies, and code patterns

---

## Monitoring & Status

### Check Version
```bash
npx claude-flow@alpha --version
claude --version
```
**What it does:** Shows installed versions

**Use case:** Troubleshooting or checking for updates

---

### Get Help
```bash
npx claude-flow@alpha --help
npx claude-flow@alpha swarm --help
```
**What it does:** Shows available commands and options

---

### Debug Mode
```bash
npx claude-flow@alpha swarm "task" --debug
```
**What it does:** Shows detailed logging for troubleshooting

---

## 💡 Pro Tips

### 1. Be Specific
❌ "Build authentication"
✅ "Build JWT-based authentication with registration, login, password hashing using bcrypt, and protected routes middleware"

### 2. Use Natural Language
You don't need to know technical terms. These work equally well:
- "make the buttons look nicer"
- "improve button styling with hover effects and rounded corners"

### 3. Iterate
If the first result isn't perfect:
```bash
npx claude-flow@alpha swarm "refine the TaskCard component to have better spacing and add a color indicator for task priority"
```

### 4. Ask for Explanations
```bash
npx claude-flow@alpha swarm "explain how the authentication middleware works"
```

### 5. Request Tests
```bash
npx claude-flow@alpha swarm "write unit tests for all API endpoints using Jest"
```

### 6. Combine Commands
```bash
# First create feature
npx claude-flow@alpha swarm "build user profile page"

# Then test it
npx claude-flow@alpha swarm "write integration tests for user profile functionality"

# Then review it
npx claude-flow@alpha swarm "review the user profile code for security issues"
```

---

## 📊 Command Patterns That Work Well

### For Full Features
```bash
npx claude-flow@alpha swarm "build [feature name] with:
- [requirement 1]
- [requirement 2]
- [requirement 3]
Following [pattern/framework] best practices"
```

### For Refactoring
```bash
npx claude-flow@alpha swarm "refactor [file/component] to:
- improve [aspect]
- follow [pattern]
- maintain current functionality"
```

### For Bug Fixes
```bash
npx claude-flow@alpha swarm "fix [issue description]:
- Expected behavior: [what should happen]
- Current behavior: [what's happening]
- Files involved: [list files]"
```

### For Documentation
```bash
npx claude-flow@alpha swarm "create documentation for [feature]:
- Include usage examples
- Explain API endpoints
- Add troubleshooting section"
```

---

## 🔄 Workflow Example: Adding a New Feature

Here's how to add a complete feature using Claude-flow:

```bash
# 1. Plan the feature
npx claude-flow@alpha swarm "create a technical specification for a task commenting feature where users can add comments to tasks"

# 2. Backend work
npx claude-flow@alpha swarm "implement the backend for task comments:
- Add comments table to database
- Create API endpoints for CRUD operations
- Add validation and error handling"

# 3. Frontend work
npx claude-flow@alpha swarm "build frontend components for task comments:
- CommentList component
- CommentForm component  
- Integrate with backend API"

# 4. Testing
npx claude-flow@alpha swarm "write tests for task comments feature covering backend and frontend"

# 5. Documentation
npx claude-flow@alpha swarm "document the task comments feature in the README with usage examples"
```

---

**Next:** Check out `lessons-learned.md` for insights on how to get the best results from Claude-flow!
