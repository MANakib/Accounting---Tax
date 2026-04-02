# AccountingTax — Personal & Small Business Finance Tracker

A simple, production-ready MVP web application for tracking personal and small business income and expenses (U.S. based).

## Features

- **Authentication** — Register, login, JWT-based sessions, bcrypt password hashing
- **Transactions** — Add, edit, soft-delete; filter by date range, type, and category
- **Duplicate Detection** — Warns before saving a transaction with the same date, amount, and description
- **Categories** — Preloaded system defaults + custom user categories
- **Dashboard** — Monthly totals (income, expenses, net profit), expense pie chart, 6-month income vs expense bar chart
- **Tax Summary** — Yearly Schedule C-style overview with estimated self-employment tax (15.3%)
- **CSV Export** — All transactions export + yearly monthly summary export

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS + Recharts |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Setup

### 1. Clone and enter the project

```bash
git clone <repo-url>
cd "Accounting & Tax"
```

### 2. Set up the database

```bash
# Create the PostgreSQL database
createdb accounting_tax

# Or using psql:
psql -U postgres -c "CREATE DATABASE accounting_tax;"
```

### 3. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/accounting_tax
JWT_SECRET=replace-with-a-strong-256-bit-random-secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Run database migrations and seed data

```bash
cd backend

# Install dependencies
npm install

# Run schema migration
npm run db:migrate

# Seed default categories
npm run db:seed
```

### 5. Start the backend

```bash
# From the backend/ directory
npm run dev
# Runs on http://localhost:3001
```

### 6. Start the frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Runs on http://localhost:3000
```

Open your browser at **http://localhost:3000** and register a new account.

---

## Project Structure

```
Accounting & Tax/
├── backend/
│   ├── src/
│   │   ├── config/db.ts              # PostgreSQL pool
│   │   ├── controllers/              # Request handlers
│   │   ├── middleware/               # Auth + error handler
│   │   ├── models/                   # Database queries
│   │   ├── routes/                   # Express routers
│   │   ├── schemas/                  # Zod validation schemas
│   │   ├── types/index.ts            # TypeScript interfaces
│   │   └── index.ts                  # Express app entry
│   ├── migrations/001_initial_schema.sql
│   ├── seeds/categories.sql
│   └── .env.example
└── frontend/
    └── src/
        ├── components/               # UI components
        │   ├── dashboard/            # Charts + summary cards
        │   ├── layout/               # Navbar + PrivateRoute
        │   ├── transactions/         # Forms, list, filters, duplicate modal
        │   ├── categories/           # Category form
        │   └── ui/                   # Button, Input, Modal, Badge
        ├── context/AuthContext.tsx   # JWT auth state
        ├── hooks/                    # useAuth, useTransactions, useCategories
        ├── pages/                    # Route-level pages
        ├── services/                 # API calls (axios)
        ├── types/index.ts
        └── utils/                    # Formatters + tax calculator
```

---

## API Reference

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login → JWT |
| GET | `/api/transactions` | Yes | List with filters + pagination |
| POST | `/api/transactions` | Yes | Create (with duplicate check) |
| PUT | `/api/transactions/:id` | Yes | Update |
| DELETE | `/api/transactions/:id` | Yes | Soft delete |
| GET | `/api/categories` | Yes | All categories |
| POST | `/api/categories` | Yes | Create custom category |
| DELETE | `/api/categories/:id` | Yes | Delete user category |
| GET | `/api/dashboard` | Yes | Monthly stats + chart data |
| GET | `/api/tax?year=YYYY` | Yes | Yearly tax summary |
| GET | `/api/export/transactions` | Yes | CSV download |
| GET | `/api/export/summary?year=YYYY` | Yes | Yearly monthly summary CSV |

### Duplicate Detection

When creating a transaction, the API checks for an existing record with the same `date`, `amount`, and `description`. If found, it returns:

```json
HTTP 409
{
  "code": "DUPLICATE_DETECTED",
  "message": "A transaction with the same date, amount, and description already exists.",
  "existingId": "uuid"
}
```

To bypass the duplicate check, include `"force": true` in the request body.

### Query Parameters for GET /api/transactions

| Parameter | Type | Description |
|-----------|------|-------------|
| `start_date` | YYYY-MM-DD | Filter from date |
| `end_date` | YYYY-MM-DD | Filter to date |
| `type` | income \| expense | Filter by type |
| `category_id` | UUID | Filter by category |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 25, max: 100) |

---

## Tax Calculation

The self-employment tax estimate follows IRS rules:

```
Net Profit         = Total Income - Total Expenses
SE Taxable Net     = Net Profit × 92.35%   (IRS deduction: self-employed pay half of SE tax)
Estimated SE Tax   = SE Taxable Net × 15.3% (12.4% Social Security + 2.9% Medicare)
```

> This is a simplified estimate. It does not include federal income tax brackets, deductions, or state taxes. Consult a tax professional for accurate filing.

---

## Production Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend (outputs to frontend/dist/)
cd frontend
npm run build
# Serve dist/ with nginx, Caddy, or:
npm run preview
```

---

## Default Categories

**Income:** Sales, Service Revenue, Consulting, Investment, Other Income

**Expense:** Rent, Utilities, Marketing, Supplies, Software, Travel, Meals, Professional Fees, Insurance, Other Expense

Users can add custom categories at any time from the Categories page.
