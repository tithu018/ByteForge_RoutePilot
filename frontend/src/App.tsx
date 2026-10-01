import * as Dialog from '@radix-ui/react-dialog';
import {
  ArrowRight,
  Box,
  Check,
  ClipboardCheck,
  CloudOff,
  Grid2X2,
  Menu,
  RefreshCw,
  ShieldCheck,
  Store,
  Truck,
  Warehouse,
  X,
} from 'lucide-react';

const roles = [
  {
    icon: Store,
    title: 'Store Manager',
    description: 'Place and track outlet orders, see planned arrivals and confirm receipt.',
    platform: 'Desktop · Phone',
  },
  {
    icon: Grid2X2,
    title: 'Dispatcher',
    description: 'Build feasible delivery plans, explain deferrals and monitor live execution.',
    platform: 'Desktop',
  },
  {
    icon: Box,
    title: 'Loader',
    description: 'Load trips against the published plan and flag shortfalls before departure.',
    platform: 'Tablet · Shared terminal',
  },
  {
    icon: Truck,
    title: 'Driver',
    description: 'Run your assigned route safely and keep delivery records working offline.',
    platform: 'Phone',
  },
] as const;

const workflow = [
  ['Store order', 'Outlet places and confirms an order before cutoff.'],
  ['Dispatcher plan', 'Suggested plan is checked against vehicle and delivery rules.'],
  ['Loader hand-off', 'Trip is loaded in sequence and shortfalls are flagged early.'],
  ['Driver execution', 'Driver records each stop online or offline.'],
  ['Store receipt', 'Receipt is confirmed in full, short or damaged.'],
  ['Issue resolution', 'Evidence is compared before any decision.'],
] as const;

const benefits = [
  [RefreshCw, 'Plans you can explain', 'Every suggested plan shows its reasons, and a dispatcher approves it before it is published.'],
  [Check, 'Nothing slips through', 'Every hand-off ends with a confirmation or a clear way to retry.'],
  [ShieldCheck, 'Safer on the road', 'Drivers see detailed actions only after they have safely stopped.'],
  [ClipboardCheck, 'Fair issue resolution', 'Loader counts, delivery events and store receipts are compared before a decision.'],
] as const;

function WaypointLogo() {
  return (
    <a className="brand" href="#top" aria-label="Waypoint home">
      <span className="brand-mark" aria-hidden="true">W</span>
      <span>Waypoint</span>
    </a>
  );
}

