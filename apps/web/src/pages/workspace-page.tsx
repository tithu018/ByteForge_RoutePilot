import { StoreOverview } from '../components/store-overview';
import { DriverTripView, DriverSyncView } from '../components/driver-board';
import { LoaderBoard } from '../components/loader-board';
import { DispatcherOverview, PlanningBoard } from '../components/control-tower';
import { useMemo, useState } from 'react';
import { useLocation, useOutletContext, useSearchParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import {
  Badge,
  CapacityBar,
  Card,
  EmptyState,
  ErrorState,
  PageHeader,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  toast,
} from '@waypoint/ui';
import type { Workspace } from '../app/workspaces';
import { queryClient } from '../app/query-client';
import {
  fetchOperationsSummary,
  recordDeliveryEvent,
  type OperationSummary,
  type Trip,
} from '../lib/api';

type OfflineDeliveryEvent = {
  clientEventId: string;
  tripStopId: string;
  type: 'ARRIVED' | 'OUTCOME_RECORDED' | 'POD_RECORDED' | 'COMPLETED';
  receiverName?: string;
  notes?: string;
  reference?: string;
  details?: Record<string, unknown>;
  createdAt: string;
};

const offlineKey = 'waypoint.driver.offline-events';
const fmtDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value.slice(0, 10)))
    : 'Not set';
const fmtDateTime = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : 'Not recorded';

