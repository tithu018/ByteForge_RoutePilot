import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { ArrowUpRight, ChevronDown, ChevronRight, Command, Menu, PanelLeftClose, Radio, Settings2, UserRound, WifiOff } from 'lucide-react';
import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@waypoint/ui';
import type { Workspace } from './workspaces';
import { clearSession, getSession } from '../lib/auth';

function subscribeConnection(callback: () => void) { window.addEventListener('online', callback); window.addEventListener('offline', callback); return () => { window.removeEventListener('online', callback); window.removeEventListener('offline', callback); }; }
function ConnectionPlaceholder() {
  const online = useSyncExternalStore(subscribeConnection, () => navigator.onLine, () => true);
  return <div className="connection-reservation">{online ? <Radio size={15} aria-hidden="true" /> : <WifiOff size={15} aria-hidden="true" />}<span>{online ? 'Device connected' : 'Device offline'}<span className="connection-detail"> · Offline delivery support coming later</span></span></div>;
}
function Brand() { return <div className="brand"><span className="brand-symbol" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 32 32"><path d="M4 9l6 15 6-12 6 12 6-15" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span><div><strong>{'<SOLUTION_NAME>'}</strong><span>DELIVERY OPERATIONS</span></div></div>; }
function Navigation({ workspace, onNavigate }: { workspace: Workspace; onNavigate?: () => void }) {
  return <nav aria-label={`${workspace.name} navigation`} className="workspace-nav">{workspace.navigation.map(({ path, label, icon: Icon }) => <NavLink end to={`/${workspace.id}${path ? `/${path}` : ''}`} key={path} onClick={onNavigate}><Icon size={18} aria-hidden="true" /><span>{label}</span><ChevronRight className="nav-active-arrow" size={14} aria-hidden="true" /></NavLink>)}</nav>;
}
export function WorkspaceLayout({ workspace }: { workspace: Workspace }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const previousPath = useRef(location.pathname);
  const main = useRef<HTMLElement>(null);
  const current = workspace.navigation.find((item) => location.pathname === `/${workspace.id}${item.path ? `/${item.path}` : ''}`);
  useEffect(() => {
    document.title = `${current?.label ?? 'Workspace'} · ${workspace.name} · Solution name`;
    if (previousPath.current !== location.pathname) { main.current?.focus(); previousPath.current = location.pathname; }
  }, [current?.label, location.pathname, workspace.name]);
  const field = workspace.id === 'driver' || workspace.id === 'loader';
  return <div className={`app-shell ${field ? 'field-shell' : ''} workspace-${workspace.id}`}>
    <a href="#main-content" className="skip-link">Skip to content</a>
    <aside className="desktop-sidebar"><Brand /><div className="tenant-label"><span className="tenant-mark">W</span><div><strong>Waypoint Group</strong><span>{workspace.subtitle}</span></div></div><p className="nav-section-label">WORKSPACE</p><Navigation workspace={workspace} /><div className="sidebar-bottom"><Link to="/foundation"><Settings2 size={17} aria-hidden="true" />Foundation & components<ArrowUpRight size={14} aria-hidden="true" /></Link><div className="sidebar-build"><span className="build-dot" />Phase 2 · Development preview</div></div></aside>
    <div className="shell-main"><header className="app-header"><div className="header-left"><Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="mobile-menu-button" aria-label="Open navigation"><Menu size={20} /></Button></SheetTrigger><SheetContent className="mobile-nav-sheet"><SheetTitle>{workspace.name} workspace</SheetTitle><SheetDescription>Authorized operational workspace.</SheetDescription><Navigation workspace={workspace} onNavigate={() => setMenuOpen(false)} /><Button asChild variant="secondary"><Link to="/foundation" onClick={() => setMenuOpen(false)}>Foundation & components</Link></Button></SheetContent></Sheet><PanelLeftClose size={18} aria-hidden="true" className="desktop-header-icon" /><nav aria-label="Breadcrumb" className="breadcrumbs"><span>{workspace.name}</span><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">{current?.label ?? 'Workspace'}</span></nav></div><div className="header-right"><Badge tone="neutral" className="header-phase">Authenticated</Badge><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" className="user-menu"><span className="user-avatar"><UserRound size={16} aria-hidden="true" /></span><span className="user-menu-label">{session?.user.displayName ?? 'Account'}</span><ChevronDown size={14} aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel className="menu-label">{session?.user.email ?? 'Authenticated account'}</DropdownMenuLabel><DropdownMenuItem onSelect={() => { clearSession(); navigate('/login', { replace: true }); }}>Sign out</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem asChild><Link to="/access-denied">Permission details</Link></DropdownMenuItem></DropdownMenuContent></DropdownMenu></div></header>
    {workspace.id === 'driver' && <ConnectionPlaceholder />}
    <main id="main-content" ref={main} tabIndex={-1} className="page-container"><Outlet context={workspace} /></main><footer className="app-footer"><span>Waypoint Group · Delivery operations</span><span><Command size={12} aria-hidden="true" /> Built from the approved design baseline</span></footer></div>
    {field && <nav className="mobile-bottom-nav" aria-label={`${workspace.name} mobile navigation`}>{workspace.navigation.map(({ path, label, icon: Icon }) => <NavLink end key={path} to={`/${workspace.id}${path ? `/${path}` : ''}`}><Icon size={20} aria-hidden="true" /><span>{label}</span></NavLink>)}</nav>}
  </div>;
}
