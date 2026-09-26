import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { DatabaseService } from '../../database/database.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import type { CreateOrderDto, ListOrdersQuery } from './orders.dto';

const dateOnly = (value: string): Date => {
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()))
    throw new BadRequestException('Requested delivery date is invalid.');
  return parsed;
};

const timeOnly = (value: string | undefined): Date | undefined => {
  if (!value) return undefined;
  const parsed = new Date(`1970-01-01T${value}:00.000Z`);
  if (Number.isNaN(parsed.getTime())) throw new BadRequestException('Requested time is invalid.');
  return parsed;
};

@Injectable()
export class OrdersService {
  constructor(private readonly database: DatabaseService) {}

  async create(input: CreateOrderDto, user: AuthenticatedUser) {
    if (!user.outletId)
      throw new BadRequestException('An authorized outlet is required to create an order.');
    const requestedDeliveryDate = dateOnly(input.requestedDeliveryDate);
    const windowOpen = timeOnly(input.requestedWindowOpen);
    const windowClose = timeOnly(input.requestedWindowClose);
    if (windowOpen && windowClose && windowOpen >= windowClose)
      throw new BadRequestException('Requested delivery window is invalid.');

    const outlet = await this.database.prisma.outlet.findUnique({ where: { id: user.outletId } });
    if (!outlet) throw new NotFoundException('Authorized outlet was not found.');
    if (input.sourceId) {
      const existing = await this.database.prisma.order.findFirst({
        where: { sourceId: input.sourceId, requestedDeliveryDate },
      });
      if (existing) {
        if (existing.outletId !== outlet.id)
          throw new ConflictException('This order reference belongs to another outlet.');
        return existing;
      }
    }
    const now = new Date();
    const intakeRun = await this.findEligibleRun(outlet.depotId, requestedDeliveryDate, now);
    if (!intakeRun)
      throw new ConflictException('No open intake run is available for this requested date.');

    const sourceId = input.sourceId ?? `DEMO-ORDER-${randomUUID()}`;
    return this.database.prisma.order.create({
      data: {
        sourceId,
        status: 'CONFIRMED',
        submittedAt: now,
        confirmedAt: now,
        requestedDeliveryDate,
        requestedWindowOpen: windowOpen,
        requestedWindowClose: windowClose,
        accessRequirement: input.accessRequirement,
        mallWindow: input.mallWindow,
        temperature: input.temperature,
        units: input.units,
        weightKg: input.weightKg,
        volumeM3: input.volumeM3,
        outletId: outlet.id,
        brandId: outlet.brandId,
        intakeRunId: intakeRun.id,
      },
      include: { outlet: true, brand: true, intakeRun: true },
    });
  }

  async list(query: ListOrdersQuery, user: AuthenticatedUser) {
    const requestedDeliveryDate = query.requestedDeliveryDate
      ? dateOnly(query.requestedDeliveryDate)
      : undefined;
    return this.database.prisma.order.findMany({
      where: {
        requestedDeliveryDate,
        ...(user.role === 'STORE_MANAGER'
          ? { outletId: user.outletId ?? '__missing_outlet__' }
          : {}),
      },
      orderBy: [{ requestedDeliveryDate: 'asc' }, { createdAt: 'desc' }],
      include: { outlet: true, brand: true, intakeRun: true },
    });
  }

  async getById(id: string, user: AuthenticatedUser) {
    const order = await this.database.prisma.order.findUnique({
      where: { id },
      include: {
        outlet: true,
        brand: true,
        intakeRun: true,
        deferrals: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!order || (user.role === 'STORE_MANAGER' && order.outletId !== user.outletId))
      throw new NotFoundException('Order was not found.');
    return order;
  }

  private findEligibleRun(depotId: string, requestedDeliveryDate: Date, now: Date) {
    return this.database.prisma.intakeRun.findFirst({
      where: {
        depotId,
        status: 'OPEN',
        deliveryDate: { gte: requestedDeliveryDate },
        cutoffAt: { gt: now },
      },
      orderBy: [{ deliveryDate: 'asc' }, { sequence: 'asc' }],
    });
  }
}
