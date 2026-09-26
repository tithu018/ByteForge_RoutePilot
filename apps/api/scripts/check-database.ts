import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

async function check(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  try { await app.get(DatabaseService).checkConnection(); console.log('Prisma database connectivity: OK'); }
  finally { await app.close(); }
}
void check().catch(() => { console.error('Database connectivity failed. Check PostgreSQL and DATABASE_URL.'); process.exitCode = 1; });
