import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function InvestorStatsCardsSkeleton() {
    return (
        <>
            {/* Main Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32 mb-2" />
                            <Skeleton className="h-5 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Insights Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <div key={j} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Skeleton className="h-4 w-4" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <Skeleton className="h-5 w-8" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Growth Chart Skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between space-x-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="text-center">
                                <Skeleton className="h-3 w-12 mb-1" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
