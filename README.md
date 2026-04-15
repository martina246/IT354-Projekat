# Help Desk Ticketing App

A React + TypeScript web application for managing help desk tickets with user and admin roles. The frontend runs with Vite, while the backend uses FastAPI with SQLite for local persistence.

## Features
- User registration and backend-driven login
- Role-based behavior for user and admin accounts
- Ticket creation, viewing, updating, and deletion
- Ticket status management
- Categories CRUD and category assignment to tickets
- Admin dashboard with ticket list and filters
- Optional email notifications through the Node email proxy

## Tech Stack
- React + TypeScript
- Vite
- FastAPI
- SQLite
- SQLAlchemy
- react-router-dom

## Project Structure
- `src/pages` - page-level views
- `src/components` - reusable UI components
- `src/api` - frontend API request helpers
- `src/types` - shared TypeScript types
- `src/context` - auth context and route guards
- `src/backend` - FastAPI app, database setup, schemas, and security helpers
- `server.js` - optional email proxy server

## Getting Started

### 1) Install frontend dependencies
```bash
npm install
```

### 2) Install backend dependencies
Create and activate your Python virtual environment, then install the backend requirements:

```bash
pip install -r requirements.txt
```

### 3) Start the FastAPI backend
From the project root:

```bash
PYTHONPATH=. uvicorn src.backend.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` and Swagger UI at `http://localhost:8000/docs`.

### 4) Start the frontend
```bash
npm run dev
```

Open the app at the URL printed by Vite, usually `http://localhost:5173`.

### 5) Optional: start the email server
If you want ticket email notifications enabled:

```bash
npm run email-server
```

This starts the email proxy at `http://localhost:3002`.

## Test Accounts
Users are no longer pre-seeded from a JSON file. Create test accounts through:
- the registration page for regular users
- Swagger at `http://localhost:8000/docs` for custom roles such as `admin`

## Scripts
- `npm run dev` - start the frontend
- `npm run email-server` - start the optional email proxy server
- `npm run dev:all` - start the frontend and optional email proxy together
- `npm run build` - build the frontend
- `npm run preview` - preview the frontend production build
- `npm run lint` - run ESLint

## Notes
- Frontend API requests use `VITE_API_URL` from `src/.env`, falling back to `http://localhost:8000`.
- Tickets include a `categoryId` field; categories are managed in the admin panel.
- User passwords are stored hashed in SQLite.
