import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { validateEnvironment } from './config/environment';
import { HealthModule } from './health/health.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PlanningModule } from './modules/planning/planning.module';
import { OperationsModule } from './modules/operations/operations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '../../../../.env'),
      validate: validateEnvironment,
    }),
    DatabaseModule,
    AuthModule,
    OrdersModule,
    PlanningModule,
    OperationsModule,
    HealthModule,
  ],
})
export class AppModule {}
