# Persista — Web Backend

> A robust, production-ready REST API backend for the **Persista** platform — powering project management, OAuth authentication, AI-driven chat actions, and a developer-facing SDK.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express.js |
| ORM | Prisma |
| Database | MySQL |
| Auth | Passport.js · Google OAuth 2.0 · GitHub OAuth · JWT |
| Security | Helmet · CORS · bcrypt |
| Logging | Morgan |
| Dev Tool | Nodemon |

---

## 📁 Project Structure

```
Web-Backend-main/
├── config/
│   └── db.config.js           # Prisma client initialization
├── controllers/
│   ├── admin.controller.js    # Project, API key & user management
│   ├── actions.controller.js  # Action & endpoint management
│   └── auth/
│       ├── googleAuth.controller.js   # Google OAuth flow
│       └── githubAuth.controller.js   # GitHub OAuth flow
│   └── sdk/
│       └── chat.controller.js         # SDK chat & AI action handling
├── middleware/
│   ├── auth.middleware.js     # JWT verification middleware
│   └── sdk.middleware.js      # API key verification middleware
├── prisma/
│   └── schema.prisma          # Database schema (MySQL)
├── routes/
│   ├── index.js
│   └── v1/
│       ├── index.js           # v1 route aggregator
│       ├── auth.routes.js     # Auth endpoints
│       ├── actions.routes.js  # Action endpoints
│       ├── sdk.routes.js      # SDK endpoints
│       └── admin/
│           └── index.js       # Admin endpoints
├── utils/
│   ├── generateApiKey.js      # Random API key generator
│   ├── parseArray.js          # Array parsing helper
│   └── responseCodes.js       # Standardized HTTP response helpers
└── index.js                   # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MySQL database
- Google OAuth credentials
- GitHub OAuth credentials

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/web-backend.git
cd web-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in the values (see Environment Variables section below)

# 4. Push the Prisma schema to your database
npx prisma db push

# 5. Generate the Prisma client
npx prisma generate

# 6. Start the server
npm run dev      # Development (with nodemon)
npm start        # Production
```

Server starts on `http://localhost:5000` by default.

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000

# Database
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# Session
COOKIE_KEY=your_session_secret

# JWT
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback
```

---

## 🗄️ Database Schema

The Prisma schema defines the following models:

| Model | Description |
|---|---|
| `User` | Platform users (OAuth-based, no passwords) |
| `Project` | Workspaces with API keys and AI endpoints |
| `UserProjectRelation` | Many-to-many user↔project with role (admin flag) |
| `ApiKey` | Per-project AI model API keys (GPT / Llama2) |
| `Action` | AI-driven conversation flows with similarity thresholds |
| `Chat` | Individual chat sessions tied to an action |
| `Messages` | Individual message-response pairs with sentiment scores |

---

## 🌐 API Reference

All routes are prefixed with `/api/v1`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/auth/google` | Initiate Google OAuth |
| `GET` | `/auth/google/callback` | Google OAuth callback |
| `GET` | `/auth/github` | Initiate GitHub OAuth |
| `GET` | `/auth/github/callback` | GitHub OAuth callback |
| `GET` | `/auth/verify` | Verify current session/token |

### Projects *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/project` | Create a new project |
| `PATCH` | `/project/:id` | Update project endpoints |

### Admin *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/admin/:id/keys` | List all API keys for a project |
| `POST` | `/admin/:id/keys` | Create a new API key |
| `DELETE` | `/admin/:id/keys/:keyId` | Delete an API key |
| `GET` | `/admin/:id/analytics` | Get project analytics |

### Actions *(requires auth)*

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/actions/:id` | Get actions for a project |
| `POST` | `/actions/:id` | Create a new action |
| `PATCH` | `/actions/:id` | Edit action endpoints |

### SDK *(requires API key)*

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sdk/chat` | Send a chat message to an AI action |

---

## 🔒 Authentication Flow

1. User initiates OAuth via `/auth/google` or `/auth/github`
2. On successful callback, a **JWT** is issued and a session is created
3. Protected routes validate the JWT via `auth.middleware.js`
4. SDK routes validate a project-level **API key** via `sdk.middleware.js`

---

## 🛡️ Security

- **Helmet** — sets secure HTTP headers
- **CORS** — restricted to the frontend origin (`persista-webapp.vercel.app`)
- **bcrypt** — password hashing (where applicable)
- **express-session** — server-side sessions with secure, SameSite cookies
- **API key middleware** — SDK routes are gated behind project-specific API keys

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---


