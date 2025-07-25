import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        console.log("🔍 Fetching investor firm details for ID:", params.id);

        const { data: firm, error } = await supabase.from("investor_firms").select("*").eq("id", params.id).single();

        if (error) {
            console.error("❌ Supabase error:", error);
            if (error.code === "PGRST116") {
                return NextResponse.json({ error: "Investor firm not found" }, { status: 404 });
            }
            throw error;
        }

        if (!firm) {
            console.log("❌ No firm found with ID:", params.id);
            return NextResponse.json({ error: "Investor firm not found" }, { status: 404 });
        }

        console.log("✅ Successfully fetched firm:", firm.firm_name);

        return NextResponse.json(firm);
    } catch (error: any) {
        console.error("❌ Error fetching investor firm:", error);
        return NextResponse.json({ error: "Failed to fetch investor firm details" }, { status: 500 });
    }
}
