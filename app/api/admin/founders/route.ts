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
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";

        const supabase = createAdminClient();

        // Build query to get founders with their company information
        let query = supabase.from("profiles").select(`
        id,
        first_name,
        last_name,
        email,
        company_function,
        companies!companies_owner_id_fkey (
          id,
          company_name
        )
      `);

        // Apply search filter if provided
        if (search) {
            query = query.or(
                `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_function.ilike.%${search}%`
            );
        }

        // Order by first name alphabetically
        const { data: founders, error } = await query.order("first_name", { ascending: true });

        if (error) {
            console.error("❌ Error fetching founders:", error);
            throw error;
        }

        // Transform the data to include company name directly
        const transformedFounders =
            founders?.map((founder) => {
                // Handle the case where companies might be an array or a single object
                const company = Array.isArray(founder.companies) ? founder.companies[0] : founder.companies;

                return {
                    id: founder.id,
                    first_name: founder.first_name,
                    last_name: founder.last_name,
                    email: founder.email,
                    company_function: founder.company_function,
                    company_name: company?.company_name || null,
                    company_id: company?.id || null,
                };
            }) || [];

        console.log(`✅ Fetched ${transformedFounders.length} founders`);

        return NextResponse.json({
            founders: transformedFounders,
            total: transformedFounders.length,
        });
    } catch (error: any) {
        console.error("❌ API Get founders operation failed:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch founders",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
