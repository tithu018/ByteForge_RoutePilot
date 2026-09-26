import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { configureApp } from './common/configure-app';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  configureApp(app, config.getOrThrow<string[]>('CORS_ORIGINS'), config.get('NODE_ENV') === 'development');
  app.enableShutdownHooks();
  await app.listen(config.getOrThrow<number>('API_PORT'), '0.0.0.0');
}
void bootstrap().catch(() => { console.error('API startup failed. Check environment configuration and database availability.'); process.exitCode = 1; });
