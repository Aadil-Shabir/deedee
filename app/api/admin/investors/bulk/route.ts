import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ParsedInvestorData } from "@/lib/utils/file-parser";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

interface ImportResult {
    success: boolean;
    rowIndex: number;
    email: string;
    error?: string;
    warnings?: string[];
    userId?: string;
    firmId?: string;
    profileId?: string;
    contactId?: string;
}

interface ImportSummary {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
}

function determineInvestmentPreference(investsViaCompany: boolean, investorType?: string): string {
    if (!investsViaCompany) {
        return "Individual investor with personal investment interests";
    }

    if (!investorType) {
        return "Company-based investment opportunities";
    }

    const type = investorType.toLowerCase();
    if (type.includes("vc") || type.includes("venture")) {
        return "High-growth technology companies with strong market potential";
    } else if (type.includes("pe") || type.includes("private equity")) {
        return "Established companies with proven business models and growth opportunities";
    } else if (type.includes("angel")) {
        return "Early-stage startups with innovative solutions and strong founding teams";
    } else if (type.includes("family office")) {
        return "Diversified investment opportunities across multiple asset classes";
    } else if (type.includes("corporate")) {
        return "Strategic investments aligned with corporate objectives and synergies";
    } else {
        return "Investment opportunities matching our fund strategy and thesis";
    }
}

