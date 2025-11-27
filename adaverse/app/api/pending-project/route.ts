import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { PendingProjects } from '@/lib/db/schema';
import { authenticateRequest } from '@/lib/middleware/apiAuth';
import { eq } from 'drizzle-orm';

/**
 * GET /api/pending-project
 * Fetch all pending projects awaiting approval
 */
export async function GET(request: NextRequest) {
    console.log('[Pending Projects - GET] Fetching all pending projects');
    
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;

    try {
        const pendingProjects = await db.select().from(PendingProjects);
        console.log(`[Pending Projects - GET] Retrieved ${pendingProjects.length} pending project(s)`);
        return NextResponse.json(pendingProjects);
    } catch (error) {
        console.error('[Pending Projects - GET] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pending projects' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/pending-project
 * Add a new project to the pending queue
 */
export async function POST(request: NextRequest) {
    console.log('[Pending Projects - POST] Adding new pending project');
    
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;

    try {
        const body = await request.json();
        const { title, image, URLName, adaProjectID, githubRepoURL, demoURL, studentIds, publishedAt } = body;

        // Validate required fields
        if (!title || !URLName || !githubRepoURL || !studentIds) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newPendingProject = await db.insert(PendingProjects).values({
            title,
            image: image || '',
            URLName,
            adaProjectID: adaProjectID || null,
            githubRepoURL,
            demoURL: demoURL || null,
            studentIds, // Comma-separated string
            publishedAt: publishedAt ? new Date(publishedAt) : null,
        }).returning();

        console.log('[Pending Projects - POST] Created pending project:', newPendingProject[0].id);
        return NextResponse.json(newPendingProject[0], { status: 201 });
    } catch (error) {
        console.error('[Pending Projects - POST] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create pending project' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/pending-project?id=123
 * Delete a pending project (rejection)
 */
export async function DELETE(request: NextRequest) {
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing project ID' },
                { status: 400 }
            );
        }

        await db.delete(PendingProjects).where(eq(PendingProjects.id, parseInt(id)));
        console.log(`[Pending Projects - DELETE] Deleted pending project ${id}`);
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Pending Projects - DELETE] Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete pending project' },
            { status: 500 }
        );
    }
}
