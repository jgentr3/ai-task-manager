# Setup Guide - Getting Started with Claude-flow

This guide will walk you through setting up your development environment and starting your first Claude-flow project.

## 📋 Pre-Flight Checklist

Before you begin, make sure you have:

- [ ] Claude Pro subscription (you'll need this to authenticate Claude Code)
- [ ] GitHub account
- [ ] Basic familiarity with using a terminal/command line
- [ ] About 30-60 minutes for initial setup

## 🎯 Choose Your Path

We offer two setup options. **GitHub Codespaces is recommended** for beginners as it provides a pre-configured cloud environment.

---

## Path 1: GitHub Codespaces (Recommended) ⭐

### Why Codespaces?
- Everything runs in the cloud (no local installation needed)
- Pre-configured environment
- Safe sandbox for experimentation
- Access from any computer with a browser

### Step-by-Step Setup

#### 1. Fork This Repository
1. Go to this repository on GitHub
2. Click the "Fork" button in the top right
3. This creates your own copy of the project

#### 2. Create a Codespace
1. In YOUR forked repository, click the green "Code" button
2. Click the "Codespaces" tab
3. Click "Create codespace on main"
4. Wait 2-3 minutes while your environment sets up

#### 3. Authenticate Claude Code
Once your Codespace opens, you'll see a VS Code interface in your browser.

Open the terminal (it should already be open at the bottom) and run:

```bash
npm install -g @anthropic-ai/claude-code
```

Then authenticate:

```bash
claude --dangerously-skip-permissions
```

**What happens next:**
1. A URL will appear in your terminal
2. Click the URL (or copy/paste it into a new browser tab)
3. You'll be redirected to authenticate with your Claude Pro account
4. Grant the necessary permissions
5. You'll see a success message

**Note for Safari users:** If the authentication fails on the first try, copy the URL and paste it into Safari manually.

#### 4. Initialize Claude-flow

```bash
npx claude-flow@alpha init --force
```

This sets up:
- Memory systems
- MCP (Model Context Protocol) servers
- Agent coordination tools
- Project structure

#### 5. Verify Installation

```bash
npx claude-flow@alpha --help
```

You should see a list of available commands. If you do, you're ready to go!

#### 6. Your First Swarm

Let's test everything with a simple task:

```bash
npx claude-flow@alpha swarm "create a hello world HTML page with CSS styling"
```

Watch as multiple AI agents coordinate to create your first file!

---

## Path 2: Local Development

### Prerequisites
1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
# Create a projects folder if you don't have one
mkdir ~/projects
cd ~/projects

# Clone your fork
git clone https://github.com/YOUR-USERNAME/ai-task-manager.git
cd ai-task-manager
```

#### 2. Install Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

#### 3. Authenticate Claude Code

```bash
claude --dangerously-skip-permissions
```

Follow the same authentication process as described in the Codespaces section above.

#### 4. Initialize Claude-flow

```bash
npx claude-flow@alpha init --force
```

#### 5. Verify Installation

```bash
npx claude-flow@alpha --help
claude --version
```

#### 6. Your First Swarm

```bash
npx claude-flow@alpha swarm "create a hello world HTML page with CSS styling"
```

---

## 🚀 Next Steps

Once you've completed setup, you're ready to start building!

### Understanding the Commands

**Basic pattern:**
```bash
npx claude-flow@alpha [command] "[natural language description]" [options]
```

**Key commands you'll use:**

1. **swarm** - Coordinate multiple agents for a task
   ```bash
   npx claude-flow@alpha swarm "your task description"
   ```

2. **hive-mind** - Start a persistent development session
   ```bash
   npx claude-flow@alpha hive-mind spawn "build a user authentication system"
   ```

3. **memory** - Manage project memory and context
   ```bash
   npx claude-flow@alpha memory stats
   npx claude-flow@alpha memory query "authentication"
   ```

4. **status** - Check on active agents and tasks
   ```bash
   npx claude-flow@alpha hive-mind status
   ```

### Project Kickoff

Now that you're set up, let's start building the Task Manager:

```bash
# Create the project structure
npx claude-flow@alpha swarm "create a professional folder structure for a full-stack task management application with frontend, backend, and tests folders"

# Initialize the backend
npx claude-flow@alpha swarm "set up Express.js backend with SQLite database, create models for users and tasks"

# Build the frontend foundation
npx claude-flow@alpha swarm "create React app with Tailwind CSS, set up routing and basic layout"
```

See `commands-used.md` for the complete list of commands used in this project.

---

## 🆘 Troubleshooting

### Authentication Issues

**Problem:** Authentication URL doesn't work
**Solution:** 
- Copy the URL manually and paste into your browser
- Try a different browser (Chrome or Firefox work best)
- Make sure you're logged into Claude Pro

**Problem:** "API key not found" error
**Solution:**
- Run `claude --dangerously-skip-permissions` again
- Check that you're logged into the correct Claude Pro account

### Installation Issues

**Problem:** `npm: command not found`
**Solution:** You need to install Node.js first (see prerequisites)

**Problem:** Permission errors when installing
**Solution:**
- On Mac/Linux: Don't use `sudo` with npm -g commands
- Follow npm's guide to fix permissions: https://docs.npmjs.com/resolving-eacces-permissions-errors

**Problem:** Claude-flow commands aren't working
**Solution:**
- Make sure you ran `npx claude-flow@alpha init --force`
- Check that you're in the correct project directory
- Try restarting your terminal

### Codespaces-Specific Issues

**Problem:** Codespace is slow or unresponsive
**Solution:**
- Codespaces has resource limits; stop the current session and create a new one
- Consider upgrading your Codespace machine type in settings

**Problem:** Lost my work when Codespace stopped
**Solution:**
- Codespaces auto-saves most work, but always commit important changes:
  ```bash
  git add .
  git commit -m "Describe what you built"
  git push
  ```

---

## 📝 Tips for Success

1. **Start Small** - Begin with simple commands before tackling complex features
2. **Read the Output** - Claude-flow agents explain what they're doing
3. **Iterate** - If the first result isn't perfect, refine your request
4. **Save Often** - Commit your code regularly with git
5. **Ask Questions** - Use natural language to ask agents to explain their code

---

## ✅ Setup Complete!

If you've made it this far, you're ready to build! Head over to `commands-used.md` to see example commands, or jump straight into building the Task Manager.

**Remember:** The beauty of Claude-flow is that you can describe what you want in plain English. Don't worry about getting the syntax perfect - the AI agents understand natural language!

Happy building! 🎉
