import { Suspense } from "react";
import { InvestorsTable } from "@/components/admin/investors-table";
import { InvestorsTableSkeleton } from "@/components/admin/investors-table-skeleton";
import { InvestorStatsCards } from "@/components/admin/investors-stats-cards";
import { InvestorStatsCardsSkeleton } from "@/components/admin/investors-stats-cards-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InvestorsPage() {
    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
                <p className="text-muted-foreground">Manage and view all investors in your database</p>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<InvestorStatsCardsSkeleton />}>
                <InvestorStatsCards />
            </Suspense>

            {/* Investors Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Investors</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Suspense fallback={<InvestorsTableSkeleton />}>
                        <InvestorsTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
