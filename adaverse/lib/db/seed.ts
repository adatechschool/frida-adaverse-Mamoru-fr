import db from "./index";
import { readFileSync } from "fs";
import { join } from "path";
import { sql } from "drizzle-orm";

async function runSeed(filePath : string) {
    const sqlContent = readFileSync(join(__dirname, 'migrations', filePath), "utf-8");
    await db.execute(sql.raw(sqlContent));
    console.log(`✅ Seed ${filePath} executed successfully!`);
}

async function seed() {
    console.log('🗑️  Clearing existing data...');
    // Delete in correct order (children first, then parents)
    await db.execute(sql`TRUNCATE TABLE students, ada_promotions, ada_projects RESTART IDENTITY CASCADE`);
    console.log('✅ Tables cleared');
    
    await runSeed('001_seed_promotions.sql');
    await runSeed('002_seed_ada_projects.sql');
    await runSeed('003_seed_students.sql');
    console.log('✅ All seeds executed successfully!');
}

seed().catch(console.error);