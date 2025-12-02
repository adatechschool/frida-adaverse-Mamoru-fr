/**
 * CLI Script to Import Projects from CSV
 * Usage: npm run import-csv
 * 
 * This script parses a CSV file and adds projects to the pending_projects table
 * Following the same workflow as AddProjectModal
 */

import db from './index';
import { PendingProjects, Projects, adaProjects, Students, adaPromotions } from './schema';
import { readFileSync } from 'fs';
import { generateURLName } from '../../utils/generateURLName';
import { normalizeText } from '../../utils/normalizeText';

interface CSVRow {
    promotion: string;
    participants: string;
    category: string;
    title: string;
    githubUrl: string;
    demoUrl: string;
    hasThumbnail: string;
}

async function parseCSV(filepath: string): Promise<CSVRow[]> {
    const content = readFileSync(filepath, 'utf-8');
    const lines = content.split('\n');
    
    // Find the header row (starts with "Promotion")
    let headerIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Promotion,Participants')) {
            headerIndex = i;
            break;
        }
    }
    
    if (headerIndex === -1) {
        throw new Error('Header row not found in CSV');
    }
    
    const rows: CSVRow[] = [];
    
    // Parse data rows (skip header)
    for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith(',,,')) continue; // Skip empty rows
        
        // Parse CSV with proper handling of quoted fields
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                parts.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        parts.push(current.trim()); // Add last field
        
        if (parts.length < 7) continue;
        
        const promotion = parts[0];
        const participants = parts[1];
        const category = parts[2];
        const title = parts[3];
        const githubUrl = parts[4];
        const demoUrl = parts[5];
        const hasThumbnail = parts[6];
        
        // Skip rows with missing required fields
        if (!title || !githubUrl || !participants || !category) continue;
        
        rows.push({
            promotion,
            participants,
            category,
            title,
            githubUrl,
            demoUrl,
            hasThumbnail
        });
    }
    
    return rows;
}

