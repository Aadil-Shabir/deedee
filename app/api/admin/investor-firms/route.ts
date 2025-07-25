import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { InvestorSourceUtils } from "@/lib/investor-source-utils";

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

// Helper function to check if table exists and create it if needed
async function ensureTableExists(supabase: ReturnType<typeof createAdminClient>) {
    try {
        const { error } = await supabase.from("investor_firms").select("id").limit(1);

        if (error && error.code === "42P01") {
            console.log("⚠️ Table investor_firms doesn't exist, creating it now...");

            const createTableSQL = `
        CREATE TABLE IF NOT EXISTS public.investor_firms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          firm_name TEXT NOT NULL,
          website_url TEXT,
          linkedin_url TEXT,
          investor_type TEXT NOT NULL,
          hq_location TEXT NOT NULL,
          other_locations TEXT[],
          fund_size NUMERIC,
          stage_focus TEXT[],
          check_size_range TEXT,
          geographies_invested TEXT[],
          industries_invested TEXT[],
          sub_industries_invested TEXT[],
          portfolio_companies JSONB,
          investment_thesis_summary TEXT,
          thesis_industry_distribution JSONB,
          fund_vintage_year BIGINT,
          recent_exits TEXT[],
          activity_score BIGINT,
          source TEXT NOT NULL DEFAULT 'admin',
          created_by_id UUID,
          last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        
        CREATE INDEX IF NOT EXISTS idx_investor_firms_firm_name ON public.investor_firms(firm_name);
        CREATE INDEX IF NOT EXISTS idx_investor_firms_source ON public.investor_firms(source);
        CREATE INDEX IF NOT EXISTS idx_investor_firms_created_by_id ON public.investor_firms(created_by_id);
      `;

            const { error: createError } = await supabase.rpc("exec_sql", { sql: createTableSQL });

            if (createError) {
                console.error("❌ Failed to create table:", createError);
                throw new Error(`Failed to create investor_firms table: ${createError.message}`);
            }

            console.log("✅ Table investor_firms created successfully");
            return true;
        } else if (error) {
            console.error("❌ Error checking table:", error);
            throw error;
        }

        return true;
    } catch (error: any) {
        console.error("❌ Error ensuring table exists:", error);
        throw new Error(`Database setup error: ${error.message}. Please run the setup script first.`);
    }
}

