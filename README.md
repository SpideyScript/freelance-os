# 🚀 Freelance Business OS

> **The all-in-one Autonomous Operating System & SaaS Command Center for high-earning independent freelancers, studios, and consultants.**

Built with the modern **MERN** stack + **TypeScript** across both client and server, featuring **Freelance Copilot AI**, real-time time tracking, dual Kanban/List sprint management, instant proposals, dynamic tax-calculated invoicing, and financial analytics.

---

## ⚡ Tech Stack

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Design Tokens (Dark / Light mode)
- **Routing**: React Router v6
- **State & Caching**: TanStack Query v5 + Context API
- **Forms & Validation**: React Hook Form + Zod
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Productivity**: Global Command Palette (`Cmd+K` / `Ctrl+K`), live timer widget

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Database**: MongoDB + Mongoose ODM (strictly indexed & referenced)
- **Authentication**: JWT tokens + bcryptjs password hashing + RBAC (`freelancer`, `admin`)
- **Validation**: Zod schema validation middleware
- **Security**: Helmet, CORS, Express Rate Limiting (standard, auth, and AI tiers)
- **Logging**: Morgan HTTP logger + Activity audit trail

### AI Engine ("Freelance Copilot")
- **Integration**: OpenAI API (`gpt-4o-mini`) + Resilient Internal Mock Engine fallback
- **Architecture**: Context-aware service layer retrieving only scoped business metrics
- **Features**:
  - AI Proposal Generator (executive problem understanding, deliverables, pricing, and CTA)
  - AI Client Message Generator (follow-ups, project updates, reminders with tone selection)
  - AI Project Planner (automated phases, milestones, and task decomposition)
  - AI Task Prioritizer (urgency ranking and effort scheduling)
  - AI Invoice Reminder (customized reminder drafts based on overdue aging)
  - AI Business Advisor (profitability analysis, hourly rate yield, pricing recommendations)
  - AI Meeting Notes Summarizer (action items extraction, decision log, follow-up email draft)
  - AI Copilot Persistent Chat (conversational business intelligence assistant)

---

## 📁 Monorepo Structure

```
/freelance-os
├── /client                  # React + Vite + TypeScript Frontend
│   ├── /src
│   │   ├── /components      # UI Components (Buttons, Modals, Cards, Badges, Tables)
│   │   │   ├── /common      # Sidebar, Header, CommandPalette (Cmd+K), FloatingCopilot
│   │   │   └── /ui          # Button, Input, Select, Badge, Card, Modal, EmptyState, Skeleton
│   │   ├── /context         # AuthContext, ThemeContext, TimerContext, NotificationContext
│   │   ├── /layouts         # AppLayout (Protected), AuthLayout
│   │   ├── /lib             # Axios api instance, formatters, cn helper
│   │   ├── /pages           # Dashboard, Clients, Projects, Tasks, Proposals, Invoices, Time, Analytics, Copilot, Settings, Auth
│   │   ├── App.tsx          # Router configuration
│   │   ├── main.tsx
│   │   └── index.css        # Tailwind tokens & dark/light theme variables
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── /server                  # Node.js + Express + TypeScript Backend
│   ├── /src
│   │   ├── /ai              # OpenAI integration, prompt templates, mock fallback reasoning engine
│   │   ├── /config          # MongoDB connection, env config
│   │   ├── /controllers     # Auth, Client, Project, Task, Proposal, Invoice, Time, Analytics, Notification, AI
│   │   ├── /middleware      # authMiddleware, validateMiddleware, errorHandler, rateLimiter
│   │   ├── /models          # User, Client, Project, Task, Proposal, Invoice, TimeEntry, Notification, Activity, AIConversation
│   │   ├── /routes          # Express subrouters & global search endpoint
│   │   ├── /services        # Core business logic layer
│   │   ├── /utils           # JWT helper, Activity logger, Seed script
│   │   ├── /validators      # Zod validation schemas
│   │   ├── app.ts           # Express app setup, CORS, Helmet, rate limiting
│   │   └── server.ts        # Server entry point
│   ├── /tests               # Jest + Supertest integration test suite
│   ├── tsconfig.json
│   └── package.json
│
├── /shared                  # Shared TypeScript interfaces, DTOs & schemas
│   ├── /src
│   │   └── index.ts
│   └── tsconfig.json
│
├── .env.example
├── package.json             # Root monorepo scripts
└── README.md
```

---

## 🔑 Environment Variables

Create `.env` inside `server/` (or copy from `.env.example`):

| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Server listening port | `5000` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/freelance_os` |
| `JWT_SECRET` | Secret key for signing JWTs | `super_secret_jwt_key_here` |
| `JWT_EXPIRES_IN`| JWT token expiration | `7d` |
| `OPENAI_API_KEY`| OpenAI API key for Copilot | `sk-...` *(Optional - fallback engine activates if empty)* |
| `OPENAI_MODEL` | OpenAI Model | `gpt-4o-mini` |

---

## 🗄️ Database Schema Overview

1. **`User`**: Account identity, hashed passwords, hourly rate, currency, business entity details, invoice terms.
2. **`Client`**: Contact details, company, email, phone, tags, lifetime revenue, last interaction timestamp.
3. **`Project`**: Client reference, budget, estimated/actual hours, milestones, documents, priority, and status.
4. **`Task`**: Project association, sprint status (`todo`, `in_progress`, `review`, `done`), priority, due dates, subtasks checklist.
5. **`Proposal`**: Line item services, deliverables, timeline, pricing explanation, terms, AI generation flag, status.
6. **`Invoice`**: Client/project links, dynamic items, tax rate, discount, subtotal, total, overdue detection, paidAt.
7. **`TimeEntry`**: Project/task link, start/end timestamps, elapsed duration, billable flag, hourly rate.
8. **`Notification`**: In-app alerts for overdue invoices, approaching deadlines, and accepted proposals.
9. **`Activity`**: Audit trail of actions across the OS.
10. **`AIConversation`**: Saved multi-turn conversation history for Freelance Copilot.

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new freelancer account
- `POST /api/auth/login` - Authenticate and receive JWT token
- `GET /api/auth/profile` - Get logged-in user profile
- `PUT /api/auth/profile` - Update settings & business entity
- `POST /api/auth/forgot-password` - Request password reset token
- `POST /api/auth/reset-password` - Reset password with token

### Clients (`/api/clients`)
- `GET /api/clients` - List clients with search, status, and tag filters
- `GET /api/clients/:id` - Get client detail with aggregated projects, invoices, and activity
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects (`/api/projects`)
- `GET /api/projects` - List projects with filters
- `GET /api/projects/:id` - Get project detail with tasks, time logs, and milestones
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks (`/api/tasks`)
- `GET /api/tasks` - List tasks for Kanban and List views
- `POST /api/tasks` - Create task with subtasks
- `POST /api/tasks/reorder` - Bulk update status and order
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Proposals (`/api/proposals`)
- `GET /api/proposals` - List proposals
- `GET /api/proposals/:id` - Get proposal details for editor/preview
- `POST /api/proposals` - Create proposal
- `PUT /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal

### Invoices (`/api/invoices`)
- `GET /api/invoices` - List invoices with overdue detection
- `GET /api/invoices/:id` - Get invoice detail
- `POST /api/invoices` - Create invoice with calculated taxes and discounts
- `PUT /api/invoices/:id` - Update invoice / mark as paid
- `DELETE /api/invoices/:id` - Delete invoice

### Time Tracking (`/api/time`)
- `GET /api/time` - List time entries
- `GET /api/time/active` - Get currently running active stopwatch
- `POST /api/time/start` - Start active timer session
- `POST /api/time/stop` - Stop timer and log duration
- `POST /api/time/manual` - Log manual time entry
- `DELETE /api/time/:id` - Delete time entry

### Analytics (`/api/analytics`)
- `GET /api/analytics/dashboard` - Main KPI metrics, monthly trends, and deadlines
- `GET /api/analytics/financial-report` - Comprehensive cash flow, billable yield, and invoice list

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark single notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read

### AI Freelance Copilot (`/api/ai`)
- `POST /api/ai/proposal` - Generate executive client proposal
- `POST /api/ai/message` - Draft client email with tone selection
- `POST /api/ai/project-planner` - Decompose brief into phases, milestones, and tasks
- `POST /api/ai/prioritize-tasks` - Rank sprint backlog by urgency score and effort
- `POST /api/ai/invoice-reminder` - Generate tailored payment reminder
- `POST /api/ai/summarize-meeting` - Extract action items and draft follow-up email
- `GET /api/ai/business-advisor` - Real-time business health score & pricing advice
- `POST /api/ai/chat` - Context-aware multi-turn Copilot chat

### Global Search (`/api/search?q=...`)
- Searches across Clients, Projects, Tasks, Invoices, and Proposals (`Cmd+K`).

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+ (Node v20+ recommended)
- MongoDB running locally on port 27017 (or MongoDB Atlas connection string)

### 1. Install all dependencies
```bash
npm run install:all
# or
npm install
```

### 2. Seed realistic demo data
```bash
npm run seed
```
Demo Credentials:
- **Email**: `alex@freelanceos.dev`
- **Password**: `password123`

### 3. Run full-stack dev servers concurrently
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## 🧪 Testing

Run backend test suite:
```bash
npm run test
```

Build verification (TypeScript & bundling):
```bash
npm run build
```

---

## 🚢 Production Deployment

1. **Build Client & Server**:
   ```bash
   npm run build
   ```
2. **Server**: Deploy `/server` to Node.js hosting (e.g. Render, Railway, AWS ECS, Heroku). Set environment variables in hosting portal.
3. **Client**: Deploy `/client/dist` to Vercel, Netlify, or Cloudflare Pages.
4. **Database**: Use MongoDB Atlas with connection string in `MONGODB_URI`.
