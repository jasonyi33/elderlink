import worker from '../src/index';

describe('Health Check Endpoint', () => {
  // Mock the KV namespace
  const mockKV = {
    get: jest.fn().mockResolvedValue(null),
    put: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
  };

  // Mock ExecutionContext
  const mockCtx = {
    waitUntil: jest.fn(),
    passThroughOnException: jest.fn()
  } as any;

  // Mock environment
  const mockEnv = {
    KV: mockKV as any,
    ENVIRONMENT: 'development',
    GEMINI_API_KEY: 'test-key',
    VAPI_API_KEY: 'test-key',
    ELEVENLABS_ENGLISH_VOICE: 'test-voice',
    ELEVENLABS_MANDARIN_VOICE: 'test-voice',
    context: mockCtx
  };

  test('GET /api/health returns ok status', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request, mockEnv, mockCtx);

    expect(response.status).toBe(200);

    const data = await response.json() as any;
    expect(data).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      environment: 'development',
      version: '1.0.0'
    });
  });

  test('health check includes KV connectivity', async () => {
    const request = new Request('http://localhost/api/health');
    const response = await worker.fetch(request, mockEnv, mockCtx);
    const data = await response.json() as any;

    expect(data.services).toEqual({
      kv: 'connected',
      gemini: 'not_tested',
      vapi: 'not_tested'
    });
  });

  test('health check responds within 100ms', async () => {
    const start = Date.now();
    const request = new Request('http://localhost/api/health');
    await worker.fetch(request, mockEnv, mockCtx);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});