import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export function validate(_config) {
  const env = createEnv({
    server: {
      PORT: z.coerce.number().min(0).max(65536).default(3000),
      NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
      POSTGRES_DATABASE_URL: z.string().url(),
      JWT_SECRET: z.string().min(1),
    },
    runtimeEnv: _config,
    emptyStringAsUndefined: true,
  });

  return env;
}

export type Env = ReturnType<typeof validate>;
