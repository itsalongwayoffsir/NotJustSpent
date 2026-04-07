# NotJustSpent 

A personal finance tracker developed for the young generation that goes beyond expenses, as it can also track your income and savings.

---

## Problem Statement

Many finance tracker apps only focus on spending. NotJustSpent gives users the opportunity not only to quickly record their daily expenses, but also to track their income and deposits, all in one streamlined single-page interface.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | HTML, CSS, JavaScript               |
| Styling     | Custom CSS with CSS variables       |
| Charts      | Chart.js 4.4                        |
| Backend     | Node.js + Express.js                |
| Database    | MongoDB Atlas (cloud) via Mongoose  |
| Fonts       | DM Sans (Google Fonts)              |
| Deployment  | Local (Node.js) / Render-ready      |

---

## Features

-  **Single-page application** — no page reloads; all views are dynamically rendered
-  **Full CRUD** on all three collections (Expenses, Income, Savings)
-  **Add expense** with title, category, amount, date, and optional note
-  **Category filter chips** — filter expenses by Food, Transport, Shopping, Entertainment, Study, or Bills
-  **Auto-select category** — clicking a chip pre-fills the category dropdown in the add form
-  **Monthly filter** — all records and charts respond to the selected month
-  **Edit modal** — inline editing without leaving the page
-  **Analyse page** — 4 charts including daily spending bar, expense category donut, income bar, savings bar
-  **Summary stats** — monthly totals for spent, income, and savings with net balance
-  **Motivational messages** — contextual feedback based on the month's financial data
-  **Error toasts** — red/dark toast notifications for success and failure states
-  **AUD currency** — amounts displayed as AUD $

---

## Folder Structure

```
notjustspent/
├── public/
│   └── index.html          # Single-page frontend (HTML + CSS + JS)
├── routes/
│   ├── expenses.js         # CRUD routes for expenses
│   ├── income.js           # CRUD routes for income
│   └── savings.js          # CRUD routes for savings deposits
├── server.js               # Express app entry point
├── package.json            # Node.js dependencies
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18+)
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account

### 2. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/notjustspent.git
cd notjustspent
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and paste your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notjustspent?retryWrites=true&w=majority
PORT=3000
```

### 4. Run
```bash
npm start
```
Visit `http://localhost:3000`

---

## Database Export

Sample data for the three collections is provided in `/database-export/`:
- `expenses.json`
- `income.json`
- `savings.json`

To import into MongoDB Atlas:
```bash
mongoimport --uri="YOUR_MONGO_URI" --collection=expenses --file=database-export/expenses.json --jsonArray
mongoimport --uri="YOUR_MONGO_URI" --collection=income   --file=database-export/income.json   --jsonArray
mongoimport --uri="YOUR_MONGO_URI" --collection=savings  --file=database-export/savings.json  --jsonArray
```

---

## Challenges Overcome

1. **Custom delete confirmation modal** :the browser's built-in confirm() dialog was blocked in certain environments, so a custom modal overlay was built to handle delete confirmations instead.
2. **Keeping charts in sync with the month filter** :a shared CACHE object was used so that switching to the Analyse page reuses already-fetched data instead of making new API calls, making the tab switch instant.
3. **Reducing API load time** :instead of fetching expenses, income, and savings one by one, Promise.all() was used to send all three requests in parallel, which noticeably sped up page refreshes.
4. **Record identity between frontend and MongoDB** :early versions used a custom uid() function for IDs, but this caused edit/delete bugs once the backend was added. Switching to MongoDB's native _id field fixed this entirely.
5. **SPA state without a framework** :without React or Vue, state was managed manually using an in-memory CACHE object, so category filtering rerenders instantly from cache rather than hitting the database each time.