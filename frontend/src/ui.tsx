import type { ElementType, ReactNode } from 'react';
import { Link } from 'react-router';
import {
  Bell,
  Check,
  ClipboardList,
  Clock3,
  Grid2X2,
  History,
  LogOut,
  PackageCheck,
  RefreshCw,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Store,
  Truck,
} from 'lucide-react';
import logoWhite from '../images/logo-white.png';
import storeManagerImage from '../images/store-manager.webp';

export type Tone = 'success' | 'warning' | 'danger' | 'neutral';

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function StatusChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`status-chip ${tone}`}><span className="status-dot" />{children}</span>;
}

export function IconBubble({ icon: Icon, tone = 'success' }: { icon: ElementType; tone?: Tone }) {
  return <span className={`icon-bubble ${tone}`}><Icon size={20} strokeWidth={1.8} /></span>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('card', className)}>{children}</section>;
}

export function ActionLink({ to, children, kind = 'primary', className }: { to: string; children: ReactNode; kind?: 'primary' | 'secondary' | 'danger' | 'ghost'; className?: string }) {
  return <Link className={cx('button', kind, className)} to={to}>{children}</Link>;
}

export function ActionButton({ children, kind = 'primary', disabled = false, className }: { children: ReactNode; kind?: 'primary' | 'secondary' | 'danger' | 'ghost'; disabled?: boolean; className?: string }) {
  return <button className={cx('button', kind, className)} type="button" disabled={disabled}>{children}</button>;
}

