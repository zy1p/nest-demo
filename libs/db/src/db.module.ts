import type { Env } from '@lib/env';
import type { Provider } from '@nestjs/common';
import { ENV } from '@lib/env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { Module } from '@nestjs/common';

import * as schema from './schema';

export const QUERY_CLIENT = 'QUERY_CLIENT';

export type QueryClient = ReturnType<typeof drizzle<typeof schema>>;

const providers: Provider[] = [
  {
    provide: QUERY_CLIENT,
    inject: [ENV],
    useFactory: (env: Env) => {
      const pool = new Pool({
        connectionString: env.POSTGRES_DATABASE_URL,
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
