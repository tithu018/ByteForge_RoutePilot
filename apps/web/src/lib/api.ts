import * as shared from '@waypoint/shared';
import type { HealthResponse, ReadinessResponse } from '@waypoint/shared';

const { healthResponseSchema, readinessResponseSchema } = shared;

const base = (import.meta.env.VITE_API_BASE_URL ?? '/api/v1').replace(/\/$/, '');
async function read(path: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`${base}${path}`, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000), headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`The service returned ${response.status}. Try again shortly.`);
  const value: unknown = await response.json();
  return value;
}
export async function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> { return healthResponseSchema.parse(await read('/health', signal)); }
export async function fetchReadiness(signal?: AbortSignal): Promise<ReadinessResponse> { return readinessResponseSchema.parse(await read('/health/ready', signal)); }
