import db from "@/lib/db";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { Project } from "@/content/project";
import { ProjectsStudents, StudentToProjects, Students } from "@/lib/db/schema";

export async function GET() {
    console.log('[Student Project - GET] Fetching all student projects');

    // Fetch all projects
    const studentProjects = await db.select().from(ProjectsStudents);

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
                        name: dbStudent.Name,
                        githubUsername: dbStudent.GithubUsername,
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

    return NextResponse.json(projectsWithStudents);
}