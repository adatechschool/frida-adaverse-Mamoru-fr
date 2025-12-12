import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { Comments, user } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { authenticateRequest } from '@/lib/middleware/apiAuth';

/**
 * GET /api/comments/projects/[id]
 * Get all comments for a specific project
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Authenticate the request
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;
    
    try {
        const { id } = await params;
        const projectId = parseInt(id);

        if (isNaN(projectId)) {
            return NextResponse.json(
                { error: 'Invalid project ID' },
                { status: 400 }
            );
        }

        // Fetch comments with user information
        const comments = await db
            .select({
                id: Comments.id,
                content: Comments.content,
                createdAt: Comments.createdAt,
                updatedAt: Comments.updatedAt,
                projectId: Comments.projectId,
                user: {
                    id: user.id,
                    name: user.name,
                    image: user.image,
                },
            })
            .from(Comments)
            .leftJoin(user, eq(Comments.userId, user.id))
            .where(eq(Comments.projectId, projectId))
            .orderBy(Comments.createdAt);

        return NextResponse.json(comments);
    } catch (error) {
        console.error('[Comments - GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}
