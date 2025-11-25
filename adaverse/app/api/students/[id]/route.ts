import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";
import {Students} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

// // GET /api/ada-project/[id] - Fetch a single project by ID
export async function GET(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    // Extract the project ID from route parameters
    const {id} = await params;
    const studentId = Number(id);
    
    console.log(`[Student - GET] Fetching student with ID: ${studentId}`);

    // Query the database for the specific student
    const studentData = await db.select().from(Students).where(eq(Students.id, studentId));
    
    console.log(`[Student - GET] Found ${studentData.length} student(s)`);

    return NextResponse.json(studentData);
}

// // DELETE /api/students/[id] - Delete a student by ID
// export async function DELETE(
//     req: NextRequest,
//     {params}: {params: Promise<{id: string}>}
// ) {
//     // Extract the student ID from route parameters
//     const {id} = await params;
//     const studentId = Number(id);
    
//     console.log(`[Student - DELETE] Attempting to delete student with ID: ${studentId}`);
//     // Execute the delete operation
//     const deletedStudent = await db.delete(Students).where(eq(Students.id, studentId));
    
//     console.log(`[Student - DELETE] Successfully deleted student ${studentId}`);
//     return NextResponse.json({
//         success: true,
//         delete: deletedStudent.rows,
//         message: `Student with ID ${studentId} has been deleted.`,
//     });
// }