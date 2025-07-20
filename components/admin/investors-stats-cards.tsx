import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Building, Globe, BarChart3, MapPin } from "lucide-react";

interface InvestorStats {
    total: number;
    adminAdded: number;
    userRegistered: number;
    thisMonth: number;
    insights: {
        topCountries: Array<{ country: string; count: number }>;
        topCategories: Array<{ category: string; count: number }>;
        growthData: Array<{ month: string; count: number }>;
    };
}

async function getInvestorStats(): Promise<InvestorStats> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/investors/stats`,
            {
                cache: "no-store", // Always fetch fresh data
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching investor stats:", error);
        // Return default values on error
        return {
            total: 0,
            adminAdded: 0,
            userRegistered: 0,
            thisMonth: 0,
            insights: {
                topCountries: [],
                topCategories: [],
                growthData: [],
            },
        };
    }
}

export async function InvestorStatsCards() {
    const stats = await getInvestorStats();

    // Calculate percentage changes (mock calculation for demo)
    const adminPercentage = stats.total > 0 ? Math.round((stats.adminAdded / stats.total) * 100) : 0;
    const userPercentage = stats.total > 0 ? Math.round((stats.userRegistered / stats.total) * 100) : 0;

    // Calculate growth trend
    const growthTrend =
        stats.insights.growthData.length >= 2
            ? stats.insights.growthData[stats.insights.growthData.length - 1].count -
              stats.insights.growthData[stats.insights.growthData.length - 2].count
            : 0;

    return (
        <>
            {/* Main Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">All investors in database</p>
                        {stats.insights.topCountries.length > 0 && (
                            <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                    Top: {stats.insights.topCountries[0].country} (
                                    {stats.insights.topCountries[0].count})
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Admin Added</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.adminAdded.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Added via admin import ({adminPercentage}%)</p>
                        {stats.insights.topCategories.length > 0 && (
                            <div className="mt-2">
                                <Badge variant="secondary" className="text-xs">
                                    Top: {stats.insights.topCategories[0].category}
                                </Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">User Registered</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.userRegistered.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Self-registered users ({userPercentage}%)</p>
                        <div className="mt-2">
                            <Badge variant="outline" className="text-xs">
                                {stats.userRegistered > stats.adminAdded ? "Majority" : "Minority"} source
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.thisMonth.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            New this month
                            {growthTrend !== 0 && (
                                <span className={`ml-1 ${growthTrend > 0 ? "text-green-600" : "text-red-600"}`}>
                                    ({growthTrend > 0 ? "+" : ""}
                                    {growthTrend})
                                </span>
                            )}
                        </p>
                        <div className="mt-2">
                            <Badge variant={stats.thisMonth > 0 ? "default" : "secondary"} className="text-xs">
                                {stats.thisMonth > 0 ? "Active Growth" : "No Growth"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Insights Cards */}
            {(stats.insights.topCountries.length > 0 || stats.insights.topCategories.length > 0) && (
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Top Countries */}
                    {stats.insights.topCountries.length > 0 && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Countries</CardTitle>
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stats.insights.topCountries.slice(0, 5).map((country, index) => (
                                        <div key={country.country} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">#{index + 1}</span>
                                                <span className="text-sm">{country.country}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {country.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Top Categories */}
                    {stats.insights.topCategories.length > 0 && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {stats.insights.topCategories.slice(0, 5).map((category, index) => (
                                        <div key={category.category} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium">#{index + 1}</span>
                                                <span className="text-sm">{category.category}</span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {category.count}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Growth Chart Data (for future chart implementation) */}
            {stats.insights.growthData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Growth Trend (Last 6 Months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between space-x-2">
                            {stats.insights.growthData.map((data, index) => (
                                <div key={data.month} className="text-center">
                                    <div className="text-xs text-muted-foreground">{data.month}</div>
                                    <div className="text-sm font-medium">{data.count}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    );
}
