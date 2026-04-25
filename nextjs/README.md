# Deetech Next.js Frontend

This folder is the standalone frontend project for Deetech Computers.

It is the clean deployment target for Vercel and should be treated as its own frontend workspace.

## Environment

Production:

- `DEETECH_API_ORIGIN=https://deetechcomputers-com.onrender.com`
- `NEXT_PUBLIC_SITE_URL=https://deetechcomputers-com.vercel.app`
- `NEXT_PUBLIC_DEETECH_ASSET_BASE=https://deetechcomputers-com.onrender.com`

Local development:

- `DEETECH_API_ORIGIN=http://127.0.0.1:5000`

You can place local values in `.env.local` when needed, but that file should not be committed.

## Scripts

```bash
pnpm install
pnpm dev
pnpm build
pnpm start
```

## Deployment

Use this folder as the Vercel root directory:

```text
nextjs
```

The backend for production is expected to be the Render service at:

```text
https://deetechcomputers-com.onrender.com
```

The live frontend storefront URL is:

```text
https://deetechcomputers-com.vercel.app
```
