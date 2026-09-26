import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AuthenticatedUser } from './auth.types';

const encode = (value: unknown): string => Buffer.from(JSON.stringify(value)).toString('base64url');
const decode = (value: string): unknown => JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as unknown;

export function signAccessToken(user: AuthenticatedUser, secret: string): string {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const payload = encode({ ...user, iat: now, exp: now + 900 });
  const input = `${header}.${payload}`;
  const signature = createHmac('sha256', secret).update(input).digest('base64url');
  return `${input}.${signature}`;
}

export function verifyAccessToken(token: string, secret: string): AuthenticatedUser {
  const parts = token.split('.');
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) throw new Error('Invalid token');
  const expected = createHmac('sha256', secret).update(`${parts[0]}.${parts[1]}`).digest();
  const actual = Buffer.from(parts[2], 'base64url');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Invalid token');
  const payload = decode(parts[1]);
  if (!payload || typeof payload !== 'object' || !('exp' in payload) || typeof payload.exp !== 'number' || payload.exp <= Math.floor(Date.now() / 1000)) throw new Error('Expired token');
  return payload as unknown as AuthenticatedUser;
}