async function createInvestorRecord(data: ParsedInvestorData, rowIndex: number): Promise<ImportResult> {
    const result: ImportResult = {
        success: false,
        rowIndex,
        email: data.email,
        warnings: [],
    };

    try {
        console.log(`🚀 Processing row ${rowIndex}: ${data.email}`);

        // Check if email already exists in auth
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find((user) => user.email === data.email.toLowerCase().trim());

        if (existingUser) {
            result.error = `Email ${data.email} already exists in the system`;
            return result;
        }

        // Check existing profile
        const { data: existingProfile } = await supabase
            .from("investor_profiles")
            .select("id")
            .eq("email", data.email.toLowerCase().trim())
            .single();

        if (existingProfile) {
            result.error = `Email ${data.email} already exists in the system`;
            return result;
        }

        let firmId: string | undefined;
        let isNewFirm = false;

        // Handle firm creation logic - same as manual add
        if (data.company_name?.trim()) {
            // Check if firm already exists
            const { data: existingFirm } = await supabase
                .from("investor_firms")
                .select("id, firm_name")
                .eq("firm_name", data.company_name.trim())
                .single();

            if (existingFirm) {
                firmId = existingFirm.id;
                console.log("♻️ Reusing existing firm:", firmId);
                result.warnings?.push("Firm already exists, creating new contact for existing firm");
            } else {
                // Create new firm
                console.log("📊 Creating new firm:", data.company_name);

                const firmData: any = {
                    firm_name: data.company_name.trim(),
                    investor_type: data.invests_via_company
                        ? data.investor_type || "Unknown"
                        : "Individual Association",
                    hq_location: `${data.country}, ${data.city}`,
                };

                const { data: newFirm, error: firmError } = await supabase
                    .from("investor_firms")
                    .insert(firmData)
                    .select("id")
                    .single();

                if (firmError) {
                    console.error("❌ Error creating firm:", firmError);
                    result.error = `Failed to create firm: ${firmError.message}`;
                    return result;
                }

                firmId = newFirm.id;
                isNewFirm = true;
                console.log("✅ Firm created:", firmId);
            }
        }

        result.firmId = firmId;

        // Create Supabase Auth user
        console.log("👤 Creating user account...");
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: data.email.toLowerCase().trim(),
            email_confirm: false,
            user_metadata: {
                created_by_admin: true,
            },
        });

        if (userError) {
            console.error("❌ Error creating user:", userError);
            // Clean up firm if we created it
            if (isNewFirm && firmId) {
                await supabase.from("investor_firms").delete().eq("id", firmId);
            }
            result.error = `Failed to create user: ${userError.message}`;
            return result;
        }

        const userId = userData.user.id;
        result.userId = userId;
        console.log("✅ User created:", userId);

        // Create investor profile - same logic as manual add
        console.log("📋 Creating investor profile...");
        const profileData: any = {
            id: userId,
            first_name: data.first_name.trim(),
            last_name: data.last_name.trim(),
            email: data.email.toLowerCase().trim(),
            investor_category: data.invests_via_company ? data.investor_type || "Company" : "Individual",
            investment_preference: data.invests_via_company ? "company" : "individual",
            source: "admin",
            location: `${data.country}, ${data.city}`,
        };

        const { data: profileResult, error: profileError } = await supabase
            .from("investor_profiles")
            .insert(profileData)
            .select("id")
            .single();

        if (profileError) {
            console.error("❌ Error creating profile:", profileError);
            // Clean up user and firm
            await supabase.auth.admin.deleteUser(userId);
            if (isNewFirm && firmId) {
                await supabase.from("investor_firms").delete().eq("id", firmId);
            }
            result.error = `Failed to create profile: ${profileError.message}`;
            return result;
        }

        result.profileId = profileResult.id;
        console.log("✅ Profile created:", profileResult.id);

        // Create investor contact only if we have a firm - same logic as manual add
        if (firmId) {
            console.log("📞 Creating investor contact...");
            const contactData: any = {
                firm_id: firmId,
                first_name: data.first_name.trim(),
                last_name: data.last_name.trim(),
                title: data.title?.trim() || "Contact",
                email: data.email.toLowerCase().trim(),
                investor_profile_id: profileResult.id, // Add the investor_profile_id here
            };

            const { data: contactResult, error: contactError } = await supabase
                .from("investor_contacts")
                .insert(contactData)
                .select("id")
                .single();

            if (contactError) {
                console.error("❌ Error creating contact:", contactError);
                // Clean up user, profile, and firm
                await supabase.auth.admin.deleteUser(userId);
                await supabase.from("investor_profiles").delete().eq("id", userId);
                if (isNewFirm && firmId) {
                    await supabase.from("investor_firms").delete().eq("id", firmId);
                }
                result.error = `Failed to create contact: ${contactError.message}`;
                return result;
            }

            result.contactId = contactResult.id;
            console.log("✅ Contact created:", contactResult.id);
        } else {
            console.log("ℹ️ No firm provided, skipping contact creation");
            result.warnings?.push("Individual investor with no company - no contact record created");
        }

        result.success = true;
        console.log(`✅ Successfully processed row ${rowIndex}`);

        return result;
    } catch (error: any) {
        console.error(`💥 Unexpected error processing row ${rowIndex}:`, error);
        result.error = `Unexpected error: ${error.message}`;
        return result;
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data: investorData } = body as { data: ParsedInvestorData[] };

        if (!investorData || !Array.isArray(investorData)) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        console.log(`🚀 Starting bulk import of ${investorData.length} investors`);

        const results: ImportResult[] = [];

        // Process each investor row by row
        for (let i = 0; i < investorData.length; i++) {
            const investor = investorData[i];
            const rowIndex = i + 2; // +2 because we start from row 1 and skip header

            try {
                const result = await createInvestorRecord(investor, rowIndex);
                results.push(result);

                // Add a small delay to prevent overwhelming the database
                if (i < investorData.length - 1) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
            } catch (error: any) {
                console.error(`💥 Error processing investor ${i + 1}:`, error);
                results.push({
                    success: false,
                    rowIndex,
                    email: investor.email,
                    error: `Processing failed: ${error.message}`,
                });
            }
        }

        // Calculate summary
        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;
        const successRate = Math.round((successful / results.length) * 100);

        const summary: ImportSummary = {
            total: results.length,
            successful,
            failed,
            successRate,
        };

        console.log(`✅ Bulk import completed: ${successful}/${results.length} successful`);

        return NextResponse.json({
            success: true,
            summary,
            results,
        });
    } catch (error: any) {
        console.error("💥 Bulk import error:", error);
        return NextResponse.json({ error: `Bulk import failed: ${error.message}` }, { status: 500 });
    }
}
