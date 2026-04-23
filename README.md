# Darshan Nayak Portfolio

A full-stack, production-ready personal portfolio — Angular 18 + Express + MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, npm 9+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/darshan-nayak-portfolio.git
cd portfolio-root
npm run install:all
```

### 2. Configure Environment

```bash
cp .env.example backend/.env
# Edit backend/.env with your values
```

### 3. Seed Database

```bash
npm run seed
```

### 4. Start Development

```bash
npm run dev
# Frontend: http://localhost:4200
# Backend:  http://localhost:3000/api/v1
```

## 📁 Project Structure

```
portfolio-root/
├── frontend/          # Angular 18 app
│   └── src/app/
│       ├── core/      # Services, guards, interceptors
│       ├── shared/    # Shared components (navbar, toast, cursor...)
│       └── features/  # Portfolio, Admin, Setup wizard
├── backend/           # Express + Mongoose API
│   └── src/
│       ├── models/    # Mongoose schemas
│       ├── routes/    # API routes
│       ├── controllers/
│       └── middleware/
├── docs/              # Deployment guide
├── .env.example
├── antigravity.yml    # Antigravity deploy config
└── docker-compose.yml # Local dev setup
```

## 🌐 Available Routes

| Route | Description |
|-------|-------------|
| `/` | Public portfolio (single-page) |
| `/admin` | Admin dashboard (JWT protected) |
| `/admin/login` | Admin login |
| `/setup` | Setup wizard (template mode) |

## 🔑 Default Admin Credentials

After seeding: `admin@portfolio.com` / `Admin@123`

> ⚠️ **Change the password immediately** via `/admin/settings`

## 🎨 Features

- ✅ Angular 18 standalone components + signals + new control flow
- ✅ 5 color themes (Midnight Blue, Forest Green, Crimson, Golden Hour, Monochrome)
- ✅ 3 font pairs (Modern Sans, Editorial Serif, Technical Mono)
- ✅ Dark/Light mode toggle with localStorage persistence
- ✅ Typewriter hero animation (CSS only)
- ✅ SVG wave + floating orb background
- ✅ Scroll-triggered reveal animations (IntersectionObserver)
- ✅ Animated number counters in About section
- ✅ Alternating timeline for Experience
- ✅ Project cards with hover overlay + click-to-modal
- ✅ Contact form → MongoDB + optional Nodemailer
- ✅ Admin panel with full CRUD for all sections
- ✅ JWT authentication with auto-refresh
- ✅ Resume PDF download endpoint
- ✅ Custom cursor ring follower (desktop)
- ✅ Scroll progress bar
- ✅ Back-to-top button
- ✅ Setup wizard for template buyers
- ✅ Rate limiting, Helmet security headers, CORS
- ✅ MongoDB seed script with Darshan's full data
- ✅ GitHub Actions CI/CD
- ✅ Antigravity deployment config
- ✅ Docker Compose for local dev

## 📦 npm Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run build` | Production build (both) |
| `npm run seed` | Seed MongoDB with portfolio data |
| `npm run deploy` | Build + prepare for deployment |
| `npm run install:all` | Install all dependencies |

## 📚 Docs

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for complete Antigravity hosting guide.

## 🛠 Tech Stack

- **Frontend**: Angular 18, TypeScript, SCSS
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: JWT (jsonwebtoken + bcryptjs)
- **Security**: Helmet, CORS, rate-limit
- **DevOps**: Docker, GitHub Actions, Antigravity
