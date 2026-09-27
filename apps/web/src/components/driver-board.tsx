import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  CloudUpload,
  Database,
  FileCheck,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Truck,
} from 'lucide-react';
import { Badge, Button, Card } from '@waypoint/ui';
import { Link } from 'react-router';
import type { OperationSummary, Trip } from '../lib/api';
import { getSession } from '../lib/auth';
export function DriverHero({ trip, subtitle }: { trip?: Trip; subtitle?: string }) {
  return (
    <section className="driver-hero">
      <p>{subtitle ?? 'Your delivery workspace'}</p>
      <h1>{getSession()?.user.displayName ?? 'Driver'}</h1>
      {trip && (
        <>
          <strong>
            Trip #{trip.tripNumber} <Badge tone="info">{trip.status}</Badge>
          </strong>
          <p>{trip.plan.name}</p>
          <small>
            {trip.stops.length} stops · {trip.vehicle.name}
          </small>
        </>
      )}
    </section>
  );
}
export function DriverTripView({
  trip,
  stopIndex,
  onSelect,
  onRecord,
  queueLength,
}: {
  trip: Trip;
  stopIndex: number;
  onSelect: (value: number) => void;
  onRecord: (type: 'ARRIVED' | 'OUTCOME_RECORDED' | 'POD_RECORDED' | 'COMPLETED') => void;
  queueLength: number;
}) {
  const stop = trip.stops[stopIndex];
  if (!stop) return null;
  return (
    <div className="driver-reference">
      <DriverHero trip={trip} />
      <Card className="driver-next-stop">
        <div className="driver-section-label">
          <span>NEXT STOP</span>
          <div>
            STOP {stopIndex + 1} OF {trip.stops.length}
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous stop"
              disabled={stopIndex === 0}
              onClick={() => onSelect(stopIndex - 1)}
            >
              <ChevronLeft size={17} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next stop"
              disabled={stopIndex >= trip.stops.length - 1}
              onClick={() => onSelect(stopIndex + 1)}
            >
              <ChevronRight size={17} />
            </Button>
          </div>
        </div>
        <div className="driver-destination">
          <span className="round-icon">
            <MapPin size={31} />
          </span>
          <div>
            <h2>
              Stop {stop.sequence}: {stop.outlet.name}
            </h2>
            <p>{stop.outlet.district}</p>
            <small>{stop.order.sourceId}</small>
          </div>
        </div>
        <div className="driver-stop-facts">
          <div>
            <Clock />
            <span>Planned arrival</span>
            <strong>
              {stop.plannedArrival
                ? new Date(stop.plannedArrival).toLocaleTimeString('en', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Not available'}
            </strong>
            <small>{stop.delivery?.status ?? 'Pending'}</small>
          </div>
          <div>
            <PackageCheck />
            <span>Dock Type</span>
            <strong>{stop.outlet.dockType ?? 'Not recorded'}</strong>
            <small>Receiving</small>
          </div>
          <div>
            <LockKeyhole />
            <span>Access</span>
            <strong>{stop.outlet.parkingConstraint ?? 'Not recorded'}</strong>
            <small>{stop.outlet.mallWindow ?? 'Check at outlet'}</small>
          </div>
        </div>
        <Button className="driver-arrive" onClick={() => onRecord('ARRIVED')}>
          <MapPin size={21} />
          I’ve Arrived at Stop
          <ArrowRight size={20} />
        </Button>
        <div className="driver-delivery-actions">
          <Button variant="secondary" onClick={() => onRecord('OUTCOME_RECORDED')}>
            <Truck size={20} />
            Record delivery
          </Button>
          <Button variant="secondary" onClick={() => onRecord('POD_RECORDED')}>
            <FileCheck size={20} />
            Capture POD
          </Button>
          <Button variant="secondary" onClick={() => onRecord('COMPLETED')}>
            <CheckCircle2 size={20} />
            Complete stop
          </Button>
        </div>
        <p className="driver-save-note">
          Actions save to the local demo queue. Open Sync to send them. {queueLength} queued.
        </p>
      </Card>
      <Card className="driver-upcoming">
        <div className="driver-section-label">
          <span>UPCOMING STOPS</span>
          <Link to="/driver/trip">
            VIEW FULL ROUTE <ArrowRight size={15} />
          </Link>
        </div>
        <ol>
          {trip.stops
            .filter((_, i) => i > stopIndex)
            .map((stop) => (
              <li key={stop.id}>
                <span>{stop.sequence}</span>
                <div>
                  <strong>{stop.outlet.name}</strong>
                  <p>{stop.outlet.district}</p>
                </div>
                <small>
                  {stop.plannedArrival
                    ? new Date(stop.plannedArrival).toLocaleTimeString('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Time not set'}
                </small>
              </li>
            ))}
        </ol>
        {stopIndex === trip.stops.length - 1 && (
          <p className="panel-empty">This is the last assigned stop.</p>
        )}
      </Card>
    </div>
  );
}
export function DriverSyncView({
  summary,
  queue,
  pending,
  success,
  error,
  onSync,
}: {
  summary: OperationSummary;
  queue: Array<{ clientEventId: string; type: string; createdAt: string }>;
  pending: boolean;
  success: boolean;
  error?: string;
  onSync: () => void;
}) {
  const synced = summary.syncEvents.filter(
    (event) =>
      event.status === 'APPLIED' || event.status === 'ACCEPTED' || event.status === 'SYNCED',
  ).length;
  return (
    <div className="driver-reference sync-reference">
      <DriverHero trip={summary.trips[0]} subtitle="Delivery updates" />
      <div className={`sync-banner ${success ? 'sync-success' : ''}`}>
        <span>
          <Cloud size={28} />
          {pending ? 'SYNCING…' : success ? 'SYNC COMPLETE' : 'SYNC CENTER'}
        </span>
        <div>
          <strong>
            {pending
              ? 'Sending your updates'
              : success
                ? 'Queue sent to the server'
                : `${queue.length} items pending sync`}
          </strong>
          <p>
            {pending
              ? 'Keep the app open while your events are sent.'
              : 'Review local events and server acknowledgements.'}
          </p>
        </div>
      </div>
      <Card className="driver-sync-card">
        <div className="sync-summary">
          <span className="round-icon">
            <Database size={27} />
          </span>
          <div>
            <h2>{queue.length} items pending sync</h2>
            <p>Deliveries, PODs, and trip updates</p>
          </div>
        </div>
        <div className="sync-counters">
          <div>
            <CheckCircle2 />
            <strong>{synced}</strong>
            <small>Accepted</small>
          </div>
          <div>
            <CloudUpload />
            <strong>{queue.length}</strong>
            <small>{pending ? 'Sending' : 'Pending'}</small>
          </div>
          <div>
            <Clock />
            <strong>{summary.syncEvents.length - synced}</strong>
            <small>Other results</small>
          </div>
        </div>
        <h2>{pending ? 'Sync Progress' : 'Sync Results'}</h2>
        <ol className="sync-event-list">
          {queue.map((event) => (
            <li key={event.clientEventId}>
              <span className="sync-event-icon">
                <Clock size={21} />
              </span>
              <div>
                <strong>{event.type.replaceAll('_', ' ')}</strong>
                <small>Saved on this device</small>
              </div>
              <time>
                {new Date(event.createdAt).toLocaleTimeString('en', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              <Badge tone="info">{pending ? 'Sending' : 'Pending'}</Badge>
            </li>
          ))}
          {summary.syncEvents.map((event) => (
            <li key={event.id}>
              <span className="sync-event-icon">
                <Check size={21} />
              </span>
              <div>
                <strong>{event.eventType.replaceAll('_', ' ')}</strong>
                <small>{event.entityType}</small>
              </div>
              <time>
                {new Date(event.serverReceivedAt).toLocaleTimeString('en', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>
              <Badge tone="neutral">{event.status}</Badge>
            </li>
          ))}
        </ol>
        {!queue.length && !summary.syncEvents.length && (
          <p className="panel-empty">No delivery updates to synchronize.</p>
        )}
        {error && (
          <p role="alert" className="ui-field-error">
            {error}
          </p>
        )}
        <Button
          className="sync-submit"
          disabled={!queue.length || pending}
          loading={pending}
          onClick={onSync}
        >
          <CloudUpload size={19} />
          Sync now{queue.length ? ` (${queue.length})` : ''}
        </Button>
        <Button asChild className="sync-submit" variant="secondary">
          <Link to="/driver/trip">
            <ArrowLeft size={16} />
            Back to active trip
          </Link>
        </Button>
        <p className="driver-save-note">
          Local event storage is available. Full offline trip caching is not yet implemented.
        </p>
      </Card>
    </div>
  );
}
