###Live : https://vidya-setu-pi.vercel.app/


# VidyaSetu

AI-powered adaptive study and assessment platform for NCERT-based learning.

VidyaSetu helps students move from passive studying to structured practice with chapter-wise study material, quiz workflows, subjective answer evaluation, and analytics.

## Features

- NCERT class, subject, and chapter browsing
- Chapter-based quiz creation
- Practice, test, and revision quiz modes
- Subjective answer evaluation workflow
- Notes upload and extraction workflow
- Student dashboard and analytics views
- Admin flows for NCERT and question management

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- Cloudinary

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL database

You can use either a hosted PostgreSQL database or a local PostgreSQL database through Docker.

## Environment Setup

Create your local environment file:

```bash
cp .env.example .env
```

Never commit `.env`. Use your own database credentials and API keys.

## Database Setup

### Option A: Hosted PostgreSQL

Use this option if you do not have Docker installed.


- Prisma ORM
- JWT Authentication

```env
DATABASE_URL="your-hosted-postgresql-url"
DIRECT_URL="your-direct-postgresql-url"
```

For Supabase, `DATABASE_URL` usually points to the pooled connection URL and `DIRECT_URL` points to the direct connection URL used by Prisma migrations.

### Option B: Docker PostgreSQL

Use this option if you have Docker installed and want a local database.

Start PostgreSQL:

```bash
docker compose up -d
```

The default `.env.example` database URLs already match the Docker database:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vidyasetu"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/vidyasetu"
```

## Install And Run

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
pnpm db:generate
```

Run migrations:

```bash
pnpm db:migrate
```

Seed the database:

```bash
pnpm db:seed
```

Start the development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Seed Data

The seed script populates your own local or hosted contributor database with NCERT academic classes, subjects, chapters, and direct PDF links.

Contributors do not need access to the maintainer's production database.

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:studio
```

## Contributing

1. Fork the repository.
2. Clone your fork.
3. Create `.env` from `.env.example`.
4. Set up PostgreSQL using either hosted PostgreSQL or Docker.
5. Run migrations and seed your database.
6. Create a feature branch.
7. Open a pull request.

Do not request or use production database access for local development.

Please read the [Code of Conduct](CODE_OF_CONDUCT.md) before participating in project spaces.

## License

MIT
