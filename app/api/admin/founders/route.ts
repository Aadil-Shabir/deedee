import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Define types for the data structure
interface Company {
    id: string;
    company_name: string;
}

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company_function: string;
    companies: Company | Company[] | null;
}

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
        console.log("🔄 Starting to fetch founders...");

        const supabase = createAdminClient();

        // Fetch profiles with their associated companies
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select(
                `
        id,
        first_name,
        last_name,
        email,
        company_function,
        companies!owner_id (
          id,
          company_name
        )
      `
            )
            .order("first_name", { ascending: true });

        if (profilesError) {
            console.error("❌ Error fetching profiles:", profilesError);
            throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
        }

        console.log(`📥 Fetched ${profiles?.length || 0} profiles`);

        // Transform the data to include company information
        const founders =
            (profiles as Profile[])?.map((profile) => {
                // Handle the companies relationship - it could be an array, single object, or null
                let companyName: string | null = null;
                let companyId: string | null = null;

                if (profile.companies) {
                    if (Array.isArray(profile.companies)) {
                        // If it's an array, take the first company
                        const firstCompany = profile.companies[0];
                        if (firstCompany) {
                            companyName = firstCompany.company_name;
                            companyId = firstCompany.id;
                        }
                    } else {
                        // If it's a single object
                        companyName = profile.companies.company_name;
                        companyId = profile.companies.id;
                    }
                }

                return {
                    id: profile.id,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    company_function: profile.company_function,
                    company_name: companyName,
                    company_id: companyId,
                };
            }) || [];

        console.log(`✅ Processed ${founders.length} founders with company data`);

        return NextResponse.json({
            success: true,
            founders,
            total: founders.length,
        });
    } catch (error: any) {
        console.error("❌ API Fetch founders operation failed:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch founders",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
