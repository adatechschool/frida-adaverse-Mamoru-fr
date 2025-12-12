import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Comments } from '@/lib/db/schema';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { eq, and } from 'drizzle-orm';
import { authenticateRequest } from '@/lib/middleware/apiAuth';

/**
 * PUT /api/comments/[id]
 * Update a comment
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

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const commentId = parseInt(id);

        if (isNaN(commentId)) {
            return NextResponse.json(
                { error: 'Invalid comment ID' },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== 'string' || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Content cannot be empty' },
                { status: 400 }
            );
        }

        // Check if comment exists and belongs to user
        const [existingComment] = await db
            .select()
            .from(Comments)
            .where(eq(Comments.id, commentId));

        if (!existingComment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        if (existingComment.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update comment
        const [updatedComment] = await db
            .update(Comments)
            .set({ 
                content: content.trim(),
                updatedAt: new Date(),
            })
            .where(eq(Comments.id, commentId))
            .returning();

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('[Comments - PUT] Error:', error);
        return NextResponse.json(
            { error: 'Failed to update comment' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/comments/[id]
 * Delete a comment
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;
        const commentId = parseInt(id);

        if (isNaN(commentId)) {
            return NextResponse.json(
                { error: 'Invalid comment ID' },
                { status: 400 }
            );
        }

        // Check if comment exists and belongs to user
        const [existingComment] = await db
            .select()
            .from(Comments)
            .where(eq(Comments.id, commentId));

        if (!existingComment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        if (existingComment.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Delete comment
        await db.delete(Comments).where(eq(Comments.id, commentId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Comments - DELETE] Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
