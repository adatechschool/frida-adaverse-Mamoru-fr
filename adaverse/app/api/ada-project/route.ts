import db from "@/lib/db";
import {adaProjects} from "@/lib/db/schema";
import { NextResponse } from "next/server";
// import { normalizeText } from "@/utils/normalizeText";

// GET /api/ada-project - Fetch all projects
export async function GET() {
    console.log('[Ada Project - GET] Fetching all Ada projects');
    
    const projects = await db.select().from(adaProjects);
    
    console.log(`[Ada Project - GET] Retrieved ${projects.length} project(s)`);
    
    return NextResponse.json(projects);
};

// // POST /api/ada-project - Create a new project
// export async function POST(request: Request) {
//     // Parse the request body to get project name
//     const { projectName } = await request.json();
    
//     console.log(`[Ada Project - POST] Creating new project: "${projectName}"`);

//     // Normalize the input project name (lowercase, remove accents, trim)
//     const normalizedInput = normalizeText(projectName);

//     // Check if a project with the same name already exists (case-insensitive, accent-insensitive)
//     const allProjects = await db.select().from(adaProjects);
//     const existingProject = allProjects.find(
//         project => normalizeText(project.projectName) === normalizedInput
//     );

//     if (existingProject) {
//         console.log(`[Ada Project - POST] Project "${projectName}" already exists (normalized match with "${existingProject.projectName}")`);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `Project '${projectName}' already exists.`,
//             },
//             { status: 409 } // 409 Conflict status code
//         );
//     }

//     // Insert the new project into the database
//     const newProject = await db.insert(adaProjects).values({
//         projectName,
//     });
    
//     console.log(`[Ada Project - POST] Successfully created project: "${projectName}"`);

//     return NextResponse.json({
//         success: true,
//         project: newProject,
//         message: `Project '${projectName}' has been created.`,
//     });
// }