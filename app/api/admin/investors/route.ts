import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

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

        // Parse query parameters
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "25");
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";
        const source = searchParams.get("source") || "";
        const country = searchParams.get("country") || "";
        const sort = searchParams.get("sort") || "created_at";
        const direction = searchParams.get("direction") || "desc";

        const supabase = createAdminClient();

        // Build the query
        let query = supabase.from("investor_profiles").select(`
        id,
        email,
        first_name,
        last_name,
        company_name,
        company_url,
        country,
        city,
        investor_category,
        investment_preference,
        data_source,
        created_by_admin,
        introducer_name,
        introducer_email,
        created_at,
        investor_stages(stage),
        investor_sectors(sector),
        investor_locations(location),
        investor_industries(industry)
      `);

        // Apply filters
        if (search) {
            query = query.or(
                `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,company_name.ilike.%${search}%`
            );
        }

        if (category) {
            query = query.eq("investor_category", category);
        }

        if (source === "admin_import") {
            query = query.eq("created_by_admin", true);
        } else if (source === "user_registration") {
            query = query.eq("created_by_admin", false);
        }

        if (country) {
            query = query.eq("country", country);
        }

        // Apply sorting
        const sortColumn =
            sort === "name"
                ? "first_name"
                : sort === "company"
                ? "company_name"
                : sort === "category"
                ? "investor_category"
                : sort === "data_source"
                ? "created_by_admin"
                : sort;

        query = query.order(sortColumn, { ascending: direction === "asc" });

        // Get total count for pagination
        const { count } = await supabase.from("investor_profiles").select("*", { count: "exact", head: true });

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: investors, error } = await query.range(from, to);

        if (error) {
            throw error;
        }

        // Transform the data to flatten the related arrays
        const transformedInvestors =
            investors?.map((investor) => ({
                ...investor,
                stages: investor.investor_stages?.map((s: any) => s.stage) || [],
                sectors: investor.investor_sectors?.map((s: any) => s.sector) || [],
                locations: investor.investor_locations?.map((l: any) => l.location) || [],
                industries: investor.investor_industries?.map((i: any) => i.industry) || [],
            })) || [];

        // Remove the nested objects since we've flattened them
        const cleanedInvestors = transformedInvestors.map((investor) => {
            const { investor_stages, investor_sectors, investor_locations, investor_industries, ...rest } = investor;
            return rest;
        });

        return NextResponse.json({
            investors: cleanedInvestors,
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch investors", details: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { investors, action } = await request.json();

        if (action === "checkDuplicates") {
            return await checkDuplicates(investors);
        }

        if (action === "saveInvestors") {
            return await saveInvestors(investors);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}

async function checkDuplicates(emails: string[]) {
    try {
        const supabase = createAdminClient();
        const { data: existingInvestors, error } = await supabase
            .from("investor_profiles")
            .select("email")
            .in("email", emails);

        if (error) throw error;

        return NextResponse.json({
            duplicates: existingInvestors?.map((inv) => inv.email) || [],
        });
    } catch (err) {
        console.error("Error checking duplicates:", err);
        return NextResponse.json({ error: "Failed to check duplicates" }, { status: 500 });
    }
}

async function saveInvestors(investors: any[]) {
    console.log("API: Saving investors data:", investors.length);

    try {
        const supabase = createAdminClient();

        // First, check for duplicates in the database
        const emailsToCheck = investors.map((inv) => inv.PrimaryContactEmail).filter(Boolean);

        if (emailsToCheck.length === 0) {
            throw new Error("No valid email addresses found in the data");
        }

        // Check for existing emails in the database
        const { data: existingInvestors, error: checkError } = await supabase
            .from("investor_profiles")
            .select("email")
            .in("email", emailsToCheck);

        if (checkError) {
            throw new Error(`Error checking for duplicates: ${checkError.message}`);
        }

        // If any duplicates found, throw an error
        if (existingInvestors && existingInvestors.length > 0) {
            const duplicateEmails = existingInvestors.map((inv) => inv.email);
            throw new Error(
                `Cannot save investors. The following email address(es) already exist in the database: ${duplicateEmails.join(
                    ", "
                )}`
            );
        }

        // If no duplicates, proceed with saving
        const savedInvestors = [];
        const errors = [];

        for (const inv of investors) {
            let investorId: string | null = null;
            let savedProfile: any = null;

            try {
                // Generate a unique ID for admin-added investors
                investorId = uuidv4();

                // Create a comprehensive about section
                const aboutParts = [];
                if (inv.PrimaryContactFunction) aboutParts.push(`${inv.PrimaryContactFunction}`);
                if (inv.InvestorFirm) aboutParts.push(`at ${inv.InvestorFirm}`);
                if (inv.InvestorRelations) aboutParts.push(`Focuses on ${inv.InvestorRelations} investments`);
                if (inv.FundingStage) aboutParts.push(`Specializes in ${inv.FundingStage} stage`);
                if (inv.HQGeography) aboutParts.push(`Based in ${inv.HQGeography}`);

                const aboutText = aboutParts.length > 0 ? aboutParts.join(". ") + "." : null;

                // 1. Save to investor_profiles table FIRST
                const { data: profileData, error: profileError } = await supabase
                    .from("investor_profiles")
                    .insert({
                        id: investorId,
                        email: inv.PrimaryContactEmail,
                        first_name: inv.PrimaryContactFirstName,
                        last_name: inv.PrimaryContactLastName,
                        company_name: inv.InvestorFirm,
                        company_url: inv.WebUrl,
                        country: inv.HQCountry,
                        city: inv.HQCity,
                        investor_category: inv.InvestorType,
                        investment_preference: inv.InvestmentType,
                        about: aboutText,
                        deal_frequency: null,
                        funded_amount: null,
                        investment_range: null,
                        investment_sweet_spot: null,
                        investment_speed: null,
                        anonymity_preference: null,
                        dealflow_frequency: null,
                        invest_in_spvs: false,
                        invest_in_pre_ipos: false,
                        // Add introducer information
                        introducer_name: inv.Introducer,
                        introducer_email: inv.IntroducerEmail,
                        introducer_type: "admin",
                        data_source: "admin_import",
                        created_by_admin: true,
                    })
                    .select()
                    .single();

                if (profileError) {
                    throw new Error(`Failed to save investor profile: ${profileError.message}`);
                }

                savedProfile = profileData;

                // 2. Save to investor_stages table
                if (inv.BusinessStages) {
                    const stages = inv.BusinessStages.split(",").map((s: string) => s.trim());
                    for (const stage of stages) {
                        const { error: stageError } = await supabase.from("investor_stages").insert({
                            investor_id: investorId,
                            stage: stage,
                        });
                        if (stageError) {
                            throw new Error(`Failed to save stage '${stage}': ${stageError.message}`);
                        }
                    }
                }

                // Add FundingStage as an additional stage if different from BusinessStages
                if (inv.FundingStage && inv.FundingStage !== inv.BusinessStages) {
                    const { error: fundingStageError } = await supabase.from("investor_stages").insert({
                        investor_id: investorId,
                        stage: inv.FundingStage,
                    });
                    if (fundingStageError) {
                        throw new Error(
                            `Failed to save funding stage '${inv.FundingStage}': ${fundingStageError.message}`
                        );
                    }
                }

                // 3. Save to investor_sectors table
                if (inv.PreferredVerticals) {
                    const sectors = inv.PreferredVerticals.split(",").map((s: string) => s.trim());
                    for (const sector of sectors) {
                        const { error: sectorError } = await supabase.from("investor_sectors").insert({
                            investor_id: investorId,
                            sector: sector,
                        });
                        if (sectorError) {
                            throw new Error(`Failed to save sector '${sector}': ${sectorError.message}`);
                        }
                    }
                }

                // 4. Save additional sectors if Sector field exists and is different
                if (inv.Sector && inv.Sector !== inv.PreferredVerticals) {
                    const additionalSectors = inv.Sector.split(",").map((s: string) => s.trim());
                    for (const sector of additionalSectors) {
                        const { error: sectorError } = await supabase.from("investor_sectors").insert({
                            investor_id: investorId,
                            sector: sector,
                        });
                        if (sectorError) {
                            throw new Error(`Failed to save additional sector '${sector}': ${sectorError.message}`);
                        }
                    }
                }

                // 5. Save to investor_locations table
                if (inv.HQCountry) {
                    const location = inv.HQCity ? `${inv.HQCity}, ${inv.HQCountry}` : inv.HQCountry;
                    const { error: locationError } = await supabase.from("investor_locations").insert({
                        investor_id: investorId,
                        location: location,
                    });
                    if (locationError) {
                        throw new Error(`Failed to save location '${location}': ${locationError.message}`);
                    }
                }

                // Add HQGeography as additional location if different
                if (inv.HQGeography && inv.HQGeography !== inv.HQCountry) {
                    const { error: geoLocationError } = await supabase.from("investor_locations").insert({
                        investor_id: investorId,
                        location: inv.HQGeography,
                    });
                    if (geoLocationError) {
                        throw new Error(
                            `Failed to save geography location '${inv.HQGeography}': ${geoLocationError.message}`
                        );
                    }
                }

                // 6. Save to investor_industries table
                if (inv.BusinessKind) {
                    const industries = inv.BusinessKind.split(",").map((s: string) => s.trim());
                    for (const industry of industries) {
                        const { error: industryError } = await supabase.from("investor_industries").insert({
                            investor_id: investorId,
                            industry: industry,
                        });
                        if (industryError) {
                            throw new Error(`Failed to save industry '${industry}': ${industryError.message}`);
                        }
                    }
                }

                // Add BusinessType as additional industry if different
                if (inv.BusinessType && inv.BusinessType !== inv.BusinessKind) {
                    const { error: businessTypeError } = await supabase.from("investor_industries").insert({
                        investor_id: investorId,
                        industry: inv.BusinessType,
                    });
                    if (businessTypeError) {
                        throw new Error(
                            `Failed to save business type '${inv.BusinessType}': ${businessTypeError.message}`
                        );
                    }
                }

                // 7. Save investment metrics
                const { error: metricsError } = await supabase.from("investor_metrics").insert({
                    investor_id: investorId,
                    min_gross_profit_margin: 0,
                    max_gross_profit_margin: 100,
                    min_ebitda_margin: 0,
                    max_ebitda_margin: 100,
                    min_cac_ltv_ratio: 1,
                    max_cac_ltv_ratio: 20,
                    requires_recurring_revenue: inv.BusinessKind?.toLowerCase().includes("saas") || false,
                    revenue_growth_preference: inv.BusinessStages || null,
                    preferred_business_types: inv.BusinessType ? [inv.BusinessType] : null,
                    preferred_business_models: inv.BusinessKind ? [inv.BusinessKind] : null,
                });

                if (metricsError) {
                    throw new Error(`Failed to save investment metrics: ${metricsError.message}`);
                }

                // 8. Save additional contact and relationship data to portfolio table
                const portfolioNotes = [];
                if (inv.GeneralEmail) portfolioNotes.push(`General Email: ${inv.GeneralEmail}`);
                if (inv.PrimaryContactFunction) portfolioNotes.push(`Contact Function: ${inv.PrimaryContactFunction}`);
                if (inv.PrimaryContactMobile) portfolioNotes.push(`Mobile: ${inv.PrimaryContactMobile}`);
                if (inv.PrimaryContactLinkedin) portfolioNotes.push(`LinkedIn: ${inv.PrimaryContactLinkedin}`);
                if (inv.PrimaryContactTwitter) portfolioNotes.push(`Twitter: ${inv.PrimaryContactTwitter}`);
                if (inv.RelationshipStatus) portfolioNotes.push(`Relationship: ${inv.RelationshipStatus}`);
                if (inv.Investments) portfolioNotes.push(`Previous Investments: ${inv.Investments}`);
                if (inv.Crunchbase) portfolioNotes.push(`Crunchbase: ${inv.Crunchbase}`);

                // Add secondary contact info if available
                if (inv.SecondaryContactFirstName || inv.SecondaryContactLastName) {
                    const secondaryName = `${inv.SecondaryContactFirstName || ""} ${
                        inv.SecondaryContactLastName || ""
                    }`.trim();
                    portfolioNotes.push(`Secondary Contact: ${secondaryName}`);
                    if (inv.SecondaryContactEmail) portfolioNotes.push(`Secondary Email: ${inv.SecondaryContactEmail}`);
                    if (inv.SecondaryContactFunction)
                        portfolioNotes.push(`Secondary Function: ${inv.SecondaryContactFunction}`);
                    if (inv.SecondaryContactMobile)
                        portfolioNotes.push(`Secondary Mobile: ${inv.SecondaryContactMobile}`);
                    if (inv.SecondaryContactLinkedin)
                        portfolioNotes.push(`Secondary LinkedIn: ${inv.SecondaryContactLinkedin}`);
                    if (inv.SecondaryContactTwitter)
                        portfolioNotes.push(`Secondary Twitter: ${inv.SecondaryContactTwitter}`);
                }

                // Save additional data as a portfolio entry (using it as a notes/metadata storage)
                if (portfolioNotes.length > 0) {
                    const { error: portfolioError } = await supabase.from("investor_portfolio").insert({
                        investor_id: investorId,
                        company_name: "Admin Import Data", // Marker to identify this as imported data
                        notes: portfolioNotes.join("\n"),
                        investment_stage: inv.FundingStage || inv.BusinessStages,
                        company_industry: inv.BusinessKind || inv.BusinessType,
                        company_location: inv.HQGeography,
                    });

                    if (portfolioError) {
                        throw new Error(`Failed to save additional portfolio data: ${portfolioError.message}`);
                    }
                }

                // If we reach here, all inserts succeeded
                savedInvestors.push(savedProfile);
                console.log(`✅ API: Successfully saved investor: ${inv.PrimaryContactEmail}`);
                console.log(`   👥 Introduced by: ${inv.Introducer} (${inv.IntroducerEmail})`);
            } catch (invError) {
                console.error(`❌ API: Error saving investor ${inv.PrimaryContactEmail}:`, invError);
                errors.push(`Error processing ${inv.PrimaryContactEmail}: ${invError.message}`);
            }
        }

        // Report results
        console.log(`=== API SAVE OPERATION COMPLETED ===`);
        console.log(`✅ Successfully saved: ${savedInvestors.length} investors`);
        console.log(`❌ Errors encountered: ${errors.length}`);

        if (errors.length > 0) {
            console.log("Errors:", errors);
        }

        if (savedInvestors.length === 0 && errors.length > 0) {
            throw new Error(`Failed to save any investors. Errors: ${errors.join("; ")}`);
        }

        return NextResponse.json({
            success: true,
            savedInvestors,
            errors,
            message: `Successfully saved ${savedInvestors.length} investors`,
        });
    } catch (error) {
        console.error("❌ API Save operation failed:", error);
        return NextResponse.json({ error: "Save operation failed", details: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { investorIds } = await request.json();

        if (!investorIds || !Array.isArray(investorIds) || investorIds.length === 0) {
            return NextResponse.json({ error: "No investor IDs provided" }, { status: 400 });
        }

        console.log(`🗑️ Starting bulk delete for ${investorIds.length} investors:`, investorIds);

        const supabase = createAdminClient();
        let deletedCount = 0;
        const errors: string[] = [];

        // Delete each investor and all related data
        for (const investorId of investorIds) {
            try {
                console.log(`🗑️ Deleting investor: ${investorId}`);

                // Delete from all related tables in the correct order (child tables first)

                // 1. Delete from investor_stages
                const { error: stagesError } = await supabase
                    .from("investor_stages")
                    .delete()
                    .eq("investor_id", investorId);

                if (stagesError) {
                    console.error(`Error deleting stages for ${investorId}:`, stagesError);
                }

                // 2. Delete from investor_sectors
                const { error: sectorsError } = await supabase
                    .from("investor_sectors")
                    .delete()
                    .eq("investor_id", investorId);

                if (sectorsError) {
                    console.error(`Error deleting sectors for ${investorId}:`, sectorsError);
                }

                // 3. Delete from investor_locations
                const { error: locationsError } = await supabase
                    .from("investor_locations")
                    .delete()
                    .eq("investor_id", investorId);

                if (locationsError) {
                    console.error(`Error deleting locations for ${investorId}:`, locationsError);
                }

                // 4. Delete from investor_industries
                const { error: industriesError } = await supabase
                    .from("investor_industries")
                    .delete()
                    .eq("investor_id", investorId);

                if (industriesError) {
                    console.error(`Error deleting industries for ${investorId}:`, industriesError);
                }

                // 5. Delete from investor_metrics
                const { error: metricsError } = await supabase
                    .from("investor_metrics")
                    .delete()
                    .eq("investor_id", investorId);

                if (metricsError) {
                    console.error(`Error deleting metrics for ${investorId}:`, metricsError);
                }

                // 6. Delete from investor_portfolio
                const { error: portfolioError } = await supabase
                    .from("investor_portfolio")
                    .delete()
                    .eq("investor_id", investorId);

                if (portfolioError) {
                    console.error(`Error deleting portfolio for ${investorId}:`, portfolioError);
                }

                // 7. Finally, delete from investor_profiles (parent table)
                const { error: profileError } = await supabase.from("investor_profiles").delete().eq("id", investorId);

                if (profileError) {
                    console.error(`Error deleting profile for ${investorId}:`, profileError);
                    errors.push(`Failed to delete investor ${investorId}: ${profileError.message}`);
                } else {
                    deletedCount++;
                    console.log(`✅ Successfully deleted investor: ${investorId}`);
                }
            } catch (error: any) {
                console.error(`Error deleting investor ${investorId}:`, error);
                errors.push(`Failed to delete investor ${investorId}: ${error.message}`);
            }
        }

        console.log(`🗑️ Bulk delete completed:`);
        console.log(`   - Successfully deleted: ${deletedCount} investors`);
        console.log(`   - Errors: ${errors.length}`);

        if (errors.length > 0) {
            console.log("Delete errors:", errors);
        }

        return NextResponse.json({
            success: true,
            deletedCount,
            errors,
            message: `Successfully deleted ${deletedCount} investor${deletedCount !== 1 ? "s" : ""}${
                errors.length > 0 ? ` with ${errors.length} error(s)` : ""
            }`,
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
