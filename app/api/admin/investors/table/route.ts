import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

function csv(name: string | null) {
    return (name ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
}
type SortField = "first_name" | "email" | "firm_name" | "created_at" | "activity_score" | "source";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = Number.parseInt(searchParams.get("page") || "1");
        const limit = Number.parseInt(searchParams.get("limit") || "25");
        const sortBy = (searchParams.get("sortBy") || "created_at") as SortField;
        const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";
        const qRaw = (searchParams.get("q") || "").trim();

        const pref = {
            sectors: csv(searchParams.get("sectors")),
            regions: csv(searchParams.get("regions")),
            business_type: csv(searchParams.get("business_type")),
            stage: csv(searchParams.get("stage")),
            model: csv(searchParams.get("model")),
            sales_type: csv(searchParams.get("sales_type")),
            ranges: csv(searchParams.get("ranges")),
        };
        const hasPrefFilters = Object.values(pref).some((arr) => arr.length > 0);

        // If we have preference filters, figure out matching investor ids first
        let allowedIds: string[] | null = null;
        if (hasPrefFilters) {
            let pq = supabase.from("investor_preferences").select("investor_id");

            if (pref.sectors.length) pq = pq.overlaps("sectors", pref.sectors);
            if (pref.regions.length) pq = pq.overlaps("regions", pref.regions);
            if (pref.business_type.length) pq = pq.overlaps("business_type", pref.business_type);
            if (pref.stage.length) pq = pq.overlaps("stage", pref.stage);
            if (pref.model.length) pq = pq.overlaps("model", pref.model);
            if (pref.sales_type.length) pq = pq.overlaps("sales_type", pref.sales_type);
            if (pref.ranges.length) pq = pq.in("range", pref.ranges);

            const { data: prefRows, error: prefErr } = await pq;
            if (prefErr) {
                console.error("Preferences filter error:", prefErr);
                return NextResponse.json({ error: prefErr.message }, { status: 500 });
            }
            allowedIds = Array.from(new Set((prefRows ?? []).map((r: any) => r.investor_id)));
            if (allowedIds.length === 0) {
                return NextResponse.json({
                    investors: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 1,
                });
            }
        }

        // Main query against the flat view
        const offset = (page - 1) * limit;
        let query = supabase.from("admin_investors_table").select("*", { count: "exact" });

        if (allowedIds) query = query.in("id", allowedIds);

        if (qRaw.length) {
            const q = qRaw.replace(/,/g, "\\,").replace(/\*/g, "\\*");
            query = query.or(
                [
                    `first_name.ilike.*${q}*`,
                    `last_name.ilike.*${q}*`,
                    `email.ilike.*${q}*`,
                    `firm_name.ilike.*${q}*`,
                ].join(",")
            );
        }

        query = query.order(sortBy, { ascending: sortOrder === "asc" }).range(offset, offset + limit - 1);

        const { data, error, count } = await query;
        if (error) {
            console.error("Investors table error:", error);
            return NextResponse.json({ error: error.message || "Failed to fetch investors" }, { status: 500 });
        }

        // Auth metadata
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const authByEmail = new Map(authUsers.users.map((u) => [u.email?.toLowerCase(), u]));

        const transformed = (data ?? []).map((row: any) => {
            const authUser = authByEmail.get(String(row.email || "").toLowerCase());
            return {
                id: row.id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                profile_image_url: row.profile_image_url,
                investor_category: row.investor_category,
                location: row.location,
                source: row.source,
                created_at: row.created_at,
                last_verified_at: row.last_verified_at,
                last_login: row.last_login,
                activity_score: row.activity_score,
                email_confirmed: !!authUser?.email_confirmed_at,
                created_by_admin: !!authUser?.user_metadata?.created_by_admin,
                firm_name: row.firm_name,
                firm_website: row.firm_website,
                firm_type: row.firm_type,
                firm_location: row.firm_location,
                contact_title: row.contact_title,
                contact_verified: !!row.contact_verified,
            };
        });

        return NextResponse.json({
            investors: transformed,
            total: count || 0,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil((count || 0) / limit)),
        });
    } catch (e: any) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
