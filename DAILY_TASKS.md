# Daily Tasks — eco-verda

Pick **one** task per day (5–10 min). Commit via PR so every change is reviewable and explainable in interviews.

## Frontend (Next.js 16 + React 19 + TypeScript + Tailwind)

- [ ] Add type annotations to one component in `src/components/` (remove `any`, add proper props interface)
- [ ] Write one unit test with Jest + React Testing Library in `src/components/__tests__/` (create if missing)
- [ ] Refactor one component to be smaller (extract sub-component, custom hook, or utility)
- [ ] Add JSDoc comment to one complex component or hook
- [ ] Replace one `any` type with proper generic/type in `src/lib/` or `src/hooks/`
- [ ] Add one accessibility improvement (aria-*, role, focus management) in a component
- [ ] Convert one client component to server component where possible (remove `'use client'`)

## Backend / Database (Prisma + NextAuth + Stripe)

- [ ] Add one Prisma model field or relation in `prisma/schema.prisma` → run `npx prisma migrate dev`
- [ ] Write one unit test for a server action / API route in `src/app/api/__tests__/`
- [ ] Add input validation (Zod schema) to one server action or API route
- [ ] Improve error handling in one API route (try/catch, proper status codes, logging)
- [ ] Add one database index in `prisma/schema.prisma` for a frequent query

## Docs / Meta

- [ ] Update `README.md` with one deployment step or environment variable
- [ ] Add one entry to `CHANGELOG.md` (create if missing) for recent change
- [ ] Fix one typo or unclear sentence in `README.md`
- [ ] Add one badge to `README.md` (Next.js version, TypeScript, Tailwind)

## Quality

- [ ] Run `npm run lint` → fix one ESLint warning
- [ ] Run `npx prettier --check .` → format one file
- [ ] Add `pre-commit` hook config (`.pre-commit-config.yaml` with `prettier`, `eslint`) if missing
- [ ] Update one outdated dependency (`npm outdated` → `npm update <pkg>`)

---

**How to use:** Each morning, pick ONE unchecked item. Do it. Commit with message like `refactor: extract ProductCard sub-component from ProductGrid`. Open PR. Merge after review. Check the box.