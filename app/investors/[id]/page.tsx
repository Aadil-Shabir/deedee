"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useInvestorDetails } from "@/hooks/query-hooks/use-investor-details";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Mail, MapPin, Building2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

function SkeletonLine({ w = "w-40" }: { w?: string }) {
    return <div className={`h-4 ${w} bg-muted animate-pulse rounded`} />;
}

function ChipList({ items }: { items?: string[] | null }) {
    if (!items || items.length === 0) return <span className="text-muted-foreground text-sm">—</span>;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs">
                    {v.replace(/-/g, " ")}
                </Badge>
            ))}
        </div>
    );
}

export default function InvestorDetailsPage() {
    const params = useParams();
    const id = params?.id as string | undefined;
    const { data, isLoading, isError, refetch } = useInvestorDetails(id);

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/admin/investors">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <SkeletonLine w="w-56" />
                </div>

                <Card className="overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                            <div className="h-24 w-24 rounded-full bg-muted animate-pulse" />
                            <div className="space-y-2">
                                <SkeletonLine w="w-48" />
                                <SkeletonLine w="w-32" />
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <SkeletonLine w="w-24" />
                                <SkeletonLine w="w-64" />
                            </div>
                            <div className="space-y-3">
                                <SkeletonLine w="w-24" />
                                <div className="flex gap-2 flex-wrap">
                                    <SkeletonLine w="w-24" />
                                    <SkeletonLine w="w-16" />
                                    <SkeletonLine w="w-20" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <SkeletonLine w="w-24" />
                                <div className="flex gap-2 flex-wrap">
                                    <SkeletonLine w="w-20" />
                                    <SkeletonLine w="w-14" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="max-w-2xl mx-auto p-6 text-center space-y-3">
                <p className="text-destructive font-medium">Failed to load investor.</p>
                <Button onClick={() => refetch()}>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Retry
                </Button>
            </div>
        );
    }

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "—";
    const title = data.contact?.title || data.investor_category || "—";
    const about = data.about || "No description available.";
    const email = data.email;
    const location = data.location || "—";
    const firm = data.firm;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Link href="/admin/investors">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                </Link>
                <h1 className="text-xl font-semibold">Investor Profile</h1>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
                            {data.profile_image_url ? (
                                <Image src={data.profile_image_url} alt={name} fill className="object-cover" />
                            ) : (
                                <div className="h-full w-full grid place-items-center text-muted-foreground">
                                    {name.slice(0, 1) || "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-2xl font-semibold">{name}</h2>
                                {data.activity_score ? (
                                    <Badge variant="outline" className="text-xs">
                                        Activity {data.activity_score}
                                    </Badge>
                                ) : null}
                                {data.last_verified_at ? (
                                    <Badge className="text-xs" variant="secondary">
                                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                                        Verified
                                    </Badge>
                                ) : null}
                            </div>
                            <p className="text-muted-foreground mt-1">{title}</p>
                            <div className="flex gap-3 mt-2 text-sm text-muted-foreground flex-wrap">
                                <span className="inline-flex items-center gap-1">
                                    <Mail className="h-3.5 w-3.5" /> {email}
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" /> {location}
                                </span>
                                {firm?.firm_name ? (
                                    <span className="inline-flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5" /> {firm.firm_name}
                                        {firm.website_url && (
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 ml-1"
                                                onClick={() => window.open(firm.website_url!, "_blank")}
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <Separator className="my-6" />

                    {/* About */}
                    <div className="space-y-2">
                        <h3 className="font-medium">About</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{about}</p>
                    </div>

                    <Separator className="my-6" />

                    {/* Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Sectors</h4>
                            <ChipList items={data.preferences?.sectors ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Regions</h4>
                            <ChipList items={data.preferences?.regions ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Business Type</h4>
                            <ChipList items={data.preferences?.business_type ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Stage</h4>
                            <ChipList items={data.preferences?.stage ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Model</h4>
                            <ChipList items={data.preferences?.model ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Sales Type</h4>
                            <ChipList items={data.preferences?.sales_type ?? null} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Range</h4>
                            <ChipList items={data.preferences?.range ?? null} />
                            {data.preferences?.sweet_spot ? (
                                <div className="text-xs text-muted-foreground mt-1">
                                    Sweet spot: {data.preferences.sweet_spot}
                                </div>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Amount Funded</h4>
                            <div className="text-sm">{data.preferences?.amount_funded ?? "—"}</div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium">Meta</h4>
                            <div className="flex flex-wrap gap-2">
                                {data.source && (
                                    <Badge variant="outline" className="text-xs capitalize">
                                        Source: {data.source}
                                    </Badge>
                                )}
                                {data.investor_category && (
                                    <Badge variant="outline" className="text-xs">
                                        {data.investor_category}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
