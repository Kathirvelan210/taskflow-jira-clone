# ⚡ TaskFlow — Jira-Inspired Project Management App

A full-stack MERN project management platform with Kanban boards, team collaboration, and task analytics.

---

## 🚀 Features

- 🔐 JWT Authentication (Register / Login / Protected Routes)
- 📁 Project Management (Create, Edit, Delete)
- 📋 Task Management (Create, Edit, Delete, Assign)
- 🗂️ Kanban Board with Drag & Drop (Todo → In Progress → Review → Done)
- 👥 Team Collaboration (Invite members by email, remove members)
- 📊 Dashboard Analytics (Progress bars, priority breakdown, completion %)
- 📱 Fully Responsive (Mobile, Tablet, Desktop)

---

## 🏗️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, Tailwind CSS, React Router DOM, Axios |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB, Mongoose                   |
| Auth      | JWT, bcryptjs                       |

---

## 📁 Folder Structure

```
taskflow/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── context/      # Auth context
│       ├── layouts/      # MainLayout
│       ├── pages/        # Login, Register, Dashboard, Projects, KanbanBoard
│       └── services/     # Axios API service
│
└── server/               # Express backend
    ├── config/           # MongoDB connection
    ├── controllers/      # Auth, Project, Task controllers
    ├── middleware/        # JWT auth middleware
    ├── models/           # User, Project, Task schemas
    └── routes/           # API routes
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v22.12+
- MongoDB Atlas account

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

### 2. Backend setup
```bash
cd server
npm install
```

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow
JWT_SECRET=your_jwt_secret_here
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🔌 API Routes

### Auth
| Method | Endpoint             | Description        |
|--------|----------------------|--------------------|
| POST   | /api/auth/register   | Register user      |
| POST   | /api/auth/login      | Login user         |
| GET    | /api/auth/me         | Get current user   |

### Projects
| Method | Endpoint                          | Description         |
|--------|-----------------------------------|---------------------|
| GET    | /api/projects                     | Get all projects    |
| POST   | /api/projects                     | Create project      |
| GET    | /api/projects/:id                 | Get project by ID   |
| PUT    | /api/projects/:id                 | Update project      |
| DELETE | /api/projects/:id                 | Delete project      |
| POST   | /api/projects/:id/members         | Add member by email |
| DELETE | /api/projects/:id/members/:userId | Remove member       |

### Tasks
| Method | Endpoint        | Description              |
|--------|-----------------|--------------------------|
| GET    | /api/tasks      | Get tasks (by projectId) |
| POST   | /api/tasks      | Create task              |
| PUT    | /api/tasks/:id  | Update task              |
| DELETE | /api/tasks/:id  | Delete task              |

---

## 🌍 Deployment

| Service  | Platform      |
|----------|---------------|
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

---

## 📸 Screenshots

> Add screenshots of Dashboard, Kanban Board, and Projects page here.

---

## 📄 Environment Variables

| Variable   | Description              |
|------------|--------------------------|
| PORT       | Server port (default 5000) |
| MONGO_URI  | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |
