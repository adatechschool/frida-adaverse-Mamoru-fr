import db from "@/lib/db";
import {Students} from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { normalizeText } from "@/utils/normalizeText";

// GET /api/students - Fetch all students
export async function GET() {
    console.log('[Students - GET] Fetching all students');
    
    const students = await db.select().from(Students);
    
    console.log(`[Students - GET] Retrieved ${students.length} student(s)`);
    
    return NextResponse.json(students);
};

// POST /api/students - Create a new student
export async function POST(request: Request) {
    // Parse the request body to get student name
    const { name, githubUsername, promotionId } = await request.json();
    
    console.log(`[Student - POST] Creating new student: "${name}"`);

    // Normalize the input student name (lowercase, remove accents, trim)
    const normalizedInput = normalizeText(name);

    // Check if a student with the same name already exists (case-insensitive, accent-insensitive)
    const allStudents = await db.select().from(Students);
    const existingStudent = allStudents.find(
        student => normalizeText(student.name) === normalizedInput || normalizeText(student.githubUsername) === normalizeText(githubUsername)
    );

    if (existingStudent) {
        console.log(`[Student - POST] Student "${name}" already exists (normalized match with "${existingStudent.name} or GitHub username "${existingStudent.githubUsername}")`);
        return NextResponse.json(
            {
                success: false,
                message: `Student '${name}' or GitHub username '${githubUsername}' already exists.`,
            },
            { status: 409 } // 409 Conflict status code
        );
    }

    // Insert the new project into the database
    const newStudent = await db.insert(Students).values({
        name: name,
        githubUsername: githubUsername,
        promotionId: promotionId,
    });
    
    console.log(`[Student - POST] Successfully created student: "${name}"`);
    return NextResponse.json({
        success: true,
        student: newStudent,
        message: `Student '${name}' has been created.`,
    });
}