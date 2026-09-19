# EcoVerda — Full-Stack E-Commerce Platform

A full-stack storefront for eco-friendly products. Next.js App Router + TypeScript, Prisma + SQLite, credentials auth via NextAuth — cart persistence, orders, reviews, newsletter and contact handling.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) + TypeScript, React 19 |
| **Styling** | Tailwind CSS v4 |
| **Database** | SQLite via Prisma ORM (swap to PostgreSQL for prod) |
| **Auth** | NextAuth v5, credentials provider, bcryptjs password hashing, Prisma adapter |
| **Payments** | Stripe SDK present (`src/lib/stripe.ts`) but **not wired into checkout** — see known issues |
| **Notifications** | react-hot-toast |

## How it's built

Mutations live in **server actions** (`src/lib/actions.ts`): `registerUser`, `addToCart`, `updateCartItem`, `removeCartItem`, `subscribeNewsletter`, `submitContact`. Only two API route handlers exist: `/api/register` and `/api/auth/*` (NextAuth). Everything else the UI does goes through server actions.

Schema (`prisma/schema.prisma`): `User` → `CartItem`/`Order`/`Review`, `Order` → `OrderItem`, `Category` → `Product`, plus standalone `Newsletter` and `Contact`. One review per user per product (unique constraint), one cart row per user per product.

## Getting Started

```bash
git clone https://github.com/Praansu/eco-verda.git
cd eco-verda
npm install

# Set up environment
cp .env.example .env        # fill in DATABASE_URL + NEXTAUTH_SECRET

# Initialize database
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts  # categories, products, admin user (below)

npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Seed login (local dev only)

- **Email:** admin@ecoverda.com
- **Password:** admin123

Seeded by `prisma/seed.ts` into your local SQLite file. Change or remove it before any real deployment.

## Project Structure

```
eco-verda/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Categories, products, admin user
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage (featured, testimonials)
│   │   ├── products/             # Listing with category filter + detail + reviews
│   │   ├── cart/                 # Cart page
│   │   ├── checkout/             # Checkout form (address + phone)
│   │   ├── orders/               # Order history + detail
│   │   ├── auth/                 # Login + register pages
│   │   └── api/                  # register + auth/[...nextauth] ONLY
│   ├── components/
│   │   ├── Header.tsx / Footer.tsx / ProductCard.tsx
│   │   ├── CartDrawer.tsx        # Slide-out cart
│   │   ├── NewsletterSection.tsx # Newsletter signup
│   │   └── Providers.tsx         # Session + toast providers
│   └── lib/
│       ├── actions.ts            # All mutations (server actions)
│       ├── auth.ts               # NextAuth config
│       ├── stripe.ts             # Stripe client — currently unused
│       ├── prisma.ts / utils.ts / placeholders.ts
└── public/images/               # Product images
```

## Known issues (honest list, in fix order)

1. **Three client components call API routes that don't exist.** `CheckoutForm` POSTs to `/api/orders`, `CartDrawer` GETs `/api/cart`, `NewsletterSection` POSTs to `/api/newsletter` — none of these route handlers are built, so those calls 404. The fix is to point them at the server actions in `lib/actions.ts` that already do the same jobs. Cart page, orders flow and newsletter signup are broken until then.
2. **Stripe isn't connected.** The SDK and client exist; nothing imports them. Checkout currently creates an order record directly. Either wire Stripe Checkout or remove the dependency.
3. **No `.env.example` shipped previously** — added now. `DATABASE_URL` and `NEXTAUTH_SECRET` are required to boot.

## Deploy

```bash
npm i -g vercel
vercel
```

For production: swap SQLite to PostgreSQL (Supabase free tier works), set real env vars, remove the seed admin, and resolve the known issues above first.

## What I Learned

- **Full-stack auth is hard.** NextAuth v5 credentials + JWT with the Prisma adapter — the callback and session flow took real time to understand, more than the login form itself.
- **Server actions vs API routes.** Actions carry all the mutations here, which is clean — but the leftover `fetch("/api/...")` calls in three components show what happens when you migrate halfway. Finish the migration; don't straddle both.
- **Cart logic is surprisingly complex.** Optimistic updates, quantity limits, stock checks, clearing on checkout — every edge case matters, and half of them only appear when a second tab is open.
- **SQLite for dev, PostgreSQL for prod.** Prisma makes the swap look trivial, but enums, defaults and case sensitivity differ — decide early, not at deploy time.
