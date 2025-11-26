import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";
import {StudentToProjects} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

// // GET /api/ada-project/[id] - Fetch a single project by ID
export async function GET(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    // Extract the project ID from route parameters
    const {id} = await params;
    const studentToProjectId = Number(id);
    
    console.log(`[Student To Projects - GET] Fetching student to project relation with ID: ${studentToProjectId}`);

    // Query the database for the specific project
    const studentToProjectData = await db.select().from(StudentToProjects).where(eq(StudentToProjects.id, studentToProjectId));
    
    console.log(`[Student To Projects - GET] Found ${studentToProjectData.length} student to project relation(s)`);

    return NextResponse.json(studentToProjectData);
}

// // DELETE /api/student_to_projects/[id] - Delete a student to project relation by ID
// export async function DELETE(
//     req: NextRequest,
//     {params}: {params: Promise<{id: string}>}
// ) {
//     // Extract the project ID from route parameters
//     const {id} = await params;
//     const studentToProjectId = Number(id);
    
//     console.log(`[Student To Projects - DELETE] Attempting to delete student to project relation with ID: ${studentToProjectId}`);
//     // Execute the delete operation
//     const deletedStudentToProject = await db.delete(StudentToProjects).where(eq(StudentToProjects.id, studentToProjectId));
    
//     console.log(`[Student To Projects - DELETE] Successfully deleted student to project relation ${studentToProjectId}`);
//     return NextResponse.json({
//         success: true,
//         delete: deletedStudentToProject.rows,
//         message: `Student to project relation with ID ${studentToProjectId} has been deleted.`,
//     });
// }