# RiskGuard - Insurance Risk Assessment Platform

A modern insurance risk assessment and underwriting system.  built with **React 18 + Vite**, featuring authentication, multi-role dashboards, and a professional UI with blue gradient design.



---


## 🎯 Project Overview

**RiskGuard** is an insurance platform designed to:
- Allow **Customers** to purchase insurance and track policies
- Enable **Underwriters** to review applications and assess risk
- Provide **Admins** with system management and analytics tools



**Key Highlights:**
- ✅ Fully functional routing with React Router v6
- ✅ Authentication system with Context API (localStorage persistence)
- ✅ Global CSS utility classes (no inline styles)
- ✅ Beginner-friendly JavaScript code (interview-ready)
- ✅ Responsive design with Tailwind CSS
- ✅ 4 dummy JSON data files for development


---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.0 |
| **Routing** | React Router | 6.20.0 |
| **Styling** | Tailwind CSS + Custom CSS | 3.3.0 |
| **Language** | JavaScript (ES6+) 
| **Package Manager** | npm | Latest |

---


### Authentication
- **Context API** stores user info and login state
- **localStorage** persists auth across page refreshes
- **Role-based routing** - redirect unauthorized users to login
- **Logout** clears user data and redirects to home

### Design System
- **Color Palette:**
  - Primary Blue: `#0066cc`
  - Dark Navy: `#004499`
  - Light Gray: `#f0f4f8`
  - Success: `#10b981`, Warning: `#f59e0b`, Danger: `#ef4444`
- **Global CSS Classes** for consistent styling (150+ utilities)
- **Responsive Grid System** (`.grid`, `.grid-2`, `.grid-3`, `.grid-4`)
- **Utility Classes** for spacing, text, alignment, buttons, cards

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ installed
- **npm** package manager
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-org/RiskGuard.git
cd RiskGuard/frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Start Development Server
```bash
npm run dev
```

The app will automatically open at **http://localhost:5173**




## 🌿 Git Workflow

### Branch Naming Convention
Follow this format for branches:

```
feature/feature-name       # New features
bugfix/bug-name            # Bug fixes
hotfix/issue-name          # Critical fixes
refactor/component-name    # Code refactoring
docs/documentation         # Documentation updates
```

**Examples:**
```bash
git checkout -b feature/user-dashboard
git checkout -b bugfix/form-validation
git checkout -b refactor/header-component
```

### Daily Workflow

#### 1. Pull Latest Changes
```bash
git pull origin main
```

#### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 3. Make Changes & Commit
```bash
# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add customer dashboard stats"
# OR
git commit -m "fix: correct form validation error"
# OR
git commit -m "refactor: simplify header component"
```

**Commit Message Prefixes:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - CSS/styling changes
- `docs:` - Documentation
- `test:` - Tests

#### 4. Push to Remote
```bash
git push origin feature/your-feature-name
```

#### 5. Create Pull Request
- Go to GitHub repository
- Click "New Pull Request"
- Select your branch
- Add title and description
- Request reviewers
- Wait for approval

#### 6. Merge to Main
Once approved:
```bash
git checkout main
git pull origin main
git merge feature/your-feature-name
git push origin main
```

#### 7. Clean Up
```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## 📚 Team Instructions

### For New Team Members

#### First Time Setup (One-time)
1. Clone the repository (see [Installation](#installation))
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Verify app opens at http://localhost:3000

#### Before Starting Work
1. Make sure you're on `main` branch: `git checkout main`
2. Pull latest changes: `git pull origin main`
3. Create your feature branch: `git checkout -b feature/your-task`

#### During Development
- Use global CSS classes instead of inline styles
- Follow beginner-friendly code patterns (see [Code Style Guidelines](#code-style-guidelines))
- Test your changes in the browser
- Commit frequently with clear messages

#### Before Pushing
1. Check code: `npm run dev` (no errors?)
2. Test your feature manually
3. Stage all changes: `git add .`
4. Commit: `git commit -m "feat: describe your changes"`
5. Push: `git push origin feature/your-branch-name`
6. Create pull request on GitHub

#### Common Issues & Solutions

**Issue: "Port 5173 already in use"**
```bash
# Find and kill process on port 5173
# Windows PowerShell:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5173
kill -9 <PID>
```

**Issue: "npm install fails"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "Git merge conflicts"**
```bash
# View conflicts
git status

# Manually fix files, then:
git add .
git commit -m "resolve: merge conflicts"
```

**Issue: "Component not displaying"**
- Check import paths are correct
- Verify component is exported with `export default`
- Check `App.jsx` has correct route

---
