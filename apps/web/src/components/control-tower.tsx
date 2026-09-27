import { useMutation } from '@tanstack/react-query';
import { validatePlan, publishPlan } from '../lib/api';
import { queryClient } from '../app/query-client';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Box,
  Check,
  CircleCheck,
  Clock,
  Flag,
  MapPin,
  Search,
  Snowflake,
  Truck,
} from 'lucide-react';
import { Badge, Button, CapacityBar, Card, toast } from '@waypoint/ui';
import type { OperationSummary, Trip } from '../lib/api';
import { RouteMap } from './route-map';
export function Panel({
  title,
  to,
  children,
  className = '',
}: {
  title: string;
  to?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`tower-panel ${className}`}>
      <div className="tower-panel-heading">
        <h2>{title}</h2>
        {to && (
          <Link to={to}>
            View all <ArrowRight size={14} />
          </Link>
        )}
      </div>
      {children}
    </Card>
  );
}
export function TripSteps({ trip }: { trip?: Trip }) {
  const stages = ['Loaded', 'En route', 'At stop', 'Next stop', 'Complete'];
  const completed = trip?.status === 'COMPLETED';
  const active = completed
    ? 4
    : trip?.stops.some((stop) => stop.delivery?.status === 'ARRIVED')
      ? 2
      : trip?.status === 'IN_PROGRESS'
        ? 1
        : trip?.loadingEvents.some((event) => event.type === 'COMPLETED')
          ? 0
          : -1;
  return (
    <ol className="trip-steps">
      {stages.map((label, i) => (
        <li className={trip && i <= active ? 'step-active' : ''} key={label}>
          <span>
            {trip && i < active ? (
              <Check size={15} />
            ) : i === 4 ? (
              <Flag size={15} />
            ) : i === 2 ? (
              <Truck size={15} />
            ) : (
              <span className="step-dot" />
            )}
          </span>
          <strong>{label}</strong>
          <small>
            {!trip
              ? 'No trip'
              : i === 0
                ? trip.plan.depot
                : i === active
                  ? trip.status.replaceAll('_', ' ')
                  : 'Pending'}
          </small>
        </li>
      ))}
    </ol>
  );
}
export function DeliveryTable({ trips }: { trips: Trip[] }) {
  return (
    <div className="ui-table-scroll">
      <table className="ui-table delivery-table">
        <thead>
          <tr>
            {[
              'Stop #',
              'Customer / Location',
              'Order #',
              'Trip #',
              'Driver',
              'Planned arrival',
              'Status',
              'Temp',
              'Actions',
            ].map((label) => (
              <th key={label}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trips.flatMap((trip) =>
            trip.stops.map((stop) => (
              <tr key={stop.id}>
                <td>{stop.sequence}</td>
                <td>
                  <strong>{stop.outlet.name}</strong>
                  <small>{stop.outlet.district}</small>
                </td>
                <td>{stop.order.sourceId}</td>
                <td>#{trip.tripNumber}</td>
                <td>{trip.driver?.name ?? 'Unassigned'}</td>
                <td>
                  {stop.plannedArrival
                    ? new Date(stop.plannedArrival).toLocaleTimeString('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Not available'}
                </td>
                <td>
                  <Badge tone={stop.delivery?.status === 'COMPLETED' ? 'success' : 'info'}>
                    {stop.delivery?.status ?? trip.status}
                  </Badge>
                </td>
                <td>{stop.order.temperature === 'REEFER' ? 'Chilled' : 'Ambient'}</td>
                <td>
                  <Button asChild variant="secondary" size="small">
                    <Link to="/dispatcher/deliveries">View</Link>
                  </Button>
                </td>
              </tr>
            )),
          )}
          {trips.length === 0 && (
            <tr>
              <td colSpan={9}>No delivery trips are available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export function DispatcherOverview({ summary }: { summary: OperationSummary }) {
  const trip = summary.trips[0];
  const available = summary.vehicles.filter((v) => v.available).length;
  const allocated = summary.vehicles.filter((v) =>
    summary.trips.some((t) => t.vehicle.id === v.id),
  ).length;
  const utilization = summary.vehicles.length
    ? Math.round((allocated / summary.vehicles.length) * 100)
    : 0;
  const metrics = [
    {
      label: 'Confirmed Orders',
      value: summary.counts.confirmedOrders,
      detail: 'Accepted demand',
      icon: Box,
    },
    {
      label: 'Planned Trips',
      value: summary.trips.length,
      detail: 'In current plans',
      icon: MapPin,
    },
    {
      label: 'Available Reefers',
      value: summary.vehicles.filter((v) => v.available && v.temperature === 'REEFER').length,
      detail: 'Refrigerated vehicles',
      icon: Truck,
    },
    {
      label: 'Active Deliveries',
      value: summary.trips.filter((t) => t.status === 'IN_PROGRESS').length,
      detail: 'Trips in progress',
      icon: BarChart3,
    },
    {
      label: 'Deferred Orders',
      value: summary.counts.deferrals,
      detail: 'Review required',
      icon: Clock,
    },
    {
      label: 'Open Exceptions',
      value: summary.counts.openIssues,
      detail: 'Needs attention',
      icon: AlertTriangle,
    },
  ];
  return (
    <div className="tower-overview">
      <div className="operations-strip">
        <span className="status-dot" />
        <strong>Operations workspace connected.</strong>
        <span>Review your latest orders, trips and exceptions.</span>
        <small>
          Updated{' '}
          {new Date(summary.generatedAt).toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </small>
      </div>
      <section className="tower-hero">
        <p className="spaced-label">DISPATCHER CONTROL TOWER</p>
        <h1>Today’s Operations</h1>
        <p>Clear visibility. Smarter decisions. Connected delivery.</p>
        <span>
          Deliver Smarter.
          <br />
          Go Further.
        </span>
      </section>
      <div className="tower-metrics">
        {metrics.map(({ label, value, detail, icon: Icon }) => (
          <Card key={label}>
            <span className="round-icon">
              <Icon size={25} />
            </span>
            <div>
              <span>{label}</span>
              <strong>{value.toLocaleString()}</strong>
              <small>{detail}</small>
            </div>
          </Card>
        ))}
      </div>
      <div className="tower-primary-grid">
        <Panel title="Trip Progress" to="/dispatcher/deliveries">
          <TripSteps trip={trip} />
          <div className="trip-summary">
            <img src="/images/waypoint-highway.png" alt="" />
            <div>
              <strong>{trip ? `Trip #${trip.tripNumber}` : 'No assigned trip'}</strong>{' '}
              <Badge tone="info">{trip?.status ?? 'Not available'}</Badge>
              <p>
                <MapPin size={13} />
                {trip?.plan.depot ?? 'Depot not available'} <ArrowRight size={13} />
                {trip?.stops[0]?.outlet.name ?? 'No stop'}
              </p>
              <small>{trip?.vehicle.name ?? 'Vehicle not assigned'}</small>
            </div>
          </div>
        </Panel>
        <Panel title="Operations Map" to="/dispatcher/planning">
          <RouteMap
            labels={trip ? [trip.plan.depot, ...trip.stops.map((s) => s.outlet.name)] : []}
          />
        </Panel>
      </div>
      <div className="tower-secondary-grid">
        <Panel title="Fleet Utilization" to="/dispatcher/fleet">
          <div className="fleet-breakdown">
            <div
              className="fleet-donut"
              style={{ background: `conic-gradient(#0963ff ${utilization}%, #e0e7f1 0)` }}
            >
              <div>
                <strong>{summary.vehicles.length ? `${utilization}%` : '—'}</strong>
                <small>Fleet allocated</small>
              </div>
            </div>
            <dl>
              <div>
                <dt>
                  <i />
                  Assigned
                </dt>
                <dd>{allocated}</dd>
              </div>
              <div>
                <dt>
                  <i />
                  Available
                </dt>
                <dd>{available}</dd>
              </div>
              <div>
                <dt>
                  <i />
                  Unavailable
                </dt>
                <dd>{summary.vehicles.length - available}</dd>
              </div>
              <div>
                <dt>Total fleet</dt>
                <dd>{summary.vehicles.length}</dd>
              </div>
            </dl>
          </div>
        </Panel>
        <Panel title="Exceptions & Alerts" to="/dispatcher/exceptions">
          <div className="tower-alerts">
            {summary.issues.slice(0, 4).map((issue) => (
              <div key={issue.id}>
                <AlertTriangle size={22} />
                <div>
                  <strong>{issue.title}</strong>
                  <small>{issue.description}</small>
                </div>
                <Badge tone="warning">{issue.status}</Badge>
              </div>
            ))}
            {!summary.issues.length && (
              <p className="panel-empty">
                <CircleCheck />
                No exceptions recorded.
              </p>
            )}
          </div>
        </Panel>
        <Panel title="Deferral Attention" to="/dispatcher/deferrals">
          <ol className="tower-deferrals">
            {summary.deferrals.slice(0, 5).map((item, i) => (
              <li key={item.id}>
                <span>{i + 1}</span>
                <div>
                  <strong>{item.order.outlet}</strong>
                  <small>{item.order.sourceId}</small>
                </div>
                <Badge tone="warning">{item.reason.replaceAll('_', ' ')}</Badge>
              </li>
            ))}
          </ol>
          {!summary.deferrals.length && <p className="panel-empty">No deferred orders.</p>}
        </Panel>
      </div>
      <Panel title="Delivery Overview" to="/dispatcher/deliveries">
        <DeliveryTable trips={summary.trips} />
      </Panel>
    </div>
  );
}
export function PlanningBoard({ summary }: { summary: OperationSummary }) {
  const action = useMutation({
    mutationFn: ({ id, kind }: { id: string; kind: 'validate' | 'publish' }) =>
      kind === 'validate' ? validatePlan(id) : publishPlan(id),
    onSuccess: () => {
      toast.success('Plan updated.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
    onError: (error) => toast.error(error.message),
  });
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(summary.trips[0]?.id ?? '');
  const [tab, setTab] = useState('Details');
  const [filter, setFilter] = useState('All');
  const trip = summary.trips.find((t) => t.id === selected) ?? summary.trips[0];
  const plan = summary.plans.find((p) => p.id === trip?.plan.id) ?? summary.plans[0];
  const assigned = new Set(summary.trips.flatMap((t) => t.stops.map((s) => s.order.id)));
  const orders = summary.orders.filter(
    (o) =>
      `${o.sourceId} ${o.outlet?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'All' || (filter === 'Assigned' ? assigned.has(o.id) : !assigned.has(o.id))),
  );
  const weight = trip?.stops.reduce((sum, s) => sum + s.order.weightKg, 0) ?? 0;
  const volume = trip?.stops.reduce((sum, s) => sum + s.order.volumeM3, 0) ?? 0;
  return (
    <div className="planning-page">
      <div className="planning-toolbar">
        <span>Plan date</span>
        <strong>
          {plan
            ? new Date(plan.deliveryDate).toLocaleDateString('en', { dateStyle: 'medium' })
            : 'Not available'}
        </strong>
        <span>Plan status</span>
        <Badge tone="info">{plan?.status ?? 'No plan'}</Badge>
        <small>Validation: {plan?.validation?.status ?? 'Not run'}</small>
        <Button
          variant="secondary"
          disabled={!plan || action.isPending}
          onClick={() => plan && action.mutate({ id: plan.id, kind: 'validate' })}
        >
          Validate Plan
        </Button>
        <Button
          disabled={!plan || plan.status === 'PUBLISHED' || action.isPending}
          onClick={() => plan && action.mutate({ id: plan.id, kind: 'publish' })}
        >
          Publish Plan
        </Button>
      </div>
      <div className="planning-columns">
        <Panel title="Confirmed Orders" className="planning-orders">
          <div className="segmented-control">
            {['All', 'Unassigned', 'Assigned'].map((label) => (
              <button
                key={label}
                aria-pressed={filter === label}
                className={filter === label ? 'selected' : ''}
                onClick={() => setFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="planning-search">
            <Search size={16} />
            <input
              aria-label="Search planning orders"
              placeholder="Search order or outlet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="planning-order-list">
            {orders.map((order) => (
              <article key={order.id}>
                <div>
                  <Box size={18} />
                  <strong>{order.sourceId}</strong>
                  <Badge tone={order.temperature === 'REEFER' ? 'info' : 'neutral'}>
                    {order.temperature === 'REEFER' ? 'Reefer required' : 'Standard'}
                  </Badge>
                </div>
                <h3>{order.outlet?.name ?? 'Outlet'}</h3>
                <p>
                  <MapPin size={12} />
                  {new Date(order.requestedDeliveryDate).toLocaleDateString('en')}
                </p>
                <footer>
                  <span>{order.weightKg} kg</span>
                  <span>{order.volumeM3} m³</span>
                  <span>{order.units} units</span>
                </footer>
              </article>
            ))}
            {!orders.length && <p className="panel-empty">No matching orders.</p>}
          </div>
        </Panel>
        <div className="planning-center">
          <div className="planning-tabs">
            <strong>Trips & Allocation</strong>
            <span>{summary.trips.length} trips</span>
            <span>{summary.depots.length} depots</span>
          </div>
          <RouteMap
            labels={trip ? [trip.plan.depot, ...trip.stops.map((s) => s.outlet.name)] : []}
          />
          <div className="planning-trips">
            {summary.trips.map((item) => (
              <article key={item.id}>
                <button
                  className="trip-accordion"
                  aria-expanded={trip?.id === item.id}
                  onClick={() => setSelected(item.id)}
                >
                  <span className="round-icon">
                    <Truck size={21} />
                  </span>
                  <div>
                    <strong>Trip #{item.tripNumber}</strong>
                    <small>
                      {item.vehicle.name} · {item.driver?.name ?? 'Unassigned'}
                    </small>
                  </div>
                  <Badge tone="info">{item.status}</Badge>
                </button>
                {trip?.id === item.id && (
                  <ol className="planning-stop-list">
                    {item.stops.map((stop) => (
                      <li key={stop.id}>
                        <span>{stop.sequence}</span>
                        <div>
                          <strong>{stop.order.sourceId}</strong>
                          <p>{stop.outlet.name}</p>
                          <small>{stop.outlet.district}</small>
                        </div>
                        <div>
                          {stop.order.weightKg} kg<small>{stop.order.volumeM3} m³</small>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        </div>
        <Panel title="Vehicle Details" className="planning-vehicle">
          <img
            className="vehicle-photo"
            src="/images/waypoint-highway.png"
            alt="Illustrative delivery truck"
          />
          <h2>{trip?.vehicle.name ?? 'No vehicle selected'}</h2>
          <p>{trip?.vehicle.type ?? 'Select a trip to inspect its vehicle.'}</p>
          <div className="segmented-control">
            {['Details', 'Capacity', 'Driver'].map((label) => (
              <button
                key={label}
                aria-pressed={tab === label}
                className={tab === label ? 'selected' : ''}
                onClick={() => setTab(label)}
              >
                {label}
              </button>
            ))}
          </div>
          {tab !== 'Driver' ? (
            <>
              <CapacityBar
                label="Weight capacity"
                value={weight}
                maximum={trip?.vehicle.weightCapacityKg ?? 0}
                unit="kg"
              />
              <CapacityBar
                label="Volume capacity"
                value={volume}
                maximum={trip?.vehicle.volumeCapacityM3 ?? 0}
                unit="m³"
              />
              {tab === 'Details' && (
                <>
                  <h3>Capabilities</h3>
                  <div className="vehicle-capability">
                    <Snowflake size={30} />
                    <div>
                      <strong>
                        {trip?.vehicle.temperature === 'REEFER' ? 'Refrigerated' : 'Ambient'}
                      </strong>
                      <small>Vehicle temperature handling</small>
                    </div>
                  </div>
                  <h3>Plan Validation</h3>
                  <div className="validation-note">
                    <CircleCheck size={20} />
                    <div>
                      <strong>{plan?.validation?.status ?? 'Not run'}</strong>
                      <p>
                        {plan?.validation?.checkedAt
                          ? new Date(plan.validation.checkedAt).toLocaleString()
                          : 'No validation evidence available.'}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="driver-detail">
              <strong>{trip?.driver?.name ?? 'Unassigned'}</strong>
              <p>{trip?.driver?.email ?? 'No driver assigned to this trip.'}</p>
              <small>{trip?.plan.depot}</small>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
