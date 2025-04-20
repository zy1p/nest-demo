import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './libs/db/src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_DATABASE_URL!,
  },
});
