# EcoVerda

[![CI](https://img.shields.io/github/actions/workflow/status/Praansu/eco-verda/ci.yml?style=flat-square)](https://github.com/Praansu/eco-verda/actions)
[![License](https://img.shields.io/badge/License-MIT-1F2328?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16.2+-1F2328?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-1F2328?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.0+-1F2328?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-ready-1F2328?style=flat-square&logo=docker&logoColor=white)](https://docker.com)

Eco-friendly marketplace built to learn **Next.js properly**. Not a tutorial clone — real features, real bugs, real fixes.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | MongoDB (Prisma ORM) |
| Auth | NextAuth v5 (beta) |
| Payments | Stripe |
| UI | Radix UI + Lucide React |

## Quick Start

```bash
# 1. Install deps
npm install

# 2. Configure env
cp .env.example .env.local
# Add MONGODB_URI, NEXTAUTH_SECRET, Stripe keys

# 3. Setup database
npx prisma generate
npx prisma db push

# 4. Run dev
npm run dev
```

Or with Docker:
```bash
docker build -t eco-verda .
docker run -p 3000:3000 --env-file .env.local eco-verda
```

## Features

- ✅ Product listing + detail pages (ISR)
- ✅ Cart (localStorage, persists across sessions)
- ✅ Search with URL-synced filters (debounced)
- ✅ Blur-up image loading
- ⚠️ Checkout — button only, Stripe webhooks WIP
- ⚠️ Seller dashboard — half built

## What I Learned

- **App Router + Server Components** change how you think about data fetching
- **Prisma + MongoDB** works but relation handling differs from SQL
- **Stripe webhooks** are tricky locally — use `stripe listen --forward-to`
- **ISR** (Incremental Static Regeneration) is powerful for product pages
- **URL-synced search** = shareable, bookmarkable, SEO-friendly filters

## Project Structure

```
eco-verda/
├── src/
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities (Prisma, Stripe, auth)
│   └── hooks/            # Custom React hooks
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── .env.example          # Env template
```

## License

MIT — use it, break it, improve it.