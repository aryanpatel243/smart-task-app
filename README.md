# ✦ Smart Task & Notes Management System
### Full Stack MERN Application

A production-ready task management system built with **MongoDB, Express.js, React, and Node.js**.

---

## 📁 Project Structure

```
smart-task-app/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── controllers/
│   │   ├── authController.js   ← Register, Login, GetMe
│   │   └── taskController.js   ← CRUD task operations
│   ├── middleware/
│   │   ├── auth.js             ← JWT verification middleware
│   │   └── errorHandler.js     ← Global error handler
│   ├── models/
│   │   ├── User.js             ← User schema (name, email, password)
│   │   └── Task.js             ← Task schema (title, desc, status, userId)
│   ├── routes/
│   │   ├── authRoutes.js       ← /api/auth/*
│   │   └── taskRoutes.js       ← /api/tasks/* (protected)
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js               ← App entry point
│
└── frontend/                 ← React Application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js         ← Top navigation bar
    │   │   ├── PrivateRoute.js   ← Auth route guard
    │   │   ├── TaskCard.js       ← Individual task display
    │   │   └── TaskModal.js      ← Create/Edit task modal
    │   ├── context/
    │   │   └── AuthContext.js    ← Global auth state (Context API)
    │   ├── pages/
    │   │   ├── Register.js       ← Registration page
    │   │   ├── Login.js          ← Login page
    │   │   └── Dashboard.js      ← Main task dashboard
    │   ├── utils/
    │   │   └── api.js            ← Axios instance with interceptors
    │   ├── App.js                ← Router + routes
    │   ├── App.css               ← All component styles
    │   ├── index.js              ← React entry point
    │   └── index.css             ← Global styles + CSS variables
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (free tier works fine)

---

## 🚀 Local Setup & Running

### Step 1 — Clone the Repository

```bash
git clone <your-github-repo-url>
cd smart-task-app
```

---

### Step 2 — Set Up MongoDB Atlas

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account
2. Create a new **Cluster** (free M0 tier)
3. In **Database Access** → Add a new database user with a password
4. In **Network Access** → Add `0.0.0.0/0` to allow all IPs (for development)
5. Click **Connect** → **Connect your application** → Copy the connection string
   - Replace `<username>` and `<password>` with your DB user credentials

---

### Step 3 — Configure Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart-task-db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_long_random_string_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Important:** Replace `JWT_SECRET` with a long random string (e.g., run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

Start the backend:
```bash
npm run dev     # Development (with nodemon auto-reload)
# OR
npm start       # Production
```

Backend runs at: `http://localhost:5000`
Test it: `http://localhost:5000/` → should return `{ message: "Smart Task API is running ✅" }`

---

### Step 4 — Configure Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 REST API Reference

### Base URL: `http://localhost:5000/api`

All protected routes require `Authorization: Bearer <token>` header.

---

### 🔐 Auth Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGci...",
  "user": {
    "_id": "64abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGci...",
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

#### GET `/api/auth/me` 🔒 Protected
Get current logged-in user info.

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

---

### ✅ Task Endpoints (All Protected)

**Headers required for all:** `Authorization: Bearer <token>`

---

#### GET `/api/tasks`
Get all tasks for the logged-in user (sorted newest first).

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "tasks": [
    {
      "_id": "65abc123...",
      "title": "Complete MERN assignment",
      "description": "Build the full stack app",
      "status": "pending",
      "userId": "64abc...",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

---

#### POST `/api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Complete MERN assignment",
  "description": "Build the full stack app",
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully.",
  "task": { "_id": "...", "title": "...", "status": "pending", ... }
}
```

---

#### PUT `/api/tasks/:id`
Update a task (any or all fields).

**Request Body (any combination):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "task": { "_id": "...", "status": "completed", ... }
}
```

---

#### DELETE `/api/tasks/:id`
Delete a task permanently.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully.",
  "taskId": "65abc123..."
}
```

---

## 🧪 Testing with Postman

1. **Import collection** or create requests manually
2. **Register** → `POST /api/auth/register` → copy the `token` from response
3. **Set Authorization** → In Postman, go to **Authorization** tab → Type: **Bearer Token** → paste token
4. Now test all task routes — they will use your token automatically

**Postman Environment Variables (recommended):**
```
base_url = http://localhost:5000/api
token    = <paste token after login>
```

---

## ☁️ Deployment

### Backend → Render.com

1. Push backend code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service** → Connect GitHub repo
3. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add **Environment Variables:**
   ```
   MONGO_URI     = <your MongoDB Atlas URI>
   JWT_SECRET    = <your secret>
   JWT_EXPIRE    = 7d
   NODE_ENV      = production
   CLIENT_URL    = https://your-frontend.netlify.app
   PORT          = 5000
   ```
5. Deploy → copy the live URL (e.g. `https://smart-task-api.onrender.com`)

---

### Frontend → Netlify

1. Push frontend code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Set:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
4. Add **Environment Variables:**
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```
5. Deploy → your site is live!

> 💡 **Note:** Also add a `_redirects` file in `frontend/public/` with content `/* /index.html 200` to handle React Router on Netlify.

---

## 🛡️ Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 12)
- **JWT** authentication with configurable expiry
- Password field excluded from all DB queries by default (`select: false`)
- Protected routes verified server-side on every request
- CORS configured with allowed origins
- Input validation on both frontend and backend
- Global error handler masks internal errors in production

---

## 🧩 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| State     | Context API + useState/useEffect  |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB Atlas + Mongoose          |
| Auth      | JWT + bcryptjs                    |
| Styling   | Pure CSS with CSS Variables       |
| Fonts     | Sora + JetBrains Mono (Google)    |
| Deploy    | Netlify (FE) + Render (BE)        |

---

## 📸 Screenshots

_Add screenshots of Register, Login, and Dashboard pages here after deployment._

---

## 📄 License

MIT — free to use for educational purposes.
