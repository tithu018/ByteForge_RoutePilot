import { Skeleton } from '@waypoint/ui';
export function PageLoading() { return <div role="status" aria-label="Loading page" className="page-loading"><Skeleton className="h-9 w-64" /><Skeleton className="h-5 w-full max-w-lg" /><Skeleton className="h-64 w-full" /><span className="sr-only">Loading page…</span></div>; }
