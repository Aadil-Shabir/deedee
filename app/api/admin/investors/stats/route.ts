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

export async function GET(request: NextRequest) {
    try {
        const supabase = createAdminClient();

        // Get current date and first day of current month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayOfMonthISO = firstDayOfMonth.toISOString();

        console.log("📊 Fetching investor statistics...");
        console.log("Current month start:", firstDayOfMonthISO);

        // 1. Get total investors count
        const { count: totalCount, error: totalError } = await supabase
            .from("investor_profiles")
            .select("*", { count: "exact", head: true });

        if (totalError) {
            console.error("Error fetching total count:", totalError);
            throw new Error(`Failed to fetch total investors: ${totalError.message}`);
        }

        // 2. Get admin-added investors count
        const { count: adminCount, error: adminError } = await supabase
            .from("investor_profiles")
            .select("*", { count: "exact", head: true })
            .eq("created_by_admin", true);

        if (adminError) {
            console.error("Error fetching admin count:", adminError);
            throw new Error(`Failed to fetch admin-added investors: ${adminError.message}`);
        }

        // 3. Get user-registered investors count
        const { count: userCount, error: userError } = await supabase
            .from("investor_profiles")
            .select("*", { count: "exact", head: true })
            .eq("created_by_admin", false);

        if (userError) {
            console.error("Error fetching user count:", userError);
            throw new Error(`Failed to fetch user-registered investors: ${userError.message}`);
        }

        // 4. Get this month's new investors count
        const { count: thisMonthCount, error: monthError } = await supabase
            .from("investor_profiles")
            .select("*", { count: "exact", head: true })
            .gte("created_at", firstDayOfMonthISO);

        if (monthError) {
            console.error("Error fetching this month count:", monthError);
            throw new Error(`Failed to fetch this month's investors: ${monthError.message}`);
        }

        // 5. Get additional insights
        // Top countries
        const { data: countryData, error: countryError } = await supabase
            .from("investor_profiles")
            .select("country")
            .not("country", "is", null);

        if (countryError) {
            console.error("Error fetching country data:", countryError);
        }

        // Top categories
        const { data: categoryData, error: categoryError } = await supabase
            .from("investor_profiles")
            .select("investor_category")
            .not("investor_category", "is", null);

        if (categoryError) {
            console.error("Error fetching category data:", categoryError);
        }

        // Process country data
        const countryStats = countryData?.reduce((acc: Record<string, number>, investor) => {
            if (investor.country) {
                acc[investor.country] = (acc[investor.country] || 0) + 1;
            }
            return acc;
        }, {});

        const topCountries = Object.entries(countryStats || {})
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([country, count]) => ({ country, count }));

        // Process category data
        const categoryStats = categoryData?.reduce((acc: Record<string, number>, investor) => {
            if (investor.investor_category) {
                acc[investor.investor_category] = (acc[investor.investor_category] || 0) + 1;
            }
            return acc;
        }, {});

        const topCategories = Object.entries(categoryStats || {})
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([category, count]) => ({ category, count }));

        // 6. Get growth data (last 6 months)
        const growthData = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

            const { count: monthlyCount, error: monthlyError } = await supabase
                .from("investor_profiles")
                .select("*", { count: "exact", head: true })
                .gte("created_at", monthStart.toISOString())
                .lte("created_at", monthEnd.toISOString());

            if (!monthlyError) {
                growthData.push({
                    month: monthStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
                    count: monthlyCount || 0,
                });
            }
        }

        const stats = {
            total: totalCount || 0,
            adminAdded: adminCount || 0,
            userRegistered: userCount || 0,
            thisMonth: thisMonthCount || 0,
            insights: {
                topCountries,
                topCategories,
                growthData,
            },
        };

        console.log("📊 Statistics calculated:");
        console.log(`   - Total: ${stats.total}`);
        console.log(`   - Admin Added: ${stats.adminAdded}`);
        console.log(`   - User Registered: ${stats.userRegistered}`);
        console.log(`   - This Month: ${stats.thisMonth}`);
        console.log(`   - Top Countries:`, topCountries);
        console.log(`   - Top Categories:`, topCategories);

        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("❌ Stats API Error:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch investor statistics",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
