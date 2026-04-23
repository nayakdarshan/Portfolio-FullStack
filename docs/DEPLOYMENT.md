# Deployment Guide — Antigravity Hosting

Complete guide for deploying the Darshan Nayak Portfolio on Antigravity.

---

## Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- GitHub account (for CI/CD)
- Antigravity account

---

## 1. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user (username + password)
4. Whitelist IP: `0.0.0.0/0` (allow all for Antigravity)
5. Get connection string:
   ```
   mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/portfolio
   ```

---

## 2. Environment Variables

Copy `.env.example` to `backend/.env`:

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Random 64-char secret |
| `PORT` | ✅ | Backend port (3000) |
| `FRONTEND_URL` | ✅ | Your frontend URL |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | Admin initial password |
| `SMTP_HOST` | ❌ | Email server (optional) |
| `SMTP_USER` | ❌ | SMTP username (optional) |
| `SMTP_PASS` | ❌ | SMTP app password (optional) |

Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. Local Development

```bash
# Install all dependencies
npm run install:all

# Copy and configure .env
cp .env.example backend/.env
# Edit backend/.env

# Seed the database
npm run seed

# Start development servers
npm run dev
# Frontend: http://localhost:4200
# Backend:  http://localhost:3000/api/v1/health
```

---

## 4. Backend Deployment (Antigravity Node.js Service)

### Via Antigravity CLI

```bash
# Install Antigravity CLI
npm install -g @antigravity/cli

# Login
antigravity login

# Deploy backend
cd backend
antigravity deploy \
  --name portfolio-api \
  --type nodejs \
  --start "npm start" \
  --env NODE_ENV=production \
  --env PORT=3000
```

### Environment Variables

Set all required env vars in the Antigravity dashboard:
- Navigate to your service → Environment Variables
- Add each variable from `backend/.env`

### Health Check Endpoint

Your backend exposes: `GET /api/v1/health`

Configure this in Antigravity for automatic health monitoring.

---

## 5. Frontend Deployment (Antigravity Static)

### Build Production Bundle

```bash
cd frontend
npm run build -- --configuration production
# Output: frontend/dist/frontend/browser/
```

### Deploy to Antigravity Static

```bash
antigravity deploy \
  --name portfolio-web \
  --type static \
  --dir frontend/dist/frontend/browser \
  --spa  # Enable SPA routing (serves index.html for all routes)
```

### Configure SPA Routing

In Antigravity dashboard → your static service → Routing:
- Add rule: `/*` → `/index.html` (200)

This ensures Angular's client-side routing works correctly.

---

## 6. Using `antigravity.yml` (Recommended)

The repository includes `antigravity.yml` for automated deployment:

```bash
# From project root
antigravity deploy -f antigravity.yml
```

This deploys both backend and frontend in one command.

---

## 7. Custom Domain + SSL

1. In Antigravity dashboard → your service → Custom Domains
2. Add your domain: `darshannayak.dev`
3. Update DNS records at your domain registrar:
   ```
   CNAME  www    your-service.antigravity.app
   A      @      <Antigravity IP>
   ```
4. Antigravity automatically provisions SSL via Let's Encrypt
5. Update `FRONTEND_URL` env var in backend to your custom domain

---

## 8. GitHub Actions CI/CD

### Setup Secrets

In GitHub → Repository → Settings → Secrets → Actions:

| Secret | Value |
|--------|-------|
| `ANTIGRAVITY_API_KEY` | Your Antigravity API key |
| `API_BASE_URL` | Your backend URL |
| `MONGODB_URI` | MongoDB Atlas URI |

### Pipeline

The `.github/workflows/ci.yml` workflow:
1. **On PR**: Runs backend tests + frontend build
2. **On push to main**: Tests + build + deploy to Antigravity

---

## 9. Post-Deployment Checklist

- [ ] Backend health check returns `{ status: "ok" }`
- [ ] Run seed: `npm run seed` (or via Antigravity console)
- [ ] Login to admin panel: `/admin/login`
- [ ] Change admin password: `/admin/settings`
- [ ] Upload resume PDF via admin panel → Profile
- [ ] Update photo URL in Profile editor
- [ ] Verify contact form submission works
- [ ] Test dark/light mode toggle
- [ ] Check mobile responsiveness

---

## 10. MongoDB Maintenance

```bash
# Re-seed (WARNING: overwrites all data)
npm run seed

# Backup with mongodump
mongodump --uri="$MONGODB_URI" --out=./backup

# Restore
mongorestore --uri="$MONGODB_URI" ./backup
```

---

## 11. Performance Tips

- Enable Antigravity CDN for static assets
- Frontend assets are cached with 1-year cache headers (`immutable`)
- Use MongoDB Atlas indexes (already configured in models)
- Rate limiting is pre-configured (adjust in `.env` if needed)

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check `FRONTEND_URL` in backend `.env` |
| Login fails | Verify admin was seeded: `npm run seed` |
| Resume 404 | Upload resume via admin panel |
| MongoDB timeout | Check Atlas IP whitelist (`0.0.0.0/0`) |
| Build fails | Ensure Node.js 18+ and run `npm run install:all` |
