import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Box,
  Check,
  Clock,
  Download,
  MapPin,
  Printer,
  Share2,
  Truck,
} from 'lucide-react';
import { Badge, Button, Card, toast } from '@waypoint/ui';
import { fetchOperationsSummary } from '../lib/api';
import type { Order } from '../lib/api';
import { RouteMap } from './route-map';
import { Panel } from './control-tower';
export function OrderTracking({ order }: { order: Order }) {
  const query = useQuery({
    queryKey: ['operations-summary'],
    queryFn: ({ signal }) => fetchOperationsSummary(signal),
  });
  const trip = query.data?.trips.find((t) => t.stops.some((s) => s.order.id === order.id));
  const stop = trip?.stops.find((s) => s.order.id === order.id);
  const stages = [
    { name: 'Order Placed', value: order.submittedAt },
    { name: 'Confirmed', value: order.confirmedAt },
    { name: 'In Transit', value: trip?.startedAt },
    {
      name: 'At Outlet',
      value: stop?.delivery?.events?.find((e) => e.type === 'ARRIVED')?.occurredAt,
    },
    { name: 'Delivered', value: stop?.delivery?.deliveredAt },
  ];
  function download() {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `order-${order.id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="order-tracking">
      <section className="store-hero tracking-hero">
        <p className="spaced-label">ORDER TRACKING</p>
        <h1>Order {order.sourceId}</h1>
        <p>Follow the recorded delivery progress for your outlet.</p>
      </section>
      <div className="tracking-toolbar">
        <Link to="/store/orders">
          <ArrowLeft size={16} />
          Back to Orders
        </Link>
        <div>
          <Button variant="ghost" onClick={download}>
            <Download size={15} />
            Download
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              void navigator.clipboard
                .writeText(window.location.href)
                .then(() => toast.success('Order link copied.'))
                .catch(() => toast.error('Could not copy the link.'));
            }}
          >
            <Share2 size={15} />
            Share
          </Button>
          <Button variant="ghost" onClick={() => window.print()}>
            <Printer size={15} />
            Print
          </Button>
        </div>
      </div>
      <Card className="tracking-facts">
        <div>
          <span className="round-icon">
            <Box />
          </span>
          <span>
            <strong>{order.sourceId}</strong>
            <small>Placed {new Date(order.submittedAt).toLocaleString()}</small>
          </span>
        </div>
        <div>
          <span className="round-icon">
            <Box />
          </span>
          <span>
            <strong>Total Items</strong>
            <small>
              {order.units} units · {order.weightKg} kg
            </small>
          </span>
        </div>
        <div>
          <span className="round-icon">
            <MapPin />
          </span>
          <span>
            <strong>Delivery to</strong>
            <small>{order.outlet?.name ?? 'Your authorized outlet'}</small>
          </span>
        </div>
      </Card>
      <Card className="tracking-main">
        <ol className="tracking-stages">
          {stages.map((stage) => (
            <li key={stage.name} className={stage.value ? 'recorded' : ''}>
              <span>{stage.value ? <Check size={19} /> : <Truck size={18} />}</span>
              <strong>{stage.name}</strong>
              <small>
                {stage.value
                  ? new Date(stage.value).toLocaleDateString('en', {
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Pending'}
              </small>
            </li>
          ))}
        </ol>
        <div className="tracking-grid">
          <div>
            <div className="tracking-arrival">
              <Truck size={32} />
              <div>
                <strong>Planned Arrival</strong>
                <h2>
                  {stop?.plannedArrival
                    ? new Date(stop.plannedArrival).toLocaleDateString('en', {
                        dateStyle: 'medium',
                      })
                    : 'Not scheduled'}
                </h2>
                <p>
                  {stop?.plannedArrival
                    ? new Date(stop.plannedArrival).toLocaleTimeString('en', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'No arrival time available yet'}
                </p>
                <Badge tone="info">{stop?.delivery?.status ?? order.status}</Badge>
              </div>
            </div>
            <div className="tracking-notice">
              <Clock size={26} />
              <div>
                <strong>Delivery Notice</strong>
                <p>
                  {query.data?.deferrals.find((d) => d.order.id === order.id)?.explanation ??
                    'Your requested date is separate from a scheduled arrival. Check here for recorded plan updates.'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="map-title">Delivery Location</h2>
            <RouteMap
              labels={[trip?.plan.depot ?? 'Depot', order.outlet?.name ?? 'Outlet']}
              compact
            />
            <div className="tracking-actions">
              <Button asChild>
                <Link to="/store/orders">
                  View All Orders <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/store/issues">Delivery issues</Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Panel title="Order Details">
        <div className="ui-table-scroll">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Temperature</th>
                <th>Requested date</th>
                <th>Units</th>
                <th>Weight</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.sourceId}</td>
                <td>
                  <Badge tone="info">{order.temperature}</Badge>
                </td>
                <td>{new Date(order.requestedDeliveryDate).toLocaleDateString()}</td>
                <td>{order.units}</td>
                <td>{order.weightKg} kg</td>
                <td>{order.volumeM3} m³</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
