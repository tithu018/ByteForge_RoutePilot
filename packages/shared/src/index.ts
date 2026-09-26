import { z } from 'zod';

export const API_PREFIX = 'api/v1';
export const healthResponseSchema = z.object({ status: z.literal('ok') });
export type HealthResponse = z.infer<typeof healthResponseSchema>;
export const readinessResponseSchema = z.object({ status: z.literal('ok'), database: z.literal('connected') });
export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;
export interface ApiError {
  error: { code: string; message: string; requestId: string; details?: string[] };
}
