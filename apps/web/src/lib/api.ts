import * as shared from '@waypoint/shared';
import type { HealthResponse, ReadinessResponse } from '@waypoint/shared';
import { getSession } from './auth';

const { healthResponseSchema, readinessResponseSchema } = shared;

const base = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
async function read(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${base}${path}`, {
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
      : AbortSignal.timeout(5000),
    headers: { Accept: 'application/json', ...authHeaders() },
  });
  if (!response.ok) throw new Error(`The service returned ${response.status}. Try again shortly.`);
  const value: unknown = await response.json();
  return value;
}
function authHeaders(): Record<string, string> {
  const token = getSession()?.accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
async function write(
  path: string,
  body: unknown,
  signal?: AbortSignal,
  method: 'POST' | 'PATCH' = 'POST',
): Promise<unknown> {
  const response = await fetch(`${base}${path}`, {
    method,
    signal: signal
      ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
      : AbortSignal.timeout(5000),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;
    const message = Array.isArray(payload?.message) ? payload.message.join(', ') : payload?.message;
    throw new Error(message ?? `The service returned ${response.status}. Try again shortly.`);
  }
  return response.json();
}

export type Temperature = 'AMBIENT' | 'REEFER';
export interface Order {
  id: string;
  sourceId: string;
  status: string;
  submittedAt: string;
  confirmedAt: string;
  requestedDeliveryDate: string;
  requestedWindowOpen?: string | null;
  requestedWindowClose?: string | null;
  accessRequirement?: string | null;
  mallWindow?: string | null;
  temperature: Temperature;
  units: number;
  weightKg: number;
  volumeM3: number;
  outlet?: { name?: string; code?: string } | null;
  brand?: { name?: string } | null;
  intakeRun?: { id: string; deliveryDate?: string; cutoffAt?: string; sequence?: number } | null;
}
export interface CreateOrderInput {
  requestedDeliveryDate: string;
  sourceId: string;
  temperature: Temperature;
  units: number;
  weightKg: number;
  volumeM3: number;
  requestedWindowOpen?: string;
  requestedWindowClose?: string;
  accessRequirement?: string;
  mallWindow?: string;
}
export async function fetchOrders(
  requestedDeliveryDate?: string,
  signal?: AbortSignal,
): Promise<Order[]> {
  const query = requestedDeliveryDate
    ? `?requestedDeliveryDate=${encodeURIComponent(requestedDeliveryDate)}`
    : '';
  return (await read(`/orders${query}`, signal)) as Order[];
}
export async function fetchOrder(id: string, signal?: AbortSignal): Promise<Order> {
  return (await read(`/orders/${encodeURIComponent(id)}`, signal)) as Order;
}
export async function createOrder(input: CreateOrderInput, signal?: AbortSignal): Promise<Order> {
  return (await write('/orders', input, signal)) as Order;
}
export interface OperationSummary {
  generatedAt: string;
  counts: {
    orders: number;
    confirmedOrders: number;
    publishedPlans: number;
    trips: number;
    openIssues: number;
    deferrals: number;
  };
  orders: Order[];
  plans: Array<{
    id: string;
    name: string;
    deliveryDate: string;
    status: string;
    version: number;
    publishedAt?: string | null;
    depot: { id: string; name: string };
    validation?: { status: string; checkedAt?: string | null } | null;
  }>;
  vehicles: Array<{
    id: string;
    sourceId: string;
    name: string;
    type: string;
    temperature: Temperature;
    available: boolean;
    weightCapacityKg: number;
    volumeCapacityM3: number;
    weeklyFuelQuotaL: number;
    homeDepot: string;
  }>;
  trips: Trip[];
  issues: Issue[];
  deferrals: Array<{
    id: string;
    reason: string;
    explanation: string;
    createdAt: string;
    order: { id: string; sourceId: string; outlet: string };
    plan: { id: string; name: string };
  }>;
  scenarios: Array<{
    id: string;
    isoYear: number;
    isoWeek: number;
    horizonStart: string;
    horizonEnd: string;
    totalVolumeM3: number;
    chilledVolumeM3: number;
    sourceLabel: string;
    sourceRunDate?: string | null;
    note?: string | null;
    depot: string;
    brand: string;
  }>;
  syncEvents: Array<{
    id: string;
    clientEventId: string;
    entityType: string;
    entityId: string;
    eventType: string;
    status: string;
    serverReceivedAt: string;
  }>;
  depots: Array<{ id: string; name: string; sourceId: string }>;
  outlets: Array<{
    id: string;
    sourceId: string;
    name: string;
    district: string;
    brand: string;
    depot: string;
  }>;
}
export interface Trip {
  id: string;
  tripNumber: number;
  status: string;
  revision: number;
  startedAt?: string | null;
  completedAt?: string | null;
  plan: { id: string; name: string; deliveryDate: string; status: string; depot: string };
  vehicle: {
    id: string;
    name: string;
    type: string;
    temperature: Temperature;
    weightCapacityKg: number;
    volumeCapacityM3: number;
  };
  driver?: { id: string; name: string; email: string } | null;
  loadingEvents: Array<{ id: string; type: string; occurredAt: string; details?: unknown }>;
  allocations: Array<{ id: string; status: string; orderId: string; sourceId: string }>;
  stops: Array<{
    id: string;
    sequence: number;
    plannedArrival?: string | null;
    outlet: {
      id: string;
      name: string;
      district: string;
      dockType?: string | null;
      parkingConstraint?: string | null;
      mallWindow?: string | null;
    };
    order: {
      id: string;
      sourceId: string;
      status: string;
      units: number;
      temperature: Temperature;
      weightKg: number;
      volumeM3: number;
    };
    delivery?: {
      id: string;
      status: string;
      deliveredAt?: string | null;
      proof?: {
        receiverName?: string | null;
        notes?: string | null;
        reference?: string | null;
      } | null;
      events?: Array<{ id: string; type: string; occurredAt: string }> | null;
    } | null;
  }>;
}
export interface Issue {
  id: string;
  type: string;
  status: string;
  title: string;
  description: string;
  createdAt: string;
  order?: { id: string; sourceId: string } | null;
}
export async function fetchOperationsSummary(signal?: AbortSignal): Promise<OperationSummary> {
  return (await read('/operations/summary', signal)) as OperationSummary;
}
export async function recordLoadingEvent(input: {
  tripId: string;
  type: 'STARTED' | 'ITEM_LOADED' | 'MISSING' | 'DAMAGED' | 'SHORTFALL' | 'READY' | 'COMPLETED';
  orderId?: string;
  details?: Record<string, unknown>;
}): Promise<unknown> {
  return write('/operations/loading-events', input);
}
export async function recordDeliveryEvent(input: {
  clientEventId: string;
  tripStopId: string;
  type: 'ARRIVED' | 'OUTCOME_RECORDED' | 'POD_RECORDED' | 'ISSUE_REPORTED' | 'COMPLETED';
  receiverName?: string;
  notes?: string;
  reference?: string;
  baseVersion?: number;
  details?: Record<string, unknown>;
}): Promise<unknown> {
  return write('/operations/delivery-events', input);
}
export async function createIssue(input: {
  type: 'LOADING' | 'DELIVERY' | 'RECEIPT' | 'OTHER';
  title: string;
  description: string;
  orderId?: string;
  deliveryId?: string;
}): Promise<unknown> {
  return write('/operations/issues', input);
}
export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return healthResponseSchema.parse(await read('/health', signal));
}
export async function fetchReadiness(signal?: AbortSignal): Promise<ReadinessResponse> {
  return readinessResponseSchema.parse(await read('/health/ready', signal));
}

export function validatePlan(id: string): Promise<unknown> {
  return write(`/planning/plans/${encodeURIComponent(id)}/validate`, {});
}
export function publishPlan(id: string): Promise<unknown> {
  return write(`/planning/plans/${encodeURIComponent(id)}/publish`, {}, undefined, 'PATCH');
}