export async function POST(request: NextRequest) {
    try {
        const { investors } = await request.json();

        if (!investors || !Array.isArray(investors) || investors.length === 0) {
            return NextResponse.json({ error: "No investor data provided" }, { status: 400 });
        }

        console.log("🚀 API: Starting save operation for", investors.length, "investors");

        const supabase = createAdminClient();

        // Ensure the table exists before proceeding
        try {
            await ensureTableExists(supabase);
        } catch (error: any) {
            return NextResponse.json(
                {
                    error: "Database setup required",
                    details: error.message,
                    setupRequired: true,
                },
                { status: 500 }
            );
        }

        // Analyze source distribution
        const sourceStats = investors.reduce((acc, inv) => {
            const source = inv.source || "admin";
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log("📊 Source distribution:", sourceStats);

        // First, check for duplicates in the database based on firm_name
        const firmNames = investors.map((inv) => inv.firm_name).filter(Boolean);

        if (firmNames.length === 0) {
            throw new Error("No valid firm names found in the data");
        }

        console.log("🔍 Checking for duplicate firm names:", firmNames.length, "firms");

        // Check for existing firm names in the database
        const { data: existingFirms, error: checkError } = await supabase
            .from("investor_firms")
            .select("firm_name")
            .in("firm_name", firmNames);

        if (checkError) {
            console.error("❌ Error checking for duplicates:", checkError);
            throw new Error(`Error checking for duplicates: ${checkError.message}`);
        }

        // If any duplicates found, throw an error
        if (existingFirms && existingFirms.length > 0) {
            const duplicateFirms = existingFirms.map((firm) => firm.firm_name);
            console.log("❌ Found duplicate firms:", duplicateFirms);
            throw new Error(
                `Cannot save investors. The following firm(s) already exist in the database: ${duplicateFirms.join(
                    ", "
                )}`
            );
        }

        console.log("✅ No duplicates found, proceeding with save operation");

        // Transform data to match the database schema
        const transformedInvestors = investors.map((investor) => {
            // Use utility function for type-safe source conversion
            const validSource = InvestorSourceUtils.toInvestorSource(investor.source);

            // For admin section, only allow 'admin' or 'ai' sources
            const finalSource = ["admin", "ai"].includes(validSource) ? validSource : "admin";

            if (finalSource !== validSource) {
                console.warn(`⚠️ Invalid source '${investor.source}' for admin section, defaulting to 'admin'`);
            }

            return {
                firm_name: investor.firm_name,
                website_url: investor.website_url,
                linkedin_url: investor.linkedin_url,
                investor_type: investor.investor_type,
                hq_location: investor.hq_location,
                other_locations: investor.other_locations,
                fund_size: investor.fund_size,
                stage_focus: investor.stage_focus,
                check_size_range: investor.check_size_range,
                geographies_invested: investor.geographies_invested,
                industries_invested: investor.industries_invested,
                sub_industries_invested: investor.sub_industries_invested,
                portfolio_companies: investor.portfolio_companies,
                investment_thesis_summary: investor.investment_thesis_summary,
                thesis_industry_distribution: investor.thesis_industry_distribution,
                fund_vintage_year: investor.fund_vintage_year,
                recent_exits: investor.recent_exits,
                activity_score: investor.activity_score,
                // Source tracking - each investor can have its own source
                source: finalSource,
                created_by_id: null, // For admin section, always null
                // last_updated_at will be set automatically by the database
            };
        });

        // Log final source distribution after validation
        const finalSourceStats = transformedInvestors.reduce(
            (acc, inv) => {
                acc[inv.source] = (acc[inv.source] || 0) + 1;
                return acc;
            },
            {} as Record<string, number> // Changed to Record<string, number>
        );

        console.log("📝 Final source distribution after validation:", finalSourceStats);

        // Insert all investors in a single batch operation
        const { data: savedInvestors, error: insertError } = await supabase
            .from("investor_firms")
            .insert(transformedInvestors)
            .select();

        if (insertError) {
            console.error("❌ Insert error:", insertError);
            throw new Error(`Failed to save investors: ${insertError.message}`);
        }

        console.log("✅ Successfully saved", savedInvestors?.length || 0, "investors to database");
        console.log("📊 Final breakdown:", finalSourceStats);

        return NextResponse.json({
            success: true,
            savedInvestors,
            sourceStats: finalSourceStats,
            message: `Successfully saved ${savedInvestors?.length || 0} investor firms with sources: ${Object.entries(
                finalSourceStats
            )
                .map(([source, count]) => `${InvestorSourceUtils.getSourceDescription(source)}: ${count}`)
                .join(", ")}`,
        });
    } catch (error: any) {
        console.error("❌ API Save operation failed:", error);
        return NextResponse.json(
            {
                error: "Save operation failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "25");
        const search = searchParams.get("search") || "";
        const sourceFilter = searchParams.get("source") || "";

        const supabase = createAdminClient();

        // Ensure the table exists before proceeding
        try {
            await ensureTableExists(supabase);
        } catch (error: any) {
            return NextResponse.json(
                {
                    error: "Database setup required",
                    details: error.message,
                    setupRequired: true,
                },
                { status: 500 }
            );
        }

        // Build the query
        let query = supabase.from("investor_firms").select("*");

        // Apply search filter
        if (search) {
            query = query.or(
                `firm_name.ilike.%${search}%,investor_type.ilike.%${search}%,hq_location.ilike.%${search}%`
            );
        }

        // Apply source filter
        if (sourceFilter && InvestorSourceUtils.isValidSource(sourceFilter)) {
            query = query.eq("source", sourceFilter);
        }

        // Get total count for pagination
        const { count } = await supabase.from("investor_firms").select("*", { count: "exact", head: true });

        // Apply pagination and sorting
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: firms, error } = await query.order("last_updated_at", { ascending: false }).range(from, to);

        if (error) {
            throw error;
        }

        return NextResponse.json({
            firms: firms || [],
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
        });
    } catch (error: any) {
        console.error("❌ API Get operation failed:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch investor firms",
                details: error.message,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { firmIds } = await request.json();

        if (!firmIds || !Array.isArray(firmIds) || firmIds.length === 0) {
            return NextResponse.json({ error: "No firm IDs provided" }, { status: 400 });
        }

        console.log(`🗑️ Starting bulk delete for ${firmIds.length} firms:`, firmIds);

        const supabase = createAdminClient();

        // Ensure the table exists before proceeding
        try {
            await ensureTableExists(supabase);
        } catch (error: any) {
            return NextResponse.json(
                {
                    error: "Database setup required",
                    details: error.message,
                    setupRequired: true,
                },
                { status: 500 }
            );
        }

        // Delete firms by IDs
        const { error: deleteError } = await supabase.from("investor_firms").delete().in("id", firmIds);

        if (deleteError) {
            console.error("❌ Delete error:", deleteError);
            throw new Error(`Failed to delete firms: ${deleteError.message}`);
        }

        console.log(`✅ Successfully deleted ${firmIds.length} firms`);

        return NextResponse.json({
            success: true,
            deletedCount: firmIds.length,
            message: `Successfully deleted ${firmIds.length} investor firm${firmIds.length !== 1 ? "s" : ""}`,
        });
    } catch (error: any) {
        console.error("❌ Bulk delete operation failed:", error);
        return NextResponse.json(
            {
                error: "Bulk delete operation failed",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
