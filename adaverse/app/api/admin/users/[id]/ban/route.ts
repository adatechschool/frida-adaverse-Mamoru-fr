import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { user } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { eq } from 'drizzle-orm';
import { authenticateRequest } from '@/lib/middleware/apiAuth';

/**
 * PUT /api/admin/users/[id]/ban
 * Ban or unban a user (admin only)
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const body = await request.json();
        const { banned } = body;

        if (typeof banned !== 'boolean') {
            return NextResponse.json(
                { error: 'Invalid banned value' },
                { status: 400 }
            );
        }

        // Check if target user exists
        const [targetUser] = await db
            .select()
            .from(user)
            .where(eq(user.id, id));

        if (!targetUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent banning another admin
        if (targetUser.role === 'admin') {
            return NextResponse.json(
                { error: 'Cannot ban another admin' },
                { status: 403 }
            );
        }

        // Prevent admins from banning themselves
        if (targetUser.id === session.user.id) {
            return NextResponse.json(
                { error: 'Cannot ban yourself' },
                { status: 403 }
            );
        }

        // Update user banned status
        const [updatedUser] = await db
            .update(user)
            .set({ banned })
            .where(eq(user.id, id))
            .returning();

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                banned: updatedUser.banned,
            },
            message: banned ? 'User has been banned' : 'User has been unbanned'
        });
    } catch (error) {
        console.error('[Admin Users - BAN] Error:', error);
        return NextResponse.json(
            { error: 'Failed to update user status' },
            { status: 500 }
        );
    }
}
