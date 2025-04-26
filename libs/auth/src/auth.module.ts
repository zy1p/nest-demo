import type { Env } from '@lib/env';
import { ENV } from '@lib/env';
import { UserModule } from '@lib/user';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';

@Module({
  providers: [AuthService, PasswordService],
  exports: [AuthService],
  imports: [
    UserModule,
    JwtModule.registerAsync({
      inject: [ENV],
      useFactory: async (env: Env) => ({
        secret: env.JWT_SECRET,
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
