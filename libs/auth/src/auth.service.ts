import { type UserService } from '@lib/user';
import { type z } from 'zod';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { type JwtService } from '@nestjs/jwt';

import { type signInSchema } from './dtos/sigin-in.dto';
import { type signUpSchema } from './dtos/sigin-up.dto';
import { type PasswordService } from './password/password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}
  async signUp({ password, ...input }: z.infer<typeof signUpSchema>) {
    const hashedPassword = await this.passwordService.scrypt(password);

    const [user] = await this.userService.createUser({
      ...input,
      password: hashedPassword,
    });

    return user;
  }

  async signInAfterSignUp(user: Awaited<ReturnType<typeof this.signUp>>) {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUpAndSignIn(input: z.infer<typeof signUpSchema>) {
    const user = await this.signUp(input);
    return this.signInAfterSignUp(user);
  }

  async signIn(input: z.infer<typeof signInSchema>) {
    const user = await this.userService.getUserByUsername(
      input.emailOrUsername,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'You need to set a password before using it',
      );
    }

    const isPasswordValid = await this.passwordService.verify(
      input.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
