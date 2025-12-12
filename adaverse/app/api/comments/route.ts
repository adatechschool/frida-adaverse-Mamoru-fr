import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Comments } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { authenticateRequest } from '@/lib/middleware/apiAuth';

/**
 * POST /api/comments
 * Create a new comment
 */
export async function POST(request: NextRequest) {
    // Authenticate the request
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;
    
    try {
        // Get session
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { projectId, content } = body;

        if (!projectId || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Content cannot be empty' },
                { status: 400 }
            );
        }

        // Create comment
        const [newComment] = await db.insert(Comments).values({
            content: content.trim(),
            projectId: parseInt(projectId),
            userId: session.user.id,
        }).returning();

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('[Comments - POST] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
