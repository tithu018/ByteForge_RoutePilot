import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard } from '../auth/auth.guards';
import { Role } from '../../generated/prisma/enums';
import type { AuthenticatedRequest } from '../auth/auth.types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PlanningService } from './planning.service';
import type {
  CreateCapacityScenarioDto,
  CreatePlanDto,
  ListCapacityScenarioQuery,
} from './planning.dto';

@Controller('planning')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DISPATCHER)
export class PlanningController {
  constructor(private readonly planning: PlanningService) {}

  @Post('plans') createPlan(@Body() body: CreatePlanDto, @Req() request: AuthenticatedRequest) {
    return this.planning.createPlan(body, request.user!);
  }
  @Get('plans/:id') getPlan(@Param('id') id: string) {
    return this.planning.getPlan(id);
  }
  @Post('plans/:id/validate') validatePlan(@Param('id') id: string) {
    return this.planning.validatePlan(id);
  }
  @Patch('plans/:id/publish') publishPlan(@Param('id') id: string) {
    return this.planning.publishPlan(id);
  }
  @Post('capacity-scenarios') createScenario(@Body() body: CreateCapacityScenarioDto) {
    return this.planning.createScenario(body);
  }
  @Get('capacity-scenarios') listScenarios(@Query() query: ListCapacityScenarioQuery) {
    return this.planning.listScenarios(query);
  }
}
