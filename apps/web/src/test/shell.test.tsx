import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WorkspaceLayout } from '../app/workspace-layout';
import WorkspacePage from '../pages/workspace-page';
import { workspaces } from '../app/workspaces';
import { StoreCreateOrderPage } from '../pages/store-orders-page';
import type { OperationSummary } from '../lib/api';

const summary: OperationSummary = {
  generatedAt: '2026-09-26T00:00:00.000Z',
  counts: {
    orders: 1,
    confirmedOrders: 1,
    publishedPlans: 1,
    trips: 1,
    openIssues: 1,
    deferrals: 1,
  },
  orders: [
    {
      id: 'order-1',
      sourceId: 'DEMO-ORDER-A',
      status: 'CONFIRMED',
      submittedAt: '2026-09-26T08:00:00.000Z',
      confirmedAt: '2026-09-26T08:00:00.000Z',
      requestedDeliveryDate: '2026-09-28T00:00:00.000Z',
      temperature: 'REEFER',
      units: 20,
      weightKg: 250,
      volumeM3: 1.5,
      outlet: { name: 'Illustrative Riverside Outlet' },
      brand: { name: 'Illustrative Fresh Brand' },
    },
  ],
  plans: [
    {
      id: 'plan-1',
      name: 'Illustrative development plan',
      deliveryDate: '2026-09-28T00:00:00.000Z',
      status: 'PUBLISHED',
      version: 1,
      depot: { id: 'depot-1', name: 'Illustrative Central Depot' },
      validation: { status: 'PASSED', checkedAt: '2026-09-26T08:30:00.000Z' },
    },
  ],
  vehicles: [
    {
      id: 'vehicle-1',
      sourceId: 'DEMO-VEHICLE-A',
      name: 'Illustrative Reefer Van',
      type: 'VAN',
      temperature: 'REEFER',
      available: true,
      weightCapacityKg: 1200,
      volumeCapacityM3: 8,
      weeklyFuelQuotaL: 250,
      homeDepot: 'Illustrative Central Depot',
    },
  ],
  trips: [
    {
      id: 'trip-1',
      tripNumber: 1,
      status: 'READY',
      revision: 1,
      plan: {
        id: 'plan-1',
        name: 'Illustrative development plan',
        deliveryDate: '2026-09-28T00:00:00.000Z',
        status: 'PUBLISHED',
        depot: 'Illustrative Central Depot',
      },
      vehicle: {
        id: 'vehicle-1',
        name: 'Illustrative Reefer Van',
        type: 'VAN',
        temperature: 'REEFER',
        weightCapacityKg: 1200,
        volumeCapacityM3: 8,
      },
      driver: { id: 'driver-1', name: 'Demo Driver', email: 'driver.demo@waypoint.local' },
      loadingEvents: [],
      allocations: [
        { id: 'allocation-1', status: 'SERVED', orderId: 'order-1', sourceId: 'DEMO-ORDER-A' },
      ],
      stops: [
        {
          id: 'stop-1',
          sequence: 1,
          outlet: {
            id: 'outlet-1',
            name: 'Illustrative Riverside Outlet',
            district: 'Demo District',
            dockType: 'standard',
            mallWindow: 'Van-only access before opening hours',
          },
          order: {
            id: 'order-1',
            sourceId: 'DEMO-ORDER-A',
            status: 'CONFIRMED',
            units: 20,
            temperature: 'REEFER',
            weightKg: 250,
            volumeM3: 1.5,
          },
          delivery: { id: 'delivery-1', status: 'PENDING' },
        },
      ],
    },
  ],
  issues: [
    {
      id: 'issue-1',
      type: 'LOADING',
      status: 'OPEN',
      title: 'Synthetic shortfall review',
      description: 'One carton requires supervisor review.',
      createdAt: '2026-09-26T08:40:00.000Z',
      order: { id: 'order-1', sourceId: 'DEMO-ORDER-A' },
    },
  ],
  deferrals: [
    {
      id: 'deferral-1',
      reason: 'ACCESS',
      explanation: 'Synthetic demonstration deferral.',
      createdAt: '2026-09-26T08:42:00.000Z',
      order: {
        id: 'order-2',
        sourceId: 'DEMO-ORDER-DEFERRED',
        outlet: 'Illustrative Riverside Outlet',
      },
      plan: { id: 'plan-1', name: 'Illustrative development plan' },
    },
  ],
  scenarios: [],
  syncEvents: [],
  depots: [],
  outlets: [],
};

vi.mock('../lib/api', async (importOriginal) => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('../lib/api')>();
  return {
    ...actual,
    fetchOperationsSummary: vi.fn(async () => summary),
    recordLoadingEvent: vi.fn(async () => ({})),
    recordDeliveryEvent: vi.fn(async () => ({})),
    createIssue: vi.fn(async () => ({})),
  };
});

function renderWorkspace(path: string) {
  const workspace = workspaces.find((candidate) => path.startsWith(`/${candidate.id}`));
  if (!workspace) throw new Error('Workspace missing for test path.');
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={`/${workspace.id}`} element={<WorkspaceLayout workspace={workspace} />}>
            <Route index element={<WorkspacePage />} />
            <Route path="*" element={<WorkspacePage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('workspace operations', () => {
  it('renders the dispatcher control tower from operations data', async () => {
    renderWorkspace('/dispatcher');
    expect(
      await screen.findByRole('heading', { name: 'Today’s delivery operation' }),
    ).toBeVisible();
    expect(screen.getByText('Latest exceptions')).toBeVisible();
  });

  it('renders the loader active load controls', async () => {
    renderWorkspace('/loader/active');
    expect(await screen.findByRole('heading', { name: 'Trip 1 loading checklist' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Mark ready' })).toBeVisible();
  });

  it('renders the driver offline delivery controls', async () => {
    renderWorkspace('/driver/trip');
    expect(
      await screen.findByRole('heading', { name: 'Stop 1: Illustrative Riverside Outlet' }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: 'Capture POD' })).toBeVisible();
  });

  it('renders the store overview with the create-order action', async () => {
    renderWorkspace('/store');
    expect(await screen.findByRole('heading', { name: 'Outlet delivery view' })).toBeVisible();
    expect(screen.getAllByRole('link', { name: /Create order/ }).length).toBeGreaterThan(0);
  });
});

describe('store ordering workflow', () => {
  it('renders the order form with accessible, unit-labelled fields', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <StoreCreateOrderPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByRole('heading', { name: 'Create order' })).toBeVisible();
    expect(screen.getByLabelText(/Requested delivery date/)).toBeVisible();
    expect(screen.getByLabelText(/Weight \(kg\)/)).toBeVisible();
    expect(screen.getByRole('button', { name: /submit order/i })).toBeVisible();
  });
});