export function KeyRows({ rows }: { rows: Array<[ReactNode, ReactNode]> }) {
  return <div className="key-rows">{rows.map(([label, value], index) => <div className="key-row" key={`${String(label)}-${index}`}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

export function Quantity({ value }: { value: number }) {
  return <div className="quantity" aria-label={`Quantity ${value}`}><button type="button" aria-label="Decrease quantity">−</button><strong>{value}</strong><button type="button" aria-label="Increase quantity">+</button></div>;
}

const navItems = [
  ['dashboard', Grid2X2, 'Dashboard', '/store/sm01'],
  ['order', ClipboardList, 'Place order', '/store/sm02'],
  ['status', Truck, 'Order status', '/store/sm05'],
  ['receive', PackageCheck, 'Receive', '/store/sm09'],
  ['history', History, 'History & issues', '/store/sm12'],
  ['notifications', Bell, 'Notifications · 4', '/store/sm14'],
  ['settings', SettingsIcon, 'Settings', '/store/sm15'],
] as const;

type StoreShellProps = {
  active: typeof navItems[number][0];
  children: ReactNode;
  outlet?: 'Fresh' | 'Style' | 'Tech';
  outletId?: string;
  mall?: boolean;
  cutoff?: string;
};

export function StoreShell({ active, children, outlet = 'Fresh', outletId = 'OUT010', mall = false, cutoff = 'Cutoff 16:00 · 20 min left' }: StoreShellProps) {
  const outletLine = `Colombo · Peliyagoda depot${mall ? ' · mall bay' : ''}`;
  return (
    <div className="store-workspace">
      <aside className="store-sidebar">
        <div className="sidebar-brand"><img src={logoWhite} alt="" /><strong>Waypoint</strong></div>
        <nav aria-label="Store Manager navigation">
          {navItems.map(([id, Icon, label, to]) => <Link className={cx('sidebar-link', active === id && 'active')} to={to} key={id}><Icon size={19} strokeWidth={1.8} /><span>{label}</span></Link>)}
        </nav>
        <img className="store-illustration" src={storeManagerImage} alt="" />
        <div className="outlet-card"><strong>{outletId} · {outlet}</strong><span>{outletLine}</span></div>
        <button className="signout" type="button"><LogOut size={18} />Sign out</button>
      </aside>
      <div className="store-main">
        <header className="store-header">
          <div className="store-location"><Store size={18} /><strong>{outletId} · {outlet} outlet</strong><span>{outletLine}</span></div>
          <div className="store-user"><StatusChip tone="warning">{cutoff}</StatusChip><Bell size={21} /><span className="avatar">SM</span><div><strong>Store Manager</strong><small>Tue 24 Mar · 15:40</small></div></div>
        </header>
        <div className="store-content">{children}</div>
      </div>
    </div>
  );
}

export function PageHeading({ title, subtitle, backTo, backLabel }: { title: string; subtitle?: string; backTo?: string; backLabel?: string }) {
  return <div className="page-heading">{backTo && <Link className="back-link" to={backTo}>← {backLabel ?? 'Back'}</Link>}<h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>;
}

export function ResultCard({ icon: Icon = Check, title, description, children, tone = 'success' }: { icon?: ElementType; title: string; description: string; children: ReactNode; tone?: Tone }) {
  return <Card className="result-card"><IconBubble icon={Icon} tone={tone} /><h2>{title}</h2><p>{description}</p>{children}</Card>;
}

export function ModalPage({ title, description, children, icon: Icon }: { title: string; description: string; children: ReactNode; icon?: ElementType }) {
  return <main className="modal-stage"><Card className="modal-card">{Icon && <IconBubble icon={Icon} tone="danger" />}<h1>{title}</h1><p>{description}</p>{children}</Card></main>;
}

export function DriverShell({ children, time, title = 'VEH012 · Trip 1', subtitle = 'Wed 25 Mar · Peliyagoda', status = 'Up to date', tone = 'success', offline = false, night = false, active = 'today' }: { children: ReactNode; time: string; title?: string; subtitle?: string; status?: string; tone?: Tone; offline?: boolean; night?: boolean; active?: 'today' | 'trip' | 'sync' }) {
  return (
    <div className={cx('driver-stage', night && 'night-stage')}>
      <main className={cx('driver-app', night && 'night')}>
        <header className="driver-header">
          <div className="phone-status"><strong>{time}</strong><span>{offline ? 'No signal' : '4G  ▮ ▮ ▮'}</span></div>
          <div className="driver-trip-head"><div><strong>{title}</strong><small>{subtitle}</small></div><StatusChip tone={tone}>{status}</StatusChip><SlidersHorizontal size={22} /></div>
        </header>
        {offline && <div className="offline-banner"><span aria-hidden="true">⌁</span>Offline — changes are saved on this phone</div>}
        <div className="driver-content">{children}</div>
        <nav className="driver-tabs" aria-label="Driver navigation">
          <Link className={cx(active === 'today' && 'active')} to="/driver/dr01"><Clock3 /><span>Today</span></Link>
          <Link className={cx(active === 'trip' && 'active')} to="/driver/dr02"><SlidersHorizontal /><span>Active trip</span></Link>
          <Link className={cx(active === 'sync' && 'active')} to="/driver/dr09"><RefreshCw /><span>Sync</span></Link>
        </nav>
      </main>
    </div>
  );
}

export function DriverModal({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="driver-stage"><main className="driver-modal-wrap"><Card className="driver-modal"><h1>{title}</h1><p>{description}</p>{children}</Card></main></div>;
}

export function RadioCard({ title, description, checked = false, children }: { title: string; description?: string; checked?: boolean; children?: ReactNode }) {
  return <label className={cx('radio-card', checked && 'selected')}><input type="radio" defaultChecked={checked} name="choice" /><span className="radio-dot" /><span><strong>{title}</strong>{description && <small>{description}</small>}{children}</span></label>;
}

export function Timeline({ items }: { items: Array<[string, string, 'done' | 'current' | 'todo']> }) {
  return <div className="timeline">{items.map(([title, description, state]) => <div className={`timeline-item ${state}`} key={title}><span className="timeline-marker">{state === 'done' ? '✓' : ''}</span><div><strong>{title}</strong><small>{description}</small></div></div>)}</div>;
}
