import db from "@/lib/db";
import {adaPromotions} from "@/lib/db/schema";
import { NextResponse } from "next/server";
// import { normalizeText } from "@/utils/normalizeText";
// import { normalizeDate } from "@/utils/normalizeDate";

// GET /api/ada-year-group - Fetch all year groups
export async function GET() {
    console.log('[Ada Year Group - GET] Fetching all Ada year groups');
    
    const yearGroups = await db.select().from(adaPromotions).orderBy(adaPromotions.startDate);
    
    console.log(`[Ada Year Group - GET] Retrieved ${yearGroups.length} year group(s)`);
    
    return NextResponse.json(yearGroups);
};

// // POST /api/ada-project - Create a new project
// export async function POST(request: Request) {
//     // Parse the request body to get project name
//     const { promotionName, startDate } = await request.json();
    
//     console.log(`[Ada Year Group - POST] Creating new year group: "${promotionName}" starting on ${startDate}`);

//     // Normalize the input project name (lowercase, remove accents, trim)
//     const normalizedInput = normalizeText(promotionName);

//     // Check if a project with the same name already exists (case-insensitive, accent-insensitive)
//     const allYearGroups = await db.select().from(adaPromotions);
//     const existingNamePromotions = allYearGroups.find(
//         promotions => normalizeText(promotions.promotionName) === normalizedInput
//     );

//     if (existingNamePromotions) {
//         console.log(`[Ada Year Group - POST] Year group "${promotionName}" already exists (normalized match with "${existingNamePromotions.promotionName}")`);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `Year group '${promotionName}' already exists.`,
//             },
//             { status: 409 } // 409 Conflict status code
//         );
//     }

//     const existingStartDatePromotions = allYearGroups.find(
//         promotions => normalizeDate(promotions.startDate) === normalizeDate(startDate)
//     );

//     if (existingStartDatePromotions) {
//         console.log(`[Ada Year Group - POST] A year group with start date "${startDate}" already exists: "${existingStartDatePromotions.promotionName}"`);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `A year group with start date '${startDate}' already exists.`,
//             },
//             { status: 409 } // 409 Conflict status code
//         );
//     }

//     // Insert the new project into the database (normalize date to ensure consistent format)
//     const newYearGroup = await db.insert(adaPromotions).values({
//         promotionName: promotionName, 
//         startDate: normalizeDate(startDate),
//     });
    
//     console.log(`[Ada Year Group - POST] Successfully created year group: "${promotionName}"`);
//     return NextResponse.json({
//         success: true,
//         yearGroup: {
//             yearGroupName : promotionName,
//             startDate: normalizeDate(startDate)
//         },
//         message: `Year group '${promotionName}' starting on ${startDate} has been created.`,
//     });
// }