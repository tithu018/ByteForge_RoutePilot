import type { Role } from '../../generated/prisma/enums';
import type { Request } from 'express';

export interface AuthenticatedUser {
  sub: string;
  email: string;
  displayName: string;
  role: Role;
  outletId: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}