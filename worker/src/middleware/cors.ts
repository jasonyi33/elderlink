/**
 * Task 3.9d: CORS Middleware Implementation
 * 
 * Cross-Origin Resource Sharing (CORS) middleware for dashboard compatibility
 * Extracted from index.ts for better code organization
 * 
 * Reference:
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.9
 * - PRD.md lines 1003-1012 (CORS implementation in Worker)
 * - Existing implementation in worker/src/index.ts lines 32-55
 */

/**
 * CORS headers configuration
 * Allow all origins (*) for demo purposes
 * In production, should restrict to specific dashboard domain
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Handle CORS preflight OPTIONS requests
 * Returns 200 OK with CORS headers, no body
 * 
 * @returns Response with CORS headers for preflight
 */
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

/**
 * Add CORS headers to an existing response
 * Preserves original response headers, status, and body
 * 
 * @param response - The original response to add CORS headers to
 * @returns New response with CORS headers added
 */
export function addCorsHeaders(response: Response): Response {
  // Create new Headers object from existing response
  const newHeaders = new Headers(response.headers);
  
  // Add CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  // Return new response with CORS headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

