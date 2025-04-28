import type { Env } from '@lib/env';
import type { DynamicModule, Provider } from '@nestjs/common';
import { ENV } from '@lib/env';
import { DrizzleConfig } from 'drizzle-orm';
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

export interface DbModuleOptions {
  connectionString: string;
  provide: string;
  schema: DrizzleConfig['schema'];
  global?: boolean;
}

@Module({
  providers,
  exports: providers,
})
export class DbModule {
  static forRoot(options: DbModuleOptions): DynamicModule {
    const providers: Provider[] = [
      {
        provide: options.provide,
        inject: [Logger],
        useFactory: async (logger: Logger) => {
          const pool = new Pool({
            connectionString: options.connectionString,
          });

          await pool.query('SELECT 1;').catch((err) => {
            logger.error('Failed to connect to the database', err);
            process.exit(-1);
          });

          const db = drizzle({ client: pool, schema: options.schema });

          return db;
        },
      },
    ];

    return {
      module: DbModule,
      providers,
      exports: providers,
      global: options.global,
    };
  }
}
