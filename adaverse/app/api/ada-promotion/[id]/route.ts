import {NextRequest, NextResponse} from "next/server";
import db from "@/lib/db";
import {adaPromotions} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

// // GET /api/ada-project/[id] - Fetch a single project by ID
export async function GET(
    req: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    // Extract the project ID from route parameters
    const {id} = await params;
    const promotionId = Number(id);
    
    console.log(`[Ada Promotion - GET] Fetching promotion with ID: ${promotionId}`);

    // Query the database for the specific project
    const promotionData = await db.select().from(adaPromotions).where(eq(adaPromotions.id, promotionId));
    
    console.log(`[Ada Promotion - GET] Found ${promotionData.length} promotion(s)`);

    return NextResponse.json(promotionData);
}

// // DELETE /api/ada-project/[id] - Delete a project by ID
// export async function DELETE(
//     req: NextRequest,
//     {params}: {params: Promise<{id: string}>}
// ) {
//     // Extract the project ID from route parameters
//     const {id} = await params;
//     const promotionId = Number(id);
    
//     console.log(`[Ada Promotion - DELETE] Attempting to delete promotion with ID: ${promotionId}`);
//     // Execute the delete operation
//     const deletedPromotion = await db.delete(adaPromotions).where(eq(adaPromotions.id, promotionId));
    
//     console.log(`[Ada Promotion - DELETE] Successfully deleted promotion ${promotionId}`);
//     return NextResponse.json({
//         success: true,
//         delete: deletedPromotion.rows,
//         message: `Promotion with ID ${promotionId} has been deleted.`,
//     });
// }