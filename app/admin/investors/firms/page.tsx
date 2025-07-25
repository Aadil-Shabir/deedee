import { Suspense } from "react";
import { InvestorFirmsTable } from "@/components/admin/investor-firms/investor-firms-table";
import { InvestorFirmsTableSkeleton } from "@/components/admin/investor-firms/investor-firms-table-skeleton";
import { InvestorFirmsStatsCards } from "@/components/admin/investor-firms/investor-firms-stats-cards";
import { InvestorFirmsStatsCardsSkeleton } from "@/components/admin/investor-firms/investor-firms-stats-cards-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InvestorsPage() {
    return (
        <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-full">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">All Investor Firms</h1>
                <p className="text-muted-foreground">View and manage all investor firms in your database</p>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<InvestorFirmsStatsCardsSkeleton />}>
                <InvestorFirmsStatsCards />
            </Suspense>

            {/* Investor Firms Table */}
            <Card className="w-full max-w-full">
                <CardHeader>
                    <CardTitle>Investor Firms Database</CardTitle>
                </CardHeader>
                <CardContent className="p-0 w-full max-w-full overflow-hidden">
                    <Suspense fallback={<InvestorFirmsTableSkeleton />}>
                        <InvestorFirmsTable />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
