# Security Rotation Checklist

Run this checklist before production launch and anytime credentials are exposed.

## 1) Rotate Credentials Immediately

- `JWT_SECRET`
- `SMTP_PASS`
- `SMOKE_ADMIN_PASSWORD` / admin user password
- `MONGO_URI` credentials (DB user password)
- `REDIS_URL` credentials (if used)

## 2) Update Runtime Environment

1. Update secrets in your deployment environment (hosting panel / CI secrets / server env).
2. Ensure `NODE_ENV=production`.
3. Ensure `FRONTEND_URL` equals your live HTTPS domain.
4. Restart backend service.

## 3) Invalidate Old Access

- Log out active sessions if your auth policy requires immediate invalidation.
- Remove old `.env` files from shared machines/backups where possible.
- Confirm old passwords no longer work.

## 4) Verify After Rotation

Run:

```bash
npm run db:verify-indexes
npm run smoke:staging
```

Expected:

- Health checks pass
- Auth checkout passes
- Guest checkout passes
- Discount race lock passes or skips only due stock constraints
- Offline snapshot availability passes (when frontend base is reachable)

## 5) Harden for Production

- Use Redis-backed rate limiting for multi-instance scaling.
- Enforce HTTPS at reverse proxy/load balancer.
- Keep `FRONTEND_URL` strict (avoid wildcard origins).
- Monitor logs for repeated 401/403/429 spikes.

