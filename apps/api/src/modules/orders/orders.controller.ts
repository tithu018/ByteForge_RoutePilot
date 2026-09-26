import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import type { AuthenticatedRequest } from '../auth/auth.types';
import type { CreateOrderDto, ListOrdersQuery } from './orders.dto';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OrdersService } from './orders.service';
import { Role } from '../../generated/prisma/enums';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @Roles(Role.STORE_MANAGER)
  create(@Body() body: CreateOrderDto, @Req() request: AuthenticatedRequest) {
    return this.orders.create(body, request.user!);
  }

  @Get()
  @Roles(Role.DISPATCHER, Role.STORE_MANAGER)
  list(@Query() query: ListOrdersQuery, @Req() request: AuthenticatedRequest) {
    return this.orders.list(query, request.user!);
  }

  @Get(':id')
  @Roles(Role.DISPATCHER, Role.STORE_MANAGER)
  getById(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.orders.getById(id, request.user!);
  }
}
