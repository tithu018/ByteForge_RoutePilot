import { Injectable, UnauthorizedException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DatabaseService } from '../../database/database.service';
import { signAccessToken } from './jwt';
import { verifyPassword } from './password';
import type { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService, private readonly config: ConfigService) {}

  async login(email: string, password: string): Promise<{ accessToken: string; user: AuthenticatedUser }> {
    const record = await this.database.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!record?.passwordHash || !(await verifyPassword(password, record.passwordHash))) throw new UnauthorizedException("We couldn't sign you in. Check your details and try again.");
    const user: AuthenticatedUser = { sub: record.id, email: record.email, displayName: record.displayName, role: record.role, outletId: record.outletId };
    return { accessToken: signAccessToken(user, this.config.getOrThrow<string>('JWT_SECRET')), user };
  }

  async profile(userId: string): Promise<AuthenticatedUser> {
    const record = await this.database.prisma.user.findUnique({ where: { id: userId } });
    if (!record) throw new UnauthorizedException('Your session is no longer valid.');
    return { sub: record.id, email: record.email, displayName: record.displayName, role: record.role, outletId: record.outletId };
  }
}