async function importCSV(csvPath: string) {
    console.log('\n📂 CSV Import Script\n');
    
    try {
        // Parse CSV
        console.log('📋 Parsing CSV file...');
        const rows = await parseCSV(csvPath);
        console.log(`✅ Found ${rows.length} project(s) to import\n`);
        
        if (rows.length === 0) {
            console.log('ℹ️  No valid projects found in CSV');
            return;
        }
        
        // Fetch existing data
        const existingProjects = await db.select().from(Projects);
        const existingPending = await db.select().from(PendingProjects);
        const allAdaProjects = await db.select().from(adaProjects);
        const allStudents = await db.select().from(Students);
        const allPromotions = await db.select().from(adaPromotions);
        
        const allURLNames = [
            ...existingProjects.map(p => p.URLName),
            ...existingPending.map(p => p.URLName)
        ];
        
        let successCount = 0;
        let skipCount = 0;
        
        // Process each row
        for (const row of rows) {
            console.log(`\n🔄 Processing: "${row.title}"`);
            
            // 1. Check if a project with this GitHub URL already exists
            const projectWithSameGitHub = existingProjects.find(p => p.githubRepoURL === row.githubUrl);
            const pendingWithSameGitHub = existingPending.find(p => p.githubRepoURL === row.githubUrl);
            
            if (projectWithSameGitHub || pendingWithSameGitHub) {
                console.log(`   ⚠️  Project with GitHub URL "${row.githubUrl}" already exists, skipping`);
                skipCount++;
                continue;
            }
            
            // 2. Find Ada Project ID with better matching
            let adaProjectID: number | null = null;
            if (row.category) {
                const normalizedCategory = normalizeText(row.category);
                
                // Try exact match first
                let matchingProject = allAdaProjects.find(p => 
                    normalizeText(p.projectName) === normalizedCategory
                );
                
                // If no exact match, try fuzzy matching
                if (!matchingProject) {
                    // Common category variations mapping
                    const categoryMap: { [key: string]: string } = {
                        'checkevents': 'adacheck',
                        'checkevent': 'adacheck',
                        'adacheckevent': 'adacheck',
                        'quizz': 'adaquiz',
                        'quiz': 'adaquiz',
                        'projets libres': 'projet libre',
                        'projet libres': 'projet libre',
                        'projets libre': 'projet libre',
                        'dataviz': 'adatech dataviz',
                        'data viz': 'adatech dataviz',
                    };
                    
                    const mappedCategory = categoryMap[normalizedCategory];
                    if (mappedCategory) {
                        matchingProject = allAdaProjects.find(p => 
                            normalizeText(p.projectName).includes(mappedCategory) ||
                            mappedCategory.includes(normalizeText(p.projectName))
                        );
                    }
                    
                    // Last resort: partial match
                    if (!matchingProject) {
                        matchingProject = allAdaProjects.find(p => 
                            normalizeText(p.projectName).includes(normalizedCategory) ||
                            normalizedCategory.includes(normalizeText(p.projectName))
                        );
                    }
                }
                
                if (matchingProject) {
                    adaProjectID = matchingProject.id;
                    console.log(`   ✅ Matched category "${row.category}" → ${matchingProject.projectName} (ID ${adaProjectID})`);
                } else {
                    console.log(`   ⚠️  Category "${row.category}" not found, using "Projet Libre"`);
                    adaProjectID = 1; // Projet Libre
                }
            }
            
            // 3. Find student IDs from participants using normalized text
            const participantNames = row.participants.split(',').map(n => n.trim());
            const studentIds: number[] = [];
            
            for (const name of participantNames) {
                const normalizedName = normalizeText(name);
                const student = allStudents.find(s => 
                    normalizeText(s.name).includes(normalizedName) ||
                    normalizedName.includes(normalizeText(s.name))
                );
                
                if (student) {
                    studentIds.push(student.id);
                    console.log(`   ✅ Found student: ${student.name} (ID: ${student.id})`);
                } else {
                    console.log(`   ⚠️  Student "${name}" not found, skipping`);
                }
            }
            
            if (studentIds.length === 0) {
                console.log(`   ❌ No matching students found, skipping project`);
                skipCount++;
                continue;
            }
            
            // 4. Generate unique URLName
            let URLName = generateURLName(row.title);
            if (allURLNames.includes(URLName)) {
                let counter = 1;
                let newURLName = `${URLName}-${counter}`;
                while (allURLNames.includes(newURLName)) {
                    counter++;
                    newURLName = `${URLName}-${counter}`;
                }
                URLName = newURLName;
                console.log(`   ✅ Generated unique URLName: ${URLName}`);
            } else {
                console.log(`   ✅ URLName: ${URLName}`);
            }
            
            // 5. Build image URL and test if it exists
            let imageUrl = '';
            const thumbnailUrl = `${row.githubUrl}/blob/main/thumbnail.png?raw=true`;
            
            try {
                const response = await fetch(thumbnailUrl, { method: 'HEAD' });
                if (response.ok) {
                    imageUrl = thumbnailUrl;
                    console.log(`   ✅ Image URL: ${imageUrl}`);
                } else {
                    console.log(`   ⚠️  No thumbnail found at ${thumbnailUrl}`);
                }
            } catch (error) {
                console.log(`   ⚠️  Could not verify thumbnail URL`);
            }
            
            // 6. Insert into pending_projects
            try {
                await db.insert(PendingProjects).values({
                    title: row.title,
                    image: imageUrl,
                    URLName,
                    adaProjectID,
                    githubRepoURL: row.githubUrl,
                    demoURL: row.demoUrl || null,
                    studentIds: studentIds.join(', '),
                    publishedAt: null,
                });
                
                allURLNames.push(URLName); // Add to prevent duplicates
                successCount++;
                console.log(`   ✅ Added to pending_projects`);
            } catch (error) {
                console.error(`   ❌ Error inserting project:`, error);
                skipCount++;
            }
        }
        
        console.log(`\n\n✨ Import Summary:`);
        console.log(`   ✅ Successfully imported: ${successCount} project(s)`);
        console.log(`   ⚠️  Skipped: ${skipCount} project(s)`);
        console.log(`\n📋 Projects are now in pending_projects table awaiting approval!`);
        
    } catch (error) {
        console.error('\n❌ Error:', error);
        process.exit(1);
    }
}

// Get CSV path from command line argument
const csvPath = process.argv[2];

if (!csvPath) {
    console.error('❌ Please provide CSV file path');
    console.log('Usage: npm run import-csv <path-to-csv-file>');
    process.exit(1);
}

importCSV(csvPath)
    .then(() => {
        console.log('\n✨ Script completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Fatal error:', error);
        process.exit(1);
    });
