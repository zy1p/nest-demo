import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sigin-in.dto';
import { SignUpDto } from './dtos/sigin-up.dto';

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
  @Post('protected')
  protected() {
    return 'This is a protected route';
  }
}
