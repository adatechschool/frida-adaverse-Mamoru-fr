import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to authenticate API requests using an API key
 * 
 * Usage in API routes:
 * const authResult = authenticateRequest(request);
 * if (authResult.error) return authResult.response;
 */
export function authenticateRequest(request: NextRequest) {
    // Get API key from request headers
    const apiKey = request.headers.get('x-api-key');
    
    // Get the expected API key from environment variables
    const validApiKey = process.env.API_SECRET_KEY;
    
    // If no API key is configured, allow the request (development mode)
    if (!validApiKey) {
        console.warn('[API Auth] Warning: API_SECRET_KEY not configured. API is unprotected!');
        return { error: false };
    }
    
    // Check if API key was provided
    if (!apiKey) {
        console.error('[API Auth] ❌ Request blocked: No API key provided');
        return {
            error: true,
            response: NextResponse.json(
                { 
                    error: 'Unauthorized',
                    message: 'API key is required. Please provide x-api-key header.' 
                },
                { 
                    status: 401,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
                    }
                }
            )
        };
    }
    
    // Validate API key
    if (apiKey !== validApiKey) {
        console.error('[API Auth] ❌ Request blocked: Invalid API key provided');
        return {
            error: true,
            response: NextResponse.json(
                { 
                    error: 'Forbidden',
                    message: 'Invalid API key provided.' 
                },
                { 
                    status: 403,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
                    }
                }
            )
        };
    }
    
    // Valid API key
    console.log('[API Auth] ✅ Request authenticated successfully');
    return { error: false };
}
