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
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check if user exists in Supabase Auth
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingUser = existingUsers.users.find((user) => user.email === email.trim().toLowerCase());

        if (existingUser) {
            return NextResponse.json({ exists: true, type: "user" });
        }

        // Check if investor profile exists
        const { data: existingProfile } = await supabase
            .from("investor_profiles")
            .select("id")
            .eq("email", email.trim().toLowerCase())
            .single();

        if (existingProfile) {
            return NextResponse.json({ exists: true, type: "investor" });
        }

        return NextResponse.json({ exists: false });
    } catch (error: any) {
        console.error("❌ Email check API Error:", error);
        return NextResponse.json({ error: "Failed to check email" }, { status: 500 });
    }
}
