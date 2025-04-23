import type { FastifyReply } from 'fastify';

import { Controller, Get, Post, Res } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('csrf')
  getCsrfToken(@Res({ passthrough: true }) res: FastifyReply) {
    // @ts-expect-error types are not compatible
    const token = res.generateCsrf();
    return { token };
  }

  // TODO: create a guard for csrf protection
  @Post('csrf-protected')
  csrfProtected() {
    return true;
  }
}
