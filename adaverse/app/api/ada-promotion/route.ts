import db from "@/lib/db";
import {adaPromotions} from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/apiAuth";
// import { normalizeText } from "@/utils/normalizeText";
// import { normalizeDate } from "@/utils/normalizeDate";

// GET /api/ada-year-group - Fetch all year groups
export async function GET(request: NextRequest) {
    // Authenticate the request
    const authResult = authenticateRequest(request);
    if (authResult.error) return authResult.response;
    
    console.log('[Ada Promotions - GET] Fetching all Ada year groups');
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    };
    
    const promotions = await db.select().from(adaPromotions).orderBy(adaPromotions.startDate);
    
    console.log(`[Ada Promotions - GET] Retrieved ${promotions.length} year group(s)`);
    
    return NextResponse.json(promotions, { headers });
};

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
};

// // POST /api/ada-promotions - Create a new promotion
// export async function POST(request: Request) {
//     // Parse the request body to get promotion name
//     const { promotionName, startDate } = await request.json();
    
//     console.log(`[Ada Promotions - POST] Creating new promotion: "${promotionName}" starting on ${startDate}`);

//     // Normalize the input project name (lowercase, remove accents, trim)
//     const normalizedInput = normalizeText(promotionName);

//     // Check if a project with the same name already exists (case-insensitive, accent-insensitive)
//     const allPromotions = await db.select().from(adaPromotions);
//     const existingNamePromotions = allPromotions.find(
//         promotions => normalizeText(promotions.promotionName) === normalizedInput
// );

//     if (existingNamePromotions) {
//         console.log(`[Ada Promotions - POST] Promotion "${promotionName}" already exists (normalized match with "${existingNamePromotions.promotionName}")`);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `Promotion '${promotionName}' already exists.`,
//             },
//             { status: 409 } // 409 Conflict status code
//         );
//     }

//     const existingStartDatePromotions = allPromotions.find(
//         promotions => normalizeDate(promotions.startDate) === normalizeDate(startDate)
//     );

//     if (existingStartDatePromotions) {
//         console.log(`[Ada Promotions - POST] A promotion with start date "${startDate}" already exists: "${existingStartDatePromotions.promotionName}"`);
//         return NextResponse.json(
//             {
//                 success: false,
//                 message: `A promotion with start date '${startDate}' already exists.`,
//             },
//             { status: 409 } // 409 Conflict status code
//         );
//     }

//     // Insert the new project into the database (normalize date to ensure consistent format)
//     const newPromotion = await db.insert(adaPromotions).values({
//         promotionName: promotionName, 
//         startDate: normalizeDate(startDate),
//     });
    
//     console.log(`[Ada Promotions - POST] Successfully created promotion: "${promotionName}"`);
//     return NextResponse.json({
//         success: true,
//         promotion: {
//             promotionName : promotionName,
//             startDate: normalizeDate(startDate)
//         },
//         message: `Promotion '${promotionName}' starting on ${startDate} has been created.`,
//     });
// }