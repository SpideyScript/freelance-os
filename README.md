<div align="center">

# 🧾 Freelance Business OS

### Your entire freelance business, unified in one dashboard.

**Stop juggling Excel, WhatsApp, Notes, and Drive. Start running your business like a business.**

<br/>

![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/freelance-business-os/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=Build)
![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)
![Stars](https://img.shields.io/github/stars/yourusername/freelance-business-os?style=for-the-badge&logo=github&color=gold)
![Issues](https://img.shields.io/github/issues/yourusername/freelance-business-os?style=for-the-badge&logo=github)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white)

<br/>

<img src="https://via.placeholder.com/1200x630/0f172a/ffffff?text=Freelance+Business+OS+%E2%80%94+Dashboard+Preview" alt="Freelance Business OS Banner" width="100%"/>

<sub>👆 Replace with an actual product screenshot or GIF walkthrough (e.g. `/docs/assets/dashboard-preview.gif`)</sub>

</div>

<br/>

## 📚 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Tech Stack](#️-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Key Libraries & Dependencies](#-key-libraries--dependencies)
- [Project Structure](#-project-structure)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support--contact)

---

## 😩 The Problem

Freelancers don't fail because of bad work — they fail because of **operational chaos**. A typical freelancer's "business system" looks like this:

| Task | Tool | Result |
|---|---|---|
| Tracking clients | 📝 Apple Notes / random Google Doc | Forgotten follow-ups |
| Sending quotes | 📄 Word doc emailed manually | Inconsistent, unprofessional |
| Invoicing | 📊 Excel + copy-pasted templates | Errors, delays |
| Payment tracking | 💬 WhatsApp "did you pay?" messages | Missed/late payments |
| Contracts | ☁️ Buried in Google Drive folders | Lost context, no audit trail |
| Client comms | ✍️ Written from scratch every time | Wasted hours, weak pitches |

The result: **lost context, fragmented records, and missed payments** — the three silent killers of freelance income.

## ✅ The Solution

**Freelance Business OS** replaces that patchwork with a single, purpose-built dashboard that handles your business end-to-end — from first contact to final payment.

<div align="center">

| 🧩 Before: Scattered Chaos | 🚀 After: Freelance Business OS |
|:---|:---|
| Client info spread across Notes, WhatsApp, email | Centralized CRM with full interaction history |
| Quotes built manually in Word/Docs | Branded proposals generated in minutes |
| Invoices tracked in spreadsheets | One-click invoicing, auto-numbered & synced |
| Manually chasing unpaid invoices | Real-time payment status + automated reminders |
| Contracts lost in Drive folders | Encrypted, searchable document vault |
| Writing pitches/emails from scratch | AI drafts client-ready copy in seconds |
| 5+ disconnected tools | 1 unified operating system |

</div>

---

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,express,postgres,prisma,stripe,docker,vercel,githubactions" alt="Tech Stack Icons"/>

</div>

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling / UI** | Tailwind CSS, shadcn/ui, Radix Primitives |
| **Backend** | Node.js, Express (API layer / webhooks) |
| **Database** | PostgreSQL + Prisma ORM |
| **Auth** | NextAuth.js (email, OAuth, magic link) |
| **Payments** | Stripe SDK (invoicing, subscriptions, payouts) |
| **AI** | OpenAI API (pitch/email generation) |
| **File Storage** | AWS S3 / Cloudflare R2 (contract vault) |
| **PDF Generation** | React-PDF / Puppeteer |
| **Deployment** | Vercel (frontend) + Railway/Render (API & DB) |

---

## ✨ Features

### 1. 👥 Client CRM & Contact Management
- Centralized client profiles with contact details, notes, and tags
- Full interaction timeline — emails, calls, meetings, and deal stage
- Custom pipelines (Lead → Proposal Sent → Active → Closed)
- Quick search and filtering across your entire client base

### 2. 📄 Proposal & Quote Generation
- Branded, reusable proposal templates
- Line-item pricing with tax, discounts, and currency support
- Client-facing e-signature and online approval
- Convert an accepted quote into an invoice in one click

### 3. 💳 One-Click Invoicing & Billing
- Auto-numbered, tax-compliant invoices generated instantly
- Recurring/retainer billing support
- Multi-currency and multi-language invoice templates
- Downloadable PDF + shareable payment link

### 4. ⏱️ Real-time Payment Tracking & Overdue Reminders
- Live dashboard of paid, pending, and overdue invoices
- Automated email/SMS reminders on a configurable schedule
- Stripe-powered payment status webhooks (instant sync)
- Revenue analytics — MRR, outstanding balance, aging reports

### 5. 🔐 Contract Storage & Document Vault
- Encrypted storage for contracts, NDAs, and signed agreements
- Version history and audit trail per document
- Link documents directly to clients and projects
- Expiry/renewal reminders for time-bound contracts

### 6. 🤖 AI-Powered Email & Pitch Writing Assistant
- Generate cold outreach pitches from a project brief
- Draft polished follow-up and reminder emails instantly
- Tone controls (formal, friendly, concise) powered by OpenAI
- Context-aware suggestions using client history from your CRM

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | `v18.17+` (LTS recommended) | [Download](https://nodejs.org) |
| **Package Manager** | `pnpm ≥ 8` (recommended) / `npm ≥ 9` / `yarn ≥ 1.22` | `pnpm` used in examples below |
| **PostgreSQL** | `v14+` | Local install or hosted (Supabase, Neon, Railway) |
| **Git** | Latest | For cloning the repo |
| **Docker** *(optional)* | Latest | For containerized local DB setup |

You'll also need API keys for the following third-party services:

- 🔑 **OpenAI API Key** — [platform.openai.com](https://platform.openai.com/api-keys) (for the AI writing assistant)
- 🔑 **Stripe API Keys** — [dashboard.stripe.com](https://dashboard.stripe.com/apikeys) (for invoicing & payments)
- 🔑 **SMTP / Email Provider** — Resend, SendGrid, or Postmark (for reminders & notifications)
- 🔑 **S3-compatible storage keys** — AWS S3 or Cloudflare R2 (for the document vault)

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/freelance-business-os.git
cd freelance-business-os
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
# or
yarn install
```

### 3. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

<details>
<summary><strong>📄 View <code>.env.example</code></strong></summary>

```env
# ── App ────────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/freelance_os"

# ── Auth (NextAuth.js) ─────────────────────────────────
NEXTAUTH_SECRET=your-random-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# ── Stripe ─────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx

# ── OpenAI (AI Writing Assistant) ──────────────────────
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini

# ── Email / Notifications ──────────────────────────────
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM="Freelance Business OS <noreply@yourdomain.com>"

# ── File Storage (Contract Vault) ──────────────────────
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=freelance-os-documents
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_REGION=us-east-1
```

</details>

### 4. Run database migrations & seed data

```bash
pnpm prisma migrate dev
pnpm prisma db seed
```

### 5. Launch the development server

```bash
pnpm dev
```

Your app will be running at **`http://localhost:3000`** 🎉

### 6. Build for production

```bash
pnpm build
pnpm start
```

---

## 📦 Key Libraries & Dependencies

| Library | Purpose |
|---|---|
| **`next`** | React framework — routing, SSR, API routes |
| **`prisma`** / **`@prisma/client`** | Type-safe ORM for PostgreSQL |
| **`next-auth`** | Authentication (OAuth, credentials, magic links) |
| **`stripe`** | Payment processing, invoicing, webhook handling |
| **`openai`** | AI SDK powering the pitch/email writing assistant |
| **`@react-pdf/renderer`** | Generates invoice & proposal PDFs |
| **`react-hook-form`** + **`zod`** | Form state management & schema validation |
| **`@radix-ui/*`** / **`shadcn/ui`** | Accessible, unstyled UI primitives |
| **`tailwindcss`** | Utility-first styling |
| **`tanstack/react-query`** | Server-state fetching & caching |
| **`resend`** | Transactional email delivery (reminders, receipts) |
| **`date-fns`** | Date manipulation for billing cycles & reminders |
| **`recharts`** | Revenue & payment analytics charts |

---

## 🗂️ Project Structure

<details>
<summary><strong>Click to expand folder structure</strong></summary>

```
freelance-business-os/
├── src/
│   ├── app/                  # Next.js App Router pages & layouts
│   │   ├── (dashboard)/      # Authenticated dashboard routes
│   │   ├── (auth)/           # Login / signup routes
│   │   └── api/              # API routes (webhooks, AI, invoices)
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities, Stripe/OpenAI clients
│   ├── server/                # Business logic & service layer
│   └── styles/                # Global styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Migration history
│   └── seed.ts                 # Seed script
├── public/                    # Static assets
├── .env.example
├── package.json
└── README.md
```

</details>

---

## 🗺️ Roadmap

- [x] Client CRM & pipeline management
- [x] Proposal & quote generation
- [x] Stripe-powered invoicing
- [x] AI writing assistant (v1)
- [ ] 📱 Mobile app (React Native)
- [ ] 🔄 Recurring retainer automation
- [ ] 📊 Advanced analytics & tax reports
- [ ] 🌍 Multi-language client portal
- [ ] 🔗 Zapier / Make.com integrations
- [ ] 🧠 AI-powered project scoping estimator

Have an idea? [Open a feature request →](https://github.com/yourusername/freelance-business-os/issues/new?labels=enhancement)

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add: amazing feature"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request** and describe your changes

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for our code style guide, commit conventions, and PR review process before submitting.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

```
MIT License © 2025 Freelance Business OS Contributors
```

---

## 💬 Support & Contact

<div align="center">

Found a bug or have a feature request? [Open an issue](https://github.com/yourusername/freelance-business-os/issues)

Have questions? Reach out via [Discussions](https://github.com/yourusername/freelance-business-os/discussions) or email **support@freelancebusinessos.dev**

⭐ **If this project helps you run your freelance business better, consider giving it a star!** ⭐

</div>