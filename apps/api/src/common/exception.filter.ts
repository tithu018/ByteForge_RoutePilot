import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiError } from '@waypoint/shared';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const requestId = String(response.getHeader('x-request-id') ?? 'unknown');
    const body = exception instanceof HttpException ? exception.getResponse() : undefined;
    const details = typeof body === 'object' && body !== null && 'message' in body && Array.isArray(body.message)
      ? body.message.filter((value: unknown): value is string => typeof value === 'string') : undefined;
    const payload: ApiError = { error: {
      code: status === 503 ? 'SERVICE_UNAVAILABLE' : status >= 500 ? 'INTERNAL_ERROR' : `HTTP_${status}`,
      message: status >= 500 ? (status === 503 ? 'Service is not ready. Try again shortly.' : 'An unexpected error occurred.') : exception instanceof HttpException ? exception.message : 'Request failed',
      requestId,
      ...(details ? { details } : {}),
    } };
    if (status >= 500) this.logger.error(`${request.method} ${request.path} status=${status} requestId=${requestId}`);
    response.status(status).json(payload);
  }
}
