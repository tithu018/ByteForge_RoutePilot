import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guards';
import type { AuthenticatedRequest } from '../auth/auth.types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { OperationsService } from './operations.service';
// DTO classes are retained at runtime for Nest route metadata.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CreateIssueDto, RecordDeliveryEventDto, RecordLoadingEventDto } from './operations.dto';

@Controller('operations')
@UseGuards(JwtAuthGuard)
export class OperationsController {
  constructor(private readonly operations: OperationsService) {}

  @Get('summary')
  summary(@Req() request: AuthenticatedRequest) {
    return this.operations.summary(request.user!);
  }

  @Post('loading-events')
  recordLoadingEvent(@Body() body: RecordLoadingEventDto, @Req() request: AuthenticatedRequest) {
    return this.operations.recordLoadingEvent(body, request.user!);
  }

  @Post('delivery-events')
  recordDeliveryEvent(@Body() body: RecordDeliveryEventDto, @Req() request: AuthenticatedRequest) {
    return this.operations.recordDeliveryEvent(body, request.user!);
  }

  @Post('issues')
  createIssue(@Body() body: CreateIssueDto, @Req() request: AuthenticatedRequest) {
    return this.operations.createIssue(body, request.user!);
  }
}
