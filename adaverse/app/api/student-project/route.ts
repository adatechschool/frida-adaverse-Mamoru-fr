import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { authenticateRequest } from "@/lib/middleware/apiAuth";

import { Project } from "@/content/project";
import { Projects, StudentToProjects, Students } from "@/lib/db/schema";

export async function GET(request: NextRequest) {
    // Authenticate the request
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;
    
    console.log('[Student Project - GET] Fetching all student projects');

    // Add CORS headers for cross-origin requests
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    };

    // Fetch all projects
    const studentProjects = await db.select().from(Projects);

    // For each project, fetch the associated students
    const projectsWithStudents: Project[] = await Promise.all(
        studentProjects.map(async (project) => {
            // Find all student-project relationships for this project
            const studentLinks = await db
                .select()
                .from(StudentToProjects)
                .where(eq(StudentToProjects.projectStudentId, project.id));

            // Fetch student details for each link
            const students = await Promise.all(
                studentLinks.map(async (link) => {
                    const studentData = await db
                        .select()
                        .from(Students)
                        .where(eq(Students.id, link.studentId))
                        .limit(1);
                    
                    // Map database fields to Student type
                    const dbStudent = studentData[0];
                    return dbStudent && {
                        id: dbStudent.id,
                        name: dbStudent.name,
                        githubUsername: dbStudent.githubUsername,
                        promotionId: dbStudent.promotionId,
                    };
                })
            );

            // Return project with students attached
            return {
                id: project.id,
                title: project.title,
                image: project.image,
                students: students.filter((s): s is NonNullable<typeof s> => s !== null), // Remove null students with type guard
                URLName: project.URLName,
                adaProjectID: project.adaProjectID!,
                githubRepoURL: project.githubRepoURL,
                demoURL: project.demoURL,
                createdAt: project.createdAt.toISOString(),
                publishedAt: project.publishedAt?.toISOString() || null,
            };
        })
    );

    console.log(`[Student Project - GET] Retrieved ${projectsWithStudents.length} student project(s)`);

    return NextResponse.json(projectsWithStudents, { headers });
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
        },
    });
}