/**
 * Latency Testing Suite for ElderLink Vapi Webhook
 *
 * Measures response times to ensure <3 second target
 */

interface LatencyBreakdown {
  parsing: number;
  processing: number;
  total: number;
}

/**
 * Measure single webhook call latency
 */
export async function measureWebhookLatency(
  workerUrl: string,
  message: string = "Hello Sam, this is a test"
): Promise<number> {
  const startTime = Date.now();

  try {
    const response = await fetch(`${workerUrl}/vapi-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          transcript: { content: message },
          role: 'user',
          language: 'en-US'
        },
        conversationHistory: []
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json() as any;
    const endTime = Date.now();

    const latency = endTime - startTime;

    console.log(`[LATENCY] ${latency}ms - Response: "${data.content?.substring(0, 50)}..."`);

    return latency;

  } catch (error) {
    console.error(`[ERROR] Request failed:`, error);
    return 10000; // Return timeout value on error
  }
}

/**
 * Measure average latency over multiple calls
 */
export async function measureAverageLatency(
  workerUrl: string,
  numCalls: number = 10
): Promise<number> {
  console.log(`\n📊 Testing average latency over ${numCalls} calls...\n`);

  const latencies: number[] = [];

  for (let i = 0; i < numCalls; i++) {
    const latency = await measureWebhookLatency(
      workerUrl,
      `Test call ${i + 1} of ${numCalls}`
    );
    latencies.push(latency);

    // Small delay between calls
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;
  const min = Math.min(...latencies);
  const max = Math.max(...latencies);

  console.log(`\n✅ Results:`);
  console.log(`  Average: ${avg.toFixed(2)}ms`);
  console.log(`  Min: ${min}ms`);
  console.log(`  Max: ${max}ms`);
  console.log(`  Target: <2500ms`);
  console.log(`  Status: ${avg < 2500 ? '✅ PASS' : '❌ FAIL'}\n`);

  return avg;
}

/**
 * Measure latency breakdown (detailed timing)
 */
export async function measureLatencyBreakdown(
  workerUrl: string
): Promise<LatencyBreakdown> {
  const overallStart = Date.now();

  // This would require Worker to return timing headers
  // For now, estimate based on total time
  const response = await fetch(`${workerUrl}/vapi-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Request-Start': overallStart.toString()
    },
    body: JSON.stringify({
      message: {
        transcript: { content: "Detailed latency test" },
        language: 'en-US'
      }
    })
  });

  await response.json(); // Consume response to complete request
  const overallEnd = Date.now();

  const total = overallEnd - overallStart;

  // Estimated breakdown (Worker should provide actual timing)
  const parsing = 50; // Estimated
  const processing = total - parsing;

  return {
    parsing,
    processing,
    total
  };
}

/**
 * Run comprehensive latency test suite
 */
export async function runLatencyTests(workerUrl: string): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║           ELDERLINK LATENCY TEST SUITE                    ║
║                                                           ║
║  Target: <3 seconds per call (Vapi timeout: 10s)         ║
║  Goal: <2.5 seconds average                              ║
╚═══════════════════════════════════════════════════════════╝
  `);

  console.log(`\nWorker URL: ${workerUrl}\n`);

  // Test 1: Single call
  console.log('📍 Test 1: Single Call Latency');
  const singleLatency = await measureWebhookLatency(workerUrl);
  console.log(`Result: ${singleLatency}ms ${singleLatency < 3000 ? '✅' : '❌'}\n`);

  // Test 2: Average of 10 calls
  console.log('📍 Test 2: Average Latency (10 calls)');
  const avgLatency = await measureAverageLatency(workerUrl, 10);
  console.log(`Result: ${avgLatency.toFixed(2)}ms ${avgLatency < 2500 ? '✅' : '❌'}\n`);

  // Test 3: Stress test (20 calls)
  console.log('📍 Test 3: Stress Test (20 consecutive calls)');
  const stressResults: number[] = [];
  for (let i = 0; i < 20; i++) {
    const latency = await measureWebhookLatency(workerUrl, `Stress test ${i + 1}`);
    stressResults.push(latency);
  }
  const timeouts = stressResults.filter(l => l >= 10000).length;
  console.log(`Timeouts: ${timeouts}/20 ${timeouts === 0 ? '✅' : '❌'}\n`);

  // Test 4: Breakdown
  console.log('📍 Test 4: Latency Breakdown');
  const breakdown = await measureLatencyBreakdown(workerUrl);
  console.log(`Parsing: ${breakdown.parsing}ms`);
  console.log(`Processing: ${breakdown.processing}ms`);
  console.log(`Total: ${breakdown.total}ms ${breakdown.total < 3000 ? '✅' : '❌'}\n`);

  // Summary
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                      SUMMARY                              ║
╠═══════════════════════════════════════════════════════════╣
║  Single Call:    ${singleLatency}ms ${singleLatency < 3000 ? '✅' : '❌'}                       ║
║  Average (10):   ${avgLatency.toFixed(2)}ms ${avgLatency < 2500 ? '✅' : '❌'}                     ║
║  Timeouts (20):  ${timeouts}/20 ${timeouts === 0 ? '✅' : '❌'}                          ║
║  Breakdown:      ${breakdown.total}ms ${breakdown.total < 3000 ? '✅' : '❌'}                      ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

// CLI execution
if (require.main === module) {
  const workerUrl = process.env.WORKER_URL || 'http://localhost:8787';

  runLatencyTests(workerUrl)
    .then(() => {
      console.log('\n✅ Latency tests completed\n');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Latency tests failed:', error);
      process.exit(1);
    });
}
