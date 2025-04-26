import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { type Observable } from 'rxjs';

import { Injectable } from '@nestjs/common';

import { invalidCsrfTokenError, validateRequest } from '.';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const isValid = validateRequest(request);

    if (!isValid) throw invalidCsrfTokenError;

    return true;
  }
}
