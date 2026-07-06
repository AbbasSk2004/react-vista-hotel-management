# Vista Hotel Management — Frontend

A modern React dashboard for running day-to-day hotel operations: room inventory, reservations, guest check-in/check-out, billing, and admin reporting. Built as the client for the [Vista Hotel Backend API](https://github.com/AbbasSk2004/vista-hotel-backend).

---

## Overview

This is a single-page application (SPA) that gives hotel staff a clean, role-aware interface to manage the property. Receptionists handle bookings and front-desk workflows; administrators get full visibility into occupancy, revenue, and staff accounts.

The UI is intentionally practical — fast tables, clear status badges, and focused forms — so front-desk staff can work through reservations without friction.

---

## Features

| Area | What you can do |
|------|-----------------|
| **Dashboard** | Occupancy snapshot, today's check-ins, revenue chart (admin) |
| **Rooms** | Browse, filter, and manage room inventory (admin can create/edit/delete) |
| **Reservations** | View bookings, create new reservations, track status |
| **Check-in / Check-out** | Process arrivals and departures with invoice generation on checkout |
| **Guests** | Search and register guest profiles |
| **Reports** | Monthly revenue, occupancy rate, room status breakdown (admin only) |
| **Staff Management** | Create, update, and remove staff accounts (admin only) |

### Role-based access

- **ADMIN** — Full access including reports and staff management
- **RECEPTIONIST** — Operational pages: rooms, reservations, guests, check-in/out

Protected routes redirect unauthenticated users to the login page. JWT tokens are stored in `localStorage` and attached to every API request automatically.

---

## Tech Stack

- **React 18** — UI components and state
- **Vite 5** — Dev server and production bundling
- **React Router v6** — Client-side routing
- **Tailwind CSS 3** — Utility-first styling with a custom hotel color palette
- **Axios** — HTTP client with auth interceptors
- **Recharts** — Revenue and occupancy charts on the admin dashboard
- **React Hot Toast** — Lightweight notifications

---

## Prerequisites

- **Node.js 18+** and npm
- A running instance of the [backend API](https://github.com/AbbasSk2004/vista-hotel-backend) (default: `http://localhost:5000`)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AbbasSk2004/react-vista-hotel-management.git
cd react-vista-hotel-management
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment (optional)

During local development, Vite proxies `/api` requests to the backend — so you usually don't need a `.env` file.

If you're pointing at a remote API or a non-default port, create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

Make sure the backend is running first; otherwise login and data pages will fail to load.

---

## Demo Accounts

These accounts work once the backend database is seeded (see the backend README):

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@hotel.com` | `admin123` |
| Receptionist | `reception@hotel.com` | `recept123` |

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Project Structure

```
src/
├── api/
│   └── api.js              # Axios instance + API modules
├── components/
│   ├── Layout.jsx          # App shell with sidebar and navbar
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx  # Auth guard
│   ├── AdminRoute.jsx      # Admin-only guard
│   ├── DataTable.jsx
│   ├── Modal.jsx
│   ├── RoomCard.jsx
│   ├── StatCard.jsx
│   └── ...
├── context/
│   └── AuthContext.jsx     # Login state, JWT, role helpers
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Rooms.jsx
│   ├── Reservations.jsx
│   ├── NewReservation.jsx
│   ├── CheckIn.jsx
│   ├── CheckOut.jsx
│   ├── Guests.jsx
│   ├── Reports.jsx
│   └── StaffManagement.jsx
├── utils/
│   └── helpers.js
├── App.jsx                 # Route definitions
├── main.jsx
└── index.css
```

---

## API Integration

All requests go through `src/api/api.js`. The Axios instance:

- Sends `Authorization: Bearer <token>` on every request when logged in
- Redirects to `/login` on 401 responses
- Uses `VITE_API_URL` in production, or `/api` (proxied) in development

**Development proxy** (configured in `vite.config.js`):

```
/api  →  http://localhost:5000
```

---

## Production Build

```bash
npm run build
```

The output lands in `dist/`. Serve it with any static file host (Nginx, Vercel, Netlify, etc.).

Set `VITE_API_URL` to your deployed backend URL before building:

```env
VITE_API_URL=https://your-api.example.com/api
```

---

## Related Repository

| Repo | Purpose |
|------|---------|
| [vista-hotel-backend](https://github.com/AbbasSk2004/vista-hotel-backend) | REST API, MongoDB, JWT auth |

---

## License

This project was built as part of a university software engineering course. Feel free to use it for learning and reference.
