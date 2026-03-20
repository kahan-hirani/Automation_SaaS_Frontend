<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&height=230&color=0:0ea5e9,45:06b6d4,100:14b8a6&text=Automation%20SaaS&fontColor=ffffff&fontSize=56&fontAlignY=36&animation=fadeIn&desc=Frontend%20Control%20Center&descAlignY=58&descSize=18" alt="Automation SaaS banner" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&weight=700&size=22&pause=1200&color=06B6D4&center=true&vCenter=true&width=840&lines=Design+and+run+automations+from+a+single+dashboard;Track+uptime%2C+prices%2C+and+job+boards+in+real+time;Built+with+React+19+%2B+Vite+%2B+Tailwind+CSS" alt="Typing effect" />
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" /></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" /></a>
  <a href="https://automation-saas-one.vercel.app/"><img src="https://img.shields.io/badge/Live-Vercel-black?logo=vercel" alt="Live" /></a>
</p>

## Live App

https://automation-saas-one.vercel.app/

## Overview

Automation SaaS frontend is a modern React application for creating, managing, and monitoring scheduled automations without writing code.

Core capabilities:
- Secure authentication experience with protected routes
- Automation dashboard with create, edit, toggle, and delete actions
- Automation detail pages with scoped logs and execution history
- Real-time metrics with periodic refresh
- Responsive UI with smooth transitions and reusable component primitives

## Frontend Stack

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS
- Framer Motion
- Radix UI
- Lucide React

## Project Layout

```text
client/
├─ public/
├─ src/
│  ├─ components/
│  │  ├─ ui/
│  │  ├─ AutomationCard.jsx
│  │  ├─ ConfirmActionModal.jsx
│  │  ├─ CreateAutomationModal.jsx
│  │  ├─ Footer.jsx
│  │  ├─ Navbar.jsx
│  │  └─ ToastStack.jsx
│  ├─ context/
│  │  └─ AuthContext.jsx
│  ├─ lib/
│  │  └─ utils.js
│  ├─ pages/
│  │  ├─ AutomationDetail.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Features.jsx
│  │  ├─ Login.jsx
│  │  ├─ Logs.jsx
│  │  ├─ Metrics.jsx
│  │  ├─ Profile.jsx
│  │  └─ Register.jsx
│  ├─ services/
│  │  └─ api.js
│  ├─ App.jsx
│  ├─ App.css
│  ├─ index.css
│  └─ main.jsx
└─ package.json
```

## Environment Variables

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

For production, set `VITE_API_URL` to your deployed backend URL.

## Local Development

Prerequisites:
- Node.js 20+
- Running backend API from `server/`

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Build and Deploy

```bash
npm run build
npm run preview
```

For Vercel deployment:
1. Set project root to `client`
2. Add `VITE_API_URL` in environment variables
3. Deploy from your repository

## API Integration Notes

- Axios client is configured in `src/services/api.js`
- JWT token is sent through `Authorization: Bearer <token>`
- Protected routes rely on the backend auth middleware and profile endpoint

## Security Notes

- Do not commit `.env` files
- Keep API URL environment-specific
- Use HTTPS backend endpoints in production

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&height=90&color=0:0f172a,100:134e4a&section=footer&text=Build%20Automations.%20Track%20Everything.&fontColor=ffffff&fontSize=22" alt="Footer banner" />
</p>
