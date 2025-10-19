/**
 * ElderLink Worker - Main Entry Point
 * Task 3.1d: API Routes Implementation
 * 
 * Routes requests to modular handlers
 */

import { handleVapiWebhook } from './handlers/vapi-webhook';
import { handleDashboardAPI } from './handlers/dashboard-api';
import { handleGetHealthData, handleGetAppointments, handleUpdateHealthNotes } from './handlers/mychart-api';
import { handleGetAlerts } from './handlers/alert-api';
import { getProfile } from './services/kv-service';
import { getAnalytics } from './services/analytics-service';
import { corsHeaders, handleCorsPreflightRequest, addCorsHeaders } from './middleware/cors';

export interface Env {
  KV: KVNamespace;
  ENVIRONMENT: string;
  GEMINI_API_KEY: string;
  VAPI_API_KEY: string;
  ELEVENLABS_ENGLISH_VOICE: string;
  ELEVENLABS_MANDARIN_VOICE: string;
  context: ExecutionContext;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Attach context to env for handlers
    env.context = ctx;
    
    const url = new URL(request.url);

    // Handle CORS preflight (using middleware)
    if (request.method === 'OPTIONS') {
      return handleCorsPreflightRequest();
    }

    try {
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

      // Vapi webhook endpoint (CRITICAL PATH)
      // Support both /vapi-webhook (legacy) and /chat/completions (OpenAI-compatible)
      if ((url.pathname === '/vapi-webhook' || url.pathname === '/chat/completions') && request.method === 'POST') {
        return addCorsHeaders(await handleVapiWebhook(request, env));
      }

      // Dashboard API - Single call gets everything
      if (url.pathname.startsWith('/api/dashboard/')) {
        const seniorId = url.pathname.split('/').pop();
        if (seniorId) {
          return addCorsHeaders(await handleDashboardAPI(seniorId, env));
        }
      }

      // MyChart endpoints
      if (url.pathname.startsWith('/api/mychart/')) {
        const parts = url.pathname.split('/');
        const seniorId = parts[3];
        const action = parts[4];

        if (request.method === 'GET' && !action) {
          return addCorsHeaders(await handleGetHealthData(seniorId, env));
        }

        if (request.method === 'GET' && action === 'appointments') {
          return addCorsHeaders(await handleGetAppointments(seniorId, env));
        }

        if (request.method === 'POST' && action === 'update') {
          return addCorsHeaders(await handleUpdateHealthNotes(seniorId, request, env));
        }
      }

      // Senior profile endpoint - GET
      if (url.pathname === '/api/senior/mrs-chen' && request.method === 'GET') {
        const profile = await getProfile('mrs-chen', env);
        return new Response(JSON.stringify(profile), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Senior profile endpoint - PUT (for initialization)
      if (url.pathname === '/api/senior/mrs-chen' && request.method === 'PUT') {
        const profile = await request.json() as any;
        await env.KV.put('senior-mrs-chen', JSON.stringify(profile));
        return new Response(JSON.stringify({ success: true, profile }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Live sentiment endpoint - GET
      if (url.pathname === '/api/sentiment/live' && request.method === 'GET') {
        const sentiment = await env.KV.get('live-sentiment');
        const data = sentiment ? JSON.parse(sentiment) : { sentiment: 0, emotions: [], timestamp: new Date().toISOString() };
        return new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Live sentiment endpoint - POST (for updates from phone calls)
      if (url.pathname.startsWith('/api/sentiment/') && request.method === 'POST') {
        const seniorId = url.pathname.split('/').pop();
        const sentimentData = await request.json() as any;
        await env.KV.put(`live-sentiment-${seniorId}`, JSON.stringify(sentimentData));
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Analytics endpoint
      if (url.pathname === '/api/analytics' && request.method === 'GET') {
        const analytics = await getAnalytics(env);
        return new Response(JSON.stringify(analytics), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Matches endpoint
      if (url.pathname.startsWith('/api/matches/')) {
        const seniorId = url.pathname.split('/').pop();
        if (seniorId && request.method === 'GET') {
          const profile = await getProfile(seniorId, env);
          if (!profile) {
            return new Response(JSON.stringify({ error: 'Profile not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }
          return new Response(JSON.stringify(profile.matches), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Groups endpoint
      if (url.pathname.startsWith('/api/groups/')) {
        const seniorId = url.pathname.split('/').pop();
        if (seniorId && request.method === 'GET') {
          const profile = await getProfile(seniorId, env);
          if (!profile) {
            return new Response(JSON.stringify({ error: 'Profile not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }
          return new Response(JSON.stringify(profile.groups), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }
      }

      // Alerts endpoint
      if (url.pathname.startsWith('/api/alerts/')) {
        const seniorId = url.pathname.split('/').pop();
        if (seniorId && request.method === 'GET') {
          return addCorsHeaders(await handleGetAlerts(seniorId, env));
        }
      }

      // Initialize demo data endpoint
      if (url.pathname === '/api/init-demo' && request.method === 'POST') {
        const profile = await request.json() as any;
        await env.KV.put(`senior-${profile.id}`, JSON.stringify(profile));
        return new Response(JSON.stringify({
          success: true,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // 404 for all other routes
      return new Response('Not found', {
        status: 404,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('[WORKER] Unhandled error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};