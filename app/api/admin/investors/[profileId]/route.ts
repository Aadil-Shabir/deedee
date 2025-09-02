// app/api/admin/investors/[profileId]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/**
 * GET /api/admin/investors/:profileId
 * Returns: investor profile + first contact + firm + preferences
 */
export async function GET(_req: NextRequest, { params }: { params: { profileId: string } }) {
    const supabase = createAdminClient();
    const id = params.profileId;

    // Profile + contacts (+firm) + preferences
    const { data, error } = await supabase
        .from("investor_profiles")
        .select(
            `
    id, first_name, last_name, email, profile_image_url, about, location,
    investor_category, created_at, last_login, last_verified_at, activity_score, source,
    investor_contacts:investor_contacts!investor_contacts_investor_profile_id_fkey (
      id, title, verified, firm_id,
      investor_firms:investor_firms!investor_contacts_firm_id_fkey (
        id, firm_name, investor_type, website_url, hq_location
      )
    ),
    investor_preferences:investor_preferences!investor_preferences_investor_id_fkey1 (*)
  `
        )
        .eq("id", id)
        .single();

    if (error || !data) {
        if (error) console.error("Investor details fetch error:", error);
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Normalize embedded shapes (Supabase can return object OR array depending on relation inference)
    const contacts = Array.isArray((data as any).investor_contacts)
        ? (data as any).investor_contacts
        : (data as any).investor_contacts
        ? [(data as any).investor_contacts]
        : [];

    const contact = contacts[0] ?? null;

    const firmRaw = contact?.investor_firms;
    const firm = firmRaw == null ? null : Array.isArray(firmRaw) ? firmRaw[0] ?? null : firmRaw;

    const prefsRaw = (data as any).investor_preferences;
    const preferences = prefsRaw == null ? null : Array.isArray(prefsRaw) ? prefsRaw[0] ?? null : prefsRaw;

    const payload = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        profile_image_url: data.profile_image_url,
        about: data.about,
        location: data.location,
        investor_category: data.investor_category,
        created_at: data.created_at,
        last_login: data.last_login,
        last_verified_at: data.last_verified_at,
        activity_score: data.activity_score,
        source: data.source,
        contact: contact
            ? {
                  id: contact.id,
                  title: contact.title,
                  verified: contact.verified ?? null,
              }
            : null,
        firm: firm
            ? {
                  id: (firm as any).id ?? null,
                  firm_name: (firm as any).firm_name ?? null,
                  investor_type: (firm as any).investor_type ?? null,
                  website_url: (firm as any).website_url ?? null,
                  hq_location: (firm as any).hq_location ?? null,
              }
            : null,
        preferences: preferences ?? null,
    };

    return NextResponse.json({ investor: payload });
}

/**
 * DELETE /api/admin/investors/:profileId
 * (Your existing logic preserved)
 */
async function waitForProfileGone(supabase: ReturnType<typeof createAdminClient>, id: string, tries = 6) {
    for (let i = 0; i < tries; i++) {
        const { data } = await supabase.from("investor_profiles").select("id").eq("id", id).maybeSingle();
        if (!data) return true;
        await new Promise((r) => setTimeout(r, 120)); // brief retry loop
    }
    return false;
}

export async function DELETE(_req: Request, { params }: { params: { profileId: string } }) {
    const supabase = createAdminClient();
    const authId = params.profileId; // profileId === auth.users.id by design

    try {
        // quick existence check (optional but gives better 404s)
        const { data: exists } = await supabase
            .from("investor_profiles")
            .select("id, email")
            .eq("id", authId)
            .maybeSingle();
        if (!exists) {
            // idempotent: if not in profiles, still try deleting auth user just in case
            await supabase.auth.admin.deleteUser(authId).catch(() => {});
            return NextResponse.json({ success: true, message: "Already deleted (no profile found)" });
        }

        // delete auth user -> cascades to investor_profiles -> cascades to children
        const authErr = await supabase.auth.admin
            .deleteUser(authId)
            .then(() => null)
            .catch((e) => e);
        if (authErr) {
            return NextResponse.json({ error: `Auth delete failed: ${authErr.message || authErr}` }, { status: 500 });
        }

        // verify the profile row is actually gone (defensive)
        const gone = await waitForProfileGone(supabase, authId);
        if (!gone) {
            return NextResponse.json({ error: "Delete acknowledged but profile still present" }, { status: 500 });
        }

        return NextResponse.json({ success: true, deleted_profile_id: authId });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Failed to delete investor" }, { status: 500 });
    }
}
