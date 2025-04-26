import type { Provider } from '@nestjs/common';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { Global, Module } from '@nestjs/common';

export const ENV = 'ENV';

const env = createEnv({
  server: {
    PORT: z.coerce.number().min(0).max(65535).default(3000),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    POSTGRES_DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export type Env = typeof env;

const providers: Provider[] = [
  {
    provide: ENV,
    useValue: env,
  },
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class EnvModule {}
