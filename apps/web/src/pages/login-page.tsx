import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Button, FormField, Input } from '@waypoint/ui';
import {
  ArrowRight,
  BarChart3,
  Cloud,
  Eye,
  EyeOff,
  Headphones,
  LockKeyhole,
  Mail,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { getSession, login } from '../lib/auth';
import { WaypointBrand } from '../components/waypoint-brand';
import { AccessHelp } from '../components/access-help';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(() => localStorage.getItem('waypoint.remembered-email') ?? '');
  const [remember, setRemember] = useState(() =>
    Boolean(localStorage.getItem('waypoint.remembered-email')),
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const session = getSession();
  if (session)
    return (
      <Navigate
        to={`/${session.user.role === 'STORE_MANAGER' ? 'store' : session.user.role.toLowerCase()}`}
        replace
      />
    );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      const result = await login(email, password);
      if (remember) localStorage.setItem('waypoint.remembered-email', email);
      else localStorage.removeItem('waypoint.remembered-email');
      navigate(
        `/${result.user.role === 'STORE_MANAGER' ? 'store' : result.user.role.toLowerCase()}`,
        { replace: true },
      );
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="reference-login">
      <div className="login-backdrop" />
      <section className="login-story">
        <WaypointBrand light />
        <p className="spaced-label">DELIVER SMARTER. GO FURTHER.</p>
        <h1>
          Real-Time
          <br />
          Visibility for a<br />
          <em>
            Better Connected
            <br />
            Supply Chain
          </em>
        </h1>
        <p className="login-intro">
          Waypoint Control Tower gives logistics and retail teams a shared view of orders, delivery
          plans, and operational updates.
        </p>
        <div className="login-benefits">
          {[
            {
              icon: BarChart3,
              title: 'Operations Visibility',
              text: 'Review orders, vehicles, and recorded delivery progress across your network.',
            },
            {
              icon: MapPin,
              title: 'Smarter Delivery Planning',
              text: 'Keep capacity, stop sequence, and delivery requirements in view.',
            },
            {
              icon: Users,
              title: 'Connected Teams',
              text: 'Unify dispatchers, loaders, drivers, and store managers in one workspace.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <span>
                <Icon size={32} />
              </span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="login-stat-row">
          <div>
            <strong>4 roles</strong>
            <span>
              One connected
              <br />
              operation
            </span>
          </div>
          <div>
            <strong>Orders</strong>
            <span>
              Demand and
              <br />
              delivery requests
            </span>
          </div>
          <div>
            <strong>Trips</strong>
            <span>
              Planning and
              <br />
              handoffs
            </span>
          </div>
          <div>
            <strong>One view</strong>
            <span>
              Operational
              <br />
              clarity
            </span>
          </div>
        </div>
      </section>
      <section className="login-form-column">
        <p className="login-tagline">
          Smarter Delivery.
          <br />
          Greater Possibilities.
        </p>
        <div className="login-card">
          <p className="spaced-label">WELCOME TO</p>
          <WaypointBrand />
          <h2>Sign in to your account</h2>
          <p className="login-card-copy">Access your operations, deliveries, and team.</p>
          <form onSubmit={submit}>
            {error && (
              <p role="alert" className="ui-field-error">
                {error}
              </p>
            )}
            <FormField id="email" label="Email address" required>
              <div className="login-input">
                <Mail size={20} />
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </FormField>
            <FormField id="password" label="Password" required>
              <div className="login-input">
                <LockKeyhole size={20} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </FormField>
            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember email
              </label>
              <AccessHelp label="Forgot password?" />
            </div>
            <Button type="submit" loading={loading}>
              Sign in <ArrowRight size={19} />
            </Button>
          </form>
          <div className="login-divider">
            <span>Workspace access</span>
          </div>
          <div className="login-access-options">
            <div>
              <ShieldCheck size={21} />
              <AccessHelp label="Account access" />
            </div>
            <div>
              <Headphones size={21} />
              <AccessHelp label="Sign-in help" />
            </div>
          </div>
          <div className="login-role-note">
            <Users size={30} />
            <div>
              <strong>Built for every role in your operation</strong>
              <p>
                Dispatcher <b>&middot;</b> Loader <b>&middot;</b> Driver <b>&middot;</b> Store
                Manager
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="login-footer">
        <div>
          <ShieldCheck />
          <span>
            <strong>Role-Based Access</strong>
            <p>Your authorized account connects you to the right workspace.</p>
          </span>
        </div>
        <div>
          <Cloud />
          <span>
            <strong>Connected Operations</strong>
            <p>Keep delivery records and team handoffs together.</p>
          </span>
        </div>
        <div>
          <Headphones />
          <span>
            <strong>Need Help?</strong>
            <p>Contact your administrator for account support.</p>
            <AccessHelp />
          </span>
        </div>
      </footer>
    </main>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const session = getSession();
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  const workspace = location.pathname.split('/')[1];
  const permitted = {
    dispatcher: 'DISPATCHER',
    loader: 'LOADER',
    driver: 'DRIVER',
    store: 'STORE_MANAGER',
  } as const;
  if (workspace && permitted[workspace as keyof typeof permitted] !== session.user.role)
    return <Navigate to="/access-denied" replace />;
  return <>{children}</>;
}
