import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchHealth } from '../lib/api';
afterEach(() => vi.unstubAllGlobals());
describe('typed health client', () => {
  it('accepts the actual health contract', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }))));
    await expect(fetchHealth()).resolves.toEqual({ status: 'ok' });
  });
  it('rejects a malformed successful response instead of showing a false healthy state', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'maybe' }))));
    await expect(fetchHealth()).rejects.toThrow();
  });
});
