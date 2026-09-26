import { it } from 'node:test';
import assert from 'node:assert/strict';
import { validateEnvironment } from '../src/config/environment';
it('validates ports and exact CORS origins without echoing secrets', () => {
  assert.throws(() => validateEnvironment({ DATABASE_URL: 'private-secret', API_PORT: 'wrong' }), (error: unknown) => error instanceof Error && !error.message.includes('private-secret'));
  assert.throws(() => validateEnvironment({ DATABASE_URL: 'postgresql://localhost/test', CORS_ORIGINS: '*' }));
  assert.equal(validateEnvironment({ DATABASE_URL: 'postgresql://localhost/test', JWT_SECRET: 'test-secret-that-is-at-least-32-chars' }).API_PORT, 3000);
});
