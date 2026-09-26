import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { DatabaseService } from '../src/database/database.service';
import { OrdersService } from '../src/modules/orders/orders.service';
import type { AuthenticatedUser } from '../src/modules/auth/auth.types';
import type { CreateOrderDto } from '../src/modules/orders/orders.dto';

const store: AuthenticatedUser = {
  sub: 'user-demo-store',
  email: 'store.demo@waypoint.local',
  displayName: 'Demo Store Manager',
  role: 'STORE_MANAGER',
  outletId: 'outlet-demo',
};

const dispatcher: AuthenticatedUser = { ...store, role: 'DISPATCHER', outletId: null };
const input: CreateOrderDto = {
  requestedDeliveryDate: '2026-09-28',
  temperature: 'REEFER',
  units: 20,
  weightKg: 250.5,
  volumeM3: 1.5,
  requestedWindowOpen: '06:00',
  requestedWindowClose: '07:30',
};

function database(overrides: Record<string, unknown> = {}): DatabaseService {
  const outlet = { id: 'outlet-demo', brandId: 'brand-demo', depotId: 'depot-demo' };
  const intakeRun = { id: 'run-demo', sourceId: 'DEMO-INTAKE-A' };
  const prisma = {
    outlet: { findUnique: async () => outlet },
    intakeRun: { findFirst: async () => intakeRun },
    order: {
      create: async ({ data }: { data: Record<string, unknown> }) => ({
        ...data,
        id: 'order-demo',
      }),
      findFirst: async () => null,
      findMany: async () => [],
      findUnique: async () => null,
    },
    ...overrides,
  };
  return { prisma } as unknown as DatabaseService;
}

describe('OrdersService', () => {
  it('creates a confirmed DEMO order on the first eligible open intake run', async () => {
    const result = await new OrdersService(database()).create(input, store);
    assert.equal(result.status, 'CONFIRMED');
    assert.match(String(result.sourceId), /^DEMO-ORDER-/);
    assert.equal(result.outletId, 'outlet-demo');
    assert.equal(result.intakeRunId, 'run-demo');
    assert.deepEqual(result.requestedWindowOpen, new Date('1970-01-01T06:00:00.000Z'));
  });

  it('returns the existing order for a repeated DEMO request reference', async () => {
    const existing = { id: 'order-existing', outletId: 'outlet-demo', sourceId: 'DEMO-REQUEST-1' };
    const prisma = { order: { findFirst: async () => existing } };
    const result = await new OrdersService(database(prisma)).create(
      { ...input, sourceId: existing.sourceId },
      store,
    );
    assert.equal(result, existing);
  });

  it('rejects a reversed requested delivery window before persistence', async () => {
    await assert.rejects(
      new OrdersService(database()).create(
        { ...input, requestedWindowOpen: '08:00', requestedWindowClose: '07:30' },
        store,
      ),
      (error: unknown) =>
        error instanceof Error && error.message === 'Requested delivery window is invalid.',
    );
  });

  it('requires an eligible open intake run after cutoff selection', async () => {
    const prisma = { intakeRun: { findFirst: async () => null } };
    await assert.rejects(
      new OrdersService(database(prisma)).create(input, store),
      ConflictException,
    );
  });

  it('scopes store order detail to the authorized outlet', async () => {
    const order = { id: 'order-other', outletId: 'outlet-other' };
    const prisma = { order: { findUnique: async () => order } };
    await assert.rejects(
      new OrdersService(database(prisma)).getById(order.id, store),
      NotFoundException,
    );
    await assert.doesNotReject(new OrdersService(database(prisma)).getById(order.id, dispatcher));
  });
});
