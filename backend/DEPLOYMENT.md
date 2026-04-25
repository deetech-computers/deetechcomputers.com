# Deetech Production Deployment

## 1) Required Environment Variables
Set these in production:

- `NODE_ENV=production`
- `PORT=5000` (or platform-assigned port)
- `MONGO_URI=<mongodb-connection-string>`
- `JWT_SECRET=<strong-random-secret>`
- `JWT_EXPIRES_IN=7d` (or your policy)
- `FRONTEND_URL=https://yourdomain.com,https://www.yourdomain.com`

Optional but recommended:

- `REDIS_URL=redis://user:password@host:6379`
- `RATE_LIMIT_PREFIX=deetech:rl`
- SMTP variables for password reset emails:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`
  - `ADMIN_EMAIL`

Notes:

- `FRONTEND_URL` supports comma-separated origins.
- In production, `origin: null` is blocked.

## 2) Install and Start
From `backend/`:

```bash
npm install
npm run db:verify-indexes
npm start
```

If `REDIS_URL` is unavailable, rate limiting falls back to memory (single-instance mode).

## 3) Build/Verify Indexes in Staging
Run:

```bash
npm run db:verify-indexes
```

This script syncs indexes and verifies:

- `clientOrderRef` unique index exists
- partial filter expression is correct for optional refs

## 4) Staging Smoke Test
Run against staging API:

```bash
set STAGING_API_BASE=https://api-staging.yourdomain.com/api
set SMOKE_USER_EMAIL=smoke.user@yourdomain.com
set SMOKE_USER_PASSWORD=YourStrongPass123!
set SMOKE_ADMIN_EMAIL=admin@yourdomain.com
set SMOKE_ADMIN_PASSWORD=AdminStrongPass123!
set STAGING_FRONTEND_BASE=https://staging.yourdomain.com
npm run smoke:staging
```

Covered checks:

- health and db health
- auth login/register
- products fetch
- wishlist add/remove
- cart add/read/clear
- authenticated order idempotency under concurrent submit
- guest checkout
- discount race lock (if admin credentials supplied)
- frontend snapshot availability

## 5) HTTPS Reverse Proxy (Nginx Example)

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL config here (cert/key)

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The backend already has `app.set("trust proxy", 1)` enabled.

## 6) Frontend Hosting Requirement

Do not run production from `file://`.
Serve frontend over HTTPS so:

- service worker can register correctly
- snapshot/offline fallback works as designed
- CORS and cookie/token policies behave correctly

