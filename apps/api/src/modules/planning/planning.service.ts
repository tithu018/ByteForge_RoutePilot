import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DatabaseService } from '../../database/database.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import type {
  CreateCapacityScenarioDto,
  CreatePlanDto,
  ListCapacityScenarioQuery,
} from './planning.dto';

type ValidationIssue = { code: string; message: string; orderId?: string; tripId?: string };

const dateOnly = (value: string): Date => {
  const date = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new BadRequestException('Date is invalid.');
  return date;
};

const decimal = (value: unknown): number => Number(value ?? 0);

@Injectable()
export class PlanningService {
  constructor(private readonly database: DatabaseService) {}

  createPlan(input: CreatePlanDto, _user: AuthenticatedUser) {
    const deliveryDate = dateOnly(input.deliveryDate);
    return this.database.prisma.plan.create({
      data: { name: input.name, deliveryDate, depotId: input.depotId },
    });
  }

  async getPlan(id: string) {
    const plan = await this.database.prisma.plan.findUnique({
      where: { id },
      include: {
        depot: true,
        decisions: { include: { order: true } },
        trips: { include: { vehicle: true, stops: true } },
        validations: { orderBy: { createdAt: 'desc' } },
        capacitySnapshots: { include: { vehicle: true } },
      },
    });
    if (!plan) throw new NotFoundException('Planning plan was not found.');
    return plan;
  }

  async validatePlan(id: string) {
    const plan = await this.database.prisma.plan.findUnique({
      where: { id },
      include: {
        decisions: { include: { order: true } },
        trips: { include: { vehicle: true, allocations: { include: { order: true } } } },
      },
    });
    if (!plan) throw new NotFoundException('Planning plan was not found.');

    const orders = await this.database.prisma.order.findMany({
      where: {
        requestedDeliveryDate: plan.deliveryDate,
        status: 'CONFIRMED',
        outlet: { depotId: plan.depotId },
      },
    });
    const decisions = new Map(plan.decisions.map((decision) => [decision.orderId, decision]));
    const blockingIssues: ValidationIssue[] = [];
    const advisoryIssues: ValidationIssue[] = [];

    for (const order of orders) {
      if (!decisions.has(order.id))
        blockingIssues.push({
          code: 'ORDER_UNASSIGNED',
          message: `Order ${order.sourceId} has no served or deferred decision.`,
          orderId: order.id,
        });
    }

    const snapshots = [];
    for (const trip of plan.trips) {
      const weightUsed = trip.allocations.reduce(
        (sum, allocation) => sum + decimal(allocation.order.weightKg),
        0,
      );
      const volumeUsed = trip.allocations.reduce(
        (sum, allocation) => sum + decimal(allocation.order.volumeM3),
        0,
      );
      const servedOrders = trip.allocations
        .filter((allocation) => allocation.status === 'SERVED')
        .map((allocation) => allocation.order);
      const hasChilled = servedOrders.some((servedOrder) => servedOrder.temperature === 'REEFER');
      const vehicle = trip.vehicle;
      if (!vehicle.available)
        blockingIssues.push({
          code: 'VEHICLE_UNAVAILABLE',
          message: `${vehicle.name} is unavailable.`,
          tripId: trip.id,
        });
      if (weightUsed > decimal(vehicle.weightCapacityKg))
        blockingIssues.push({
          code: 'WEIGHT_EXCEEDED',
          message: `Trip ${trip.tripNumber} exceeds weight capacity by ${(weightUsed - decimal(vehicle.weightCapacityKg)).toFixed(3)} kg.`,
          tripId: trip.id,
        });
      if (volumeUsed > decimal(vehicle.volumeCapacityM3))
        blockingIssues.push({
          code: 'VOLUME_EXCEEDED',
          message: `Trip ${trip.tripNumber} exceeds volume capacity by ${(volumeUsed - decimal(vehicle.volumeCapacityM3)).toFixed(3)} m3.`,
          tripId: trip.id,
        });
      if (hasChilled && vehicle.temperature !== 'REEFER')
        blockingIssues.push({
          code: 'REEFER_REQUIRED',
          message: `Trip ${trip.tripNumber} assigns chilled goods to a non-reefer vehicle.`,
          tripId: trip.id,
        });
      if (trip.tripNumber > 2)
        blockingIssues.push({
          code: 'TRIP_LIMIT_EXCEEDED',
          message: 'A plan cannot contain more than two trips.',
          tripId: trip.id,
        });
      advisoryIssues.push({
        code: 'FUEL_ESTIMATE_PENDING',
        message: `Fuel estimate for trip ${trip.tripNumber} requires route distance data.`,
        tripId: trip.id,
      });
      snapshots.push({
        planId: plan.id,
        vehicleId: vehicle.id,
        vehicleType: vehicle.type,
        temperature: vehicle.temperature,
        available: vehicle.available,
        tripCount: plan.trips.filter((candidate) => candidate.vehicleId === vehicle.id).length,
        weightCapacityKg: vehicle.weightCapacityKg,
        volumeCapacityM3: vehicle.volumeCapacityM3,
        weightUsedKg: weightUsed,
        volumeUsedM3: volumeUsed,
        weeklyFuelQuotaL: vehicle.weeklyFuelQuotaL,
        reservedFuelL: null,
      });
    }

    for (const snapshot of snapshots)
      await this.database.prisma.planCapacitySnapshot.upsert({
        where: { planId_vehicleId: { planId: snapshot.planId, vehicleId: snapshot.vehicleId } },
        update: snapshot,
        create: snapshot,
      });
    const validation = await this.database.prisma.planValidation.upsert({
      where: { planId_planVersion: { planId: plan.id, planVersion: plan.version } },
      update: {
        status: blockingIssues.length ? 'BLOCKED' : 'PASSED',
        blockingIssues,
        advisoryIssues,
        checkedAt: new Date(),
      },
      create: {
        planId: plan.id,
        planVersion: plan.version,
        status: blockingIssues.length ? 'BLOCKED' : 'PASSED',
        blockingIssues,
        advisoryIssues,
        checkedAt: new Date(),
      },
    });
    return {
      planId: plan.id,
      version: plan.version,
      status: validation.status,
      blockingIssues,
      advisoryIssues,
      checkedAt: validation.checkedAt,
    };
  }

