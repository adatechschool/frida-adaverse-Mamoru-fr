import db from "@/lib/db";
import {StudentToProjects} from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { normalizeText } from "@/utils/normalizeText";
import { normalizeDate } from "@/utils/normalizeDate";

// GET /api/student_to_projects - Fetch all student to projects
export async function GET() {
    console.log('[Student To Projects - GET] Fetching all student to projects');
    
    const studentToProjects = await db.select().from(StudentToProjects);
    
    console.log(`[Student To Projects - GET] Retrieved ${studentToProjects.length} student to projects(s)`);
    
    return NextResponse.json(studentToProjects);
};

// POST /api/student_to_projects - Create a new project-student relation
export async function POST(request: Request) {
    // Parse the request body to get project name
    const { studentId, projectStudentId } = await request.json();
    
    console.log(`[Student To Projects - POST] Creating new student to project relation: studentId="${studentId}", projectStudentId="${projectStudentId}"`);

    // Check if a project with the same name already exists (case-insensitive, accent-insensitive)
    const AllProjectsStudentsRelations = await db.select().from(StudentToProjects);
    const existingNamePromotions = AllProjectsStudentsRelations.find(
        relations => relations.studentId === studentId && relations.projectStudentId === projectStudentId
    );

    if (existingNamePromotions) {
        console.log(`[Student To Projects - POST] Student to project relation already exists (studentId="${studentId}", projectStudentId="${projectStudentId}")`);
        return NextResponse.json(
            {
                success: false,
                message: `Student to project relation already exists.`,
            },
            { status: 409 } // 409 Conflict status code
        );
    }

    // Insert the new project into the database (normalize date to ensure consistent format)
    const newStudentProjectRelation = await db.insert(StudentToProjects).values({
        studentId: studentId, 
        projectStudentId: projectStudentId,
    });
    
    console.log(`[Student To Projects - POST] Successfully created student to project relation: studentId="${studentId}", projectStudentId="${projectStudentId}"`);
    return NextResponse.json({
        success: true,
        StudentToProject: {
            studentId: studentId,
            projectStudentId: projectStudentId
        },
        message: `Student to project relation has been created.`,
    });
}