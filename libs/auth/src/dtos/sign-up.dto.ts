import { UserService } from '@lib/user';
import { createZodDto } from 'nestjs-zod';

export const signUpSchema = UserService.userCreateSchema;

export class SignUpDto extends createZodDto(signUpSchema) {}
