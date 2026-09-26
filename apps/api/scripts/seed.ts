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
  await prisma.user.upsert({ where: { email: 'dispatcher.demo@waypoint.local' }, update: {}, create: { email: 'dispatcher.demo@waypoint.local', displayName: 'Demo Dispatcher', passwordHash: demoPasswordHash, role: 'DISPATCHER' } });
  await prisma.user.upsert({ where: { email: 'loader.demo@waypoint.local' }, update: {}, create: { email: 'loader.demo@waypoint.local', displayName: 'Demo Loader', passwordHash: demoPasswordHash, role: 'LOADER' } });
  await prisma.user.upsert({ where: { email: 'driver.demo@waypoint.local' }, update: {}, create: { email: 'driver.demo@waypoint.local', displayName: 'Demo Driver', passwordHash: demoPasswordHash, role: 'DRIVER' } });
  await prisma.user.upsert({ where: { email: 'store.demo@waypoint.local' }, update: {}, create: { email: 'store.demo@waypoint.local', displayName: 'Demo Store Manager', passwordHash: demoPasswordHash, role: 'STORE_MANAGER', outletId: outlet.id } });
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
  const order = await prisma.order.upsert({
    where: {
      sourceId_requestedDeliveryDate: {
        sourceId: 'DEMO-ORDER-A',
        requestedDeliveryDate: calendarDay.date,
      },
    },
    update: {},
    create: {
      sourceId: 'DEMO-ORDER-A',
      status: 'CONFIRMED',
      submittedAt: new Date('2026-09-26T08:00:00.000Z'),
      requestedDeliveryDate: calendarDay.date,
      temperature: 'REEFER',
      units: 20,
      weightKg: 250,
      volumeM3: 1.5,
      outletId: outlet.id,
      brandId: brand.id,
    },
  });
  await prisma.plan.upsert({
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
          tripNumber: 1,
          stops: { create: { outletId: outlet.id, orderId: order.id, sequence: 1 } },
        },
      },
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
