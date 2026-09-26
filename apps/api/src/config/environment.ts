import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url().refine((url) => url.startsWith('postgresql://') || url.startsWith('postgres://'), 'PostgreSQL URL required'),
  CORS_ORIGINS: z.string().default('http://localhost:5173').transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean)).pipe(z.array(z.url().refine((url) => new URL(url).origin === url, 'Use an exact origin without path or wildcard')).min(1)),
});

export type Environment = z.infer<typeof schema>;
export function validateEnvironment(input: Record<string, unknown>): Environment {
  const result = schema.safeParse(input);
  if (!result.success) {
    // Never include actual environment values or credentials in startup errors.
    throw new Error(`Invalid environment: ${result.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
  }
  return result.data;
}
