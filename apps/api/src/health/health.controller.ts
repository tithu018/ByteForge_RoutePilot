import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import type { HealthResponse, ReadinessResponse } from '@waypoint/shared';
import { DatabaseService } from '../database/database.service';

@Controller('health')
export class HealthController {
  constructor(@Inject(DatabaseService) private readonly database: DatabaseService) {}

  @Get()
  live(): HealthResponse { return { status: 'ok' }; }

  @Get('ready')
  async ready(): Promise<ReadinessResponse> {
    try { await this.database.checkConnection(); }
    catch { throw new ServiceUnavailableException('Database is not ready'); }
    return { status: 'ok', database: 'connected' };
  }
}
