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

export async function POST(request: NextRequest) {
    try {
        console.log("🚀 Starting send to founders operation...");

        const body = await request.json();
        const { founderIds, investorFirmIds } = body;

        // Validate input
        if (!founderIds || !Array.isArray(founderIds) || founderIds.length === 0) {
            console.error("❌ Invalid founder IDs:", founderIds);
            return NextResponse.json(
                { error: "Founder IDs are required and must be a non-empty array" },
                { status: 400 }
            );
        }

        if (!investorFirmIds || !Array.isArray(investorFirmIds) || investorFirmIds.length === 0) {
            console.error("❌ Invalid investor firm IDs:", investorFirmIds);
            return NextResponse.json(
                { error: "Investor firm IDs are required and must be a non-empty array" },
                { status: 400 }
            );
        }

        console.log(`📝 Processing ${founderIds.length} founders and ${investorFirmIds.length} investor firms`);

        const supabase = createAdminClient();

        // First, verify that all founders exist
        const { data: foundersCheck, error: foundersCheckError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name")
            .in("id", founderIds);

        if (foundersCheckError) {
            console.error("❌ Error checking founders:", foundersCheckError);
            throw new Error(`Failed to verify founders: ${foundersCheckError.message}`);
        }

        if (!foundersCheck || foundersCheck.length !== founderIds.length) {
            const foundFounderIds = foundersCheck?.map((f) => f.id) || [];
            const missingFounderIds = founderIds.filter((id) => !foundFounderIds.includes(id));
            console.error("❌ Some founders not found:", missingFounderIds);
            return NextResponse.json(
                { error: `Some founders were not found: ${missingFounderIds.join(", ")}` },
                { status: 400 }
            );
        }

        // Verify that all investor firms exist
        const { data: firmsCheck, error: firmsCheckError } = await supabase
            .from("investor_firms")
            .select("id, firm_name")
            .in("id", investorFirmIds);

        if (firmsCheckError) {
            console.error("❌ Error checking investor firms:", firmsCheckError);
            throw new Error(`Failed to verify investor firms: ${firmsCheckError.message}`);
        }

        if (!firmsCheck || firmsCheck.length !== investorFirmIds.length) {
            const foundFirmIds = firmsCheck?.map((f) => f.id) || [];
            const missingFirmIds = investorFirmIds.filter((id) => !foundFirmIds.includes(id));
            console.error("❌ Some investor firms not found:", missingFirmIds);
            return NextResponse.json(
                { error: `Some investor firms were not found: ${missingFirmIds.join(", ")}` },
                { status: 400 }
            );
        }

        // Prepare contacts to insert
        const contactsToInsert = [];
        for (const founderId of founderIds) {
            for (const firmId of investorFirmIds) {
                contactsToInsert.push({
                    founder_id: founderId,
                    investor_firm_id: firmId,
                    added_by_platform: true,
                });
            }
        }

        console.log(`📝 Attempting to insert ${contactsToInsert.length} founder contacts`);

        // Check for existing contacts to provide better feedback
        const { data: existingContacts, error: existingError } = await supabase
            .from("founder_contacts")
            .select("founder_id, investor_firm_id")
            .in("founder_id", founderIds)
            .in("investor_firm_id", investorFirmIds);

        if (existingError) {
            console.error("❌ Error checking existing contacts:", existingError);
            throw new Error(`Failed to check existing contacts: ${existingError.message}`);
        }

        // Create a set of existing contact pairs for quick lookup
        const existingPairs = new Set(
            existingContacts?.map((contact) => `${contact.founder_id}-${contact.investor_firm_id}`) || []
        );

        // Filter out existing contacts
        const newContactsToInsert = contactsToInsert.filter(
            (contact) => !existingPairs.has(`${contact.founder_id}-${contact.investor_firm_id}`)
        );

        const duplicateCount = contactsToInsert.length - newContactsToInsert.length;

        console.log(`🔍 Found ${existingContacts?.length || 0} existing contacts`);
        console.log(`✨ Will insert ${newContactsToInsert.length} new contacts`);
        console.log(`⚠️ Skipping ${duplicateCount} duplicate contacts`);

        let insertedCount = 0;
        let insertedContacts: any = [];

        if (newContactsToInsert.length > 0) {
            // Insert new contacts
            const { data: insertResult, error: insertError } = await supabase
                .from("founder_contacts")
                .insert(newContactsToInsert).select(`
          id,
          founder_id,
          investor_firm_id,
          created_at,
          profiles!founder_id (
            first_name,
            last_name
          ),
          investor_firms!investor_firm_id (
            firm_name
          )
        `);

            if (insertError) {
                console.error("❌ Insert error:", insertError);
                throw new Error(`Failed to insert founder contacts: ${insertError.message}`);
            }

            insertedContacts = insertResult || [];
            insertedCount = insertedContacts.length;

            console.log(`✅ Successfully inserted ${insertedCount} new contacts`);
        }

        // Prepare detailed response
        const founderNames = foundersCheck.map((f) => `${f.first_name} ${f.last_name}`);
        const firmNames = firmsCheck.map((f) => f.firm_name);

        let message = "";
        if (insertedCount > 0 && duplicateCount > 0) {
            message = `Successfully sent ${firmNames.length} investor firm${firmNames.length > 1 ? "s" : ""} to ${
                founderNames.length
            } founder${founderNames.length > 1 ? "s" : ""}. ${insertedCount} new contact${
                insertedCount > 1 ? "s" : ""
            } created, ${duplicateCount} duplicate${duplicateCount > 1 ? "s" : ""} skipped.`;
        } else if (insertedCount > 0) {
            message = `Successfully sent ${firmNames.length} investor firm${firmNames.length > 1 ? "s" : ""} to ${
                founderNames.length
            } founder${founderNames.length > 1 ? "s" : ""}. ${insertedCount} new contact${
                insertedCount > 1 ? "s" : ""
            } created.`;
        } else {
            message = `All selected investor firms have already been sent to the selected founders. No new contacts created.`;
        }

        return NextResponse.json({
            success: true,
            message,
            insertedCount,
            duplicateCount,
            totalAttempted: contactsToInsert.length,
            details: {
                founders: founderNames,
                firms: firmNames,
                insertedContacts: insertedContacts.map((contact: any) => ({
                    id: contact.id,
                    founder_name: `${contact.profiles?.first_name} ${contact.profiles?.last_name}`,
                    firm_name: contact.investor_firms?.firm_name,
                    created_at: contact.created_at,
                })),
            },
        });
    } catch (error: any) {
        console.error("❌ API Send to founders operation failed:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Failed to send investor firms to founders",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
