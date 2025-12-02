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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    };

    // Fetch all projects with their students in a single query using joins
    const projectsData = await db
        .select({
            projectId: Projects.id,
            projectTitle: Projects.title,
            projectImage: Projects.image,
            projectURLName: Projects.URLName,
            projectAdaProjectID: Projects.adaProjectID,
            projectGithubRepoURL: Projects.githubRepoURL,
            projectDemoURL: Projects.demoURL,
            projectCreatedAt: Projects.createdAt,
            projectPublishedAt: Projects.publishedAt,
            studentId: Students.id,
            studentName: Students.name,
            studentGithubUsername: Students.githubUsername,
            studentPromotionId: Students.promotionId,
        })
        .from(Projects)
        .leftJoin(StudentToProjects, eq(StudentToProjects.projectStudentId, Projects.id))
        .leftJoin(Students, eq(Students.id, StudentToProjects.studentId));

    // Group students by project
    const projectsMap = new Map<number, Project>();
    
    for (const row of projectsData) {
        if (!projectsMap.has(row.projectId)) {
            projectsMap.set(row.projectId, {
                id: row.projectId,
                title: row.projectTitle,
                image: row.projectImage,
                students: [],
                URLName: row.projectURLName,
                adaProjectID: row.projectAdaProjectID!,
                githubRepoURL: row.projectGithubRepoURL,
                demoURL: row.projectDemoURL,
                createdAt: row.projectCreatedAt.toISOString(),
                publishedAt: row.projectPublishedAt?.toISOString() || null,
            });
        }
        
        // Add student if exists (left join might return null students)
        if (row.studentId) {
            const project = projectsMap.get(row.projectId)!;
            project.students!.push({
                id: row.studentId,
                name: row.studentName!,
                githubUsername: row.studentGithubUsername!,
                promotionId: row.studentPromotionId!,
            });
        }
    }

    const projectsWithStudents = Array.from(projectsMap.values());

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