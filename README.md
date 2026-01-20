# Help Desk Ticketing App

A React + TypeScript web application for managing help desk tickets with user and admin roles. Data is stored locally using json-server.

## Features
- User authentication (register/login) with role-based access (user/admin)
- Ticket creation, viewing, updating, and deletion
- Ticket status management (open, in progress, closed)
- Categories CRUD and category assignment to tickets
- Admin dashboard with ticket list and filters
- Admin user management (view users and their tickets)

## Tech Stack
- React + TypeScript
- Vite
- react-router-dom for client-side routing
- json-server for local API

## Project Structure
- `src/pages` - page-level views
- `src/components` - reusable UI components
- `src/api` - API request helpers
- `src/types` - shared TypeScript types
- `src/context` - auth context and guards
- `src/utils` - small shared utilities

## Getting Started

### 1) Install dependencies
```bash
npm install
```

### 2) Start the API server
```bash
npm run server
```
This serves `db.json` at `http://localhost:3001`.

### 3) Start the frontend
```bash
npm run dev
```
Open the app at the URL printed by Vite (usually `http://localhost:5173`).

## Test Accounts
These accounts are pre-seeded in `db.json`:

- **Admin**
  - Email: `mara@gmail.com`
  - Password: `456`

- **User**
  - Email: `mart@gmail.com`
  - Password: `123`

## Scripts
- `npm run dev` - start the frontend
- `npm run server` - start json-server
- `npm run build` - build the frontend
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Notes
- Tickets include a `categoryId` field; categories are managed in the admin panel.
- All data lives in `db.json` and resets if you replace that file.
