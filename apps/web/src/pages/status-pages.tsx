import { Link } from 'react-router';
import { Button, EmptyState } from '@waypoint/ui';
import { LockKeyhole, MapPinned } from 'lucide-react';
import { clearSession } from '../lib/auth';

export function NotFoundPage() { return <main className="standalone-state"><EmptyState title="This page wasn’t found" description="The address may have changed. Return to the development workspace to continue." icon={<MapPinned size={26} />} action={<Button asChild><Link to="/dispatcher">Open workspace</Link></Button>} /></main>; }
export function AccessDeniedPage() { return <main className="standalone-state"><EmptyState title="Access denied" description="Your account is signed in, but this workspace belongs to another role. Return to your authorized workspace or sign in with a different account." icon={<LockKeyhole size={26} />} action={<Button asChild variant="secondary"><Link to="/login" onClick={clearSession}>Switch account</Link></Button>} /></main>; }