function SignInDialog({ triggerClassName = '' }: { triggerClassName?: string }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={`button button-primary ${triggerClassName}`}>Sign in</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div>
            <p className="eyebrow">Sign in</p>
            <Dialog.Title>Choose your workspace</Dialog.Title>
            <Dialog.Description>
              Each role uses its own secure workspace and the same shared delivery record.
            </Dialog.Description>
          </div>
          <div className="dialog-role-list">
            {roles.map(({ icon: Icon, title, platform }) => (
              <button type="button" className="dialog-role" key={title}>
                <span className="icon-circle"><Icon size={19} strokeWidth={1.8} /></span>
                <span><strong>{title}</strong><small>{platform}</small></span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          <Dialog.Close className="dialog-close" aria-label="Close sign in dialog">
            <X size={20} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function HeroIllustration() {
  return (
    <div className="hero-illustration" aria-hidden="true">
      <div className="sun" />
      <div className="mountain mountain-far" />
      <div className="mountain mountain-near" />
      <div className="route route-one" />
      <div className="route route-two" />
      <span className="map-node node-one"><Store size={16} /></span>
      <span className="map-node node-two"><Warehouse size={18} /></span>
      <span className="map-node node-three"><Truck size={18} /></span>
      <div className="warehouse-building">
        <Warehouse size={56} strokeWidth={1.4} />
        <span>Waypoint depot</span>
      </div>
      <div className="hero-truck"><Truck size={60} strokeWidth={1.35} /></div>
    </div>
  );
}

function App() {
  return (
    <main id="top">
      <section className="hero-section">
        <header className="site-header page-width">
          <WaypointLogo />
          <nav aria-label="Main navigation">
            <a href="#how-it-works">How it works</a>
            <a href="#roles">Roles</a>
          </nav>
          <SignInDialog />
          <button className="mobile-menu" type="button" aria-label="Open menu"><Menu /></button>
        </header>

        <div className="hero-layout page-width">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light">Delivery operations platform</p>
            <h1>One shared workflow from outlet order to confirmed delivery.</h1>
            <p className="hero-intro">
              Plan, load, deliver and confirm every outlet order in one connected workspace—with
              clear status for everyone involved.
            </p>
            <div className="hero-actions">
              <SignInDialog />
              <a className="button button-secondary-light" href="#how-it-works">See how it works</a>
            </div>
            <div className="status-row" aria-label="Example delivery statuses">
              <span className="status status-success"><Check size={14} />Delivered</span>
              <span className="status status-warning">△ Deferred</span>
              <span className="status status-neutral"><RefreshCw size={13} />Sync pending</span>
              <small>Clear, shared status at every step</small>
            </div>
          </div>
          <HeroIllustration />
        </div>

        <div className="feature-strip page-width">
          <article><span className="feature-icon"><ClipboardCheck /></span><div><strong>One record, end to end</strong><p>Orders, plans, loading, delivery and receipt share a single history.</p></div></article>
          <article><span className="feature-icon"><ShieldCheck /></span><div><strong>Role-based access</strong><p>Everyone sees only their outlet, depot or assigned trip.</p></div></article>
          <article><span className="feature-icon"><CloudOff /></span><div><strong>Keeps working offline</strong><p>Drivers can deliver without signal; records sync automatically.</p></div></article>
          <article><span className="feature-icon"><RefreshCw /></span><div><strong>Live status updates</strong><p>Plan changes and delivery events reach the right people as they happen.</p></div></article>
        </div>
      </section>

      <section className="section section-roles" id="roles">
        <div className="page-width">
          <p className="eyebrow">Roles</p>
          <h2>Four roles. One shared system.</h2>
          <p className="section-intro">Each role signs in to its own workspace, with the same status vocabulary, data and audit trail.</p>
          <div className="role-grid">
            {roles.map(({ icon: Icon, title, description, platform }) => (
              <article className="role-card" key={title}>
                <span className="icon-circle"><Icon size={23} strokeWidth={1.8} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
                <div><strong>{platform}</strong><ArrowRight size={18} /></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="page-width">
          <p className="eyebrow">How it works</p>
          <h2>One loop from order to resolution</h2>
          <div className="workflow-grid">
            {workflow.map(([title, description], index) => (
              <article className="workflow-card" key={title}>
                <span>{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < workflow.length - 1 && <ArrowRight className="workflow-arrow" size={19} />}
              </article>
            ))}
          </div>
          <p className="audit-note"><ShieldCheck size={18} />Every stage writes to one shared audit trail—changes are never silently overwritten.</p>

          <p className="eyebrow benefit-eyebrow">Why Waypoint</p>
          <h2>Built for everyday delivery operations</h2>
          <div className="benefit-grid">
            {benefits.map(([Icon, title, description]) => (
              <article key={title}>
                <span className="icon-circle"><Icon size={21} /></span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Sign in with the account your administrator set up for you.</p>
        <SignInDialog />
      </section>

      <footer className="site-footer">
        <div className="page-width">
          <WaypointLogo />
          <nav aria-label="Footer navigation"><a href="#top">Help centre</a><a href="#top">Contact support</a><a href="#top">Privacy</a><a href="#top">Terms of use</a></nav>
          <small>© 2026 Waypoint. All rights reserved.</small>
        </div>
      </footer>
    </main>
  );
}

export default App;
