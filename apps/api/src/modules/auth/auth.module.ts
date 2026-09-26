import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RolesGuard } from './auth.guards';
import { DatabaseModule } from '../../database/database.module';

@Module({ imports: [DatabaseModule], controllers: [AuthController], providers: [AuthService, JwtAuthGuard, RolesGuard], exports: [AuthService, JwtAuthGuard, RolesGuard] })
export class AuthModule {}