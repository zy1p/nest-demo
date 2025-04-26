import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from './auth.guard';
import { type AuthService } from './auth.service';
import { type SignInDto } from './dtos/sigin-in.dto';
import { type SignUpDto } from './dtos/sigin-up.dto';
import { User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('current-user')
  currentUser(@User() user) {
    return user;
  }
}
