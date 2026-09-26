import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PlanningController } from './planning.controller';
import { PlanningService } from './planning.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PlanningController],
  providers: [PlanningService],
})
export class PlanningModule {}
