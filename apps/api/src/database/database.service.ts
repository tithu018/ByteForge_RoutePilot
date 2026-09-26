import { Injectable, Inject } from '@nestjs/common';
import type { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly client: PrismaClient;

  constructor(@Inject(ConfigService) config: ConfigService) {
    const adapter = new PrismaPg({ connectionString: config.getOrThrow<string>('DATABASE_URL'), connectionTimeoutMillis: 3000, query_timeout: 3000, max: 5 });
    this.client = new PrismaClient({ adapter });
  }

  async onModuleInit(): Promise<void> { await this.client.$connect(); }
  async onModuleDestroy(): Promise<void> { await this.client.$disconnect(); }
  async checkConnection(): Promise<void> { await this.client.$queryRaw`SELECT 1`; }
}
