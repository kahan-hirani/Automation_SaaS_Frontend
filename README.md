# 🤖 Automation SaaS

> **Live Demo:** [https://automation-saas-one.vercel.app/](https://automation-saas-one.vercel.app/)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://automation-saas-one.vercel.app/)

---

## What is Automation SaaS?

**Automation SaaS** is a full-stack, production-deployed web platform that lets users create and schedule intelligent automation tasks — without writing a single line of code. Think of it as your personal automation engine that runs on a schedule and keeps you informed via email.

Users can monitor websites, track prices, and watch job boards — all from one sleek dashboard.

---

## ✨ Features

| Feature                     | Description                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 🔐 **Authentication**       | Secure register/login with JWT. Protected routes for authenticated users only.                               |
| 📋 **Automation Dashboard** | View all automations in a beautiful card layout with status badges and controls.                             |
| ➕ **Create Automations**   | Create 3 types of automations with a guided modal — URL, schedule, config.                                   |
| ✏️ **Edit & Manage**        | Edit name, schedule, and config. Toggle active/inactive or delete automations.                               |
| 📊 **Live Metrics**         | Real-time execution metrics — success rate, average run time, queue status. Auto-refreshes every 30 seconds. |
| 📜 **Execution Logs**       | View all automation execution history. Filter by type (Uptime / Price / Jobs).                               |
| 👤 **Profile Management**   | Update account details and manage your session.                                                              |
| 📬 **Email Alerts**         | Get notified by email on price drops, site outages, and new job listings.                                    |

---

## 🎯 Use Cases

### 1. 🌐 Website Uptime Monitoring

Never be the last to know your site is down.

- Configure a URL and a schedule (e.g., every 5 minutes)
- The system visits the site via a headless browser (Puppeteer)
- Measures HTTP status, response time, and page content
- Classifies health as **Healthy**, **Degraded**, or **Unhealthy**
- Sends an email alert with full diagnostics

**Who uses it:** Developers, freelancers, small business owners monitoring client sites.

---

### 2. 💰 Price Monitor

Get notified the moment a product hits your target price.

- Provide a product page URL + CSS selector that points to the price element
- Set your target price threshold
- The system scrapes the price on your schedule (e.g., every 30 minutes)
- Sends a **Price Drop Alert** email when the current price ≤ your target
- Also notifies you if the price changes significantly above your target

**Who uses it:** Shoppers, deal hunters, e-commerce analysts.

---

### 3. 📰 Job Monitor

Never miss a new job posting on your target careers page.

- Provide a careers page URL + CSS selector for job listing elements
- Optionally filter by keyword (e.g., "React", "Remote")
- The system tracks listing count and titles across runs
- Sends an alert listing all **new job titles** when new postings appear

**Who uses it:** Job seekers, recruiters, talent acquisition teams.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Vercel)                      │
│  React 19 + Vite + TailwindCSS + Framer Motion             │
│  https://automation-saas-one.vercel.app                     │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS + JWT (Authorization header)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Render)                      │
│  Express 5 + Sequelize ORM + Node-cron + BullMQ            │
│  Docker-based deployment on Render Web Service             │
└──────────┬───────────────────────────┬──────────────────────┘
           │                           │
           ▼                           ▼
┌──────────────────┐       ┌──────────────────────┐
│  Supabase        │       │  Upstash Redis       │
│  PostgreSQL      │       │  (BullMQ Queue +     │
│  (Users,         │       │   Caching layer)     │
│  Automations,    │       └──────────────────────┘
│  Logs)           │                  │
└──────────────────┘                  ▼
                          ┌──────────────────────┐
                          │  BullMQ Worker       │
                          │  (Runs inside API    │
                          │   or as separate     │
                          │   Background Worker) │
                          │                      │
                          │  Handlers:           │
                          │  - Puppeteer Uptime  │
                          │  - Price Scraper     │
                          │  - Job Board Scraper │
                          └──────────────────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │  Nodemailer (Gmail)  │
                          │  Email Notifications │
                          └──────────────────────┘
