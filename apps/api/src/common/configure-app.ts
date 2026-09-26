import { Logger, ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import helmet from 'helmet';
import { API_PREFIX } from '@waypoint/shared';
import { ApiExceptionFilter } from './exception.filter';

export function configureApp(app: INestApplication, origins: string[], development = false): void {
  app.setGlobalPrefix(API_PREFIX);
  app.use(helmet());
  app.enableCors({ origin: origins, credentials: false });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, validationError: { target: false, value: false } }));
  app.useGlobalFilters(new ApiExceptionFilter());
  const logger = new Logger('HTTP');
  app.use((request: Request, response: Response, next: NextFunction) => {
    const requestId = randomUUID();
    response.setHeader('x-request-id', requestId);
    const start = performance.now();
    if (development) response.on('finish', () => logger.log(`${request.method} ${request.path} ${response.statusCode} ${Math.round(performance.now() - start)}ms requestId=${requestId}`));
    // Never log headers, bodies, query strings, passwords or connection URLs.
    next();
  });
}
