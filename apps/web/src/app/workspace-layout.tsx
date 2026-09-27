import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Headphones,
  LogOut,
  Mail,
  Menu,
  Search,
  Settings2,
  UserRound,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@waypoint/ui';
import type { Workspace } from './workspaces';
import { clearSession, getSession } from '../lib/auth';
import { WaypointBrand } from '../components/waypoint-brand';
import { AccessHelp } from '../components/access-help';
function subscribeConnection(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
function Navigation({ workspace, onNavigate }: { workspace: Workspace; onNavigate?: () => void }) {
  return (
    <nav className="workspace-nav" aria-label={`${workspace.name} navigation`}>
      {workspace.navigation.map(({ path, label, icon: Icon }) => (
        <NavLink
          end
          key={path}
          to={`/${workspace.id}${path ? `/${path}` : ''}`}
          onClick={onNavigate}
        >
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
export function WorkspaceLayout({ workspace }: { workspace: Workspace }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  const online = useSyncExternalStore(
    subscribeConnection,
    () => navigator.onLine,
    () => true,
  );
  const current = workspace.navigation.find(
    (item) => location.pathname === `/${workspace.id}${item.path ? `/${item.path}` : ''}`,
  );
  useEffect(() => {
    document.title = `${current?.label ?? 'Workspace'} | Waypoint Control Tower`;
    if (previousPath.current !== location.pathname) {
      main.current?.focus();
      previousPath.current = location.pathname;
    }
  }, [current?.label, location.pathname]);
  const field = workspace.id === 'driver' || workspace.id === 'loader';
  const user = session?.user;
  const account = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="user-menu">
          <span className="user-avatar">
            <UserRound size={21} />
          </span>
          <span className="user-menu-label">
            {user?.displayName ?? 'Account'}
            <small>{workspace.name}</small>
          </span>
          <ChevronDown size={15} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="account-menu">
        <DropdownMenuLabel className="account-menu-profile">
          <span className="account-menu-avatar" aria-hidden="true">
            <UserRound size={20} />
          </span>
          <span>
            <strong>{user?.displayName ?? 'Account'}</strong>
            <small>{workspace.name}</small>
          </span>
        </DropdownMenuLabel>
        <div className="account-menu-meta">
          <Mail size={15} aria-hidden="true" />
          <span>{user?.email ?? 'Authorized workspace'}</span>
        </div>
        <DropdownMenuItem
          className="account-menu-signout"
          onSelect={() => {
            clearSession();
            navigate('/login', { replace: true });
          }}
        >
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  return (
    <div
      className={`app-shell reference-shell workspace-${workspace.id} ${field ? 'field-shell' : ''}`}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="desktop-sidebar">
        <WaypointBrand light />
        <Navigation workspace={workspace} />
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <Headphones size={26} />
            <div>
              <strong>Need Help?</strong>
              <AccessHelp label="Contact Support →" />
            </div>
          </div>
          <Link to="/foundation">
            <Settings2 size={20} />
            Components & status
          </Link>
          <div className="sidebar-account">{account}</div>
        </div>
      </aside>
      <div className="shell-main">
        <header className="app-header">
          <div className="header-left">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mobile-menu-button"
                  aria-label="Open navigation"
                >
                  <Menu size={21} />
                </Button>
              </SheetTrigger>
              <SheetContent className="mobile-nav-sheet">
                <SheetTitle>{workspace.name} workspace</SheetTitle>
                <SheetDescription>Navigate your authorized workspace.</SheetDescription>
                <Navigation workspace={workspace} onNavigate={() => setMenuOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="mobile-brand">
              <WaypointBrand light />
            </div>
            <form
              className="header-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(
                  `/${workspace.id}/${workspace.id === 'dispatcher' ? 'orders' : workspace.id === 'store' ? 'orders' : workspace.id === 'loader' ? 'active' : 'trip'}?q=${encodeURIComponent(search)}`,
                );
              }}
            >
              <Search size={18} />
              <input
                aria-label="Search workspace"
                placeholder="Search orders or outlets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
          </div>
          <div className="header-right">
            <span className="header-date">
              <CalendarDays size={18} />
              {new Intl.DateTimeFormat('en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date())}
            </span>
            <Button asChild variant="ghost" size="icon" aria-label="View issues">
              <Link
                to={`/${workspace.id}/${workspace.id === 'dispatcher' ? 'exceptions' : workspace.id === 'driver' ? 'sync' : 'issues'}`}
              >
                <Bell size={22} />
              </Link>
            </Button>
            {account}
          </div>
        </header>
        {workspace.id === 'store' && (
          <nav className="store-top-nav" aria-label="Store shortcuts">
            <WaypointBrand light />
            {workspace.navigation.map((item) => (
              <NavLink end key={item.path} to={`/store${item.path ? `/${item.path}` : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
        {workspace.id === 'driver' && (
          <div className={`driver-connection ${online ? '' : 'is-offline'}`}>
            {online ? <Wifi size={15} /> : <WifiOff size={15} />}{' '}
            {online ? 'Device online' : 'Device offline'}
          </div>
        )}
        <main id="main-content" ref={main} tabIndex={-1} className="page-container">
          <Outlet context={workspace} />
        </main>
      </div>
      {field && (
        <nav className="mobile-bottom-nav" aria-label={`${workspace.name} mobile navigation`}>
          {workspace.navigation.map(({ path, label, icon: Icon }) => (
            <NavLink end key={path} to={`/${workspace.id}${path ? `/${path}` : ''}`}>
              <Icon size={23} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
