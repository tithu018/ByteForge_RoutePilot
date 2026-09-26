import { Link } from 'react-router';
import { Button, EmptyState } from '@waypoint/ui';
import { LockKeyhole, MapPinned } from 'lucide-react';

export function NotFoundPage() { return <main className="standalone-state"><EmptyState title="This page wasn’t found" description="The address may have changed. Return to the development workspace to continue." icon={<MapPinned size={26} />} action={<Button asChild><Link to="/dispatcher">Open workspace</Link></Button>} /></main>; }
export function AccessDeniedPage() { return <main className="standalone-state"><EmptyState title="Access denied" description="This is the access-denied design placeholder. Authentication and role permissions are not active in this foundation." icon={<LockKeyhole size={26} />} action={<Button asChild variant="secondary"><Link to="/dispatcher">Return to preview</Link></Button>} /></main>; }
