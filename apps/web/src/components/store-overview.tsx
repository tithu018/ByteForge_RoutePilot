import { Link } from 'react-router';
import { Box, MapPin, Store, Truck, ArrowRight } from 'lucide-react';
import { Badge, Card } from '@waypoint/ui';
import type { OperationSummary } from '../lib/api';
import { StoreCreateOrderPage } from '../pages/store-orders-page';
import { Panel } from './control-tower';
export function StoreOverview({ summary }: { summary: OperationSummary }) {
  const outlet = summary.outlets[0];
  const next = summary.trips.find((trip) => trip.status !== 'COMPLETED');
  return (
    <div className="store-overview">
      <section className="store-hero">
        <p className="spaced-label">STORE MANAGER</p>
        <h1>
          Keep Your Store
          <br />
          <em>Fully Stocked</em>
        </h1>
        <p>Create orders, follow deliveries, and keep your team connected to the supply chain.</p>
      </section>
      <div className="store-summary-grid">
        <Card>
          <span className="round-icon">
            <Store />
          </span>
          <h2>Outlet Summary</h2>
          <strong>{outlet?.name ?? summary.orders[0]?.outlet?.name ?? 'Your outlet'}</strong>
          <p>{outlet?.district ?? 'Authorized outlet workspace'}</p>
          <p>{outlet?.depot ?? 'Waypoint Group'}</p>
          <Link to="/store/orders">
            View Store Orders <ArrowRight size={15} />
          </Link>
        </Card>
        <Card>
          <span className="round-icon">
            <Truck />
          </span>
          <h2>Next Delivery</h2>
          <strong>
            {next
              ? new Date(next.plan.deliveryDate).toLocaleDateString('en', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Not scheduled'}
          </strong>
          <p>{next?.vehicle.name ?? 'Awaiting a published trip'}</p>
          <p>{next?.plan.depot ?? 'No arrival time available'}</p>
          <Badge tone="info">{next?.status ?? 'Pending'}</Badge>
        </Card>
        <Card>
          <span className="round-icon">
            <Box />
          </span>
          <h2>Open Orders</h2>
          <strong>
            {
              summary.orders.filter(
                (o) => !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status),
              ).length
            }
          </strong>
          <p>{summary.counts.confirmedOrders} confirmed</p>
          <p>{summary.counts.openIssues} open issues</p>
          <Link to="/store/orders">
            View All Orders <ArrowRight size={15} />
          </Link>
        </Card>
      </div>
      <div className="store-inline-create">
        <StoreCreateOrderPage embedded />
      </div>
      <Panel title="Recent Orders" to="/store/orders">
        <div className="ui-table-scroll">
          <table className="ui-table">
            <thead>
              <tr>
                {['Order #', 'Date', 'Items', 'Delivery Date', 'Status', 'Actions'].map((label) => (
                  <th key={label}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.orders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link to={`/store/orders/${order.id}`}>{order.sourceId}</Link>
                  </td>
                  <td>{new Date(order.submittedAt).toLocaleDateString('en')}</td>
                  <td>{order.units} units</td>
                  <td>{new Date(order.requestedDeliveryDate).toLocaleDateString('en')}</td>
                  <td>
                    <Badge tone="info">{order.status}</Badge>
                  </td>
                  <td>
                    <Link to={`/store/orders/${order.id}`}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!summary.orders.length && (
            <p className="panel-empty">
              <MapPin size={20} />
              No orders yet.
            </p>
          )}
        </div>
      </Panel>
    </div>
  );
}
