import { type NextRequest, NextResponse } from "next/server";
import { enrichmentService, type EnrichmentData } from "@/lib/services/investor-enrichment-service";

// GET - Get items that need enrichment
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type") || "firms";
        const limit = Number.parseInt(searchParams.get("limit") || "10");

        let data;
        if (type === "firms") {
            data = await enrichmentService.getFirmsNeedingEnrichment(limit);
        } else if (type === "contacts") {
            data = await enrichmentService.getContactsNeedingEnrichment(limit);
        } else {
            return NextResponse.json({ error: "Invalid type. Use 'firms' or 'contacts'" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data,
            count: data.length,
        });
    } catch (error: any) {
        console.error("❌ Enrichment GET API Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to fetch enrichment data",
            },
            { status: 500 }
        );
    }
}

// POST - Update enriched data
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, id, data }: { type: "firm" | "contact"; id: string; data: EnrichmentData } = body;

        if (!type || !id || !data) {
            return NextResponse.json({ error: "Missing required fields: type, id, data" }, { status: 400 });
        }

        if (type === "firm" && data.firmData) {
            await enrichmentService.enrichFirmData(id, data.firmData);
        } else if (type === "contact" && data.contactData) {
            await enrichmentService.enrichContactData(id, data.contactData);
        } else {
            return NextResponse.json({ error: "Invalid type or missing data" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: `${type} enriched successfully`,
        });
    } catch (error: any) {
        console.error("❌ Enrichment POST API Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to enrich data",
            },
            { status: 500 }
        );
    }
}

// PUT - Batch enrich multiple items
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { items }: { items: Array<{ type: "firm" | "contact"; id: string; data: any }> } = body;

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ error: "Missing or invalid items array" }, { status: 400 });
        }

        const jobIds = await enrichmentService.batchEnrich(items);

        return NextResponse.json({
            success: true,
            message: `Batch enrichment started for ${items.length} items`,
            jobIds,
        });
    } catch (error: any) {
        console.error("❌ Batch Enrichment API Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to start batch enrichment",
            },
            { status: 500 }
        );
    }
}
