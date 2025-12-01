import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { PendingProjects, Projects } from '@/lib/db/schema';
import { authenticateRequest } from '@/lib/middleware/apiAuth';
import { eq } from 'drizzle-orm';
import { generateURLName } from '@/utils/generateURLName';

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
        const { title, image, adaProjectID, githubRepoURL, demoURL, studentIds, publishedAt } = body;

        // Validate required fields
        if (!title || !githubRepoURL || !studentIds) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Generate base URL name from title
        let URLName = generateURLName(title);
        console.log(`[Pending Projects - POST] Generated URLName from title "${title}": "${URLName}"`);

        // Check if URLName already exists in both tables and make it unique
        const existingProjects = await db.select().from(Projects);
        const existingPending = await db.select().from(PendingProjects);
        const allURLNames = [
            ...existingProjects.map(p => p.URLName),
            ...existingPending.map(p => p.URLName)
        ];

        // If URLName exists, append a number to make it unique
        if (allURLNames.includes(URLName)) {
            console.log(`[Pending Projects - POST] URLName "${URLName}" already exists, finding unique variant...`);
            let counter = 1;
            let newURLName = `${URLName}-${counter}`;
            while (allURLNames.includes(newURLName)) {
                counter++;
                newURLName = `${URLName}-${counter}`;
            }
            URLName = newURLName;
            console.log(`[Pending Projects - POST] Using unique URLName: "${URLName}"`);
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
