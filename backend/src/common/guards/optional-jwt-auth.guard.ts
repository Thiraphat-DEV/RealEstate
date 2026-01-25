import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const result = super.canActivate(context);

    if (result instanceof Promise) {
      return result.catch(() => true);
    }

    if (result instanceof Observable) {
      return result.pipe(catchError(() => of(true)));
    }

    return result;
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    _info: any,
    _context: ExecutionContext,
    _status?: any
  ): TUser {
    if (err || !user) {
      return null as TUser;
    }
    return user as TUser;
  }
}
