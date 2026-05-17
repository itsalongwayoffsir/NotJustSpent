# NotJustSpent 💸

A personal finance tracker developed for the young generation that goes beyond expenses, as it can also track your income and savings.

---

## Problem Statement

Many finance tracker apps only focus on spending. NotJustSpent gives users the opportunity not only to quickly record their daily expenses, but also to track their income and deposits, all in one streamlined single-page interface. Users can log transactions, visualise spending patterns, and stay on top of their monthly budget — all without leaving a single page.

---

## Tech Stack

| Layer       | Technology                           |
|-------------|--------------------------------------|
| Frontend    | Vanilla HTML, CSS, JavaScript (ES6+) |
| Styling     | Custom CSS with CSS variables        |
| Charts      | Chart.js 4.4                         |
| Backend     | Node.js + Express.js                 |
| Database    | MongoDB Atlas (cloud) via Mongoose   |
| Auth        | JWT (jsonwebtoken) + bcryptjs        |
| Fonts       | DM Sans (Google Fonts)               |
| Deployment  | Render (backend) + MongoDB Atlas     |

---

## How to Run

### Prerequisites
- [Node.js](https://nodejs.org) v18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### Setup
```bash
git clone https://github.com/itsalongwayoffsir/NotJustSpent.git
cd NotJustSpent
npm install
```

### Configure environment
Copy `.env.example` to `.env` and fill in your values:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notjustspent
JWT_SECRET=your_secret_key_here
PORT=3000
```

### Load sample data (optional)
```bash
node seed_belle_may.js
```

### Start the server
```bash
npm start
```
Visit `http://localhost:3000`

---

## Features

### Authentication
- ✅ User registration with email, username, and password
- ✅ Password hashing using bcryptjs (12 salt rounds)
- ✅ JWT-based login with 7-day token expiry
- ✅ Auto-login on page refresh using localStorage token
- ✅ Show/hide password toggle on login and register forms
- ✅ Role-based access control (user / admin)

### Expenses
- ✅ Add expense with title, category, amount, date, description
- ✅ Edit and delete expenses
- ✅ Filter by category using chip buttons
- ✅ Filter by month
- ✅ **Live search** — real-time filtering as user types, with dropdown suggestions and keyword highlighting
- ✅ Input validation with shake animation and inline error messages

### Income & Savings
- ✅ Add, edit, delete income records
- ✅ Add, edit, delete savings deposits
- ✅ Monthly totals displayed on dashboard

### Analytics (Analyse page)
- ✅ Monthly summary: total income, total spent, total saved, net balance
- ✅ Daily spending bar chart
- ✅ Expense category donut chart with amount + percentage on hover
- ✅ Income and savings bar charts
- ✅ Motivational message based on financial performance

### User Profile
- ✅ Edit username, email, and avatar (emoji picker)
- ✅ Username uniqueness enforced on the server
- ✅ Profile changes reflected instantly in the sidebar

### Admin Panel
- ✅ View all registered users with role badges
- ✅ Promote/demote users between admin and user roles
- ✅ Delete user accounts
- ✅ Activity log — records every login, logout, and CRUD operation with timestamp
- ✅ Admin-only access enforced via JWT middleware

### UX & Accessibility
- ✅ Single-page application — no page reloads
- ✅ Responsive mobile design with bottom tab navigation
- ✅ Page fade + slide animations
- ✅ Loading skeleton and spinner
- ✅ Keyboard navigability (Tab + Enter/Space)
- ✅ ARIA labels and roles for screen reader support
- ✅ Toast notifications for all actions
- ✅ Smart caching to avoid redundant API calls

---

## Folder Structure

```
NotJustSpent/
├── public/
│   └── index.html              # Single-page frontend (HTML + CSS + JS)
├── routes/
│   ├── auth.js                 # Register, login, logout, profile update
│   ├── expenses.js             # CRUD routes for expenses (auth-protected)
│   ├── income.js               # CRUD routes for income (auth-protected)
│   ├── savings.js              # CRUD routes for savings (auth-protected)
│   └── admin.js                # Admin-only: user management + activity logs
├── models/
│   ├── User.js                 # User schema (username, email, password hash, role, avatar)
│   └── Activity.js             # Activity log schema (userId, action, detail, timestamp)
├── middleware/
│   └── auth.js                 # JWT verification + admin role check middleware
├── database-export/
│   ├── expenses.json           # Sample expense data
│   ├── income.json             # Sample income data
│   └── savings.json            # Sample savings data
├── server.js                   # Express app entry point
├── seed_belle_may.js           # Script to seed May 2026 sample data
├── package.json
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## Workload Allocation

This is an **individual assignment**. All code was written by a single student.

| File | Author |
|------|--------|
| `public/index.html` | Individual |
| `routes/auth.js` | Individual |
| `routes/expenses.js` | Individual |
| `routes/income.js` | Individual |
| `routes/savings.js` | Individual |
| `routes/admin.js` | Individual |
| `models/User.js` | Individual |
| `models/Activity.js` | Individual |
| `middleware/auth.js` | Individual |
| `server.js` | Individual |

---

## Database Export

Sample data is available in `/database-export/`. To import:
```bash
node seed_belle_may.js
```
This seeds 30 expenses, 4 income records, and 3 savings deposits for May 2026.

---

## Live Demo

🌐 [https://notjustspent.onrender.com](https://notjustspent.onrender.com)

> Note: The free Render instance may take ~50 seconds to wake up after inactivity.

---

## Challenges Overcome

1. **Custom delete confirmation modal** — the browser's built-in `confirm()` dialog was blocked in certain environments, so a custom modal overlay was built to handle delete confirmations reliably.
2. **JWT token scoping per user** — all database queries were updated to filter by `userId` so each user only sees their own data, and edits/deletes verify ownership before proceeding.
3. **Role-based access control** — a two-layer middleware system was implemented: `authMiddleware` verifies the JWT on every protected route, and `adminMiddleware` additionally checks the user's role before granting access to admin endpoints.
4. **Live search with suggestions** — implemented real-time filtering that simultaneously updates the table and shows a dropdown of matching suggestions, using an in-memory cache to avoid repeated API calls on each keystroke.
5. **SPA state management without a framework** — all UI state (auth, cache, filters, search query) was managed manually using JavaScript variables and localStorage, requiring careful coordination to keep the interface consistent across page navigation.
