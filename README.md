# GetMyCV

GetMyCV is a resume manager built with Next.js. It helps users upload, organize, share, and track multiple PDF resumes for different job titles, roles, and job descriptions.

Instead of sending recruiters a static file that may become outdated, users share a stable public resume link. When a resume is updated in GetMyCV, the shared link can continue to point recruiters, portfolio visitors, and profile viewers to the latest version.

## Why GetMyCV?

- Upload different resumes for different job titles, roles, and job descriptions.
- Manage every resume from one dashboard instead of searching through local files.
- Share clean public links with recruiters, hiring managers, portfolios, and public profiles.
- Keep shared links stable while updating the underlying resume over time.
- Track resume views and downloads automatically.
- Control resume visibility with public and private resume containers.

## Features

- Email/password authentication with email verification.
- Google and GitHub sign-in support.
- User profile with username-based public resume URLs.
- PDF resume upload through Vercel Blob.
- Dashboard for creating, previewing, sharing, editing, and deleting resume containers.
- Public resume pages at `/:username/:slug`.
- Private resume handling for restricted resume links.
- View and download tracking per resume container.
- Monthly analytics chart for resume views and downloads.
- One-click copy/share actions and QR-code sharing support.

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Drizzle ORM](https://orm.drizzle.team/)
- PostgreSQL, configured for Neon through `@neondatabase/serverless`
- [Better Auth](https://www.better-auth.com/)
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)
- [Resend](https://resend.com/) for transactional email
- shadcn/Radix UI primitives

## Getting Started

### Prerequisites

- Node.js 20 or newer
- pnpm
- PostgreSQL database
- Vercel Blob store
- Resend API key
- Google and GitHub OAuth apps, if social login is enabled

### Install Dependencies

```bash
pnpm install
```

### Configure Environment Variables

Create `.env.local` in the project root:

```bash
DATABASE_URL=
NEXT_PUBLIC_BASE_URL=http://localhost:3000

GETMYCV_BLOB_READ_WRITE_TOKEN=

RESEND_API_KEY=
RESEND_FROM=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Depending on your Better Auth setup, you may also need the standard Better Auth secret and URL variables required by your deployment environment.

### Set Up the Database

Generate and run migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

For local schema syncing during development, you can also use:

```bash
npx drizzle-kit push
```

If you change Better Auth schema configuration, regenerate the auth schema before generating Drizzle migrations:

```bash
npx @better-auth/cli@latest generate
```

### Run the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev       # Start the local development server
pnpm build     # Build the production app
pnpm start     # Start the production server
pnpm lint      # Run ESLint
pnpm lint:fix  # Fix lint issues where possible
pnpm format    # Format files with Prettier
pnpm reset     # Remove Next.js and dependency caches
```

## How It Works

1. A user signs up and configures a username.
2. The user creates a resume container for a specific role, such as `Full Stack Developer`.
3. The user uploads a PDF resume and chooses a slug, such as `full-stack-developer`.
4. GetMyCV generates a public link like:

   ```text
   https://your-domain.com/username/full-stack-developer
   ```

5. Recruiters can view or download the resume from the link.
6. GetMyCV records view and download events for analytics.
7. The user can manage resume containers from the dashboard.

## Project Structure

```text
app/                         Next.js app routes and pages
app/[username]/[slug]/        Public resume viewer
app/api/                      Upload, auth, view, and download API routes
app/dashboard/                Authenticated resume dashboard
actions/                      Server actions
components/                   Shared UI components
db/                           Drizzle client, schema, and query helpers
lib/                          Auth, validation, and utility helpers
migrations/                   Database migrations
public/                       Static assets
types/                        Shared TypeScript types
```

## Product Roadmap

- Replace an existing resume file while preserving the same public URL.
- Add richer analytics such as referrers, locations, devices, and time ranges.
- Add resume-specific notes for job title, company, role, and job description.
- Add expiring or password-protected private resume links.
- Add custom domains and embeddable portfolio widgets.

## Deployment

The app is designed to deploy cleanly on Vercel:

1. Connect the repository to Vercel.
2. Add the same environment variables from `.env.local`.
3. Configure the production database and Vercel Blob store.
4. Run migrations against the production database.
5. Deploy.
