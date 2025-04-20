import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { Env } from 'src/env.validation';

import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as schema from './schema';

export const QUERY_CLIENT = 'QUERY_CLIENT';

export type QueryClient = ReturnType<typeof drizzle<typeof schema>>;

const providers: Provider[] = [
  {
    provide: QUERY_CLIENT,
    inject: [ConfigService],
    useFactory: (configService: ConfigService<Env, true>) => {
      const pool = new Pool({
        connectionString: configService.get('POSTGRES_DATABASE_URL', {
          infer: true,
        }),
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
