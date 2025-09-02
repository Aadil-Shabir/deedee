import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function createAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

type ReqItem = { id?: string; email?: string | null };
type ReqBody = { items?: ReqItem[]; profileIds?: string[] };
type Result = { authId?: string; email?: string | null; ok: boolean; error?: string; note?: string };

async function waitForGone(supabase: ReturnType<typeof createAdminClient>, id: string, tries = 6) {
    for (let i = 0; i < tries; i++) {
        const { data } = await supabase.from("investor_profiles").select("id").eq("id", id).maybeSingle();
        if (!data) return true;
        await new Promise((r) => setTimeout(r, 120));
    }
    return false;
}

export async function POST(req: Request) {
    const supabase = createAdminClient();

    try {
        const body = (await req.json()) as ReqBody;
        const items: ReqItem[] = Array.isArray(body?.items)
            ? body.items
            : Array.isArray(body?.profileIds)
            ? body.profileIds.map((id) => ({ id }))
            : [];

        const normalized = items
            .map((x) => ({ id: x?.id?.trim(), email: x?.email?.trim()?.toLowerCase() ?? null }))
            .filter((x) => x.id || x.email);

        if (normalized.length === 0) {
            return NextResponse.json({ error: "Provide items with id and/or email" }, { status: 400 });
        }

        // Pull auth users once (small datasets). For large sets, you’d page or map by id-only.
        const { data: list } = await supabase.auth.admin.listUsers();
        const byEmail = new Map((list?.users ?? []).filter((u) => u.email).map((u) => [u.email!.toLowerCase(), u.id]));
        const byId = new Set((list?.users ?? []).map((u) => u.id));

        const results: Result[] = [];

        for (const input of normalized) {
            try {
                // Resolve auth id: prefer input.id if it is a known auth user; else match by email; else fall back and try anyway
                let authId: string | undefined = undefined;
                if (input.id && byId.has(input.id)) authId = input.id;
                if (!authId && input.email) authId = byEmail.get(input.email);

                // If we can’t resolve, treat idempotently:
                if (!authId) {
                    // If profile doesn’t exist either, we’re done.
                    const { data: p } = await supabase
                        .from("investor_profiles")
                        .select("id")
                        .eq("id", input.id ?? "")
                        .maybeSingle();
                    if (!p) {
                        results.push({ authId: input.id, email: input.email, ok: true, note: "already deleted" });
                        continue;
                    }
                    // Try deleting profile directly as fallback (should still cascade children)
                    const { data: del, error: delErr } = await supabase
                        .from("investor_profiles")
                        .delete()
                        .eq("id", p.id)
                        .select("id")
                        .maybeSingle();

                    if (delErr || !del?.id) {
                        results.push({
                            authId: p.id,
                            email: input.email,
                            ok: false,
                            error: delErr?.message || "no rows deleted",
                        });
                        continue;
                    }
                    results.push({ authId: p.id, email: input.email, ok: true, note: "deleted via profile fallback" });
                    continue;
                }

                // Delete the auth user -> cascades to profiles -> cascades to children
                await supabase.auth.admin.deleteUser(authId);

                // verify gone
                const gone = await waitForGone(supabase, authId);
                if (!gone) {
                    results.push({
                        authId,
                        email: input.email,
                        ok: false,
                        error: "profile still present after auth delete",
                    });
                    continue;
                }

                results.push({ authId, email: input.email, ok: true });
            } catch (e: any) {
                results.push({ authId: input.id, email: input.email, ok: false, error: e?.message || "unknown error" });
            }
        }

        const successCount = results.filter((r) => r.ok).length;
        const failureCount = results.length - successCount;
        const failedList = results.filter((r) => !r.ok).slice(0, 5);
        const message =
            failureCount === 0
                ? `Deleted ${successCount} ${successCount === 1 ? "investor" : "investors"}.`
                : `Deleted ${successCount}, failed ${failureCount}: ${failedList
                      .map((r) => r.email || r.authId || "unknown")
                      .join(", ")}${failureCount > failedList.length ? "…" : ""}`;

        return NextResponse.json({ successCount, failureCount, results, message });
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "bulk delete failed" }, { status: 500 });
    }
}
