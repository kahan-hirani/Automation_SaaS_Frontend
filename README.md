# Automation SaaS Client

Production-oriented frontend for the Automation SaaS platform.

This application provides:
- Authentication (register, login, profile)
- Automation management (create, edit, activate/pause, delete)
- Automation detail pages with per-automation logs
- Global logs with type-specific filters (uptime, price, jobs)
- User-friendly metrics dashboard
- Product/features presentation pages

The client is built with React + Vite and communicates with the backend API at `http://localhost:3000/api/v1` by default.

## Table of contents

1. Overview
2. Tech stack
3. Project structure
4. Routing and page responsibilities
5. Frontend architecture and data flow
6. API integration contract
7. Local development setup
8. Build and deployment
9. Testing and quality workflow (A to Z)
10. Troubleshooting
11. Security and production notes

## 1) Overview

The client is a protected dashboard-style SPA where users can:
- Sign up and sign in
- Create automations of 3 types:
	- `WEBSITE_UPTIME`
	- `PRICE_MONITOR`
	- `JOB_MONITOR`
- View automation cards and open each automation detail page
- Edit automation configuration and schedule
- Review logs globally and per automation
- See simplified performance metrics

## 2) Tech stack

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS + PostCSS
- Framer Motion (UI transitions)
- Lucide React icons
- Radix UI primitives (dialogs)

## 3) Project structure

```text
client/
	public/
	src/
		components/
			ui/
			AutomationCard.jsx
			CreateAutomationModal.jsx
			ConfirmActionModal.jsx
			Navbar.jsx
			Footer.jsx
			ToastStack.jsx
		context/
			AuthContext.jsx
		lib/
			utils.js
		pages/
			Dashboard.jsx
			AutomationDetail.jsx
			Logs.jsx
			Metrics.jsx
			Features.jsx
			Login.jsx
			Register.jsx
			Profile.jsx
		services/
			api.js
		App.jsx
		main.jsx
```

## 4) Routing and page responsibilities

Routes are declared in `src/App.jsx`.

- Public routes:
	- `/login`
	- `/register`
- Protected routes:
	- `/` dashboard
	- `/automations/:id` automation detail + edit + scoped logs
	- `/logs` global logs
	- `/metrics` simplified metrics
	- `/features` product and capability summary
	- `/profile` account details

Route guards:
- `ProtectedRoute`: redirects unauthenticated users to `/login`
- `PublicRoute`: redirects authenticated users to `/`

## 5) Frontend architecture and data flow

### Authentication flow

`AuthContext` in `src/context/AuthContext.jsx` manages:
- `user`
- `loading`
- `token` (from `localStorage`)
- `login`, `register`, `logout`, `refreshProfile`

On app load:
1. Token is read from `localStorage`
2. Profile is fetched using `/auth/users/profile`
3. If token is invalid, user is logged out

### API flow

`src/services/api.js` creates a shared Axios instance:
- Base URL: `http://localhost:3000/api/v1`
- `Authorization: Bearer <token>` header added automatically when token exists

### UI interaction flow examples

Dashboard card click:
1. User clicks an automation card on dashboard
2. App navigates to `/automations/:id`
3. Detail page loads automation + logs for that specific automation
4. User can edit via modal (same modal component used for create/edit)

Logs filtering:
1. User opens global logs page
2. User selects one type (`Uptime`, `Price`, `Jobs`)
3. Table updates with fields specific to that type

Metrics page:
1. Metrics fetched from `/metrics`
2. Client displays only user-focused values:
	 - total runs
	 - success rate
	 - average run time
	 - pending tasks
	 - running now
3. Auto refresh every 30s

## 6) API integration contract

Client currently consumes these endpoint groups:

- Auth:
	- `POST /auth/users/register`
	- `POST /auth/users/login`
	- `GET /auth/users/profile`
	- `PUT /auth/users/profile`
	- `DELETE /auth/users/profile`
- Automations:
	- `GET /automations`
	- `GET /automations/:id`
	- `POST /automations/create-automation`
	- `PUT /automations/:id`
	- `PATCH /automations/:id/toggle`
	- `DELETE /automations/:id`
- Logs:
	- `GET /logs?limit=...`
	- `GET /logs/:automationId?limit=...`
	- `GET /logs/stats`
- Metrics:
	- `GET /metrics`

## 7) Local development setup

Prerequisites:
- Node.js 20+
- Backend server running at `http://localhost:3000`

Install dependencies:

```bash
cd client
npm install
```

Start development server:

```bash
npm run dev
```

Default local URL:
- `http://localhost:5173`

## 8) Build and deployment

Build production bundle:

```bash
cd client
npm run build
```

Preview production build locally:

```bash
npm run preview
```

Important deployment note:
- API base URL is currently hardcoded in `src/services/api.js`.
- For production, move this to environment-based configuration (for example via Vite env variables).

## 9) Testing and quality workflow (A to Z)

This client currently has no unit test framework wired yet, so production readiness uses a layered approach:

### A. Static quality checks

Lint:

```bash
cd client
npm run lint
```

### B. Compile-time safety

Build verification:

```bash
cd client
npm run build
```

### C. End-to-end manual functional checks

Recommended checklist before release:

1. Auth
	 - Register new user
	 - Login/logout
	 - Protected route redirect
2. Automation CRUD
	 - Create each automation type
	 - Edit automation from detail page
	 - Toggle active/inactive
	 - Delete automation
3. Logs
	 - Global logs page renders
	 - Type filters (`Uptime`, `Price`, `Jobs`) work
	 - Detail page shows only selected automation logs
4. Metrics
	 - User-friendly cards render
	 - Auto-refresh updates values
5. Responsive UI
	 - Dashboard, detail, logs, metrics, features on mobile + desktop

### D. Suggested future hardening

For full CI-grade frontend testing, add:
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright/Cypress
- Accessibility checks (axe)

## 10) Troubleshooting

### Blank or failed data loads
- Verify backend is running on port `3000`
- Check browser network tab for `401/500` errors
- Confirm token exists in `localStorage`

### CORS errors
- Ensure backend CORS allowlist includes frontend origin (`5173/5174`)

### Build succeeds but API fails in production
- Confirm API URL is environment-configured for deployed backend

### Login loop or unexpected redirect to login
- Token may be expired or invalid; logout and login again

## 11) Security and production notes

- Never commit secrets/tokens
- Use HTTPS in production
- Use secure cookie/token handling policy aligned with backend auth strategy
- Keep dependency versions updated
- Run lint + build as required CI gates before release

## Scripts quick reference

```bash
npm run dev      # Start Vite dev server
npm run build    # Build production bundle
npm run preview  # Preview built app
npm run lint     # Lint source code
```
