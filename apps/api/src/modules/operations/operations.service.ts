import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DatabaseService } from '../../database/database.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import type {
  CreateIssueDto,
  RecordDeliveryEventDto,
  RecordLoadingEventDto,
} from './operations.dto';

const toNumber = (value: unknown): number => Number(value ?? 0);
type JsonInput =
  string | number | boolean | { [key: string]: JsonInput | null } | readonly (JsonInput | null)[];
const toJsonInput = (value: unknown): JsonInput | undefined =>
  value === undefined ? undefined : (JSON.parse(JSON.stringify(value)) as JsonInput);

@Injectable()
export class OperationsService {
  constructor(private readonly database: DatabaseService) {}

  async summary(user: AuthenticatedUser) {
    const orderWhere = user.role === 'STORE_MANAGER' ? { outletId: user.outletId ?? '' } : {};
    const tripWhere = user.role === 'DRIVER' ? { driverId: user.sub } : {};
    const [
      orders,
      plans,
      vehicles,
      trips,
      issues,
      deferrals,
      scenarios,
      syncEvents,
      depots,
      outlets,
    ] = await Promise.all([
      this.database.prisma.order.findMany({
        where: orderWhere,
        orderBy: [{ requestedDeliveryDate: 'asc' }, { createdAt: 'desc' }],
        include: { outlet: true, brand: true, intakeRun: true, deferrals: true },
        take: 50,
      }),
      this.database.prisma.plan.findMany({
        orderBy: [{ deliveryDate: 'desc' }, { createdAt: 'desc' }],
        include: { depot: true, validations: { orderBy: { createdAt: 'desc' }, take: 1 } },
        take: 10,
      }),
      this.database.prisma.vehicle.findMany({
        include: { homeDepot: true },
        orderBy: { name: 'asc' },
      }),
      this.database.prisma.trip.findMany({
        where: tripWhere,
        include: {
          plan: { include: { depot: true } },
          vehicle: true,
          driver: true,
          loadingEvents: { orderBy: { occurredAt: 'desc' } },
          stops: {
            orderBy: { sequence: 'asc' },
            include: {
              outlet: true,
              order: true,
              delivery: {
                include: {
                  events: { orderBy: { occurredAt: 'desc' } },
                  proof: true,
                  receipt: true,
                  issues: true,
                },
              },
            },
          },
          allocations: { include: { order: true } },
          fuelUsages: true,
        },
        orderBy: [{ plan: { deliveryDate: 'asc' } }, { tripNumber: 'asc' }],
        take: 30,
      }),
      this.database.prisma.issue.findMany({
        orderBy: { createdAt: 'desc' },
        include: { order: true, delivery: true, reporter: true },
        take: 30,
      }),
      this.database.prisma.deferral.findMany({
        orderBy: { createdAt: 'desc' },
        include: { order: { include: { outlet: true } }, plan: true },
        take: 30,
      }),
      this.database.prisma.capacityPlanningScenario.findMany({
        include: { depot: true, brand: true },
        orderBy: [{ isoYear: 'asc' }, { isoWeek: 'asc' }],
        take: 20,
      }),
      this.database.prisma.syncEvent.findMany({
        where: user.role === 'DRIVER' ? { actorId: user.sub } : {},
        orderBy: { serverReceivedAt: 'desc' },
        take: 30,
      }),
      this.database.prisma.depot.findMany({ orderBy: { name: 'asc' } }),
      this.database.prisma.outlet.findMany({
        include: { brand: true, depot: true },
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      generatedAt: new Date().toISOString(),
      user,
      counts: {
        orders: orders.length,
        confirmedOrders: orders.filter((order) => order.status === 'CONFIRMED').length,
        publishedPlans: plans.filter((plan) => plan.status === 'PUBLISHED').length,
        trips: trips.length,
        openIssues: issues.filter((issue) => issue.status === 'OPEN').length,
        deferrals: deferrals.length,
      },
      orders: orders.map((order) => ({
        id: order.id,
        sourceId: order.sourceId,
        status: order.status,
        submittedAt: order.submittedAt,
        confirmedAt: order.confirmedAt,
        requestedDeliveryDate: order.requestedDeliveryDate,
        requestedWindowOpen: order.requestedWindowOpen,
        requestedWindowClose: order.requestedWindowClose,
        temperature: order.temperature,
        units: order.units,
        weightKg: toNumber(order.weightKg),
        volumeM3: toNumber(order.volumeM3),
        outlet: { id: order.outlet.id, name: order.outlet.name, sourceId: order.outlet.sourceId },
        brand: { id: order.brand.id, name: order.brand.name },
        intakeRun: order.intakeRun
          ? {
              id: order.intakeRun.id,
              sourceId: order.intakeRun.sourceId,
              cutoffAt: order.intakeRun.cutoffAt,
              status: order.intakeRun.status,
            }
          : null,
      })),
      plans: plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        deliveryDate: plan.deliveryDate,
        status: plan.status,
        version: plan.version,
        publishedAt: plan.publishedAt,
        depot: { id: plan.depot.id, name: plan.depot.name },
        validation: plan.validations[0] ?? null,
      })),
      vehicles: vehicles.map((vehicle) => ({
        id: vehicle.id,
        sourceId: vehicle.sourceId,
        name: vehicle.name,
        type: vehicle.type,
        temperature: vehicle.temperature,
        available: vehicle.available,
        weightCapacityKg: toNumber(vehicle.weightCapacityKg),
        volumeCapacityM3: toNumber(vehicle.volumeCapacityM3),
        weeklyFuelQuotaL: toNumber(vehicle.weeklyFuelQuotaL),
        homeDepot: vehicle.homeDepot.name,
      })),
      trips: trips.map((trip) => ({
        id: trip.id,
        tripNumber: trip.tripNumber,
        status: trip.status,
        revision: trip.revision,
        startedAt: trip.startedAt,
        completedAt: trip.completedAt,
        plan: {
          id: trip.plan.id,
          name: trip.plan.name,
          deliveryDate: trip.plan.deliveryDate,
          status: trip.plan.status,
          depot: trip.plan.depot.name,
        },
        vehicle: {
          id: trip.vehicle.id,
          name: trip.vehicle.name,
          type: trip.vehicle.type,
          temperature: trip.vehicle.temperature,
          weightCapacityKg: toNumber(trip.vehicle.weightCapacityKg),
          volumeCapacityM3: toNumber(trip.vehicle.volumeCapacityM3),
        },
        driver: trip.driver
          ? { id: trip.driver.id, name: trip.driver.displayName, email: trip.driver.email }
          : null,
        loadingEvents: trip.loadingEvents,
        allocations: trip.allocations.map((allocation) => ({
          id: allocation.id,
          status: allocation.status,
          orderId: allocation.orderId,
          sourceId: allocation.order.sourceId,
        })),
        stops: trip.stops.map((stop) => ({
          id: stop.id,
          sequence: stop.sequence,
          plannedArrival: stop.plannedArrival,
          outlet: {
            id: stop.outlet.id,
            name: stop.outlet.name,
            district: stop.outlet.district,
            dockType: stop.outlet.dockType,
            parkingConstraint: stop.outlet.parkingConstraint,
            mallWindow: stop.outlet.mallWindow,
          },
          order: {
            id: stop.order.id,
            sourceId: stop.order.sourceId,
            status: stop.order.status,
            units: stop.order.units,
            temperature: stop.order.temperature,
            weightKg: toNumber(stop.order.weightKg),
            volumeM3: toNumber(stop.order.volumeM3),
          },
          delivery: stop.delivery,
        })),
      })),
      issues,
      deferrals: deferrals.map((deferral) => ({
        id: deferral.id,
        reason: deferral.reason,
        explanation: deferral.explanation,
        createdAt: deferral.createdAt,
        order: {
          id: deferral.order.id,
          sourceId: deferral.order.sourceId,
          outlet: deferral.order.outlet.name,
        },
        plan: { id: deferral.plan.id, name: deferral.plan.name },
      })),
      scenarios: scenarios.map((scenario) => ({
        id: scenario.id,
        isoYear: scenario.isoYear,
        isoWeek: scenario.isoWeek,
        horizonStart: scenario.horizonStart,
        horizonEnd: scenario.horizonEnd,
        totalVolumeM3: toNumber(scenario.totalVolumeM3),
        chilledVolumeM3: toNumber(scenario.chilledVolumeM3),
        sourceLabel: scenario.sourceLabel,
        sourceRunDate: scenario.sourceRunDate,
        note: scenario.note,
        depot: scenario.depot.name,
        brand: scenario.brand?.name ?? 'All brands',
      })),
      syncEvents,
      depots,
      outlets: outlets.map((outlet) => ({
        id: outlet.id,
        sourceId: outlet.sourceId,
        name: outlet.name,
        district: outlet.district,
        brand: outlet.brand.name,
        depot: outlet.depot.name,
      })),
    };
  }

