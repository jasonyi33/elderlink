describe('Health Check Endpoint', () => {
  let worker: any;

  beforeAll(() => {
    // We'll import the worker once it's created
    // For now, this will fail, which is expected in TDD
    try {
      worker = require('../src/index').default;
    } catch (error) {
      // Expected to fail initially
    }
  });

  test('GET /api/health returns ok status', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
      environment: 'development',
      version: '1.0.0'
    });
  });

  test('health check includes KV connectivity', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request);
    const data = await response.json();

    expect(data.services).toEqual({
      kv: 'connected',
      gemini: 'not_tested',
      vapi: 'not_tested'
    });
  });

  test('health check responds within 100ms', async () => {
    const start = Date.now();
    const request = new Request('http://localhost/api/health');
    await worker.fetch(request);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});