import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Button, FormField, Input } from '@waypoint/ui';
import { getSession, login } from '../lib/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  if (getSession()) return <Navigate to="/" replace />;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(undefined);
    try { const session = await login(email, password); navigate(`/${session.user.role === 'STORE_MANAGER' ? 'store' : session.user.role.toLowerCase()}`, { replace: true }); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "We couldn't sign you in. Check your details and try again."); }
    finally { setLoading(false); }
  }
  return <main className="auth-page"><div className="auth-panel"><div className="auth-mark" aria-hidden="true">W</div><p className="eyebrow">WAYPOINT GROUP</p><h1>Sign in to delivery operations</h1><p className="auth-copy">Use your authorized operational account to continue.</p><form onSubmit={submit} noValidate>{error && <p className="ui-field-error auth-error" role="alert">{error}</p>}<FormField id="email" label="Email" required><Input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></FormField><FormField id="password" label="Password" required><Input id="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></FormField><Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button></form><p className="auth-note">Development authentication. Access is determined by the account role.</p></div></main>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  const workspace = location.pathname.split('/')[1];
  const permitted = { dispatcher: 'DISPATCHER', loader: 'LOADER', driver: 'DRIVER', store: 'STORE_MANAGER' } as const;
  if (workspace && permitted[workspace as keyof typeof permitted] !== session.user.role) return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
}