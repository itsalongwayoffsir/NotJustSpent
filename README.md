# NotJustSpent

A personal finance tracker developed for the young generation that goes beyond expenses, as it can also track your income and savings.

---

## Problem Statement

Many finance tracker apps only focus on spending. NotJustSpent gives users the opportunity not only to quickly record their daily expenses, but also to track their income and deposits, all in one streamlined single-page interface. Users can log transactions, visualise spending patterns, and stay on top of their monthly budget, all without leaving a single page.

---

## Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Frontend   | Vanilla HTML, CSS, JavaScript (ES6+) |
| Styling    | Custom CSS with CSS variables        |
| Charts     | Chart.js 4.4                         |
| Backend    | Node.js + Express.js                 |
| Database   | MongoDB Atlas (cloud) via Mongoose   |
| Auth       | JWT (jsonwebtoken) + bcryptjs        |
| Fonts      | DM Sans (Google Fonts)               |
| Deployment | Render + MongoDB Atlas               |

---

## How to Run

### Prerequisites
- Node.js v18+
- A free MongoDB Atlas account

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
- User registration with email, username, and password
- Password hashing using bcryptjs with 12 salt rounds
- Real-time password strength indicator during registration
- Show/hide password toggle on login and register forms
- JWT-based login with 7-day token expiry
- Auto-login on page refresh using localStorage token
- Role-based access control (user / admin)

### Expenses
- Add expense with title, category, amount, date, and description
- Edit and delete expenses
- Collapsible section to keep the interface tidy
- Filter by category using chip buttons
- Filter by month
- Live search with real-time filtering, dropdown suggestions, and keyword highlighting
- Export current month's expenses as a CSV file
- Input validation with shake animation and inline error messages

### Income and Savings
- Add, edit, and delete income records
- Add, edit, and delete savings deposits
- Set a goal amount for each savings deposit, with a progress bar showing how close you are
- Collapsible sections for both income and savings
- Monthly totals displayed on the dashboard

### Analytics
- Monthly summary showing total income, total spent, total saved, and net balance
- Daily spending bar chart
- Expense category donut chart with amount and percentage on hover
- Income and savings bar charts
- Motivational message based on monthly financial performance

### User Profile
- Edit username, email, and avatar using an emoji picker
- Change password with current password verification
- Username uniqueness enforced on the server
- Profile changes reflected instantly in the sidebar

### Admin Panel
- View all registered users
- Live search to filter users by name, email, or role
- Promote or demote users between admin and user roles
- Delete user accounts
- Activity log that records every login, logout, and CRUD operation with timestamp
- Live search in the activity log to filter by user or action type
- Admin-only access enforced via JWT middleware

### UX and Accessibility
- Single-page application with no page reloads
- Dark mode toggle with preference saved to localStorage
- Responsive mobile design with bottom tab navigation
- Page fade and slide animations
- Loading skeleton and spinner while data loads
- Collapsible sections with expanded/collapsed state saved to localStorage
- Keyboard navigability with Tab and Enter/Space support
- ARIA labels and roles for screen reader support
- Toast notifications for all user actions
- Smart caching to avoid redundant API calls

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
│   └── admin.js                # Admin-only: user management and activity logs
├── models/
│   ├── User.js                 # User schema (username, email, password hash, role, avatar)
│   └── Activity.js             # Activity log schema (userId, action, detail, timestamp)
├── middleware/
│   └── auth.js                 # JWT verification and admin role check middleware
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

This is an individual assignment.

| File | Author |
|------|--------|
| public/index.html | Yangzi Jin |
| routes/auth.js | Yangzi Jin |
| routes/expenses.js | Yangzi Jin |
| routes/income.js | Yangzi Jin |
| routes/savings.js | Yangzi Jin |
| routes/admin.js | Yangzi Jin |
| models/User.js | Yangzi Jin |
| models/Activity.js | Yangzi Jin |
| middleware/auth.js | Yangzi Jin |
| server.js | Yangzi Jin |

---

## Database Export

Sample data is available in `/database-export/`. To import:
```bash
node seed_belle_may.js
```
This seeds 30 expenses, 4 income records, and 3 savings deposits for May 2026.

---

## Live Demo

https://notjustspent.onrender.com

Note: The free Render instance may take around 50 seconds to wake up after a period of inactivity.

---

## Challenges Overcome

1. Custom delete confirmation modal: the browser's built-in confirm() dialog was blocked in certain environments, so a custom modal overlay was built to handle delete confirmations reliably.

2. JWT token scoping per user: all database queries were updated to filter by userId so each user only sees their own data, and edits and deletes verify ownership before proceeding.

3. Role-based access control: a two-layer middleware system was implemented where authMiddleware verifies the JWT on every protected route, and adminMiddleware additionally checks the user's role before granting access to admin endpoints.

4. Live search with suggestions: implemented real-time filtering that simultaneously updates the expense table and shows a dropdown of matching suggestions, using an in-memory cache to avoid repeated API calls on each keystroke.

5. SPA state management without a framework: all UI state including auth, cache, filters, and search query was managed manually using JavaScript variables and localStorage, requiring careful coordination to keep the interface consistent across page navigation.
