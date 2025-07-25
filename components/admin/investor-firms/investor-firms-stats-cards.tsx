import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Bot, UserCheck, Crown } from "lucide-react";

interface InvestorFirmsStats {
    total: number;
    adminUploaded: number;
    foundersAdded: number;
    selfRegistered: number;
    aiAdded: number;
    insights: {
        topTypes: Array<{ type: string; count: number }>;
        topLocations: Array<{ location: string; count: number }>;
        recentGrowth: number;
    };
}

async function getInvestorFirmsStats(): Promise<InvestorFirmsStats> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/investor-firms/stats`,
            {
                cache: "no-store", // Always fetch fresh data
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch stats");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching investor firms stats:", error);
        // Return default values on error
        return {
            total: 0,
            adminUploaded: 0,
            foundersAdded: 0,
            selfRegistered: 0,
            aiAdded: 0,
            insights: {
                topTypes: [],
                topLocations: [],
                recentGrowth: 0,
            },
        };
    }
}

export async function InvestorFirmsStatsCards() {
    const stats = await getInvestorFirmsStats();

    // Calculate percentages
    const adminPercentage = stats.total > 0 ? Math.round((stats.adminUploaded / stats.total) * 100) : 0;
    const foundersPercentage = stats.total > 0 ? Math.round((stats.foundersAdded / stats.total) * 100) : 0;
    const selfRegPercentage = stats.total > 0 ? Math.round((stats.selfRegistered / stats.total) * 100) : 0;
    const aiPercentage = stats.total > 0 ? Math.round((stats.aiAdded / stats.total) * 100) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">All investor firms</p>
                    {stats.insights.recentGrowth > 0 && (
                        <div className="mt-2">
                            <Badge variant="outline" className="text-xs text-green-600">
                                +{stats.insights.recentGrowth} this month
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Admin Uploaded</CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.adminUploaded.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Uploaded by admins ({adminPercentage}%)</p>
                    <div className="mt-2">
                        <Badge variant="default" className="text-xs">
                            Primary Source
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Founders Added</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.foundersAdded.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Added by founders ({foundersPercentage}%)</p>
                    <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                            Community Driven
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Self Registered</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.selfRegistered.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">Self-registered ({selfRegPercentage}%)</p>
                    <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                            Direct Sign-ups
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">AI Added</CardTitle>
                    <Bot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.aiAdded.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">AI discovered ({aiPercentage}%)</p>
                    <div className="mt-2">
                        <Badge
                            variant="outline"
                            className={`text-xs ${
                                stats.insights.recentGrowth > 0 ? "text-green-600" : "text-muted-foreground"
                            }`}
                        >
                            {stats.insights.recentGrowth > 0
                                ? `+${stats.insights.recentGrowth} recent`
                                : "No recent growth"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