  async recordLoadingEvent(input: RecordLoadingEventDto, user: AuthenticatedUser) {
    const trip = await this.database.prisma.trip.findUnique({ where: { id: input.tripId } });
    if (!trip) throw new NotFoundException('Trip was not found.');
    if (input.type === 'STARTED')
      await this.database.prisma.trip.update({
        where: { id: input.tripId },
        data: { status: 'LOADING', startedAt: trip.startedAt ?? new Date() },
      });
    if (input.type === 'COMPLETED' || input.type === 'READY')
      await this.database.prisma.trip.update({
        where: { id: input.tripId },
        data: { status: input.type === 'READY' ? 'READY' : 'LOADED' },
      });
    return this.database.prisma.loadingEvent.create({
      data: {
        tripId: input.tripId,
        actorId: user.sub,
        type: input.type,
        orderId: input.orderId,
        details: toJsonInput(input.details),
        occurredAt: new Date(),
      },
    });
  }

  async recordDeliveryEvent(input: RecordDeliveryEventDto, user: AuthenticatedUser) {
    const existing = await this.database.prisma.syncEvent.findUnique({
      where: { clientEventId: input.clientEventId },
    });
    if (existing) return { status: 'ALREADY_APPLIED', syncEvent: existing };

    const stop = await this.database.prisma.tripStop.findUnique({
      where: { id: input.tripStopId },
      include: { delivery: true, trip: true },
    });
    if (!stop) throw new NotFoundException('Stop was not found.');
    let delivery = stop.delivery;
    if (!delivery) {
      delivery = await this.database.prisma.delivery.create({
        data: { tripId: stop.tripId, tripStopId: stop.id },
      });
    }
    const nextStatus =
      input.type === 'COMPLETED'
        ? 'COMPLETED'
        : input.type === 'ARRIVED'
          ? 'ARRIVED'
          : input.type === 'OUTCOME_RECORDED' || input.type === 'POD_RECORDED'
            ? 'DELIVERED'
            : delivery.status;
    const event = await this.database.prisma.deliveryEvent.create({
      data: {
        deliveryId: delivery.id,
        actorId: user.sub,
        type: input.type,
        details: toJsonInput(input.details),
        occurredAt: new Date(),
      },
    });
    delivery = await this.database.prisma.delivery.update({
      where: { id: delivery.id },
      data: {
        status: nextStatus,
        deliveredAt:
          input.type === 'OUTCOME_RECORDED' || input.type === 'COMPLETED'
            ? new Date()
            : delivery.deliveredAt,
      },
    });
    if (input.receiverName || input.notes || input.reference) {
      await this.database.prisma.proofOfDelivery.upsert({
        where: { deliveryId: delivery.id },
        update: {
          receiverName: input.receiverName,
          notes: input.notes,
          reference: input.reference,
          capturedAt: new Date(),
        },
        create: {
          deliveryId: delivery.id,
          receiverName: input.receiverName,
          notes: input.notes,
          reference: input.reference,
          capturedAt: new Date(),
        },
      });
    }
    if (input.type === 'COMPLETED') {
      await this.database.prisma.trip.update({
        where: { id: stop.tripId },
        data: { status: 'IN_PROGRESS' },
      });
    }
    const syncEvent = await this.database.prisma.syncEvent.create({
      data: {
        clientEventId: input.clientEventId,
        actorId: user.sub,
        entityType: 'Delivery',
        entityId: delivery.id,
        eventType: input.type,
        deviceOccurredAt: new Date(),
        baseVersion: input.baseVersion,
        payload: toJsonInput(input) ?? {},
        status: 'ACCEPTED',
      },
    });
    return { status: 'ACCEPTED', event, delivery, syncEvent };
  }

  async createIssue(input: CreateIssueDto, user: AuthenticatedUser) {
    return this.database.prisma.issue.create({
      data: {
        type: input.type,
        title: input.title,
        description: input.description,
        orderId: input.orderId,
        deliveryId: input.deliveryId,
        reporterId: user.sub,
      },
    });
  }
}
