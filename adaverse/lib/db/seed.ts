import db from "./index";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { sql } from "drizzle-orm";
import { Projects, StudentToProjects } from "./schema";

async function runSeed(filePath : string) {
    const sqlContent = readFileSync(join(__dirname, 'migrations', filePath), "utf-8");
    await db.execute(sql.raw(sqlContent));
    console.log(`✅ Seed ${filePath} executed successfully!`);
}

async function backupDataToJson() {
    console.log('💾 Backing up data to JSON...');

    // Récupérer les données des tables
    const projectsBackup = await db.execute(sql`SELECT * FROM projects_students`);
    const studentToProjectsBackup = await db.execute(sql`SELECT * FROM student_to_projects`);

    // Créer un objet pour le backup
    const backupData = {
        projects_students: projectsBackup.rows,
        student_to_projects: studentToProjectsBackup.rows,
        timestamp: new Date().toISOString(),
    };

    // Générer un nom de fichier avec la date
    const backupFileName = `backup_${new Date().toISOString().split('T')[0]}.json`;
    const backupPath = join(__dirname, 'backups', backupFileName);

    // Écrire le fichier JSON
    writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Backup saved to ${backupFileName}`);
}

async function seed() {
    console.log('🗑️  Clearing existing data...');
    
    // Backup projects_students and student_to_projects data
    console.log('📦 Backing up project data...');
    await backupDataToJson();
    const projectsBackup = await db.execute(sql`SELECT * FROM projects_students`);
    const studentToProjectsBackup = await db.execute(sql`SELECT * FROM student_to_projects`);
    
    // Truncate base tables (this will CASCADE and clear student_to_projects)
    await db.execute(sql`TRUNCATE TABLE students RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE ada_promotions RESTART IDENTITY CASCADE`);
    await db.execute(sql`TRUNCATE TABLE ada_projects RESTART IDENTITY CASCADE`);
    
    console.log('✅ Base tables cleared');
    
    // Re-seed base tables
    await runSeed('001_seed_promotions.sql');
    await runSeed('002_seed_ada_projects.sql');
    await runSeed('003_seed_students.sql');
    
    // Restore projects_students
    console.log('♻️  Restoring project data...');
    const backupData = JSON.parse(readFileSync(join(__dirname, 'backups', `backup_${new Date().toISOString().split('T')[0]}.json`), 'utf-8'));

    for (const row of backupData.projects_students) {
        await db.insert(Projects).values({
            id: row.id as number,
            title: row.title as string,
            image: row.image as string,
            URLName: row.url_name as string,
            adaProjectID: row.ada_project_id as number,
            githubRepoURL: row.github_repo_url as string,
            demoURL: row.demo_url as string | null,
            createdAt: row.created_at ? new Date(row.created_at as string) : undefined,
            publishedAt: row.published_at ? new Date(row.published_at as string) : null,
        });
    }
    
    // Restore student_to_projects (only for students that still exist)
    for (const row of backupData.student_to_projects) {
        try {
            await db.insert(StudentToProjects).values({
                id: row.id as number,
                studentId: row.student_id as number,
                projectStudentId: row.project_student_id as number,
            });
        } catch (error) {
            console.log(`⚠️  Skipped orphaned link: student ${row.student_id} no longer exists`);
        }
    }
    
    // Reset the sequences for the restored tables
    await db.execute(sql`SELECT setval('projects_students_id_seq', (SELECT MAX(id) FROM projects_students))`);
    await db.execute(sql`SELECT setval('student_to_projects_id_seq', (SELECT MAX(id) FROM student_to_projects))`);
    
    console.log('✅ All seeds executed successfully!');
}

seed().catch(console.error);