import type { Env } from '@lib/env';
import type { Provider } from '@nestjs/common';
import { ENV } from '@lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from 'nestjs-pino';
import { Pool } from 'pg';

import { Module } from '@nestjs/common';

import * as schema from './schema';

export const QUERY_CLIENT = 'QUERY_CLIENT';

export type QueryClient = ReturnType<typeof drizzle<typeof schema>>;

const providers: Provider[] = [
  {
    provide: QUERY_CLIENT,
    inject: [ENV, Logger],
    useFactory: async (env: Env, logger: Logger) => {
      const pool = new Pool({
        connectionString: env.POSTGRES_DATABASE_URL,
      });

      await pool.query('SELECT 1;').catch((err) => {
        logger.error('Failed to connect to the database', err);
        process.exit(-1);
      });

      const db = drizzle({ client: pool, schema });

      return db;
    },
  },
];

@Module({
  providers,
  exports: providers,
})
export class DbModule {}
