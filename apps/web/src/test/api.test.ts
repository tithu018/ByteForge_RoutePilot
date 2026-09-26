import { afterEach, describe, expect, it, vi } from 'vitest';
import { createOrder, fetchHealth, fetchOrders } from '../lib/api';
afterEach(() => vi.unstubAllGlobals());
describe('typed health client', () => {
  it('accepts the actual health contract', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }))),
    );
    await expect(fetchHealth()).resolves.toEqual({ status: 'ok' });
  });
  it('rejects a malformed successful response instead of showing a false healthy state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 'maybe' }))),
    );
    await expect(fetchHealth()).rejects.toThrow();
  });
});
describe('ordering client', () => {
  it('sends the authenticated order contract and reads order history', async () => {
    sessionStorage.setItem(
      'waypoint.session',
      JSON.stringify({ accessToken: 'demo-token', user: { role: 'STORE_MANAGER' } }),
    );
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'order-1', sourceId: 'DEMO-ORDER-1' }])),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: 'order-1', sourceId: 'DEMO-ORDER-1' })),
      );
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchOrders()).resolves.toHaveLength(1);
    await expect(
      createOrder({
        requestedDeliveryDate: '2026-09-28',
        sourceId: 'DEMO-ORDER-1',
        temperature: 'AMBIENT',
        units: 1,
        weightKg: 0,
        volumeM3: 0,
      }),
    ).resolves.toMatchObject({ sourceId: 'DEMO-ORDER-1' });
    expect(fetchMock.mock.calls[1]?.[1]).toEqual(
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ Authorization: 'Bearer demo-token' }),
      }),
    );
  });
});
