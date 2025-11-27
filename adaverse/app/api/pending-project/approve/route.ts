import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { PendingProjects } from '@/lib/db/schema';
import { authenticateRequest } from '@/lib/middleware/apiAuth';
import { eq } from 'drizzle-orm';
import { writeFileSync } from 'fs';
import { join } from 'path';

/**
 * POST /api/pending-project/approve?id=123
 * Approve a pending project and add it to the SQL file for batch execution
 */
export async function POST(request: NextRequest) {
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

        // Fetch the pending project
        const pendingProject = await db.select().from(PendingProjects).where(eq(PendingProjects.id, parseInt(id)));

        if (pendingProject.length === 0) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const project = pendingProject[0];
        const studentIdsArray = project.studentIds.split(',').map(id => id.trim());

        // Generate SQL statements
        const sqlStatements = [];

        // 1. Insert into projects_students
        const publishedAtSQL = project.publishedAt 
            ? `'${project.publishedAt.toISOString()}'` 
            : 'NOW()';

        sqlStatements.push(
            `-- Project ID ${project.id}: ${project.title}`,
            `DO $$`,
            `DECLARE`,
            `  project_id INT;`,
            `BEGIN`,
            `  INSERT INTO projects_students (title, image, url_name, ada_project_id, github_repo_url, demo_url, published_at)`,
            `  VALUES (`,
            `    '${project.title.replace(/'/g, "''")}',`,
            `    '${project.image.replace(/'/g, "''")}',`,
            `    '${project.URLName.replace(/'/g, "''")}',`,
            `    ${project.adaProjectID || 'NULL'},`,
            `    '${project.githubRepoURL.replace(/'/g, "''")}',`,
            `    ${project.demoURL ? `'${project.demoURL.replace(/'/g, "''")}'` : 'NULL'},`,
            `    ${publishedAtSQL}`,
            `  )`,
            `  RETURNING id INTO project_id;`,
            ``
        );

        // 2. Insert into student_to_projects for each student
        studentIdsArray.forEach((studentId) => {
            sqlStatements.push(
                `  INSERT INTO student_to_projects (student_id, project_student_id)`,
                `  VALUES (${studentId}, project_id);`
            );
        });

        sqlStatements.push(
            `  `,
            `  -- Delete from pending_projects`,
            `  DELETE FROM pending_projects WHERE id = ${project.id};`,
            `END $$;`,
            ``
        );

        const sqlContent = sqlStatements.join('\n');

        // Append to the SQL file
        const sqlFilePath = join(process.cwd(), 'lib', 'db', 'migrations', '005_approved_projects.sql');
        
        try {
            // Append to file (or create if doesn't exist)
            const fs = require('fs');
            fs.appendFileSync(sqlFilePath, sqlContent + '\n\n');
            console.log(`[Pending Projects - APPROVE] Added project ${id} to SQL file`);
        } catch (error) {
            console.error('[Pending Projects - APPROVE] Error writing to file:', error);
            return NextResponse.json(
                { error: 'Failed to write SQL file' },
                { status: 500 }
            );
        }

        return NextResponse.json({ 
            success: true,
            message: 'Project approved and added to migration file'
        });
    } catch (error) {
        console.error('[Pending Projects - APPROVE] Error:', error);
        return NextResponse.json(
            { error: 'Failed to approve project' },
            { status: 500 }
        );
    }
}
