# RiskGuard Insurance Platform

A comprehensive React-based insurance management system with advanced risk scoring, underwriting rules engine, and multi-role portal system.

---

## Overview

RiskGuard is a full-featured insurance platform featuring:
- **Customer Portal**: Application submission with automatic risk assessment
- **Underwriter Portal**: Application review with professional risk analysis dashboard  
- **Admin Portal**: System management, product management, and analytics
- **Risk Engine**: Intelligent risk scoring based on age, health, lifestyle, and claim history
- **Premium Calculation**: Dynamic pricing based on risk factors
- **Payment Tracking**: Outstanding payment management and history

---

## Technology Stack

### Frontend
- **React** 18.2.0 - UI framework
- **Vite** 5.0.0 - Build tool and dev server
- **Tailwind CSS** 3.3.0 - Utility-first CSS framework
- **React Router** 6.20.0 - SPA routing and navigation
- **Axios** 1.6.0 - HTTP client for API communication
- **Recharts** 2.10.0 - React charting library for analytics

### Backend
- **json-server** 0.17.4 - Mock REST API server
- **db.json** - File-based data persistence

### Development Tools
- **Node.js** 18+ - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control

---

## Project Structure

```
frontend/
├── public/
│   ├── db.json                 # Mock database
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── common/             # Shared: Navbar, Sidebar, Header, Footer, ProtectedRoute
│   │   ├── customer-portal/    # Customer: Dashboard, ApplicationForm, PolicyList, 
│   │   │                       #          PaymentTracker, ProfileSection, Settings
│   │   ├── underwriter-portal/ # Underwriter: Dashboard, ApplicationReview, Settings
│   │   └── admin-portal/       # Admin: Dashboard, ProductManagement, UserManagement,
│   │                           #       AnalyticsCharts, Settings
│   ├── pages/                  # Pages: Home, Login, Register, NotFound, Unauthorized
│   ├── context/                # AuthContext for global state
│   ├── hooks/                  # useAuth custom hook
│   ├── utils/
│   │   ├── api.js              # Axios API client
│   │   ├── riskEngine.js       # Risk scoring & underwriting logic
│   │   ├── constants.js        # App constants
│   │   ├── helpers.js          # Utility functions
│   │   └── validators.js       # Form validation
│   ├── styles/
│   │   └── globals.css         # Global styles & Tailwind
│   └── main.jsx                # React entry point
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git

### Installation

```bash
# Clone repository
git clone <repository-url>
cd RiskGuardProject/frontend

# Install dependencies
npm install

# Start dev server (http://localhost:5174)
npm run dev

# Start API server (http://localhost:3001) - in another terminal
npm run server
```

---

## Git Workflow for Team Members

### Clone Repository (First Time)
```bash
git clone <repository-url>
cd RiskGuardProject
cd frontend
npm install
```

### Create Feature Branch
```bash
git pull origin main
git checkout -b feature/your-feature-name
```

**Branch naming convention:**
- `feature/add-payment-module`
- `bugfix/fix-login-error`
- `refactor/optimize-risk-engine`
- `docs/update-readme`

### Make Changes & Commit
```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add payment tracking to dashboard"

# Push to remote
git push origin feature/your-feature-name
```

### Create Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Add description
4. Request code review
5. Merge after approval

### After Merging
```bash
git checkout main
git pull origin main
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

### Useful Git Commands
```bash
git status                          # Check current status
git branch -a                       # List all branches
git log --oneline                   # View commit history
git reset --soft HEAD~1             # Undo last commit
git stash                           # Temporarily save changes
git checkout -- src/file.jsx        # Discard file changes
```

---

### Merge Conflicts
```bash
git status
# Resolve conflicts manually
git add .
git commit -m "resolve: merge conflicts"
```

---

## Team Collaboration

### Daily Workflow
1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/xyz`
3. Make commits with clear messages
4. Push changes: `git push origin feature/xyz`
5. Create PR on GitHub
6. Request code review
7. Merge after approval




## Common Tasks

### Add New Component
1. Create file in appropriate portal folder
2. Use functional component with hooks
3. Use Tailwind CSS classes for styling
4. Export as default

### Add New Route
1. Import component in `main.jsx`
2. Add `<Route>` with `<ProtectedRoute>` wrapper
3. Update Sidebar navigation in `getMenuItems()`

### Add New API Call
1. Create method in `utils/api.js` (use axiosInstance)
2. Import and use in component via `useState` + `useEffect`

### Deploy Changes
1. Create feature branch
2. Commit & push changes
3. Create PR with description
4. Code review & approval
5. Merge to main
6. Automatic deployment

---

## License

Proprietary - RiskGuard Insurance Platform
