export interface Env {
  KV: KVNamespace;
  ENVIRONMENT: string;
  GEMINI_API_KEY: string;
  VAPI_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check endpoint
    if (url.pathname === '/api/health' && request.method === 'GET') {
      const start = Date.now();

      // Test KV connectivity
      let kvStatus = 'unknown';
      try {
        await env.KV.get('test-key');
        kvStatus = 'connected';
      } catch (error) {
        kvStatus = 'error';
      }

      const healthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'development',
        version: '1.0.0',
        services: {
          kv: kvStatus,
          gemini: 'not_tested',
          vapi: 'not_tested'
        },
        latency: `${Date.now() - start}ms`
      };

      return new Response(JSON.stringify(healthResponse), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    // 404 for all other routes (for now)
    return new Response('Not found', {
      status: 404,
      headers: corsHeaders
    });
  }
};