import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClipboardList, PackageCheck, Plus, RefreshCw } from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FormField,
  Input,
  PageHeader,
  Select,
  Skeleton,
  Textarea,
} from '@waypoint/ui';
import {
  createOrder,
  fetchOrder,
  fetchOrders,
  type CreateOrderInput,
  type Order,
} from '../lib/api';
import { queryClient } from '../app/query-client';

const today = () => new Date().toISOString().slice(0, 10);
const retryId = () => `DEMO-ORDER-CLIENT-${Date.now()}`;
const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
    new Date(`${value.slice(0, 10)}T00:00:00`),
  );
const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value),
  );
function OrderFacts({ order }: { order: Order }) {
  return (
    <dl className="order-facts">
      <div>
        <dt>Requested date</dt>
        <dd>{formatDate(order.requestedDeliveryDate)}</dd>
      </div>
      <div>
        <dt>Temperature</dt>
        <dd>{order.temperature}</dd>
      </div>
      <div>
        <dt>Units</dt>
        <dd>{order.units}</dd>
      </div>
      <div>
        <dt>Weight</dt>
        <dd>{order.weightKg} kg</dd>
      </div>
      <div>
        <dt>Volume</dt>
        <dd>{order.volumeM3} m³</dd>
      </div>
    </dl>
  );
}
function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="order-card">
      <div className="order-card-heading">
        <div>
          <p className="ui-eyebrow">{formatDate(order.requestedDeliveryDate)}</p>
          <h2>{order.sourceId}</h2>
        </div>
        <Badge tone="success">{order.status}</Badge>
      </div>
      <OrderFacts order={order} />
      <div className="order-card-footer">
        <span>Confirmed {formatDateTime(order.confirmedAt)}</span>
        <Button asChild variant="secondary" size="small">
          <Link to={`/store/orders/${order.id}`}>View order</Link>
        </Button>
      </div>
    </Card>
  );
}
export function StoreOrdersPage() {
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: ({ signal }) => fetchOrders(undefined, signal),
  });
  const orders = query.data ?? [];
  return (
    <>
      <PageHeader
        eyebrow="STORE MANAGER / ORDERS"
        title="Order history"
        description="Review confirmed requests for your authorized outlet."
        actions={
          <Button asChild>
            <Link to="/store/create">
              <Plus size={16} aria-hidden="true" />
              Create order
            </Link>
          </Button>
        }
      />
      {query.isLoading ? (
        <div className="order-grid" aria-label="Loading orders">
          <Skeleton className="order-skeleton" />
          <Skeleton className="order-skeleton" />
        </div>
      ) : query.isError ? (
        <ErrorState
          title="Couldn't load your orders"
          description={query.error.message}
          onRetry={() => void query.refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={25} />}
          title="No orders yet"
          description="Create a separate order for a requested delivery date."
          action={
            <Button asChild>
              <Link to="/store/create">Create order</Link>
            </Button>
          }
        />
      ) : (
        <div className="order-grid">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </>
  );
}
function OrderForm({ onAccepted }: { onAccepted: (order: Order) => void }) {
  const [form, setForm] = useState<Omit<CreateOrderInput, 'sourceId'>>({
    requestedDeliveryDate: '',
    temperature: 'AMBIENT',
    units: 1,
    weightKg: 0,
    volumeM3: 0,
    requestedWindowOpen: '',
    requestedWindowClose: '',
    accessRequirement: '',
    mallWindow: '',
  });
  const [error, setError] = useState<string>();
  const update = (key: keyof typeof form, value: string | number) =>
    setForm((current) => ({ ...current, [key]: value }));
  const mutation = useMutation({
    mutationFn: () =>
      createOrder({
        ...form,
        sourceId: retryId(),
        requestedWindowOpen: form.requestedWindowOpen || undefined,
        requestedWindowClose: form.requestedWindowClose || undefined,
        accessRequirement: form.accessRequirement || undefined,
        mallWindow: form.mallWindow || undefined,
      }),
    onSuccess: onAccepted,
    onError: (reason) =>
      setError(reason instanceof Error ? reason.message : 'Your order could not be sent.'),
  });
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    if (!form.requestedDeliveryDate || form.units < 1 || form.weightKg < 0 || form.volumeM3 < 0) {
      setError('Enter a requested date and valid non-negative quantities.');
      return;
    }
    if (
      form.requestedWindowOpen &&
      form.requestedWindowClose &&
      form.requestedWindowOpen >= form.requestedWindowClose
    ) {
      setError('The requested delivery window must end after it starts.');
      return;
    }
    mutation.mutate();
  }
  return (
    <form className="order-form" onSubmit={submit} noValidate>
      {error && (
        <Alert title="Order not sent" tone="critical">
          {error}
        </Alert>
      )}
      <fieldset>
        <legend>Delivery request</legend>
        <FormField
          id="requestedDeliveryDate"
          label="Requested delivery date"
          description="The server will confirm the eligible intake run."
          required
        >
          <Input
            id="requestedDeliveryDate"
            type="date"
            min={today()}
            value={form.requestedDeliveryDate}
            onChange={(event) => update('requestedDeliveryDate', event.target.value)}
            required
          />
        </FormField>
        <div className="form-grid">
          <FormField id="requestedWindowOpen" label="Window opens">
            <Input
              id="requestedWindowOpen"
              type="time"
              value={form.requestedWindowOpen}
              onChange={(event) => update('requestedWindowOpen', event.target.value)}
            />
          </FormField>
          <FormField id="requestedWindowClose" label="Window closes">
            <Input
              id="requestedWindowClose"
              type="time"
              value={form.requestedWindowClose}
              onChange={(event) => update('requestedWindowClose', event.target.value)}
            />
          </FormField>
        </div>
      </fieldset>
      <fieldset>
        <legend>Goods</legend>
        <FormField id="temperature" label="Temperature handling" required>
          <Select
            id="temperature"
            value={form.temperature}
            onChange={(event) => update('temperature', event.target.value)}
          >
            <option value="AMBIENT">Ambient</option>
            <option value="REEFER">Refrigerated / chilled</option>
          </Select>
        </FormField>
        <div className="form-grid">
          <FormField id="units" label="Units" required>
            <Input
              id="units"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              value={form.units}
              onChange={(event) => update('units', Number(event.target.value))}
            />
          </FormField>
          <FormField id="weightKg" label="Weight (kg)" required>
            <Input
              id="weightKg"
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={form.weightKg}
              onChange={(event) => update('weightKg', Number(event.target.value))}
            />
          </FormField>
        </div>
        <FormField id="volumeM3" label="Volume (m³)" required>
          <Input
            id="volumeM3"
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={form.volumeM3}
            onChange={(event) => update('volumeM3', Number(event.target.value))}
          />
        </FormField>
      </fieldset>
      <fieldset>
        <legend>
          Access context <span className="legend-optional">Optional</span>
        </legend>
        <FormField id="accessRequirement" label="Access requirement">
          <Input
            id="accessRequirement"
            placeholder="e.g. rear entrance"
            value={form.accessRequirement}
            onChange={(event) => update('accessRequirement', event.target.value)}
          />
        </FormField>
        <FormField id="mallWindow" label="Mall window">
          <Textarea
            id="mallWindow"
            rows={3}
            placeholder="Add a delivery access note"
            value={form.mallWindow}
            onChange={(event) => update('mallWindow', event.target.value)}
          />
        </FormField>
      </fieldset>
      <div className="order-form-actions">
        <Button asChild variant="secondary">
          <Link to="/store/orders">Cancel</Link>
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          <PackageCheck size={16} aria-hidden="true" />
          {mutation.isPending ? 'Submitting order...' : 'Submit order'}
        </Button>
      </div>
    </form>
  );
}
export function StoreCreateOrderPage() {
  const [accepted, setAccepted] = useState<Order>();
  if (accepted)
    return (
      <StoreOrderConfirmation order={accepted} onCreateAnother={() => setAccepted(undefined)} />
    );
  return (
    <>
      <PageHeader
        eyebrow="STORE MANAGER / CREATE ORDER"
        title="Create order"
        description="Submit a distinct request for your authorized outlet. Acceptance does not mean the order is scheduled."
      />
      <Card className="order-form-card">
        <div className="order-form-note">
          <Badge tone="info">Server-confirmed cutoff</Badge>
          <p>
            Use the requested date and quantities your delivery team needs for planning. The latest
            eligibility is checked when you submit.
          </p>
        </div>
        <OrderForm
          onAccepted={(order) => {
            setAccepted(order);
            void queryClient.invalidateQueries({ queryKey: ['orders'] });
          }}
        />
      </Card>
    </>
  );
}
function StoreOrderConfirmation({
  order,
  onCreateAnother,
}: {
  order: Order;
  onCreateAnother: () => void;
}) {
  return (
    <>
      <PageHeader
        eyebrow="STORE MANAGER / ORDER CONFIRMATION"
        title="Order confirmed"
        description="Your request was accepted by the delivery service."
        actions={<Badge tone="success">Confirmed</Badge>}
      />
      <Card className="confirmation-card">
        <Alert title="Not scheduled yet" tone="info">
          This order is confirmed for planning. A later published plan will determine scheduling and
          arrival details.
        </Alert>
        <div className="confirmation-reference">
          <span>Order reference</span>
          <strong>{order.sourceId}</strong>
        </div>
        <OrderFacts order={order} />
        <div className="confirmation-meta">
          <span>Submitted {formatDateTime(order.submittedAt)}</span>
          <span>Intake run {order.intakeRun?.id ?? 'confirmed by server'}</span>
        </div>
        <div className="order-form-actions">
          <Button asChild variant="secondary">
            <Link to={`/store/orders/${order.id}`}>View order</Link>
          </Button>
          <Button onClick={onCreateAnother}>
            <Plus size={16} aria-hidden="true" />
            Create another order
          </Button>
        </div>
      </Card>
    </>
  );
}
export function StoreOrderDetailPage() {
  const { id = '' } = useParams();
  const query = useQuery({
    queryKey: ['order', id],
    queryFn: ({ signal }) => fetchOrder(id, signal),
    enabled: Boolean(id),
  });
  if (query.isLoading)
    return (
      <>
        <PageHeader title="Order detail" />
        <Skeleton className="detail-skeleton" />
      </>
    );
  if (query.isError || !query.data)
    return (
      <ErrorState
        title="Couldn't load this order"
        description={query.error?.message ?? 'The order is not available to this outlet.'}
        onRetry={() => void query.refetch()}
      />
    );
  const order = query.data;
  return (
    <>
      <PageHeader
        eyebrow="STORE MANAGER / ORDER DETAIL"
        title={order.sourceId}
        description="Confirmed demand remains separate from later planning and delivery states."
        actions={<Badge tone="success">{order.status}</Badge>}
      />
      <Card className="detail-card">
        <OrderFacts order={order} />
        <div className="detail-timeline">
          <div>
            <strong>Order received</strong>
            <span>{formatDateTime(order.submittedAt)}</span>
          </div>
          <div>
            <strong>Confirmed</strong>
            <span>{formatDateTime(order.confirmedAt)}</span>
          </div>
          <div>
            <strong>Scheduling pending</strong>
            <span>No published arrival is available yet.</span>
          </div>
        </div>
        <Button asChild variant="secondary">
          <Link to="/store/orders">
            <RefreshCw size={16} aria-hidden="true" />
            Back to order history
          </Link>
        </Button>
      </Card>
    </>
  );
}
