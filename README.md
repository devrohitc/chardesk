# Pokedesk — Full-Stack MERN Personal Life Dashboard

A Pokémon-inspired, gamified personal dashboard and life tracker built with an industry-standard Client–Server MERN (MongoDB, Express, React, Node.js) architecture.

---

## 1. Architecture Overview

The project is restructured into an enterprise-ready, modular client–server monorepo layout:

```text
pokedesk-mvp/
│
├── client/                     # Frontend (React 19 + Vite)
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── assets/             # Images and design assets
│   │   ├── components/         # Reusable UI components (Modals, Tags, Sprites)
│   │   ├── contexts/           # React Context (AuthContext)
│   │   ├── data/               # Seed data & starter Pokémon
│   │   ├── features/           # Feature-level modules
│   │   ├── hooks/              # Custom hooks (useSavedState)
│   │   ├── layouts/            # Layout shells (AppLayout)
│   │   ├── pages/              # View pages (Home, Journal, Routines, Finance, Pokédex, Settings, Auth)
│   │   ├── routes/             # Client routing configuration
│   │   ├── services/           # Centralized API clients & services (api, authService, questService, etc.)
│   │   ├── styles/             # Stylesheet (styles.css)
│   │   ├── utils/              # Formatting, storage helpers
│   │   ├── App.jsx             # Root React application shell
│   │   └── main.jsx            # React 19 entry point with ErrorBoundary
│   ├── .env.example            # Frontend environment variable template
│   ├── index.html              # HTML5 entry page
│   ├── package.json            # Frontend dependencies and scripts
│   └── vite.config.js          # Vite config with /api proxy to Express backend
│
├── server/                     # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/             # DB connection (Mongoose) & Environment config
│   │   ├── constants/          # HTTP status codes & system constants
│   │   ├── controllers/        # Express route controllers (Auth, Quests, Logs, Finance, Trainer, Health)
│   │   ├── middlewares/        # Auth (JWT), Validation, Error handling, 404
│   │   ├── models/             # Mongoose schemas (User, Quest, DailyLog, Finance, TrainerProgress)
│   │   ├── routes/             # REST API routes (/api/auth, /api/quests, etc.)
│   │   ├── services/           # Business logic layer
│   │   ├── utils/              # Standardized API response formatters & logger
│   │   ├── validators/         # Express-validator request validation schemas
│   │   ├── app.js              # Express application configuration & security middleware
│   │   └── server.js           # Server bootstrap & graceful shutdown
│   ├── tests/                  # Integration tests (Health check, Auth validation)
│   ├── .env.example            # Backend environment variable template
│   └── package.json            # Backend dependencies and scripts
│
├── .gitignore                  # Git ignore rules for client, server, and workspace
├── README.md                   # Full documentation & guide
└── package.json                # Root workspace scripts (concurrent dev, test, build)
```

---

## 2. Technologies

### Frontend (`client/`)
- **React 19** with Hooks & Context API
- **Vite 6** for lightning-fast bundling & development
- **Lucide React** for icons
- **Modern Responsive CSS** with custom retro-game styling

### Backend (`server/`)
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** ODM
- **JWT (JSON Web Tokens)** & **Bcrypt.js** for authentication & password security
- **Helmet**, **CORS**, **Morgan**, & **Compression** for security and performance
- **Express-Validator** for robust request validation
- **Node:Test & Supertest** for automated API testing

---

## 3. Getting Started

### Prerequisites
- **Node.js 20+** (Node 22 LTS or 26 recommended)
- **npm 10+**
- **MongoDB** (Local instance or MongoDB Atlas URI; app gracefully falls back to local storage if MongoDB is not connected)

### 1. Installation

Install all dependencies (root, client, and server) with a single command from the project root:

```bash
npm run install:all
```

Or install independently:

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Environment Configuration

#### Backend Configuration (`server/.env`):
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Default settings:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/pokedesk
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### Frontend Configuration (`client/.env`):
Copy `client/.env.example` to `client/.env`:
```bash
cp client/.env.example client/.env
```
Default settings:
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 4. Development & Running the App

### Option A: Run Both Client & Server Concurrently (Recommended)
From the project root:
```bash
npm run dev
```
- Frontend starts at: `http://localhost:5173`
- Backend API starts at: `http://localhost:5000`

### Option B: Run Independently

**Start Backend:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

**Start Frontend:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

---

## 5. API Reference

All backend REST API endpoints are prefixed with `/api`:

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health status & database connection state | No |
| `POST` | `/api/auth/register` | Register a new trainer account | No |
| `POST` | `/api/auth/login` | Log in trainer and receive JWT token | No |
| `GET` | `/api/auth/me` | Get current trainer profile | Yes |
| `GET` | `/api/auth/users` | List registered trainers | No |
| `GET` | `/api/quests` | Get user quests | Yes |
| `POST` | `/api/quests` | Create a new quest | Yes |
| `PUT` | `/api/quests/:id/toggle` | Toggle quest completion for a date | Yes |
| `DELETE` | `/api/quests/:id` | Delete a quest | Yes |
| `GET` | `/api/logs/:date` | Get daily routine & journal log | Yes |
| `PUT` | `/api/logs/:date` | Update daily routine & journal log | Yes |
| `GET` | `/api/finance` | Get financial summary, budget & bills | Yes |
| `POST` | `/api/finance/transactions`| Add transaction (expense/income) | Yes |
| `DELETE`| `/api/finance/transactions/:id`| Remove transaction | Yes |
| `POST` | `/api/finance/bills` | Add recurring bill | Yes |
| `PUT` | `/api/finance/bills/:id/toggle`| Toggle bill payment status | Yes |
| `DELETE`| `/api/finance/bills/:id` | Delete recurring bill | Yes |
| `GET` | `/api/trainer/progress` | Get trainer XP, coins, Pokémon | Yes |
| `POST` | `/api/trainer/catch` | Catch a Pokémon companion | Yes |
| `PUT` | `/api/trainer/partner` | Set active partner Pokémon | Yes |
| `POST` | `/api/trainer/focus` | Record completed focus session | Yes |

---

## 6. Testing & Building

### Run Server Tests
```bash
npm test
# or
npm run test:server
```

### Build Client for Production
```bash
npm run build:client
```

Output is bundled into `client/dist/`.

---

## 7. Standalone Prototype Run (Optional)
If running without Node/npm, `RUN-POKEDESK.bat` or `python -m http.server 8000` remains available to view the standalone version at `http://127.0.0.1:8000/pokedesk-local.html`.
