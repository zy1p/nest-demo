import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { AppService } from './app.service';
import { CsrfGuard, generateToken } from './csrf';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('csrf')
  getCsrfToken(@Req() req, @Res({ passthrough: true }) res) {
    const token = generateToken(req, res, true);
    return { token };
  }

  @ApiHeader({ name: 'x-csrf-token', required: true })
  @UseGuards(CsrfGuard)
  @Post('csrf-protected')
  csrfProtected() {
    return { message: 'CSRF protected route' };
  }
}
