import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const signInSchema = z.object({
  emailOrUsername: z.string().email().or(z.string()),
  password: z.string().min(8),
});

export class SignInDto extends createZodDto(signInSchema) {}
