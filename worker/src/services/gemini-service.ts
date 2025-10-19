/**
 * Task 3.8d: Gemini Service Implementation
 * 
 * Production-ready Gemini API wrapper with timeout, retry, and error handling
 * 
 * Reference:
 * - PRD.md lines 1397-1422 (callGemini base implementation)
 * - PRD.md lines 792-834 (Modular Gemini Architecture)
 * - DEVELOPER_2_IMPLEMENTATION.md Task 3.8
 * 
 * Features:
 * - 7-second timeout with Promise.race
 * - Exponential backoff retry (max 3 attempts)
 * - 429 rate limit handling
 * - Malformed JSON handling
 * - Comprehensive error logging
 */

import { Env } from './kv-service';

/**
 * Call Gemini API with timeout, retry, and error handling
 * Production-ready wrapper for all Gemini calls
 * PRD lines 1397-1422
 * 
 * @param prompt - The prompt to send to Gemini
 * @param env - Cloudflare environment with GEMINI_API_KEY
 * @param options - Optional configuration (timeout, maxTokens, temperature)
 * @returns Gemini response text
 * @throws Error if all retries fail or timeout occurs
 */
export async function callGemini(
  prompt: string,
  env: Env,
  options?: {
    timeout?: number;
    maxTokens?: number;
    temperature?: number;
    maxRetries?: number;
  }
): Promise<string> {
  const timeout = options?.timeout || 7000; // 7-second default
  const maxTokens = options?.maxTokens || 200; // PRD line 1410
  const temperature = options?.temperature || 0.7; // PRD line 1409
  const maxRetries = options?.maxRetries || 3;

  console.log('[GEMINI] Calling API with timeout:', timeout, 'ms');

  // Retry loop with exponential backoff
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log('[GEMINI] Attempt', attempt, 'of', maxRetries);

      // Create the API call promise
      const apiCallPromise = fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': env.GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens
            }
          })
        }
      );

      // Create timeout promise
      const timeoutPromise = new Promise<Response>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout after ' + timeout + 'ms')), timeout)
      );

      // Race: API call vs timeout
      const response = await Promise.race([apiCallPromise, timeoutPromise]) as Response;

      // Handle HTTP errors
      if (!response.ok) {
        const status = response.status;
        
        // Handle 429 rate limit - retry with backoff
        if (status === 429) {
          console.log('[GEMINI] Rate limit (429) hit, retrying...');
          
          if (attempt < maxRetries) {
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, attempt - 1) * 1000;
            console.log('[GEMINI] Waiting', delay, 'ms before retry');
            await new Promise(resolve => setTimeout(resolve, delay));
            continue; // Retry
          }
          
          throw new Error(`Gemini API rate limit: ${status}`);
        }
        
        // Other HTTP errors
        throw new Error(`Gemini API error: ${status}`);
      }

      // Parse response
      const data = await response.json() as any;
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Gemini response missing text content');
      }

      console.log('[GEMINI] Success. Response length:', text.length);
      return text;

    } catch (error: any) {
      console.error('[GEMINI] Error on attempt', attempt, ':', error.message);

      // If timeout or last attempt, throw
      if (error.message?.includes('timeout') || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff before retry
      const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
      console.log('[GEMINI] Retrying after', delay, 'ms...');
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Should never reach here
  throw new Error('Gemini API: Max retries exceeded');
}

/**
 * Call Gemini with specific configuration for response generation
 * Optimized for conversation responses (lower latency target)
 */
export async function callGeminiForResponse(
  prompt: string,
  env: Env
): Promise<string> {
  return callGemini(prompt, env, {
    timeout: 7000,
    maxTokens: 200,
    temperature: 0.7,
    maxRetries: 2 // Fewer retries for responses (need speed)
  });
}

/**
 * Call Gemini with specific configuration for analysis
 * Can tolerate slightly longer timeout for better accuracy
 */
export async function callGeminiForAnalysis(
  prompt: string,
  env: Env
): Promise<string> {
  return callGemini(prompt, env, {
    timeout: 7000,
    maxTokens: 300,
    temperature: 0.5, // Lower temp for more consistent analysis
    maxRetries: 3
  });
}

