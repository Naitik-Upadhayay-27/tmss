# FatakPay TMS — Frontend

React + TypeScript SPA for the FatakPay Ticket Management System.

## Stack

- React 19 · TypeScript · Vite 8
- Tailwind CSS (no component libraries)
- React Query (server state) · Zustand (global state)
- React Router v6 · React Hook Form + Zod
- Axios · Lucide React icons · Recharts

## Quick Start (Local Dev)

```bash
# 1. Clone and enter
git clone <repo-url>
cd fatakpay-tms-frontend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL

# 4. Start dev server
npm run dev
```

App available at: `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to `VITE_API_URL` automatically — no CORS issues in dev.

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | ✅ | `http://127.0.0.1:8000` | Backend API base URL (no trailing slash) |

See `.env.example` for the full template.

## Scripts

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

## Docker

```bash
# Build and run (serves on port 3000)
docker compose up --build

# Pass a custom backend URL at build time
docker compose up --build -e VITE_API_URL=https://api.yourdomain.com
```

## Deployment (Vercel)

1. Import this repo on Vercel
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable `VITE_API_URL` = your Render backend URL
6. Deploy

`vercel.json` handles SPA routing rewrites automatically.

## Role-Based Routing

| Role | Landing Page |
|---|---|
| `SUPER_ADMIN` | `/dashboard` |
| `DEPT_HEAD` | `/head/dashboard` |
| `MEMBER` | `/member/dashboard` |
| `CALLER` | `/agent/dashboard` |

## Project Structure

```
src/
├── api/              # Axios API functions (one file per resource)
│   ├── client.ts     # Axios instance with JWT interceptors
│   ├── tickets.api.ts
│   ├── users.api.ts
│   └── ...
├── design-system/    # Shared UI primitives (Button, Modal, Badge, etc.)
├── features/         # Page-level components grouped by feature
│   ├── auth/         # Login, RoleGuard, useAuthStore
│   ├── dashboard/    # Super admin dashboard
│   ├── depthead/     # HOD ticket list + bulk assign
│   ├── member/       # Member ticket list
│   ├── agent/        # Caller ticket list + create
│   ├── tickets/      # Ticket detail, create modal, filters, timeline
│   ├── departments/  # Department management + detail
│   └── users/        # User management
├── hooks/            # React Query hooks (useTickets, useUsers, etc.)
├── layout/           # AppShell, Sidebar, PageHeader
├── types/            # TypeScript interfaces (Ticket, User, etc.)
├── utils/            # formatRelative, formatDateTime, etc.
├── App.tsx           # Router + QueryClient + Toaster
└── main.tsx
```

## API Contract

All API calls go through `src/api/client.ts` which:
- Sets `Authorization: Bearer <token>` on every request
- Auto-refreshes the access token on 401
- Reads base URL from `VITE_API_URL`

Backend must be running at `VITE_API_URL` with CORS allowing this origin.
