import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "./db/schemas/index.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

// npx @better-auth/cli@latest generate

// npx drizzle-kit generate
// npx drizzle-kit migrate
// npx drizzle-kit push
