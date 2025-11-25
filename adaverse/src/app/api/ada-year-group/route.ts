import db from "@/src/lib/db";
import {adaYearGroups} from "@/src/lib/db/schema";
import { NextResponse } from "next/server";
import { normalizeText } from "@/src/utils/normalizeText";
import { normalizeDate } from "@/src/utils/normalizeDate";

// GET /api/ada-project - Fetch all projects
export async function GET() {
    console.log('[Ada Year Group - GET] Fetching all Ada year groups');
    
    const yearGroups = await db.select().from(adaYearGroups).orderBy(adaYearGroups.startDate);
    
    console.log(`[Ada Year Group - GET] Retrieved ${yearGroups.length} year group(s)`);
    
    return NextResponse.json(yearGroups);
};

// POST /api/ada-project - Create a new project
export async function POST(request: Request) {
    // Parse the request body to get project name
    const { yearGroupName, startDate } = await request.json();
    
    console.log(`[Ada Year Group - POST] Creating new year group: "${yearGroupName}" starting on ${startDate}`);

    // Normalize the input project name (lowercase, remove accents, trim)
    const normalizedInput = normalizeText(yearGroupName);

    // Check if a project with the same name already exists (case-insensitive, accent-insensitive)
    const allYearGroups = await db.select().from(adaYearGroups);
    const existingNameYearGroup = allYearGroups.find(
        yearGroup => normalizeText(yearGroup.yearGroupName) === normalizedInput
    );

    if (existingNameYearGroup) {
        console.log(`[Ada Year Group - POST] Year group "${yearGroupName}" already exists (normalized match with "${existingNameYearGroup.yearGroupName}")`);
        return NextResponse.json(
            {
                success: false,
                message: `Year group '${yearGroupName}' already exists.`,
            },
            { status: 409 } // 409 Conflict status code
        );
    }

    const existingStartDateYearGroup = allYearGroups.find(
        yearGroup => normalizeDate(yearGroup.startDate) === normalizeDate(startDate)
    );

    if (existingStartDateYearGroup) {
        console.log(`[Ada Year Group - POST] A year group with start date "${startDate}" already exists: "${existingStartDateYearGroup.yearGroupName}"`);
        return NextResponse.json(
            {
                success: false,
                message: `A year group with start date '${startDate}' already exists.`,
            },
            { status: 409 } // 409 Conflict status code
        );
    }

    // Insert the new project into the database (normalize date to ensure consistent format)
    const newYearGroup = await db.insert(adaYearGroups).values({
        yearGroupName, 
        startDate: normalizeDate(startDate),
    });
    
    console.log(`[Ada Year Group - POST] Successfully created year group: "${yearGroupName}"`);
    return NextResponse.json({
        success: true,
        yearGroup: {
            yearGroupName : yearGroupName,
            startDate: normalizeDate(startDate)
        },
        message: `Year group '${yearGroupName}' starting on ${startDate} has been created.`,
    });
}