function readOfflineQueue(): OfflineDeliveryEvent[] {
  try {
    const raw = localStorage.getItem(offlineKey);
    return raw ? (JSON.parse(raw) as OfflineDeliveryEvent[]) : [];
  } catch {
    localStorage.removeItem(offlineKey);
    return [];
  }
}
function writeOfflineQueue(queue: OfflineDeliveryEvent[]): void {
  localStorage.setItem(offlineKey, JSON.stringify(queue));
}
function statusTone(status: string): 'neutral' | 'info' | 'success' | 'warning' | 'critical' {
  if (['OPEN', 'BLOCKED', 'DEFERRED'].includes(status)) return 'warning';
  if (['PUBLISHED', 'PASSED', 'READY', 'LOADED', 'COMPLETED', 'DELIVERED'].includes(status))
    return 'success';
  if (['CANCELLED', 'DISMISSED'].includes(status)) return 'critical';
  if (['CONFIRMED', 'IN_PROGRESS', 'ARRIVED'].includes(status)) return 'info';
  return 'neutral';
}
function LoadingView() {
  return (
    <div className="ops-grid">
      <Skeleton className="ops-skeleton" />
      <Skeleton className="ops-skeleton" />
      <Skeleton className="ops-skeleton" />
    </div>
  );
}
function EmptyOps({ title }: { title: string }) {
  return <EmptyState title={title} description="Seed demo data, then refresh this workspace." />;
}
function useOperations() {
  return useQuery({
    queryKey: ['operations-summary'],
    queryFn: ({ signal }) => fetchOperationsSummary(signal),
  });
}
function SummaryShell({
  title,
  eyebrow,
  description,
  children,
  action,
}: {
  title: string;
  eyebrow: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} actions={action} />
      {children}
    </>
  );
}
function OrdersTable({ orders }: { orders: OperationSummary['orders'] }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const setSearch = (value: string) =>
    setSearchParams(value ? { q: value } : {}, { replace: true });
  const [status, setStatus] = useState('ALL');
  const filtered = orders.filter(
    (order) =>
      (status === 'ALL' || order.status === status) &&
      `${order.sourceId} ${order.outlet?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  );
  if (!orders.length) return <EmptyOps title="No orders are available" />;
  return (
    <Card className="ops-card table-card">
      <div className="orders-toolbar">
        <label className="order-search">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Search orders"
            placeholder="Search orders or outlets..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <select
          className="ui-input order-status-filter"
          aria-label="Filter order status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="ALL">All statuses</option>
          {[...new Set(orders.map((order) => order.status))].map((value) => (
            <option key={value} value={value}>
              {value.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
        <span role="status">{filtered.length} results</span>
      </div>
      {filtered.length === 0 && (
        <EmptyState
          title="No matching orders"
          description="Try another search or change the status filter."
        />
      )}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Order</TableHeader>
            <TableHeader>Outlet</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Load</TableHeader>
            <TableHeader>Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.sourceId}</TableCell>
              <TableCell>{order.outlet?.name ?? 'Outlet'}</TableCell>
              <TableCell>{fmtDate(order.requestedDeliveryDate)}</TableCell>
              <TableCell>
                {order.weightKg} kg ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {order.volumeM3} m3
              </TableCell>
              <TableCell>
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
function TripsTable({ trips, compact = false }: { trips: Trip[]; compact?: boolean }) {
  if (!trips.length) return <EmptyOps title="No trips are available" />;
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Trip</TableHeader>
          <TableHeader>Vehicle</TableHeader>
          {!compact && <TableHeader>Driver</TableHeader>}
          <TableHeader>Stops</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell>
              {trip.plan.name} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· #{trip.tripNumber}
            </TableCell>
            <TableCell>{trip.vehicle.name}</TableCell>
            {!compact && <TableCell>{trip.driver?.name ?? 'Unassigned'}</TableCell>}
            <TableCell>{trip.stops.length}</TableCell>
            <TableCell>
              <Badge tone={statusTone(trip.status)}>{trip.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
function IssueList({
  issues,
  compact = false,
}: {
  issues: OperationSummary['issues'];
  compact?: boolean;
}) {
  if (!issues.length) return <EmptyOps title="No issues recorded" />;
  return (
    <div className={compact ? 'issue-stack compact' : 'issue-stack'}>
      {issues.map((issue) => (
        <Card className="issue-card" key={issue.id}>
          <div>
            <h2>{issue.title}</h2>
            <p>{issue.description}</p>
            <span>
              {issue.order?.sourceId ?? issue.type} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·{' '}
              {fmtDateTime(issue.createdAt)}
            </span>
          </div>
          <Badge tone={statusTone(issue.status)}>{issue.status}</Badge>
        </Card>
      ))}
    </div>
  );
}
function DeferralList({ summary }: { summary: OperationSummary }) {
  if (!summary.deferrals.length) return <EmptyOps title="No deferrals recorded" />;
  return (
    <div className="ops-grid two">
      {summary.deferrals.map((deferral) => (
        <Card className="ops-card" key={deferral.id}>
          <div className="ops-card-heading">
            <h2>{deferral.order.sourceId}</h2>
            <Badge tone="warning">{deferral.reason}</Badge>
          </div>
          <p>{deferral.explanation}</p>
          <span className="ops-muted">
            {deferral.order.outlet} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·{' '}
            {fmtDateTime(deferral.createdAt)}
          </span>
        </Card>
      ))}
    </div>
  );
}
function ScenarioList({ summary }: { summary: OperationSummary }) {
  if (!summary.scenarios.length) return <EmptyOps title="No capacity scenarios recorded" />;
  return (
    <div className="ops-grid two">
      {summary.scenarios.map((scenario) => (
        <Card className="ops-card" key={scenario.id}>
          <div className="ops-card-heading">
            <h2>
              Week {scenario.isoWeek}, {scenario.isoYear}
            </h2>
            <Badge>{scenario.brand}</Badge>
          </div>
          <CapacityBar
            label="Chilled volume share"
            value={scenario.chilledVolumeM3}
            maximum={scenario.totalVolumeM3}
            unit="m3"
          />
          <p>
            {scenario.depot} ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· {scenario.sourceLabel}
          </p>
          <span className="ops-muted">
            {fmtDate(scenario.horizonStart)} to {fmtDate(scenario.horizonEnd)}
          </span>
        </Card>
      ))}
    </div>
  );
}
function DispatcherScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  if (section === 'orders')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / ORDER INTAKE"
        title="Confirmed demand"
        description="Orders accepted before cutoff and ready for planning review."
      >
        <OrdersTable orders={summary.orders} />
      </SummaryShell>
    );
  if (section === 'planning') return <PlanningBoard summary={summary} />;
  if (section === 'fleet')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / FLEET"
        title="Vehicle capacity"
        description="Weight, volume and refrigerated capability are visible before dispatch."
      >
        <div className="ops-grid two">
          {summary.vehicles.map((vehicle) => {
            const trip = summary.trips.find((candidate) => candidate.vehicle.id === vehicle.id);
            const weightUsed = trip?.stops.reduce((sum, stop) => sum + stop.order.weightKg, 0) ?? 0;
            const volumeUsed = trip?.stops.reduce((sum, stop) => sum + stop.order.volumeM3, 0) ?? 0;
            return (
              <Card className="ops-card" key={vehicle.id}>
                <div className="ops-card-heading">
                  <h2>{vehicle.name}</h2>
                  <Badge tone={vehicle.available ? 'success' : 'critical'}>{vehicle.type}</Badge>
                </div>
                <CapacityBar
                  label="Weight"
                  value={weightUsed}
                  maximum={vehicle.weightCapacityKg}
                  unit="kg"
                />
                <CapacityBar
                  label="Volume"
                  value={volumeUsed}
                  maximum={vehicle.volumeCapacityM3}
                  unit="m3"
                />
                <p>
                  {vehicle.temperature === 'REEFER' ? 'Refrigerated capable' : 'Ambient vehicle'}{' '}
                  ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· Fuel quota {vehicle.weeklyFuelQuotaL}{' '}
                  L/week
                </p>
              </Card>
            );
          })}
        </div>
      </SummaryShell>
    );
  if (section === 'deliveries')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / DELIVERIES"
        title="Trips in motion"
        description="Driver, vehicle, stop and POD state in one operational view."
      >
        <Card className="ops-card table-card">
          <TripsTable trips={summary.trips} />
        </Card>
      </SummaryShell>
    );
  if (section === 'deferrals')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / DEFERRALS"
        title="Deferred demand history"
        description="Every deferral stays attached to the order and plan context."
      >
        <DeferralList summary={summary} />
      </SummaryShell>
    );
  if (section === 'exceptions')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / EXCEPTIONS"
        title="Open operational issues"
        description="Loading, delivery and receipt exceptions share one queue."
      >
        <IssueList issues={summary.issues} />
      </SummaryShell>
    );
  if (section === 'capacity')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / FUTURE CAPACITY"
        title="Capacity scenarios"
        description="Synthetic scenario records are isolated from official competition datasets."
      >
        <ScenarioList summary={summary} />
      </SummaryShell>
    );
  return <DispatcherOverview summary={summary} />;
}

function LoaderScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  if (section === 'issues')
    return (
      <SummaryShell
        eyebrow="LOADER / ISSUES"
        title="Loading exceptions"
        description="Review recorded loading issues."
      >
        <IssueList issues={summary.issues.filter((issue) => issue.type === 'LOADING')} />
      </SummaryShell>
    );
  return <LoaderBoard summary={summary} />;
}
function DriverScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  const [queue, setQueue] = useState<OfflineDeliveryEvent[]>(() => readOfflineQueue());
  const trip = summary.trips[0];
  const [stopIndex, setStopIndex] = useState(0);
  const stop = trip?.stops[stopIndex];
  const syncMutation = useMutation({
    mutationFn: async (events: OfflineDeliveryEvent[]) => {
      for (const { createdAt: _createdAt, ...event } of events) await recordDeliveryEvent(event);
    },
    onSuccess: () => {
      writeOfflineQueue([]);
      setQueue([]);
      toast.success('Offline delivery events synchronized.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
  });
  function recordOffline(type: OfflineDeliveryEvent['type']) {
    if (!stop) return;
    const event: OfflineDeliveryEvent = {
      clientEventId: `offline-${crypto.randomUUID()}`,
      tripStopId: stop.id,
      type,
      receiverName: type === 'POD_RECORDED' || type === 'COMPLETED' ? 'Demo receiver' : undefined,
      reference: type === 'POD_RECORDED' || type === 'COMPLETED' ? `POD-${Date.now()}` : undefined,
      notes:
        type === 'POD_RECORDED' || type === 'COMPLETED'
          ? 'Captured while offline, then replayed.'
          : undefined,
      details: { offline: true, source: 'driver-workspace' },
      createdAt: new Date().toISOString(),
    };
    const next = [...queue, event];
    writeOfflineQueue(next);
    setQueue(next);
    toast.info(`${type.replaceAll('_', ' ').toLowerCase()} saved locally.`);
  }
  if (section === 'sync')
    return (
      <DriverSyncView
        summary={summary}
        queue={queue}
        pending={syncMutation.isPending}
        success={syncMutation.isSuccess}
        error={syncMutation.error?.message}
        onSync={() => syncMutation.mutate(queue)}
      />
    );
  if (!trip || !stop) return <EmptyOps title="No active trip assigned" />;
  return (
    <DriverTripView
      trip={trip}
      stopIndex={stopIndex}
      onSelect={setStopIndex}
      onRecord={recordOffline}
      queueLength={queue.length}
    />
  );
}
function StoreScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  if (section === 'issues')
    return (
      <SummaryShell
        eyebrow="STORE / ISSUES"
        title="Delivery issues"
        description="Outlet-visible issue history for receipts and delivery exceptions."
      >
        <IssueList issues={summary.issues} />
      </SummaryShell>
    );
  return <StoreOverview summary={summary} />;
}
export default function WorkspacePage() {
  const workspace = useOutletContext<Workspace>();
  const location = useLocation();
  const section = useMemo(() => location.pathname.split('/')[2] ?? '', [location.pathname]);
  const query = useOperations();
  if (query.isLoading) return <LoadingView />;
  if (query.isError)
    return (
      <ErrorState
        title="Workspace data could not be loaded"
        description={query.error.message}
        onRetry={() => void query.refetch()}
      />
    );
  const summary = query.data;
  if (!summary) return <EmptyOps title="No workspace data" />;
  if (workspace.id === 'dispatcher')
    return <DispatcherScreen summary={summary} section={section} />;
  if (workspace.id === 'loader') return <LoaderScreen summary={summary} section={section} />;
  if (workspace.id === 'driver') return <DriverScreen summary={summary} section={section} />;
  return <StoreScreen summary={summary} section={section} />;
}
