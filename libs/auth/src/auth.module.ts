import { UserModule } from '@lib/user';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  exports: [AuthService],
  imports: [
    UserModule,
    JwtModule.register({
      // TODO: move to env
      secret: 'jwt_secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
