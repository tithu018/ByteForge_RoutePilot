import { config } from 'dotenv';
import { resolve } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { hashPassword } from '../src/modules/auth/password';

config({ path: resolve(__dirname, '../../.env'), quiet: true });

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    'postgresql://waypoint:waypoint_local_only@localhost:55432/waypoint',
});
const prisma = new PrismaClient({ adapter });
const date = (value: string): Date => new Date(`${value}T00:00:00.000Z`);
const time = (value: string): Date => new Date(`1970-01-01T${value}:00.000Z`);

async function main(): Promise<void> {
  const demoPasswordHash = await hashPassword('DemoOnly-ChangeMe-2026!');
  const brand = await prisma.brand.upsert({
    where: { sourceId: 'DEMO-BRAND-A' },
    update: {},
    create: { sourceId: 'DEMO-BRAND-A', name: 'Illustrative Fresh Brand' },
  });
  const depot = await prisma.depot.upsert({
    where: { sourceId: 'DEMO-DEPOT-A' },
    update: {},
    create: {
      sourceId: 'DEMO-DEPOT-A',
      name: 'Illustrative Central Depot',
      district: 'Demo District',
    },
  });
  const outlet = await prisma.outlet.upsert({
    where: { sourceId: 'DEMO-OUTLET-A' },
    update: {},
    create: {
      sourceId: 'DEMO-OUTLET-A',
      name: 'Illustrative Riverside Outlet',
      district: 'Demo District',
      dockType: 'standard',
      parkingConstraint: 'none',
      windowOpenTime: time('06:00'),
      windowCloseTime: time('10:00'),
      brandId: brand.id,
      depotId: depot.id,
    },
  });
  const vehicle = await prisma.vehicle.upsert({
    where: { sourceId: 'DEMO-VEHICLE-A' },
    update: {},
    create: {
      sourceId: 'DEMO-VEHICLE-A',
      name: 'Illustrative Reefer Van',
      type: 'VAN',
      temperature: 'REEFER',
      weightCapacityKg: 1200,
      volumeCapacityM3: 8,
      fuelType: 'diesel',
      kmPerL: 9.5,
      weeklyFuelQuotaL: 250,
      homeDepotId: depot.id,
    },
  });
  await prisma.user.upsert({
    where: { email: 'dispatcher.demo@waypoint.local' },
    update: {},
    create: {
      email: 'dispatcher.demo@waypoint.local',
      displayName: 'Demo Dispatcher',
      passwordHash: demoPasswordHash,
      role: 'DISPATCHER',
    },
  });
  const loader = await prisma.user.upsert({
    where: { email: 'loader.demo@waypoint.local' },
    update: {},
    create: {
      email: 'loader.demo@waypoint.local',
      displayName: 'Demo Loader',
      passwordHash: demoPasswordHash,
      role: 'LOADER',
    },
  });
  const driver = await prisma.user.upsert({
    where: { email: 'driver.demo@waypoint.local' },
    update: {},
    create: {
      email: 'driver.demo@waypoint.local',
      displayName: 'Demo Driver',
      passwordHash: demoPasswordHash,
      role: 'DRIVER',
    },
  });
  await prisma.user.upsert({
    where: { email: 'store.demo@waypoint.local' },
    update: {},
    create: {
      email: 'store.demo@waypoint.local',
      displayName: 'Demo Store Manager',
      passwordHash: demoPasswordHash,
      role: 'STORE_MANAGER',
      outletId: outlet.id,
    },
  });
  const calendarDay = await prisma.calendarDay.upsert({
    where: { date: date('2026-09-28') },
    update: {},
    create: {
      date: date('2026-09-28'),
      dow: 1,
      dowName: 'Monday',
      isWeekend: false,
      isoYear: 2026,
      isoWeek: 40,
      isOperating: true,
    },
  });
  const intakeRun = await prisma.intakeRun.upsert({
    where: { sourceId: 'DEMO-INTAKE-A' },
    update: {},
    create: {
      sourceId: 'DEMO-INTAKE-A',
      deliveryDate: calendarDay.date,
      cutoffAt: new Date('2026-09-26T10:00:00.000Z'),
      depotId: depot.id,
    },
  });
  const order = await prisma.order.upsert({
    where: {
      sourceId_requestedDeliveryDate: {
        sourceId: 'DEMO-ORDER-A',
        requestedDeliveryDate: calendarDay.date,
      },
    },
    update: {
      status: 'CONFIRMED',
      confirmedAt: new Date('2026-09-26T08:00:00.000Z'),
      requestedWindowOpen: time('06:00'),
      requestedWindowClose: time('07:30'),
      accessRequirement: 'standard_dock',
      intakeRunId: intakeRun.id,
    },
    create: {
      sourceId: 'DEMO-ORDER-A',
      status: 'CONFIRMED',
      submittedAt: new Date('2026-09-26T08:00:00.000Z'),
      confirmedAt: new Date('2026-09-26T08:00:00.000Z'),
      requestedDeliveryDate: calendarDay.date,
      requestedWindowOpen: time('06:00'),
      requestedWindowClose: time('07:30'),
      accessRequirement: 'standard_dock',
      temperature: 'REEFER',
      units: 20,
      weightKg: 250,
      volumeM3: 1.5,
      outletId: outlet.id,
      brandId: brand.id,
      intakeRunId: intakeRun.id,
    },
  });
  const deferredOrder = await prisma.order.upsert({
    where: {
      sourceId_requestedDeliveryDate: {
        sourceId: 'DEMO-ORDER-DEFERRED',
        requestedDeliveryDate: calendarDay.date,
      },
    },
    update: {
      status: 'DEFERRED',
      confirmedAt: new Date('2026-09-26T08:10:00.000Z'),
      requestedWindowOpen: time('08:00'),
      requestedWindowClose: time('09:30'),
      accessRequirement: 'mall_loading_bay',
      mallWindow: 'Van-only access before opening hours',
      intakeRunId: intakeRun.id,
    },
    create: {
      sourceId: 'DEMO-ORDER-DEFERRED',
      status: 'DEFERRED',
      submittedAt: new Date('2026-09-26T08:10:00.000Z'),
      confirmedAt: new Date('2026-09-26T08:10:00.000Z'),
      requestedDeliveryDate: calendarDay.date,
      requestedWindowOpen: time('08:00'),
      requestedWindowClose: time('09:30'),
      accessRequirement: 'mall_loading_bay',
      mallWindow: 'Van-only access before opening hours',
      temperature: 'AMBIENT',
      units: 16,
      weightKg: 480,
      volumeM3: 2.4,
      outletId: outlet.id,
      brandId: brand.id,
      intakeRunId: intakeRun.id,
    },
  });
  const plan = await prisma.plan.upsert({
    where: {
      depotId_deliveryDate_version: {
        depotId: depot.id,
        deliveryDate: calendarDay.date,
        version: 1,
      },
    },
    update: {},
    create: {
      name: 'Illustrative development plan',
      deliveryDate: calendarDay.date,
      depotId: depot.id,
      decisions: {
        create: {
          orderId: order.id,
          decision: 'SERVED',
          explanation: { label: 'SYNTHETIC DEVELOPMENT DATA — NOT OFFICIAL COMPETITION DATA' },
        },
      },
      trips: {
        create: {
          vehicleId: vehicle.id,
          driverId: driver.id,
          tripNumber: 1,
          stops: { create: { outletId: outlet.id, orderId: order.id, sequence: 1 } },
        },
      },
    },
  });
  const trip = await prisma.trip.findFirst({
    where: { planId: plan.id, tripNumber: 1 },
    include: { stops: true },
  });
  if (trip) {
    await prisma.trip.update({
      where: { id: trip.id },
      data: { driverId: driver.id, status: 'READY' },
    });
    await prisma.allocation.upsert({
      where: { planId_orderId: { planId: plan.id, orderId: order.id } },
      update: { tripId: trip.id, status: 'SERVED' },
      create: { planId: plan.id, orderId: order.id, tripId: trip.id, status: 'SERVED' },
    });
    const stop = trip.stops[0];
    if (stop) {
      await prisma.delivery.upsert({
        where: { tripStopId: stop.id },
        update: { status: 'PENDING' },
        create: { tripId: trip.id, tripStopId: stop.id, status: 'PENDING' },
      });
    }
    const loadingEvent = await prisma.loadingEvent.findFirst({
      where: { tripId: trip.id, type: 'READY' },
    });
    if (!loadingEvent) {
      await prisma.loadingEvent.create({
        data: {
          tripId: trip.id,
          actorId: loader.id,
          type: 'READY',
          orderId: order.id,
          details: { label: 'Synthetic ready-to-load checkpoint' },
          occurredAt: new Date('2026-09-26T08:45:00.000Z'),
        },
      });
    }
  }
  const existingDeferral = await prisma.deferral.findFirst({
    where: { planId: plan.id, orderId: deferredOrder.id },
  });
  if (!existingDeferral) {
    await prisma.deferral.create({
      data: {
        planId: plan.id,
        orderId: deferredOrder.id,
        reason: 'ACCESS',
        explanation:
          'Synthetic demonstration deferral for mall access and vehicle suitability review.',
      },
    });
  }
  const existingIssue = await prisma.issue.findFirst({
    where: { title: 'Synthetic shortfall review', orderId: order.id },
  });
  if (!existingIssue) {
    await prisma.issue.create({
      data: {
        type: 'LOADING',
        status: 'OPEN',
        orderId: order.id,
        reporterId: loader.id,
        title: 'Synthetic shortfall review',
        description: 'One carton requires supervisor review before dispatch. Demo data only.',
      },
    });
  }
  await prisma.planValidation.upsert({
    where: {
      planId_planVersion: {
        planId: plan.id,
        planVersion: plan.version,
      },
    },
    update: {
      status: 'PASSED',
      blockingIssues: [],
      advisoryIssues: [],
      checkedAt: new Date('2026-09-26T08:30:00.000Z'),
    },
    create: {
      planId: plan.id,
      planVersion: plan.version,
      status: 'PASSED',
      blockingIssues: [],
      advisoryIssues: [],
      checkedAt: new Date('2026-09-26T08:30:00.000Z'),
    },
  });
  await prisma.planCapacitySnapshot.upsert({
    where: {
      planId_vehicleId: {
        planId: plan.id,
        vehicleId: vehicle.id,
      },
    },
    update: {
      vehicleType: vehicle.type,
      temperature: vehicle.temperature,
      available: vehicle.available,
      tripCount: 1,
      weightCapacityKg: vehicle.weightCapacityKg,
      volumeCapacityM3: vehicle.volumeCapacityM3,
      weightUsedKg: order.weightKg,
      volumeUsedM3: order.volumeM3,
      weeklyFuelQuotaL: vehicle.weeklyFuelQuotaL,
      reservedFuelL: 20,
    },
    create: {
      planId: plan.id,
      vehicleId: vehicle.id,
      vehicleType: vehicle.type,
      temperature: vehicle.temperature,
      available: vehicle.available,
      tripCount: 1,
      weightCapacityKg: vehicle.weightCapacityKg,
      volumeCapacityM3: vehicle.volumeCapacityM3,
      weightUsedKg: order.weightKg,
      volumeUsedM3: order.volumeM3,
      weeklyFuelQuotaL: vehicle.weeklyFuelQuotaL,
      reservedFuelL: 20,
    },
  });
  await prisma.capacityPlanningScenario.upsert({
    where: {
      depotId_brandId_isoYear_isoWeek: {
        depotId: depot.id,
        brandId: brand.id,
        isoYear: 2026,
        isoWeek: 40,
      },
    },
    update: {
      horizonStart: date('2026-09-28'),
      horizonEnd: date('2026-10-04'),
      totalVolumeM3: 12,
      chilledVolumeM3: 4,
      sourceLabel: 'DEMO-ILLUSTRATIVE-SCENARIO',
      sourceRunDate: new Date('2026-09-26T08:30:00.000Z'),
      assumptions: { label: 'SYNTHETIC DEVELOPMENT DATA - NOT OFFICIAL COMPETITION DATA' },
      note: 'Illustrative scenario only; not a forecast or fleet recommendation.',
    },
    create: {
      depotId: depot.id,
      brandId: brand.id,
      isoYear: 2026,
      isoWeek: 40,
      horizonStart: date('2026-09-28'),
      horizonEnd: date('2026-10-04'),
      totalVolumeM3: 12,
      chilledVolumeM3: 4,
      sourceLabel: 'DEMO-ILLUSTRATIVE-SCENARIO',
      sourceRunDate: new Date('2026-09-26T08:30:00.000Z'),
      assumptions: { label: 'SYNTHETIC DEVELOPMENT DATA - NOT OFFICIAL COMPETITION DATA' },
      note: 'Illustrative scenario only; not a forecast or fleet recommendation.',
    },
  });
  console.log('Seeded SYNTHETIC DEVELOPMENT DATA — NOT OFFICIAL COMPETITION DATA');
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
