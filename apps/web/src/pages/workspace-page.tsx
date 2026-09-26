import { useMemo, useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  CloudOff,
  CloudUpload,
  Flag,
  MapPin,
  Radio,
  Route,
  Truck,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
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
  createIssue,
  fetchOperationsSummary,
  recordDeliveryEvent,
  recordLoadingEvent,
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
function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: typeof Route;
}) {
  return (
    <Card className="metric-card">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
      <Icon size={22} aria-hidden="true" />
    </Card>
  );
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
  if (!orders.length) return <EmptyOps title="No orders are available" />;
  return (
    <Card className="ops-card table-card">
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
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.sourceId}</TableCell>
              <TableCell>{order.outlet?.name ?? 'Outlet'}</TableCell>
              <TableCell>{fmtDate(order.requestedDeliveryDate)}</TableCell>
              <TableCell>
                {order.weightKg} kg · {order.volumeM3} m3
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
              {trip.plan.name} · #{trip.tripNumber}
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
              {issue.order?.sourceId ?? issue.type} · {fmtDateTime(issue.createdAt)}
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
            {deferral.order.outlet} · {fmtDateTime(deferral.createdAt)}
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
            {scenario.depot} · {scenario.sourceLabel}
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
  if (section === 'planning')
    return (
      <SummaryShell
        eyebrow="DISPATCHER / ROUTE PLANNING"
        title="Plan validation"
        description="Published and draft plans with validation evidence."
      >
        <div className="ops-grid two">
          {summary.plans.map((plan) => (
            <Card className="ops-card" key={plan.id}>
              <div className="ops-card-heading">
                <div>
                  <span className="ui-eyebrow">{fmtDate(plan.deliveryDate)}</span>
                  <h2>{plan.name}</h2>
                </div>
                <Badge tone={statusTone(plan.status)}>{plan.status}</Badge>
              </div>
              <p>Depot: {plan.depot.name}</p>
              <p>Version {plan.version}</p>
              <Alert
                title={`Validation ${plan.validation?.status ?? 'not run'}`}
                tone={statusTone(plan.validation?.status ?? 'neutral')}
              >
                Checked {fmtDateTime(plan.validation?.checkedAt)}
              </Alert>
            </Card>
          ))}
        </div>
      </SummaryShell>
    );
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
                  {vehicle.temperature === 'REEFER' ? 'Refrigerated capable' : 'Ambient vehicle'} ·
                  Fuel quota {vehicle.weeklyFuelQuotaL} L/week
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
  return (
    <SummaryShell
      eyebrow="DISPATCHER / CONTROL TOWER"
      title="Today’s delivery operation"
      description="Orders, plans, trips and exceptions update from the same backend."
      action={
        <Badge tone="success">
          <Radio size={13} aria-hidden="true" />
          Live data
        </Badge>
      }
    >
      <div className="metrics-grid">
        <MetricCard
          label="Orders"
          value={summary.counts.orders}
          detail="Confirmed and deferred demand"
          icon={ClipboardCheck}
        />
        <MetricCard
          label="Trips"
          value={summary.trips.length}
          detail="Ready or active trips"
          icon={Route}
        />
        <MetricCard
          label="Issues"
          value={summary.counts.openIssues}
          detail="Open exception records"
          icon={Flag}
        />
        <MetricCard
          label="Deferrals"
          value={summary.counts.deferrals}
          detail="History retained for review"
          icon={AlertTriangle}
        />
      </div>
      <div className="ops-grid two">
        <Card className="ops-card">
          <h2>Next trips</h2>
          <TripsTable trips={summary.trips.slice(0, 3)} compact />
        </Card>
        <Card className="ops-card">
          <h2>Latest exceptions</h2>
          <IssueList issues={summary.issues.slice(0, 4)} compact />
        </Card>
      </div>
    </SummaryShell>
  );
}
function LoaderScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  const trip = summary.trips[0];
  const mutation = useMutation({
    mutationFn: (type: 'STARTED' | 'READY' | 'COMPLETED' | 'SHORTFALL') =>
      recordLoadingEvent({
        tripId: trip?.id ?? '',
        type,
        orderId: trip?.stops[0]?.order.id,
        details: { source: 'loader-workspace' },
      }),
    onSuccess: () => {
      toast.success('Loading event recorded.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
  });
  const issueMutation = useMutation({
    mutationFn: () =>
      createIssue({
        type: 'LOADING',
        title: 'Loading dock review',
        description: 'Loader reported a goods check from the workspace.',
        orderId: trip?.stops[0]?.order.id,
      }),
    onSuccess: () => {
      toast.success('Issue reported.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
  });
  if (section === 'issues')
    return (
      <SummaryShell
        eyebrow="LOADER / ISSUES"
        title="Loading exceptions"
        description="Missing, damaged and short goods are visible before dispatch."
      >
        <IssueList issues={summary.issues.filter((issue) => issue.type === 'LOADING')} />
      </SummaryShell>
    );
  if (!trip) return <EmptyOps title="No assigned loads" />;
  const weightUsed = trip.stops.reduce((sum, stop) => sum + stop.order.weightKg, 0);
  const volumeUsed = trip.stops.reduce((sum, stop) => sum + stop.order.volumeM3, 0);
  return (
    <SummaryShell
      eyebrow={section === 'active' ? 'LOADER / ACTIVE LOAD' : 'LOADER / ASSIGNED LOADS'}
      title={
        section === 'active'
          ? `Trip ${trip.tripNumber} loading checklist`
          : 'Assigned warehouse load'
      }
      description="Fast tablet-first controls for load readiness and exception capture."
      action={<Badge tone={statusTone(trip.status)}>{trip.status}</Badge>}
    >
      <div className="ops-grid two">
        <Card className="ops-card action-card">
          <div className="ops-card-heading">
            <div>
              <span className="ui-eyebrow">{fmtDate(trip.plan.deliveryDate)}</span>
              <h2>{trip.vehicle.name}</h2>
            </div>
            <Truck size={24} aria-hidden="true" />
          </div>
          <CapacityBar
            label="Weight loaded"
            value={weightUsed}
            maximum={trip.vehicle.weightCapacityKg}
            unit="kg"
          />
          <CapacityBar
            label="Volume loaded"
            value={volumeUsed}
            maximum={trip.vehicle.volumeCapacityM3}
            unit="m3"
          />
          <div className="ops-action-row">
            <Button loading={mutation.isPending} onClick={() => mutation.mutate('STARTED')}>
              Start load
            </Button>
            <Button
              variant="secondary"
              loading={mutation.isPending}
              onClick={() => mutation.mutate('READY')}
            >
              Mark ready
            </Button>
            <Button
              variant="secondary"
              loading={issueMutation.isPending}
              onClick={() => issueMutation.mutate()}
            >
              Report issue
            </Button>
          </div>
        </Card>
        <Card className="ops-card">
          <h2>Stop sequence</h2>
          <ol className="stop-list">
            {trip.stops.map((stop) => (
              <li key={stop.id}>
                <span>{stop.sequence}</span>
                <div>
                  <strong>{stop.outlet.name}</strong>
                  <p>
                    {stop.order.sourceId} · {stop.order.units} units · {stop.order.temperature}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </SummaryShell>
  );
}
function DriverScreen({ summary, section }: { summary: OperationSummary; section: string }) {
  const [queue, setQueue] = useState<OfflineDeliveryEvent[]>(() => readOfflineQueue());
  const trip = summary.trips[0];
  const stop = trip?.stops[0];
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
      <SummaryShell
        eyebrow="DRIVER / SYNC"
        title="Offline recovery"
        description="Events stay on the device, survive reload, then replay with idempotent client IDs."
        action={<Badge tone={queue.length ? 'warning' : 'success'}>{queue.length} queued</Badge>}
      >
        <div className="ops-grid two">
          <Card className="ops-card action-card">
            <CloudOff size={26} aria-hidden="true" />
            <h2>Local queue</h2>
            <p>
              {queue.length
                ? `${queue.length} event(s) are stored locally.`
                : 'No local delivery events are waiting.'}
            </p>
            <div className="ops-action-row">
              <Button
                disabled={!queue.length || syncMutation.isPending}
                loading={syncMutation.isPending}
                onClick={() => syncMutation.mutate(queue)}
              >
                <CloudUpload size={16} aria-hidden="true" />
                Sync now
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  writeOfflineQueue([]);
                  setQueue([]);
                }}
              >
                Clear local demo queue
              </Button>
            </div>
          </Card>
          <Card className="ops-card">
            <h2>Server reconciliation</h2>
            {summary.syncEvents.length ? (
              <ol className="sync-list">
                {summary.syncEvents.map((event) => (
                  <li key={event.id}>
                    <Badge tone={statusTone(event.status)}>{event.status}</Badge>
                    <span>
                      {event.eventType} · {fmtDateTime(event.serverReceivedAt)}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p>No synchronized events yet.</p>
            )}
          </Card>
        </div>
      </SummaryShell>
    );
  if (!trip || !stop) return <EmptyOps title="No active trip assigned" />;
  return (
    <SummaryShell
      eyebrow={section === 'trip' ? 'DRIVER / ACTIVE TRIP' : 'DRIVER / TODAY'}
      title={`Stop ${stop.sequence}: ${stop.outlet.name}`}
      description="Mobile-first stop work with local persistence for the degradation scenario."
      action={
        <Badge tone={statusTone(stop.delivery?.status ?? 'PENDING')}>
          {stop.delivery?.status ?? 'PENDING'}
        </Badge>
      }
    >
      <div className="driver-stop-card">
        <Card className="ops-card action-card">
          <div className="ops-card-heading">
            <div>
              <span className="ui-eyebrow">{trip.vehicle.name}</span>
              <h2>{stop.outlet.name}</h2>
            </div>
            <MapPin size={26} aria-hidden="true" />
          </div>
          <p>
            {stop.outlet.district} · {stop.outlet.dockType ?? 'Standard dock'} ·{' '}
            {stop.outlet.mallWindow ?? 'No mall window noted'}
          </p>
          <div className="driver-load">
            <span>{stop.order.sourceId}</span>
            <strong>
              {stop.order.units} units · {stop.order.weightKg} kg · {stop.order.volumeM3} m3
            </strong>
          </div>
          <Alert title="Offline degradation path" tone="info">
            Use these controls while offline, reload the app, then open Sync to replay the queue.
          </Alert>
          <div className="driver-actions">
            <Button onClick={() => recordOffline('ARRIVED')}>Record arrival</Button>
            <Button variant="secondary" onClick={() => recordOffline('OUTCOME_RECORDED')}>
              Record delivery
            </Button>
            <Button variant="secondary" onClick={() => recordOffline('POD_RECORDED')}>
              Capture POD
            </Button>
            <Button variant="secondary" onClick={() => recordOffline('COMPLETED')}>
              Complete stop
            </Button>
          </div>
        </Card>
        <Card className="ops-card">
          <h2>Cached stop data</h2>
          <dl className="ops-definition">
            <div>
              <dt>Vehicle</dt>
              <dd>{trip.vehicle.name}</dd>
            </div>
            <div>
              <dt>Order</dt>
              <dd>{stop.order.sourceId}</dd>
            </div>
            <div>
              <dt>Temperature</dt>
              <dd>{stop.order.temperature}</dd>
            </div>
            <div>
              <dt>Local queue</dt>
              <dd>{queue.length} saved event(s)</dd>
            </div>
          </dl>
        </Card>
      </div>
    </SummaryShell>
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
  return (
    <SummaryShell
      eyebrow="STORE / OVERVIEW"
      title="Outlet delivery view"
      description="Your confirmed orders, delivery state and exception history."
      action={
        <Button asChild>
          <Link to="/store/create">
            Create order
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Button>
      }
    >
      <div className="metrics-grid">
        <MetricCard
          label="Orders"
          value={summary.orders.length}
          detail="Visible to this outlet"
          icon={Boxes}
        />
        <MetricCard
          label="Open issues"
          value={summary.counts.openIssues}
          detail="Delivery and receipt follow-up"
          icon={Flag}
        />
        <MetricCard
          label="Trips"
          value={summary.trips.length}
          detail="Published operational trips"
          icon={Truck}
        />
        <MetricCard
          label="POD"
          value={
            summary.trips.some((trip) => trip.stops.some((candidate) => candidate.delivery?.proof))
              ? 'Ready'
              : 'Pending'
          }
          detail="Proof of delivery status"
          icon={CheckCircle2}
        />
      </div>
      <OrdersTable orders={summary.orders} />
    </SummaryShell>
  );
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
