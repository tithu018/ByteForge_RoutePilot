export type Role = 'DISPATCHER' | 'LOADER' | 'DRIVER' | 'STORE_MANAGER';
export interface SessionUser { sub: string; email: string; displayName: string; role: Role; outletId: string | null; }
export interface Session { accessToken: string; user: SessionUser; }
const key = 'waypoint.session';

export function getSession(): Session | null {
  const value = sessionStorage.getItem(key);
  if (!value) return null;
  try { return JSON.parse(value) as Session; } catch { sessionStorage.removeItem(key); return null; }
}
export function clearSession(): void { sessionStorage.removeItem(key); }
export async function login(email: string, password: string): Promise<Session> {
  const response = await fetch(`${(import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '')}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ email, password }) });
  if (!response.ok) throw new Error("We couldn't sign you in. Check your details and try again.");
  const session = await response.json() as Session;
  sessionStorage.setItem(key, JSON.stringify(session));
  return session;
}