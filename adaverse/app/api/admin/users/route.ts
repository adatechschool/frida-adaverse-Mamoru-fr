import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { user } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/middleware/apiAuth';

/**
 * GET /api/admin/users
 * Get all users (admin only)
 */
export async function GET(request: NextRequest) {
    // Authenticate the request
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;

    try {
        // Get session
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        // Fetch all users
        const users = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                banned: user.banned,
                createdAt: user.createdAt,
            })
            .from(user)
            .orderBy(user.createdAt);

        return NextResponse.json(users);
    } catch (error) {
        console.error('[Admin Users - GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
