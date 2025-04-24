import { Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('csrf')
  getCsrfToken() {
    // TODO: integrate double csrf
  }

  // TODO: create a guard for csrf protection
  @Post('csrf-protected')
  csrfProtected() {
    return true;
  }
}