```

---

## 🧩 Frontend Tech Stack

| Technology         | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **React 19**       | UI component framework                          |
| **Vite 7**         | Ultra-fast dev server and bundler               |
| **React Router 7** | Client-side routing with protected route guards |
| **Axios**          | HTTP client for API calls with interceptors     |
| **Tailwind CSS**   | Utility-first responsive styling                |
| **Framer Motion**  | Smooth page transitions and micro-animations    |
| **Lucide React**   | Modern, consistent icon set                     |
| **Radix UI**       | Accessible modal/dialog primitives              |

---

## 📁 Project Structure

```
client/
├── public/
└── src/
    ├── components/
    │   ├── ui/                    # Radix-based UI primitives
    │   ├── AutomationCard.jsx     # Card for each automation on dashboard
    │   ├── CreateAutomationModal.jsx  # Create & Edit form modal
    │   ├── ConfirmActionModal.jsx # Delete/action confirmation dialog
    │   ├── Navbar.jsx             # Top navigation bar
    │   ├── Footer.jsx             # Page footer
    │   └── ToastStack.jsx         # Notification toast system
    ├── context/
    │   └── AuthContext.jsx        # Global auth state (JWT, user, login/logout)
    ├── lib/
    │   └── utils.js               # Shared utility functions
    ├── pages/
    │   ├── Dashboard.jsx          # Main automation grid view
    │   ├── AutomationDetail.jsx   # Detail view + scoped logs + edit
    │   ├── Logs.jsx               # Global logs with type filters
    │   ├── Metrics.jsx            # Execution metrics dashboard
    │   ├── Features.jsx           # Product features landing section
    │   ├── Login.jsx              # Login page
    │   ├── Register.jsx           # Registration page
    │   └── Profile.jsx            # Account management
    ├── services/
    │   └── api.js                 # Axios instance with base URL + auth header
    ├── App.jsx                    # Route declarations + route guards
    └── main.jsx                   # App entry point
```

---

## 🔒 Authentication Flow

```
User opens app
    │
    ├─ Token in localStorage?
    │       │
    │       ├─ Yes → GET /auth/users/profile
    │       │           │
    │       │           ├─ Success → Set user in AuthContext → App loads
    │       │           └─ Fail    → Clear token → Redirect to /login
    │       │
    │       └─ No  → Redirect to /login
    │
User logs in → Token saved to localStorage → Profile fetched → Dashboard loads
```

---

## ⚙️ Environment Variables

Create a `.env` file at the root of the `client/` directory:

```env
VITE_API_URL=https://your-render-api-url.onrender.com/api/v1
```

For local development this defaults to `http://localhost:3000/api/v1` if not set.

**On Vercel:** Add `VITE_API_URL` in your project's **Settings → Environment Variables** and trigger a redeployment.

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 20+
- Backend server running (see [backend README](../server/README.md))

### Steps

```bash
cd client
npm install
```

Create environment file:

```bash
cp .env.example .env
# Edit VITE_API_URL to point to your running backend
```

Start the development server:

```bash
npm run dev
```

App runs at: [http://localhost:5173](http://localhost:5173)

---

## 📦 Build & Deployment

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

### Deploy to Vercel

1. Push to GitHub (or connect Vercel to your repo)
2. In the Vercel dashboard, set the **Root Directory** to `client`
3. Add environment variable `VITE_API_URL` pointing to your Render backend
4. Vercel auto-deploys on every push to `main`

The `vercel.json` is already configured to handle SPA routing (all routes redirect to `index.html`).

---

## 📋 Scripts Reference

```bash
npm run dev      # Start Vite dev server (hot reload)
npm run build    # Build production bundle to ./dist
npm run preview  # Locally preview the production build
npm run lint     # Run ESLint across source files
```

---

## 🔐 Security Notes

- JWTs are stored in `localStorage` and attached as `Authorization: Bearer <token>` headers
- All API routes requiring authentication are protected by the backend middleware
- CORS is configured on the backend to allow only the Vercel frontend domain in production
- Never commit your `.env` file — it's in `.gitignore`

---

## 🌐 Live Application

**→ [https://automation-saas-one.vercel.app/](https://automation-saas-one.vercel.app/)**

---

_Built with ❤️ using React, Vite, and TailwindCSS. Powered by a Node.js + PostgreSQL + Redis backend._
