import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Truck,
} from 'lucide-react';
import { Badge, Button, Card, EmptyState, toast } from '@waypoint/ui';
import { createIssue, recordLoadingEvent } from '../lib/api';
import type { OperationSummary } from '../lib/api';
import { queryClient } from '../app/query-client';
import { Panel } from './control-tower';
export function LoaderBoard({ summary }: { summary: OperationSummary }) {
  const [tripId, setTripId] = useState(summary.trips[0]?.id ?? '');
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const setSearch = (value: string) =>
    setSearchParams(value ? { q: value } : {}, { replace: true });
  const trip = summary.trips.find((t) => t.id === tripId) ?? summary.trips[0];
  const mutation = useMutation({
    mutationFn: recordLoadingEvent,
    onSuccess: () => {
      toast.success('Loading event recorded.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
    onError: (error) => toast.error(error.message),
  });
  const issue = useMutation({
    mutationFn: () =>
      createIssue({
        type: 'LOADING',
        title: 'Loading dock review',
        description: 'Loader requested a goods check.',
        orderId: trip?.stops[0]?.order.id,
      }),
    onSuccess: () => {
      toast.success('Issue reported.');
      void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
    },
    onError: (error) => toast.error(error.message),
  });
  if (!trip)
    return (
      <EmptyState
        title="No assigned loads"
        description="Assigned loading trips will appear here."
      />
    );
  const milestones = ['STARTED', 'READY', 'COMPLETED'];
  const recorded = milestones.filter((type) => trip.loadingEvents.some((e) => e.type === type));
  const progress = Math.round((recorded.length / 3) * 100);
  return (
    <div className="loader-board">
      <div className="loader-topline">
        <Link to="/loader">
          <ArrowLeft size={16} />
          Back to loads
        </Link>
        <label>
          Assigned trip{' '}
          <select value={trip.id} onChange={(e) => setTripId(e.target.value)}>
            {summary.trips.map((t) => (
              <option value={t.id} key={t.id}>
                Trip #{t.tripNumber} - {t.vehicle.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="loader-plan-notice">
        <CheckCircle2 />
        <strong>Plan version {trip.revision}</strong>
        <span>{trip.plan.name}. Review the stop sequence before completing loading.</span>
      </div>
      <section className="loader-hero">
        <p className="spaced-label">TRIP</p>
        <h1>
          #{trip.tripNumber} <Badge tone="info">{trip.status}</Badge>
        </h1>
        <h2>
          {trip.plan.depot} <ArrowRight size={18} />{' '}
          {trip.stops
            .map((s) => s.outlet.district)
            .filter((v, i, a) => a.indexOf(v) === i)
            .join(', ')}
        </h2>
        <div className="loader-facts">
          <div>
            <Truck />
            <span>
              Vehicle ID<strong>{trip.vehicle.name}</strong>
              <small>{trip.vehicle.type}</small>
            </span>
          </div>
          <div>
            <Clock />
            <span>
              Delivery date
              <strong>
                {new Date(trip.plan.deliveryDate).toLocaleDateString('en', { dateStyle: 'medium' })}
              </strong>
              <small>Planned service date</small>
            </span>
          </div>
          <div>
            <Box />
            <span>
              Total Orders<strong>{trip.stops.length}</strong>
              <small>{trip.stops.reduce((sum, s) => sum + s.order.units, 0)} units</small>
            </span>
          </div>
          <div>
            <MapPin />
            <span>
              Route<strong>{trip.stops.length} stops</strong>
              <small>Delivery sequence</small>
            </span>
          </div>
        </div>
      </section>
      <div className="loading-progress">
        <div>
          <h2>Loading Progress</h2>
          <progress value={recorded.length} max={3} aria-label="Loading milestones completed" />
        </div>
        <div>
          <strong>{progress}%</strong>
          <span>{recorded.length} of 3 milestones recorded</span>
        </div>
      </div>
      <div className="loader-middle">
        <Panel title="Stop Sequence">
          <ol className="loader-stops">
            {trip.stops.map((stop) => (
              <li key={stop.id}>
                <span>{stop.sequence}</span>
                <details>
                  <summary>
                    <strong>{stop.outlet.name}</strong>
                    <Badge tone="info">{stop.order.status}</Badge>
                  </summary>
                  <p>{stop.outlet.district}</p>
                  <p>
                    {stop.order.sourceId} · {stop.order.units} units · {stop.order.weightKg} kg
                  </p>
                </details>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title={`Trip ${trip.tripNumber} loading checklist`}>
          <div className="loading-checks">
            {[
              { type: 'STARTED', label: 'Loading started' },
              { type: 'READY', label: 'Load readiness confirmed' },
              { type: 'COMPLETED', label: 'Loading completed' },
            ].map((item) => (
              <div key={item.type}>
                <input
                  type="checkbox"
                  aria-label={item.label}
                  checked={recorded.includes(item.type)}
                  readOnly
                  disabled
                />
                <span>{item.label}</span>
                <small>
                  {trip.loadingEvents.find((e) => e.type === item.type)?.occurredAt
                    ? new Date(
                        trip.loadingEvents.find((e) => e.type === item.type)!.occurredAt,
                      ).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
                    : 'Not recorded'}
                </small>
              </div>
            ))}
          </div>
          <div className="loader-check-actions">
            <Button
              loading={mutation.isPending}
              onClick={() => mutation.mutate({ tripId: trip.id, type: 'STARTED' })}
            >
              Start load
            </Button>
            <Button
              variant="secondary"
              loading={mutation.isPending}
              onClick={() => mutation.mutate({ tripId: trip.id, type: 'READY' })}
            >
              Mark ready
            </Button>
            <Button
              variant="secondary"
              loading={mutation.isPending}
              onClick={() => mutation.mutate({ tripId: trip.id, type: 'COMPLETED' })}
            >
              Complete loading
            </Button>
            <Button variant="secondary" loading={issue.isPending} onClick={() => issue.mutate()}>
              Report issue
            </Button>
          </div>
        </Panel>
      </div>
      <Card className="loader-orders">
        <div className="tower-panel-heading">
          <h2>Orders to Load ({trip.stops.length})</h2>
          <label className="planning-search">
            <Search size={16} />
            <input
              aria-label="Search loading orders"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders or outlets..."
            />
          </label>
        </div>
        <div className="ui-table-scroll">
          <table className="ui-table">
            <thead>
              <tr>
                {['Order #', 'Customer', 'Items', 'Weight', 'Status', 'Actions'].map((t) => (
                  <th key={t}>{t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trip.stops
                .filter((s) =>
                  `${s.order.sourceId} ${s.outlet.name}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                )
                .map((stop) => (
                  <tr key={stop.id}>
                    <td>
                      <strong>{stop.order.sourceId}</strong>
                      <small>Stop {stop.sequence}</small>
                    </td>
                    <td>
                      {stop.outlet.name}
                      <small>{stop.outlet.district}</small>
                    </td>
                    <td>
                      {stop.order.units} units<small>{stop.order.temperature}</small>
                    </td>
                    <td>{stop.order.weightKg} kg</td>
                    <td>
                      <Badge tone="info">{stop.order.status}</Badge>
                    </td>
                    <td>
                      <div className="loading-row-actions">
                        {[
                          { type: 'ITEM_LOADED', label: 'Loaded' },
                          { type: 'MISSING', label: 'Missing' },
                          { type: 'DAMAGED', label: 'Damaged' },
                          { type: 'SHORTFALL', label: 'Short' },
                        ].map(({ type, label }) => (
                          <Button
                            key={type}
                            size="small"
                            variant={type === 'ITEM_LOADED' ? 'primary' : 'secondary'}
                            disabled={mutation.isPending}
                            onClick={() =>
                              mutation.mutate({
                                tripId: trip.id,
                                orderId: stop.order.id,
                                type: type as 'ITEM_LOADED' | 'MISSING' | 'DAMAGED' | 'SHORTFALL',
                              })
                            }
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
