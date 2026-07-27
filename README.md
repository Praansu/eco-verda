# EcoVerda — Full-Stack E-Commerce Platform

A full-stack e-commerce platform for eco-friendly and sustainable products. Built with modern web technologies to demonstrate production-ready engineering.

## Tech Stack

| Layer | Technology | Why It Was Chosen |
|-------|-----------|-------------------|
| **Frontend** | Next.js 15 (App Router) + TypeScript | Industry-standard React framework with SSR/SSG |
| **Styling** | Tailwind CSS v4 | Utility-first, responsive design |
| **Database** | SQLite (via Prisma ORM) | Zero-config local dev; swap to PostgreSQL for prod |
| **Auth** | NextAuth.js (Auth.js) | Battle-tested auth with JWT sessions |
| **Payments** | Stripe (ready to integrate) | Payment infrastructure for production |
| **Deploy** | Vercel (frontend) + Supabase (DB) | Free tiers, blazing fast CDN |

## Features

### 🛍️ Store
- Product catalog with category filtering and search
- Product detail pages with reviews
- Featured collections on homepage

### 🛒 Cart & Checkout
- Add to cart with quantity controls
- Server-side cart persistence (per user)
- Checkout flow with address capture
- Order confirmation and history

### 👤 User System
- Registration with password hashing (bcryptjs)
- Login/logout with JWT sessions
- Protected routes and API endpoints
- Persistent sessions across devices

### 🎨 Design
- Dark mode toggle (saves preference)
- Fully responsive (mobile-first)
- Accessible UI with semantic HTML
- Toast notifications for user feedback

### 📬 Marketing
- Newsletter subscription
- Contact form with database persistence
- Testimonials section

## Database Schema

```
User ──┐
       ├── CartItem ── Product
       ├── Order ── OrderItem ── Product
       └── Review ── Product

Category ── Product
Newsletter (standalone)
Contact (standalone)
```

## Getting Started

```bash
git clone https://github.com/Praansu/eco-verda.git
cd eco-verda
npm install

# Set up environment
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts

# Start development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Demo Credentials
- **Email:** admin@ecoverda.com
- **Password:** admin123

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | List products (search, category, featured filters) |
| `/api/products/[id]` | GET | Single product with reviews |
| `/api/cart` | GET | Get user's cart |
| `/api/orders` | GET/POST | List/create orders |
| `/api/newsletter` | POST | Subscribe email |
| `/api/contact` | POST | Submit contact form |
| `/api/register` | POST | Create account |
| `/api/auth/*` | - | NextAuth.js auth routes |

## Project Structure

```
eco-verda/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── products/             # Product listing + detail
│   │   ├── cart/                 # Shopping cart
│   │   ├── checkout/             # Checkout flow
│   │   ├── orders/               # Order history + detail
│   │   ├── auth/                 # Login + register
│   │   └── api/                  # REST API routes
│   ├── components/
│   │   ├── Header.tsx            # Nav + dark mode + cart drawer
│   │   ├── Footer.tsx            # Site footer
│   │   ├── ProductCard.tsx       # Product card component
│   │   ├── CartDrawer.tsx        # Slide-out cart
│   │   ├── NewsletterSection.tsx # Newsletter signup
│   │   └── Providers.tsx         # Session + toast providers
│   └── lib/
│       ├── prisma.ts             # Prisma client
│       ├── auth.ts               # NextAuth config
│       ├── stripe.ts             # Stripe client
│       ├── utils.ts              # Helpers
│       └── actions.ts            # Server actions
└── public/images/               # Product images
```

## Deploy

Deploy to Vercel:

```bash
npm i -g vercel
vercel
```

For production, swap SQLite to PostgreSQL (Supabase free tier) and add Stripe keys.

## What I Learned

- **Full-stack auth is hard.** NextAuth.js with credentials + JWT requires careful session handling. Prisma adapter made the DB integration smooth but understanding the callback flow took time.
- **Server actions vs API routes.** Next.js server actions are great for mutations; API routes are better for fetching data from client components. Mixing both requires clear patterns.
- **Dark mode in 2026.** CSS variables + Tailwind's `dark:` variant class strategy. Persisting to localStorage and reading on mount to avoid flash.
- **SQLite for dev, PostgreSQL for prod.** Prisma makes swapping trivial, but the schema differences (enums, arrays) need thought early.
- **Cart logic is surprisingly complex.** Optimistic updates, quantity limits, stock validation, clearing on checkout — every edge case matters.
