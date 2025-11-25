import {NextRequest, NextResponse} from "next/server";
import db from "@/src/lib/db";
import {adaProjects} from "@/src/lib/db/schema";
import {eq} from "drizzle-orm";

// GET /api/ada-project/[id] - Fetch a single project by ID
export async function GET(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    // Extract the project ID from route parameters
    const {id} = await params;
    const projectId = Number(id);
    
    console.log(`[Ada Project - GET] Fetching project with ID: ${projectId}`);

    // Query the database for the specific project
    const projectData = await db.select().from(adaProjects).where(eq(adaProjects.id, projectId));
    
    console.log(`[Ada Project - GET] Found ${projectData.length} project(s)`);

    return NextResponse.json(projectData);

}

// DELETE /api/ada-project/[id] - Delete a project by ID
export async function DELETE(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    // Extract the project ID from route parameters
    const {id} = await params;
    const projectId = Number(id);
    
    console.log(`[Ada Project - DELETE] Attempting to delete project with ID: ${projectId}`);
    // Execute the delete operation
    const deletedProject = await db.delete(adaProjects).where(eq(adaProjects.id, projectId));
    
    console.log(`[Ada Project - DELETE] Successfully deleted project ${projectId}`);
    return NextResponse.json({
        success: true,
        delete: deletedProject.rows,
        message: `Project with ID ${projectId} has been deleted.`,
    });
}