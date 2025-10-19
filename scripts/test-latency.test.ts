import { measureWebhookLatency, measureAverageLatency, measureLatencyBreakdown } from './test-latency';

describe('Webhook Latency Tests', () => {
  const WORKER_URL = process.env.WORKER_URL || 'https://elderlink-dev.elderlinkhelper.workers.dev';

  test('webhook responds in <3 seconds', async () => {
    const latency = await measureWebhookLatency(WORKER_URL);

    expect(latency).toBeLessThan(3000);
    console.log(`✅ Latency: ${latency}ms`);
  }, 10000); // 10s timeout for test itself

  test('average latency over 10 calls <2.5 seconds', async () => {
    const avgLatency = await measureAverageLatency(WORKER_URL, 10);

    expect(avgLatency).toBeLessThan(2500);
    console.log(`✅ Average latency: ${avgLatency}ms over 10 calls`);
  }, 60000); // 60s timeout

  test('no timeouts in 20 consecutive calls', async () => {
    const results = [];

    for (let i = 0; i < 20; i++) {
      const latency = await measureWebhookLatency(WORKER_URL);
      results.push(latency);
    }

    const timeouts = results.filter(l => l >= 10000); // 10s = Vapi timeout
    expect(timeouts.length).toBe(0);

    console.log(`✅ All 20 calls completed successfully`);
    console.log(`Min: ${Math.min(...results)}ms, Max: ${Math.max(...results)}ms`);
  }, 120000); // 2min timeout

  test('latency breakdown measured', async () => {
    const breakdown = await measureLatencyBreakdown(WORKER_URL);

    expect(breakdown.parsing).toBeLessThan(100);
    expect(breakdown.processing).toBeLessThan(2000);
    expect(breakdown.total).toBeLessThan(3000);

    console.log('📊 Latency Breakdown:');
    console.log(`  Parsing: ${breakdown.parsing}ms`);
    console.log(`  Processing: ${breakdown.processing}ms`);
    console.log(`  Total: ${breakdown.total}ms`);
  }, 10000);

  test('concurrent requests handled correctly', async () => {
    const requests = Array(5).fill(null).map(() =>
      measureWebhookLatency(WORKER_URL)
    );

    const latencies = await Promise.all(requests);

    latencies.forEach(latency => {
      expect(latency).toBeLessThan(5000); // Slight degradation OK
    });

    const avgConcurrent = latencies.reduce((a, b) => a + b) / latencies.length;
    console.log(`✅ Average latency with 5 concurrent: ${avgConcurrent}ms`);
  }, 30000);
});
