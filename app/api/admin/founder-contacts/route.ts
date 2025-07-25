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
        const body = await request.json();
        const { founderIds, investorFirmIds } = body;

        // Validate input
        if (!founderIds || !Array.isArray(founderIds) || founderIds.length === 0) {
            return NextResponse.json(
                { error: "Founder IDs are required and must be a non-empty array" },
                { status: 400 }
            );
        }

        if (!investorFirmIds || !Array.isArray(investorFirmIds) || investorFirmIds.length === 0) {
            return NextResponse.json(
                { error: "Investor firm IDs are required and must be a non-empty array" },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

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

        // Insert contacts (upsert to handle duplicates)
        const { data: insertedContacts, error: insertError } = await supabase
            .from("founder_contacts")
            .upsert(contactsToInsert, {
                onConflict: "founder_id,investor_firm_id",
                ignoreDuplicates: true,
            })
            .select();

        if (insertError) {
            console.error("❌ Error inserting founder contacts:", insertError);
            throw insertError;
        }

        const insertedCount = insertedContacts?.length || 0;
        const duplicateCount = contactsToInsert.length - insertedCount;

        console.log(`✅ Successfully inserted ${insertedCount} founder contacts`);
        if (duplicateCount > 0) {
            console.log(`ℹ️ Skipped ${duplicateCount} duplicate contacts`);
        }

        // Create success message
        let message = `Successfully sent ${investorFirmIds.length} investor firm${
            investorFirmIds.length > 1 ? "s" : ""
        } to ${founderIds.length} founder${founderIds.length > 1 ? "s" : ""}.`;

        if (insertedCount > 0) {
            message += ` ${insertedCount} new contact${insertedCount > 1 ? "s" : ""} created.`;
        }

        return NextResponse.json({
            success: true,
            message,
            insertedCount,
            duplicateCount,
            totalAttempted: contactsToInsert.length,
        });
    } catch (error: any) {
        console.error("❌ API Send to founders operation failed:", error);
        return NextResponse.json(
            {
                error: "Failed to send investor firms to founders",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