  async publishPlan(id: string) {
    const validation = await this.validatePlan(id);
    if (validation.status !== 'PASSED')
      throw new ConflictException('Plan has blocking validation issues.');
    const plan = await this.database.prisma.plan.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
    });
    return { plan, validation };
  }

  async createScenario(input: CreateCapacityScenarioDto) {
    if (input.chilledVolumeM3 > input.totalVolumeM3)
      throw new BadRequestException('Chilled volume cannot exceed total volume.');
    const horizonStart = dateOnly(input.horizonStart);
    const horizonEnd = dateOnly(input.horizonEnd);
    if (horizonStart > horizonEnd)
      throw new BadRequestException('Capacity scenario horizon is invalid.');
    const update = {
      horizonStart,
      horizonEnd,
      totalVolumeM3: input.totalVolumeM3,
      chilledVolumeM3: input.chilledVolumeM3,
      sourceLabel: input.sourceLabel,
      sourceRunDate: input.sourceRunDate ? new Date(input.sourceRunDate) : null,
      note: input.note,
    };
    const create = {
      depotId: input.depotId,
      brandId: input.brandId,
      isoYear: input.isoYear,
      isoWeek: input.isoWeek,
      ...update,
    };
    if (input.brandId) {
      return this.database.prisma.capacityPlanningScenario.upsert({
        where: {
          depotId_brandId_isoYear_isoWeek: {
            depotId: input.depotId,
            brandId: input.brandId,
            isoYear: input.isoYear,
            isoWeek: input.isoWeek,
          },
        },
        update,
        create,
      });
    }
    const existing = await this.database.prisma.capacityPlanningScenario.findFirst({
      where: {
        depotId: input.depotId,
        brandId: null,
        isoYear: input.isoYear,
        isoWeek: input.isoWeek,
      },
    });
    return existing
      ? this.database.prisma.capacityPlanningScenario.update({
          where: { id: existing.id },
          data: update,
        })
      : this.database.prisma.capacityPlanningScenario.create({ data: create });
  }

  listScenarios(query: ListCapacityScenarioQuery) {
    return this.database.prisma.capacityPlanningScenario.findMany({
      where: {
        depotId: query.depotId,
        ...(query.isoYear ? { isoYear: query.isoYear } : {}),
        ...(query.isoWeek ? { isoWeek: query.isoWeek } : {}),
      },
      orderBy: [{ isoYear: 'asc' }, { isoWeek: 'asc' }],
    });
  }
}
