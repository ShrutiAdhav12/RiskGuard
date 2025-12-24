# RiskGuard - Insurance Risk Assessment Platform

A modern insurance risk assessment and underwriting system.  built with **React 18 + Vite**, featuring authentication, multi-role dashboards, and a professional UI with blue gradient design.



---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Development Guide](#development-guide)
- [Git Workflow](#git-workflow)
- [Team Instructions](#team-instructions)
- [Dummy Data](#dummy-data)

---

## 🎯 Project Overview

**RiskGuard** is an insurance platform designed to:
- Allow **Customers** to purchase insurance and track policies
- Enable **Underwriters** to review applications and assess risk
- Provide **Admins** with system management and analytics tools

This frontend MVP demonstrates core user flows with a professional UI, dummy data integration, and beginner-friendly React code perfect for onboarding new developers.

**Key Highlights:**
- ✅ Fully functional routing with React Router v6
- ✅ Authentication system with Context API (localStorage persistence)
- ✅ Global CSS utility classes (no inline styles)
- ✅ Beginner-friendly JavaScript code (interview-ready)
- ✅ Responsive design with Tailwind CSS
- ✅ 4 dummy JSON data files for development

---

## 📁 Folder Structure

```
RiskGuard/
├── frontend/                          # Frontend application root
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx        # Navigation header with auth
│   │   │   │   └── Footer.jsx        # Footer component
│   │   │   ├── landing/
│   │   │   │   ├── HeroSection.jsx   # Landing page hero
│   │   │   │   ├── ProductCards.jsx  # Insurance products (uses products.json)
│   │   │   │   └── LandingPageComponent.jsx
│   │   │   ├── customer-portal/
│   │   │   │   └── Dashboard.jsx     # Customer dashboard (3 fields)
│   │   │   ├── underwriter-portal/
│   │   │   │   └── Dashboard.jsx     # Underwriter review dashboard
│   │   │   └── admin-portal/
│   │   │       └── Dashboard.jsx     # Admin system dashboard
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx       # / (Home)
│   │   │   ├── Login.jsx             # /login (with role selection)
│   │   │   ├── Register.jsx          # /register (Name, Email, Password)
│   │   │   └── dashboards/
│   │   │       ├── CustomerDashboard.jsx    # /customer-dashboard
│   │   │       ├── UnderwriterDashboard.jsx # /underwriter-dashboard
│   │   │       └── AdminDashboard.jsx       # /admin-dashboard
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global auth state (user, isLoggedIn)
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js            # Hook to access AuthContext
│   │   │   └── useForm.js            # Form state management hook
│   │   │
│   │   ├── styles/
│   │   │   └── globals.css           # Global CSS classes (150+ utilities)
│   │   │
│   │   ├── data/
│   │   │   ├── users.json            # Dummy users (customers, underwriters, admin)
│   │   │   ├── products.json         # Insurance products (Life, Health, Motor)
│   │   │   ├── policies.json         # Sample policies
│   │   │   ├── applications.json     # Sample applications
│   │   │   └── README.md             # Data usage guide
│   │   │
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx                  # React entry point
│   │
│   ├── public/
│   ├── index.html                    # Entry HTML file
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.js                # Vite server config (port 3000)
│   ├── tailwind.config.js            # Tailwind theme config
│   ├── postcss.config.js             # PostCSS plugins
│   └── README.md                     # This file
│
└── backend/                          # Java Spring Boot (future phase)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend Framework** | React | 18.2.0 |
| **Build Tool** | Vite | 5.0.0 |
| **Routing** | React Router | 6.20.0 |
| **State Management** | Context API + useState | Built-in |
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

#### 4. Build for Production
```bash
npm run build
```

Output goes to `dist/` folder

#### 5. Preview Production Build
```bash
npm run preview
```

---



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

## 📊 Dummy Data

The project includes 4 JSON data files in `src/data/`:

### users.json
- 3 customers (John, Sarah, Michael)
- 2 underwriters (Alice, Robert)
- 1 admin user
- Fields: id, name, email, role, phone, address

### products.json
- Life Insurance (❤️ icon, $50/month)
- Health Insurance (⚕️ icon, $200/month)
- Motor Insurance (🚗 icon, $150/month)
- Fields: id, name, description, icon, basePrice, maxCoverage, features

### policies.json
- 4 sample active/pending policies
- Fields: id, customerId, productId, status, coverage, premium, startDate, endDate

### applications.json
- 4 sample applications (approved/pending/under_review)
- Fields: id, customerId, status, riskScore, submittedDate, reviewerNotes

**Usage:**
```javascript
import productsData from '../../data/products.json'

{productsData.products.map(product => (
  <div key={product.id}>{product.name}</div>
))}
```

See `src/data/README.md` for detailed structure

---

## 📝 Code Examples

### Adding a New Page

1. Create page file in `src/pages/MyPage.jsx`:
```javascript
function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  )
}

export default MyPage
```

2. Add route in `src/App.jsx`:
```javascript
<Route path="/my-page" element={<MyPage />} />
```

3. Add navigation in `src/components/common/Header.jsx`:
```javascript
<a href="/my-page">My Page</a>
```

### Using Context for Auth
```javascript
import { useAuth } from '../../hooks/useAuth'

function MyComponent() {
  let auth = useAuth()
  
  if (!auth.isLoggedIn) {
    return <p>Please login</p>
  }
  
  return <p>Welcome, {auth.user.name}</p>
}
```

### Using Global CSS Classes
```javascript
function MyComponent() {
  return (
    <div className="container">
      <h1 className="page-title">Title</h1>
      <div className="grid grid-3">
        <div className="stat-card">Card 1</div>
        <div className="stat-card">Card 2</div>
        <div className="stat-card">Card 3</div>
      </div>
    </div>
  )
}
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following code style guidelines
3. Commit with clear messages: `git commit -m "feat: add feature"`
4. Push to GitHub: `git push origin feature/your-feature`
5. Create Pull Request on GitHub
6. Get approved and merge

---

## 📞 Support & Questions

- Check documentation in `src/data/README.md`
- Review component code for examples
- Ask senior team members
- Create GitHub issues for bugs

---

## 📄 License

Internal Project - RiskGuard Team

---

## 👥 Team

- **Frontend Lead**: [Your Name]
- **Team Members**: [Add team names here]
- **Last Updated**: December 24, 2025

---

**Happy Coding! 🚀**
- **Context API** for state management
- **Role-based** user system (Customer, Underwriter, Admin)
- **localStorage** persistence for user sessions
- **Protected routes** ready for implementation

### 📱 Components
- **Header** - Sticky navigation with login/logout functionality
- **Footer** - Company info and links
- **Dashboard Cards** - Stats and quick actions display
- **Forms** - Multi-step registration with validation
- **Alerts & Badges** - Status indicators and feedback messages

## Tech Stack

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool & dev server
- **React Router 6.20** - Client-side routing
- **Tailwind CSS 3.3** - Utility-first CSS
- **Custom CSS** - Professional styling

### No External Dependencies (20% MVP)
- ❌ No TypeScript
- ❌ No Material-UI
- ❌ No Axios (ready for integration)
- ❌ No state management libraries
- ✅ Just React hooks and Context API

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## File Organization

### Key Files
- **src/App.jsx** - Main app component with all routes
- **src/main.jsx** - React entry point
- **src/context/AuthContext.jsx** - Authentication state management
- **src/hooks/useAuth.js** - Hook to access auth context
- **src/hooks/useForm.js** - Form state management helper

### Component Hierarchy
```
App (routing)
├── Header (common)
├── LandingPage
│   └── HeroSection, ProductCards, Footer
├── Login
├── Register
└── Dashboards (Customer, Underwriter, Admin)
    └── Dashboard components with Header and Footer
```

## Form Validation

All forms include client-side validation:
- **Login**: Email format, password required
- **Registration**: Multi-step with email, phone, password validation
- **Error messages**: Clear feedback for invalid inputs

## Styling

### Color Palette
- **Primary Blue**: `#0066cc`
- **Dark Navy**: `#004499`
- **Light Gray**: `#f0f4f8`
- **Success Green**: `#10b981`
- **Warning Amber**: `#f59e0b`
- **Danger Red**: `#ef4444`

### Global CSS Utilities
- Button styles (primary, secondary, success, danger, warning)
- Card layouts with shadows and hover effects
- Grid and flex utilities
- Alert and badge components
- Responsive breakpoints

## Next Steps (30-50% MVP)

1. **Backend Integration**
   - Connect login/registration to Java Spring Boot API
   - Implement Axios for API calls
   - Add JWT token handling

2. **Data Management**
   - Create JSON data files (customers, policies, applications)
   - Implement data tables with sorting/filtering
   - Add pagination for lists

3. **Dashboard Features**
   - Policy management CRUD operations
   - Application review workflow
   - User and product management

4. **Additional Components**
   - Policy list table with actions
   - Application review modals
   - Risk assessment forms
   - Charts and analytics views

## Notes

- This is a **20% MVP** focused on core functionality
- Code is simple and interview-friendly
- No unnecessary complexity or advanced patterns
- All components are functional and ready to extend
- Professional styling looks hand-written, not AI-generated

## Author

Created as a simplified insurance risk assessment platform.

---

**Status**: Frontend complete and ready for backend integration.
