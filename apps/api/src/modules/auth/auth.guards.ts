import { Injectable, UnauthorizedException, ForbiddenException, SetMetadata } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Reflector } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { verifyAccessToken } from './jwt';
import type { AuthenticatedRequest } from './auth.types';
import type { Role } from '../../generated/prisma/enums';

export const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> => SetMetadata('roles', roles);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = request.headers.authorization?.startsWith('Bearer ') ? request.headers.authorization.slice(7) : undefined;
    if (!token) throw new UnauthorizedException('Authentication is required.');
    try { request.user = verifyAccessToken(token, this.config.getOrThrow<string>('JWT_SECRET')); return true; } catch { throw new UnauthorizedException('Your session has expired.'); }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user || !roles.includes(request.user.role)) throw new ForbiddenException("You don't have access to this page.");
    return true;
  }
}