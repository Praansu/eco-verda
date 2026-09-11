# Contributing to EcoVerda

Thank you for considering contributing!

## How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, focused commits
4. **Run linting and type checking**: `npm run lint && npx tsc --noEmit`
5. **Open a Pull Request** with a clear description

## Code Style

- TypeScript/React: ESLint + Prettier
- Commit messages: Conventional Commits

## Development Setup

```bash
git clone https://github.com/Praansu/eco-verda.git
cd eco-verda
npm install
cp .env.example .env
# Add your environment variables
npm run dev
```

## Project Structure

```
eco-verda/
├── src/
│   ├── app/              # Next.js 16 App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities (Prisma, placeholders, etc.)
│   └── actions/          # Server actions
├── prisma/
│   └── schema.prisma     # Database schema
├── public/
│   └── images/           # Static images + blur-up placeholders
└── .github/workflows/    # CI/CD pipelines
```

## Areas for Contribution

- Add product reviews/ratings
- Implement wishlist functionality
- Add order history page
- Improve search (fuzzy search, filters)
- Add admin dashboard
- Write component tests
- Improve accessibility (a11y)