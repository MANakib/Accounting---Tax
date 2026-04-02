---
description: Workspace instructions for Accounting & Tax web application
applyTo: '**'
---

# Accounting & Tax Application — Workspace Instructions

**Project Type:** React frontend + Node.js/Express backend accounting application for personal/small business use

## Quick Start

### Prerequisites
- Node.js 18+ (for both frontend and backend)
- npm or yarn package manager
- Git

### Initial Setup

```bash
# Clone and initialize
git clone <repo-url>
cd accounting-tax

# Install dependencies (frontend)
cd frontend && npm install

# Install dependencies (backend)  
cd ../backend && npm install
```

### Development Workflow

```bash
# Terminal 1: Backend (http://localhost:3001)
cd backend && npm run dev

# Terminal 2: Frontend (http://localhost:3000)
cd frontend && npm run dev
```

### Build for Production

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

---

## Project Structure

```
accounting-tax/
├── .github/
│   └── copilot-instructions.md       # This file
├── frontend/                          # React application
│   ├── src/
│   │   ├── pages/                    # Route pages
│   │   ├── components/               # Reusable components
│   │   ├── services/                 # API clients
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── utils/                    # Utility functions
│   │   └── App.tsx                   # Main component
│   ├── package.json
│   └── ...
├── backend/                           # Express API Server
│   ├── src/
│   │   ├── routes/                   # API route handlers
│   │   ├── controllers/              # Business logic
│   │   ├── middleware/               # Auth, validation, etc.
│   │   ├── models/                   # Data models/schemas
│   │   ├── services/                 # Database services
│   │   └── index.ts                  # App entry point
│   ├── package.json
│   └── ...
└── docs/                              # Project documentation

```

---

## Architecture

### Frontend (React)
- **TypeScript** for type safety
- **Component-based** architecture with reusable UI components
- **React Router** for navigation
- **State management:** TBD (suggest Context API or Redux Toolkit for accounting state)
- **API communication** via fetch or axios client

### Backend (Node.js/Express)
- **TypeScript** for type safety
- **RESTful API** endpoints for accounting operations (transactions, accounts, reports)
- **Middleware** for authentication, request validation, error handling
- **Database service layer** for data persistence

### Data Models (Suggested)
- **Accounts** (checking, savings, credit cards, etc.)
- **Transactions** (income, expenses, transfers)
- **Categories** (for expense tracking)
- **Reports** (monthly/quarterly summaries, tax categories)
- **User** (single or multi-user support)

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI framework |
| **Frontend** | TypeScript | Type safety |
| **Frontend** | React Router | Navigation |
| **Frontend** | TBD | State management |
| **Backend** | Node.js 18+ | Runtime |
| **Backend** | Express | HTTP server |
| **Backend** | TypeScript | Type safety |
| **Database** | TBD | Data storage (see recommendations) |
| **Auth** | TBD | Authentication/authorization |

---

## Database Recommendation

### For Accounting Applications, Recommend **Azure Cosmos DB**

**Why Cosmos DB is ideal for accounting:**
- **Multi-region write capability** — Enable real-time sync across devices
- **Low-latency reads** — Critical for transaction lookups and account balances
- **Elastic scaling** — Grows with your business without downtime
- **ACID transactions** — Reliable for financial operations (especially with transactions API)
- **No fixed schema** — Flexibility to evolve accounting models
- **Cost-effective** — Consumption-based pricing; free tier available for development

**Alternative Options:**
- **PostgreSQL** — Traditional relational option; good for structured financial data
- **Firebase/Firestore** — Quick setup, real-time updates, good for prototyping
- **MongoDB** — Document database; flexible schema like Cosmos DB

**Setup for Development:**
- Use **Azure Cosmos DB Emulator** locally (free, full fidelity with cloud service)
- Connection string: `https://localhost:8081/`
- Or use Azure free tier account for limited cloud testing

---

## Accounting Best Practices

1. **Data Integrity**
   - All transactions are immutable (create new records, don't modify)
   - Maintain transaction history for audit trails
   - Use transaction IDs for referencing and reconciliation

2. **Calculations**
   - Store account balances as derived values (calculated from transactions)
   - Use precise decimal arithmetic (avoid floating point for currency)
   - Implement double-entry bookkeeping if multi-currency/comprehensive

3. **Reporting**
   - Build reports server-side for consistency
   - Cache commonly used reports (monthly summaries, tax categories)
   - Support date-range filtering for all reports

4. **Security**
   - Sensitive operations require authentication
   - Use HTTPS in production
   - Validate and sanitize all inputs
   - Implement role-based access if multi-user features planned

5. **User Experience**
   - Provide clear transaction categorization
   - Real-time balance updates
   - Bulk import capabilities (CSV, bank statements)
   - Export reports (PDF, CSV)

---

## Development Conventions

### Code Style
- **Language:** TypeScript (strict mode)
- **Formatting:** Prettier with 2-space indentation
- **Linting:** ESLint with standard config
- **Naming:** camelCase for variables/functions, PascalCase for components/classes

### Git Workflow
- **Branch naming:** `feature/description`, `fix/description`, `docs/description`
- **Commits:** Clear, descriptive commit messages
- **PRs:** Required for non-trivial changes

### API Naming
- **RESTful convention:** Use `GET /accounts`, `POST /transactions`, etc.
- **Response format:** Consistent JSON structure with status codes
- **Error responses:** Include error message and error code for debugging

### Frontend Components
- **Structure:** One component per file in `/components`
- **Props:** Use TypeScript interfaces for prop definitions
- **Hooks:** Extract complex logic into custom hooks in `/hooks`

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with hot reload

# Testing
npm run test            # Run test suite
npm run test:watch     # Watch mode

# Linting & Formatting
npm run lint            # Check code style
npm run format          # Auto-format code
npm run type-check      # TypeScript type checking

# Building
npm run build           # Production build
npm run start           # Run production build

# Database (when configured)
npm run db:migrate      # Run pending migrations
npm run db:seed         # Populate sample data
```

---

## Common Development Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement backend route and service
3. Implement frontend components and API client
4. Test locally with both services running
5. Commit with descriptive message
6. Create PR for review

### Database Schema Changes
1. Create migration file (naming: `YYYYMMDD_HHmmss_description`)
2. Test migration locally
3. Document schema changes in relevant model files
4. Update TypeScript interfaces to match

### Debugging
- **Backend:** Use `console.log()` or debugger breakpoints
- **Frontend:** Use React DevTools and browser DevTools
- **Network:** Check browser network tab for API calls
- **Database:** Use database UI client (Cosmos Explorer, pgAdmin, etc.)

---

## Resources & Links

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Azure Cosmos DB Documentation](https://learn.microsoft.com/azure/cosmos-db/)
- [RESTful API Best Practices](https://restfulapi.net/)

---

## Next Steps

1. ✅ Set up initial project structure (frontend & backend folders)
2. ⏳ Configure TypeScript, ESLint, and Prettier
3. ⏳ Set up database connection (Cosmos DB or alternative)
4. ⏳ Implement authentication/authorization
5. ⏳ Build core accounting features (accounts, transactions, categories)
6. ⏳ Add reporting and export capabilities
7. ⏳ Set up testing framework (Jest, React Testing Library)
8. ⏳ Prepare for deployment (containerization, CI/CD)

---

## Questions or Issues?

- Unclear sections? Ask for clarification on specific areas
- Want to adjust tech stack? Let me know and I can update recommendations
- Need database setup help? Specify which database you choose, and I'll provide setup steps
