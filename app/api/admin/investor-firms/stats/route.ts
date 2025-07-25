import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side admin client with service key
function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient();

        console.log("📊 Fetching investor firms statistics...");

        // 1. Get total firms count
        const { count: totalCount, error: totalError } = await supabase
            .from("investor_firms")
            .select("*", { count: "exact", head: true });

        if (totalError) {
            console.error("Error fetching total count:", totalError);
            throw new Error(`Failed to fetch total firms: ${totalError.message}`);
        }

        // 2. Get counts by source
        const { data: sourceData, error: sourceError } = await supabase.from("investor_firms").select("source");

        if (sourceError) {
            console.error("Error fetching source data:", sourceError);
            throw new Error(`Failed to fetch source data: ${sourceError.message}`);
        }

        // Count by source
        const sourceCounts =
            sourceData?.reduce((acc: Record<string, number>, firm) => {
                const source = firm.source || "admin";
                acc[source] = (acc[source] || 0) + 1;
                return acc;
            }, {}) || {};

        // 3. Get recent growth (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count: recentCount, error: recentError } = await supabase
            .from("investor_firms")
            .select("*", { count: "exact", head: true })
            .gte("last_updated_at", thirtyDaysAgo.toISOString());

        if (recentError) {
            console.error("Error fetching recent count:", recentError);
        }

        // 4. Get top investor types
        const { data: typeData, error: typeError } = await supabase
            .from("investor_firms")
            .select("investor_type")
            .not("investor_type", "is", null);

        if (typeError) {
            console.error("Error fetching type data:", typeError);
        }

        // 5. Get top locations
        const { data: locationData, error: locationError } = await supabase
            .from("investor_firms")
            .select("hq_location")
            .not("hq_location", "is", null);

        if (locationError) {
            console.error("Error fetching location data:", locationError);
        }

        // Process type data
        const typeStats = typeData?.reduce((acc: Record<string, number>, firm) => {
            if (firm.investor_type) {
                acc[firm.investor_type] = (acc[firm.investor_type] || 0) + 1;
            }
            return acc;
        }, {});

        const topTypes = Object.entries(typeStats || {})
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([type, count]) => ({ type, count }));

        // Process location data
        const locationStats = locationData?.reduce((acc: Record<string, number>, firm) => {
            if (firm.hq_location) {
                acc[firm.hq_location] = (acc[firm.hq_location] || 0) + 1;
            }
            return acc;
        }, {});

        const topLocations = Object.entries(locationStats || {})
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([location, count]) => ({ location, count }));

        const stats = {
            total: totalCount || 0,
            adminUploaded: sourceCounts.admin || 0,
            foundersAdded: sourceCounts.founder || 0,
            selfRegistered: sourceCounts.investor || 0,
            aiAdded: sourceCounts.ai || 0,
            insights: {
                topTypes,
                topLocations,
                recentGrowth: recentCount || 0,
            },
        };

        console.log("📊 Investor firms statistics calculated:");
        console.log(`   - Total: ${stats.total}`);
        console.log(`   - Admin Uploaded: ${stats.adminUploaded}`);
        console.log(`   - Founders Added: ${stats.foundersAdded}`);
        console.log(`   - Self Registered: ${stats.selfRegistered}`);
        console.log(`   - AI Added: ${stats.aiAdded}`);
        console.log(`   - Recent Growth: ${stats.insights.recentGrowth}`);

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("❌ Investor Firms Stats API Error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch investor firms statistics",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
