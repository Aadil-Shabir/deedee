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

interface AddManualInvestorRequest {
    firstName: string;
    lastName: string;
    email: string;
    investsViaCompany: boolean;
    investorType?: string;
    companyName?: string;
    country: string;
    city: string;
    title?: string;
}

export async function POST(request: NextRequest) {
    const supabase = createAdminClient();

    try {
        const body: AddManualInvestorRequest = await request.json();
        const { firstName, lastName, email, investsViaCompany, investorType, companyName, country, city, title } = body;

        console.log("📝 Creating manual investor:", { email, investsViaCompany, investorType, companyName });

        // Validate required fields
        if (!firstName || !lastName || !email || !country || !city) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (investsViaCompany && (!investorType || !companyName)) {
            return NextResponse.json(
                { error: "Investor type and company name required for company investors" },
                { status: 400 }
            );
        }

        // Check if email already exists in auth
        console.log("🔍 Checking if user exists in auth...");
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find((user) => user.email === email.toLowerCase());

        if (existingUser) {
            return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
        }

        // Check if email already exists in investor_profiles
        console.log("🔍 Checking if investor profile exists...");
        const { data: existingProfile } = await supabase
            .from("investor_profiles")
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existingProfile) {
            return NextResponse.json({ error: "An investor profile with this email already exists" }, { status: 409 });
        }

        // Check if email already exists in investor_contacts
        console.log("🔍 Checking if investor contact exists...");
        const { data: existingContact } = await supabase
            .from("investor_contacts")
            .select("id")
            .eq("email", email.toLowerCase())
            .single();

        if (existingContact) {
            return NextResponse.json({ error: "An investor contact with this email already exists" }, { status: 409 });
        }

        // Variables to track created resources for cleanup
        let createdUserId: string | null = null;
        let createdProfileId: string | null = null;
        let createdFirmId: string | null = null;
        let createdContactId: string | null = null;

        try {
            // 1. Create auth user
            console.log("👤 Creating user account...");
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
                email: email.toLowerCase(),
                password: Math.random().toString(36).slice(-8) + "Aa1!", // Temporary password
                email_confirm: true,
                user_metadata: {
                    first_name: firstName,
                    last_name: lastName,
                    role: "investor",
                },
            });

            if (authError) {
                console.error("❌ Auth user creation failed:", authError);
                throw new Error(`Failed to create user account: ${authError.message}`);
            }

            createdUserId = authUser.user.id;
            console.log("✅ User created:", createdUserId);

            // 2. Create investor profile
            console.log("📋 Creating investor profile...");
            const { data: profile, error: profileError } = await supabase
                .from("investor_profiles")
                .insert({
                    id: createdUserId,
                    first_name: firstName,
                    last_name: lastName,
                    email: email.toLowerCase(),
                    investor_category: investsViaCompany ? investorType : "Individual",
                    investment_preference: investsViaCompany ? "company" : "individual",
                    location: `${city}, ${country}`,
                    source: "admin",
                })
                .select()
                .single();

            if (profileError) {
                console.error("❌ Profile creation failed:", profileError);
                throw new Error(`Failed to create investor profile: ${profileError.message}`);
            }

            createdProfileId = profile.id;
            console.log("✅ Investor profile created:", createdProfileId);

            // 3. Handle firm and contact creation logic
            if (companyName && companyName.trim()) {
                console.log("🏢 Processing company association...");

                // Check if firm already exists
                const { data: existingFirm } = await supabase
                    .from("investor_firms")
                    .select("id")
                    .eq("firm_name", companyName.trim())
                    .single();

                if (existingFirm) {
                    createdFirmId = existingFirm.id;
                    console.log("✅ Using existing firm:", createdFirmId);
                } else {
                    // Create new firm
                    const { data: newFirm, error: firmError } = await supabase
                        .from("investor_firms")
                        .insert({
                            firm_name: companyName.trim(),
                            investor_type: investsViaCompany ? investorType : "Individual Association",
                            hq_location: `${city}, ${country}`,
                            source: "deedee",
                        })
                        .select()
                        .single();

                    if (firmError) {
                        console.error("❌ Firm creation failed:", firmError);
                        throw new Error(`Failed to create investor firm: ${firmError.message}`);
                    }

                    createdFirmId = newFirm.id;
                    console.log("✅ New firm created:", createdFirmId);
                }

                // Create investor contact
                console.log("📞 Creating investor contact...");
                const { data: contact, error: contactError } = await supabase
                    .from("investor_contacts")
                    .insert({
                        firm_id: createdFirmId,
                        investor_profile_id: createdProfileId,
                        first_name: firstName,
                        last_name: lastName,
                        email: email.toLowerCase(),
                        title: title || null,
                    })
                    .select()
                    .single();

                if (contactError) {
                    console.error("❌ Contact creation failed:", contactError);
                    throw new Error(`Failed to create investor contact: ${contactError.message}`);
                }

                createdContactId = contact.id;
                console.log("✅ Investor contact created:", createdContactId);
            }

            console.log("🎉 Manual investor creation completed successfully!");

            return NextResponse.json({
                success: true,
                message: "Investor added successfully",
                data: {
                    userId: createdUserId,
                    profileId: createdProfileId,
                    firmId: createdFirmId,
                    contactId: createdContactId,
                    investorType: investsViaCompany ? investorType : "Individual",
                    hasCompany: !!createdFirmId,
                    logic: investsViaCompany
                        ? "Company investor - created firm and contact"
                        : companyName
                        ? "Individual investor with company - created firm and contact"
                        : "Individual investor only - no firm created",
                },
            });
        } catch (error: any) {
            console.log("❌ Transaction failed, cleaning up...");

            // Cleanup in reverse order
            if (createdContactId) {
                try {
                    await supabase.from("investor_contacts").delete().eq("id", createdContactId);
                    console.log("🧹 Cleaned up investor contact");
                } catch (cleanupError) {
                    console.log("⚠️ Failed to cleanup investor contact:", cleanupError);
                }
            }

            if (createdFirmId) {
                try {
                    await supabase.from("investor_firms").delete().eq("id", createdFirmId);
                    console.log("🧹 Cleaned up investor firm");
                } catch (cleanupError) {
                    console.log("⚠️ Failed to cleanup investor firm:", cleanupError);
                }
            }

            if (createdProfileId) {
                try {
                    await supabase.from("investor_profiles").delete().eq("id", createdProfileId);
                    console.log("🧹 Cleaned up investor profile");
                } catch (cleanupError) {
                    console.log("⚠️ Failed to cleanup investor profile:", cleanupError);
                }
            }

            if (createdUserId) {
                try {
                    await supabase.auth.admin.deleteUser(createdUserId);
                    console.log("🧹 Cleaned up user account");
                } catch (cleanupError) {
                    console.log("⚠️ Failed to cleanup user account:", cleanupError);
                }
            }

            throw error;
        }
    } catch (error: any) {
        console.error("❌ Manual Investor API Error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Failed to add investor",
            },
            { status: 500 }
        );
    }
}
