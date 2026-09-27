import { OrderTracking } from '../components/order-tracking';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ClipboardList, PackageCheck, Plus } from 'lucide-react';
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
        <dd>{order.volumeM3} mÃ‚Â³</dd>
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
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const query = useQuery({
    queryKey: ['orders'],
    queryFn: ({ signal }) => fetchOrders(undefined, signal),
  });
  const orders = (query.data ?? []).filter((order) =>
    `${order.sourceId} ${order.outlet?.name ?? ''}`.toLowerCase().includes(search.toLowerCase()),
  );
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
      <Input
        aria-label="Search store orders"
        placeholder="Search orders or outlets..."
        value={search}
        onChange={(e) =>
          setSearchParams(e.target.value ? { q: e.target.value } : {}, { replace: true })
        }
        className="store-order-search"
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
    <form className="order-form reference-order-form" onSubmit={submit} noValidate>
      {error && (
        <Alert title="Order not sent" tone="critical">
          {error}
        </Alert>
      )}
      <FormField id="accessRequirement" label="Delivery access / entrance">
        <Input
          id="accessRequirement"
          placeholder="Add the entrance, dock, or access instructions..."
          value={form.accessRequirement}
          onChange={(event) => update('accessRequirement', event.target.value)}
        />
      </FormField>
      <div className="order-quantity-grid">
        <FormField id="units" label="Units" required>
          <Input
            id="units"
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={form.units}
            onChange={(e) => update('units', Number(e.target.value))}
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
            onChange={(e) => update('weightKg', Number(e.target.value))}
          />
        </FormField>
        <FormField id="volumeM3" label="Volume (m3)" required>
          <Input
            id="volumeM3"
            type="number"
            min="0"
            step="0.1"
            inputMode="decimal"
            value={form.volumeM3}
            onChange={(e) => update('volumeM3', Number(e.target.value))}
          />
        </FormField>
      </div>
      <div className="form-grid">
        <FormField id="requestedDeliveryDate" label="Requested delivery date" required>
          <Input
            id="requestedDeliveryDate"
            type="date"
            min={today()}
            required
            value={form.requestedDeliveryDate}
            onChange={(e) => update('requestedDeliveryDate', e.target.value)}
          />
        </FormField>
        <FormField id="temperature" label="Temperature requirement" required>
          <Select
            id="temperature"
            value={form.temperature}
            onChange={(e) => update('temperature', e.target.value)}
          >
            <option value="AMBIENT">Ambient</option>
            <option value="REEFER">Refrigerated / chilled</option>
          </Select>
        </FormField>
      </div>
      <Alert title="Order Cutoff Notice" tone="info">
        The service checks the eligible intake run when you submit. Order acceptance does not
        guarantee a scheduled delivery.
      </Alert>
      <details className="order-window">
        <summary>Delivery time window (optional)</summary>
        <div className="form-grid">
          <FormField id="requestedWindowOpen" label="Window opens">
            <Input
              id="requestedWindowOpen"
              type="time"
              value={form.requestedWindowOpen}
              onChange={(e) => update('requestedWindowOpen', e.target.value)}
            />
          </FormField>
          <FormField id="requestedWindowClose" label="Window closes">
            <Input
              id="requestedWindowClose"
              type="time"
              value={form.requestedWindowClose}
              onChange={(e) => update('requestedWindowClose', e.target.value)}
            />
          </FormField>
        </div>
      </details>
      <FormField id="mallWindow" label="Delivery access notes (optional)">
        <Textarea
          id="mallWindow"
          rows={2}
          placeholder="Add mall delivery windows or special access instructions..."
          value={form.mallWindow}
          onChange={(e) => update('mallWindow', e.target.value)}
        />
      </FormField>
      <div className="order-form-actions">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            setForm({
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
            setError(undefined);
          }}
        >
          Clear
        </Button>
        <Button type="submit" loading={mutation.isPending}>
          <PackageCheck size={16} />
          {mutation.isPending ? 'Submitting order...' : 'Submit order'}
        </Button>
      </div>
    </form>
  );
}

export function StoreCreateOrderPage({ embedded = false }: { embedded?: boolean } = {}) {
  const [accepted, setAccepted] = useState<Order>();
  if (accepted)
    return (
      <StoreOrderConfirmation order={accepted} onCreateAnother={() => setAccepted(undefined)} />
    );
  return (
    <>
      <PageHeader
        eyebrow="STORE MANAGER / CREATE ORDER"
        title={embedded ? 'Create a New Order' : 'Create order'}
        description={
          embedded
            ? 'Tell us what you need and we will send it for planning.'
            : 'Submit a distinct request for your authorized outlet. Acceptance does not mean the order is scheduled.'
        }
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
            void queryClient.invalidateQueries({ queryKey: ['operations-summary'] });
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
  return <OrderTracking order={query.data} />;
}
