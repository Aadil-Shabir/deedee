// app/api/admin/investors/manual/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
    });
}

export async function POST(request: NextRequest) {
    const supabase = createAdminClient();

    try {
        const body = await request.json();
        const { firstName, lastName, email, investsViaCompany, investorType, companyName, country, city, title } =
            body as {
                firstName: string;
                lastName: string;
                email: string;
                investsViaCompany: boolean;
                investorType?: string;
                companyName?: string;
                country: string;
                city: string;
                title?: string;
            };

        if (!firstName || !lastName || !email || !country || !city) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        if (investsViaCompany && (!investorType || !companyName)) {
            return NextResponse.json(
                { error: "Investor type and company name required for company investors" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase();

        // --- existence checks (use maybeSingle to avoid throwing on 0 rows)
        const { data: usersList, error: listErr } = await supabase.auth.admin.listUsers();
        if (listErr) {
            return NextResponse.json({ error: `Auth user list failed: ${listErr.message}` }, { status: 500 });
        }
        if (usersList.users.find((u) => u.email?.toLowerCase() === normalizedEmail)) {
            return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
        }

        const { data: existingProfile } = await supabase
            .from("investor_profiles")
            .select("id")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (existingProfile?.id) {
            return NextResponse.json({ error: "An investor profile with this email already exists" }, { status: 409 });
        }

        const { data: existingContact } = await supabase
            .from("investor_contacts")
            .select("id")
            .eq("email", normalizedEmail)
            .maybeSingle();
        if (existingContact?.id) {
            return NextResponse.json({ error: "An investor contact with this email already exists" }, { status: 409 });
        }

        // --- create flow
        let createdUserId: string | null = null;
        let createdProfileId: string | null = null;
        let createdFirmId: string | null = null;
        let createdContactId: string | null = null;

        try {
            // 1) auth user
            const { data: authRes, error: authError } = await supabase.auth.admin.createUser({
                email: normalizedEmail,
                password: Math.random().toString(36).slice(-8) + "Aa1!",
                email_confirm: true,
                user_metadata: { first_name: firstName, last_name: lastName, role: "investor" },
            });
            if (authError || !authRes?.user) {
                throw new Error(`Failed to create user account: ${authError?.message}`);
            }
            createdUserId = authRes.user.id;

            // 2) investor profile — DO NOT set `id` explicitly
            const { data: profile, error: profileError } = await supabase
                .from("investor_profiles")
                .insert({
                    // id: createdUserId, <-- remove this
                    auth_user_id: createdUserId, // <-- keep linkage here (make sure column exists)
                    first_name: firstName,
                    last_name: lastName,
                    email: normalizedEmail,
                    investor_category: investsViaCompany ? investorType : "Individual",
                    investment_preference: investsViaCompany ? "company" : "individual",
                    location: `${city}, ${country}`,
                    source: "admin",
                })
                .select("id")
                .single();

            if (profileError || !profile?.id) {
                // cleanup auth user if profile fails
                if (createdUserId) await supabase.auth.admin.deleteUser(createdUserId).catch(() => {});
                throw new Error(`Failed to create investor profile: ${profileError?.message}`);
            }
            createdProfileId = profile.id;

            // 3) firm (if provided) + contact
            if (companyName?.trim()) {
                // find firm
                let firmId: string | null = null;
                const { data: existingFirm } = await supabase
                    .from("investor_firms")
                    .select("id")
                    .eq("firm_name", companyName.trim())
                    .maybeSingle();

                if (existingFirm?.id) {
                    firmId = existingFirm.id;
                } else {
                    const { data: newFirm, error: firmErr } = await supabase
                        .from("investor_firms")
                        .insert({
                            firm_name: companyName.trim(),
                            investor_type: investsViaCompany ? investorType : "Individual Association",
                            hq_location: `${city}, ${country}`,
                            source: "deedee",
                        })
                        .select("id")
                        .single();
                    if (firmErr || !newFirm?.id) {
                        // cleanup profile + auth
                        await supabase.from("investor_profiles").delete().eq("id", createdProfileId!);
                        if (createdUserId) await supabase.auth.admin.deleteUser(createdUserId).catch(() => {});
                        throw new Error(`Failed to create investor firm: ${firmErr?.message}`);
                    }
                    firmId = newFirm.id;
                }
                createdFirmId = firmId;

                // contact — use the PROFILE ID we just captured
                const { data: contact, error: contactErr } = await supabase
                    .from("investor_contacts")
                    .insert({
                        firm_id: firmId,
                        investor_profile_id: createdProfileId, // <-- critical
                        first_name: firstName,
                        last_name: lastName,
                        email: normalizedEmail,
                        title: title ?? null,
                    })
                    .select("id")
                    .single();

                if (contactErr || !contact?.id) {
                    // cleanup new firm if we created one, then profile + auth
                    if (createdFirmId) await supabase.from("investor_firms").delete().eq("id", createdFirmId);
                    await supabase.from("investor_profiles").delete().eq("id", createdProfileId!);
                    if (createdUserId) await supabase.auth.admin.deleteUser(createdUserId).catch(() => {});
                    throw new Error(`Failed to create investor contact: ${contactErr?.message}`);
                }
                createdContactId = contact.id;
            }

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
                },
            });
        } catch (innerErr) {
            // cleanup (reverse order)
            if (createdContactId) await supabase.from("investor_contacts").delete().eq("id", createdContactId);
            if (createdFirmId) await supabase.from("investor_firms").delete().eq("id", createdFirmId);
            if (createdProfileId) await supabase.from("investor_profiles").delete().eq("id", createdProfileId);
            if (createdUserId) await supabase.auth.admin.deleteUser(createdUserId).catch(() => {});
            throw innerErr;
        }
    } catch (error: any) {
        console.error("❌ Manual Investor API Error:", error);
        return NextResponse.json({ error: error?.message ?? "Failed to add investor" }, { status: 500 });
    }
}
