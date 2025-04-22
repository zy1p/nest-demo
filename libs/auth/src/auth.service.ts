import { UserService } from '@lib/user';
import { z } from 'zod';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { signInSchema } from './dtos/sigin-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(input: z.infer<typeof signInSchema>): Promise<any> {
    const user = await this.userService.getUserByUsername(
      input.emailOrUsername,
    );

    // TODO: add password hashing
    if (user?.password !== input.password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
