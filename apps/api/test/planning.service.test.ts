import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BadRequestException, ConflictException } from '@nestjs/common';
import type { DatabaseService } from '../src/database/database.service';
import { PlanningService } from '../src/modules/planning/planning.service';

const vehicle = {
  id: 'vehicle-demo',
  name: 'DEMO Reefer',
  type: 'VAN',
  temperature: 'REEFER',
  available: true,
  weightCapacityKg: 100,
  volumeCapacityM3: 1,
  weeklyFuelQuotaL: 100,
};
const order = {
  id: 'order-demo',
  sourceId: 'DEMO-ORDER-A',
  temperature: 'REEFER',
  weightKg: 40,
  volumeM3: 0.5,
};
function database(planOverrides: Record<string, unknown> = {}, orders = [order]): DatabaseService {
  const plan = {
    id: 'plan-demo',
    depotId: 'depot-demo',
    deliveryDate: new Date('2026-09-28T00:00:00.000Z'),
    version: 1,
    decisions: [{ orderId: order.id }],
    trips: [
      {
        id: 'trip-demo',
        tripNumber: 1,
        vehicleId: vehicle.id,
        vehicle,
        allocations: [{ status: 'SERVED', order }],
      },
    ],
    ...planOverrides,
  };
  const prisma = {
    plan: {
      findUnique: async () => plan,
      create: async ({ data }: { data: unknown }) => data,
      update: async ({ data }: { data: unknown }) => ({ ...plan, ...(data as object) }),
    },
    order: { findMany: async () => orders },
    planCapacitySnapshot: { upsert: async ({ create }: { create: unknown }) => create },
    planValidation: {
      upsert: async ({ create }: { create: { status: string; checkedAt: Date } }) => create,
    },
    capacityPlanningScenario: {
      upsert: async ({ create }: { create: unknown }) => create,
      findFirst: async () => null,
      update: async ({ data }: { data: unknown }) => data,
      create: async ({ data }: { data: unknown }) => data,
      findMany: async () => [],
    },
  };
  return { prisma } as unknown as DatabaseService;
}

describe('PlanningService', () => {
  it('passes a complete synthetic plan and writes capacity evidence', async () => {
    const result = await new PlanningService(database()).validatePlan('plan-demo');
    assert.equal(result.status, 'PASSED');
    assert.equal(result.blockingIssues.length, 0);
    assert.equal(result.advisoryIssues[0]?.code, 'FUEL_ESTIMATE_PENDING');
  });

  it('blocks missing order coverage and independent capacity violations', async () => {
    const oversizedOrder = { ...order, weightKg: 120, volumeM3: 2 };
    const result = await new PlanningService(
      database(
        {
          decisions: [],
          trips: [
            {
              id: 'trip-demo',
              tripNumber: 1,
              vehicleId: vehicle.id,
              vehicle,
              allocations: [{ status: 'SERVED', order: oversizedOrder }],
            },
          ],
        },
        [oversizedOrder],
      ),
    ).validatePlan('plan-demo');
    assert.equal(result.status, 'BLOCKED');
    assert.deepEqual(
      result.blockingIssues.map((issue) => issue.code),
      ['ORDER_UNASSIGNED', 'WEIGHT_EXCEEDED', 'VOLUME_EXCEEDED'],
    );
  });

  it('rejects a chilled order assigned to a non-reefer vehicle', async () => {
    const result = await new PlanningService(
      database({
        trips: [
          {
            id: 'trip-demo',
            tripNumber: 1,
            vehicleId: vehicle.id,
            vehicle: { ...vehicle, temperature: 'AMBIENT' },
            allocations: [{ status: 'SERVED', order }],
          },
        ],
      }),
    ).validatePlan('plan-demo');
    assert.equal(result.blockingIssues[0]?.code, 'REEFER_REQUIRED');
  });

  it('rejects invalid future-capacity scenarios without persistence', async () => {
    await assert.rejects(
      () =>
        new PlanningService(database()).createScenario({
          depotId: 'depot-demo',
          isoYear: 2026,
          isoWeek: 40,
          horizonStart: '2026-09-28',
          horizonEnd: '2026-10-04',
          totalVolumeM3: 1,
          chilledVolumeM3: 2,
          sourceLabel: 'DEMO-SCENARIO',
        }),
      BadRequestException,
    );
  });

  it('does not publish a plan with blocking issues', async () => {
    await assert.rejects(
      () => new PlanningService(database({ decisions: [] }, [order])).publishPlan('plan-demo'),
      ConflictException,
    );
  });
});
