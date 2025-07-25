import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Building2,
    Globe,
    ExternalLink,
    MapPin,
    DollarSign,
    Activity,
    FileText,
    Briefcase,
    ArrowLeft,
    Calendar,
    Target,
    TrendingUp,
    Award,
    Linkedin,
    Clock,
    Database,
} from "lucide-react";
import Link from "next/link";
import { InvestorSourceUtils } from "@/lib/investor-source-utils";

interface InvestorFirmDetailProps {
    params: {
        id: string;
    };
}

async function getInvestorFirm(id: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/investor/${id}`,
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching investor firm:", error);
        return null;
    }
}

export default async function InvestorFirmDetailPage({ params }: InvestorFirmDetailProps) {
    const firm = await getInvestorFirm(params.id);

    if (!firm) {
        notFound();
    }

    // Helper functions
    const formatCurrency = (value: number | null) => {
        if (!value) return "Not disclosed";
        if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getInitials = (firmName: string) => {
        return firmName
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatArrayValue = (value: string[] | null, emptyText = "Not specified") => {
        if (!value || value.length === 0) return emptyText;
        return value;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-card">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16 shrink-0">
                                    <AvatarFallback className="text-lg bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                                        {getInitials(firm.firm_name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0">
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                                        {firm.firm_name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                                        {firm.investor_type && (
                                            <Badge variant="secondary" className="font-medium">
                                                {firm.investor_type}
                                            </Badge>
                                        )}
                                        {firm.hq_location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-4 w-4" />
                                                <span>{firm.hq_location}</span>
                                            </div>
                                        )}
                                        <Badge
                                            variant="outline"
                                            className={`${InvestorSourceUtils.getSourceBadgeColor(firm.source)}`}
                                        >
                                            {InvestorSourceUtils.getSourceDescription(firm.source)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {firm.website_url && (
                                <Button variant="outline" asChild>
                                    <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Website
                                    </a>
                                </Button>
                            )}
                            {firm.linkedin_url && (
                                <Button variant="outline" asChild>
                                    <a href={firm.linkedin_url} target="_blank" rel="noopener noreferrer">
                                        <Linkedin className="h-4 w-4 mr-2" />
                                        LinkedIn
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Firm Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Firm Name
                                            </label>
                                            <p className="text-lg font-semibold mt-1">{firm.firm_name}</p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Investor Type
                                            </label>
                                            <div className="mt-2">
                                                <Badge variant="secondary" className="text-sm">
                                                    {firm.investor_type || "Not specified"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Headquarters
                                            </label>
                                            <p className="text-sm mt-1 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {firm.hq_location || "Not specified"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Fund Size
                                            </label>
                                            <p className="text-lg font-semibold mt-1 flex items-center gap-2">
                                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                                {formatCurrency(firm.fund_size)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Fund Vintage Year
                                            </label>
                                            <p className="text-sm mt-1 flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {firm.fund_vintage_year || "Not specified"}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                                Check Size Range
                                            </label>
                                            <p className="text-sm mt-1">{firm.check_size_range || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>

                                {firm.other_locations && firm.other_locations.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                            Other Locations
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {firm.other_locations.map((location: string, index: number) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {location}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Investment Focus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Investment Focus
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Stage Focus */}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                        Stage Focus
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {firm.stage_focus && firm.stage_focus.length > 0 ? (
                                            firm.stage_focus.map((stage: string, index: number) => (
                                                <Badge key={index} variant="secondary" className="text-sm">
                                                    <Activity className="h-3 w-3 mr-1" />
                                                    {stage}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>

                                {/* Geographic Focus */}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                        Geographic Focus
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {firm.geographies_invested && firm.geographies_invested.length > 0 ? (
                                            firm.geographies_invested.map((geography: string, index: number) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {geography}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>

                                {/* Industry Focus */}
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                        Industry Focus
                                    </label>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground">
                                                Industries
                                            </label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {firm.industries_invested && firm.industries_invested.length > 0 ? (
                                                    firm.industries_invested.map((industry: string, index: number) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            <Briefcase className="h-3 w-3 mr-1" />
                                                            {industry}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">Not specified</span>
                                                )}
                                            </div>
                                        </div>

                                        {firm.sub_industries_invested && firm.sub_industries_invested.length > 0 && (
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground">
                                                    Sub-Industries
                                                </label>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {firm.sub_industries_invested.map(
                                                        (subIndustry: string, index: number) => (
                                                            <Badge key={index} variant="outline" className="text-xs">
                                                                {subIndustry}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Investment Thesis */}
                        {firm.investment_thesis_summary && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Investment Thesis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="prose prose-sm max-w-none">
                                        <p className="text-sm leading-relaxed text-foreground">
                                            {firm.investment_thesis_summary}
                                        </p>
                                    </div>

                                    {firm.thesis_industry_distribution && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                                Industry Distribution
                                            </label>
                                            <div className="space-y-2">
                                                {Object.entries(firm.thesis_industry_distribution).map(
                                                    ([industry, percentage]) => (
                                                        <div
                                                            key={industry}
                                                            className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                                                        >
                                                            <span className="text-sm font-medium capitalize">
                                                                {industry}
                                                            </span>
                                                            <Badge variant="secondary" className="text-xs">
                                                                {percentage}%
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Portfolio & Exits */}
                        {((firm.portfolio_companies && firm.portfolio_companies.length > 0) ||
                            (firm.recent_exits && firm.recent_exits.length > 0)) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Award className="h-5 w-5" />
                                        Portfolio & Exits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {firm.portfolio_companies && firm.portfolio_companies.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground mb-4 block">
                                                Portfolio Companies ({firm.portfolio_companies.length})
                                            </label>
                                            <div className="grid gap-3 max-h-96 overflow-y-auto">
                                                {firm.portfolio_companies
                                                    .slice(0, 20)
                                                    .map((company: any, index: number) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                                                        >
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">
                                                                    {company.name}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    {company.industry && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {company.industry}
                                                                        </Badge>
                                                                    )}
                                                                    {company.date && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            <Calendar className="h-3 w-3 mr-1" />
                                                                            {company.date}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {company.url && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0 shrink-0"
                                                                    asChild
                                                                >
                                                                    <a
                                                                        href={company.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        <ExternalLink className="h-4 w-4" />
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ))}
                                                {firm.portfolio_companies.length > 20 && (
                                                    <div className="text-center py-2">
                                                        <Badge variant="outline" className="text-xs">
                                                            +{firm.portfolio_companies.length - 20} more companies
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {firm.recent_exits && firm.recent_exits.length > 0 && (
                                        <div>
                                            <label className="text-sm font-medium text-muted-foreground mb-3 block">
                                                Recent Exits
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {firm.recent_exits.map((exit: string, index: number) => (
                                                    <Badge key={index} variant="outline" className="text-xs">
                                                        <TrendingUp className="h-3 w-3 mr-1" />
                                                        {exit}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">Fund Size</span>
                                        </div>
                                        <span className="text-sm font-semibold">{formatCurrency(firm.fund_size)}</span>
                                    </div>

                                    {firm.activity_score && (
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Activity Score</span>
                                            </div>
                                            <Badge variant="outline" className="text-sm">
                                                {firm.activity_score}
                                            </Badge>
                                        </div>
                                    )}

                                    {firm.portfolio_companies && (
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Portfolio Size</span>
                                            </div>
                                            <span className="text-sm font-semibold">
                                                {firm.portfolio_companies.length}
                                            </span>
                                        </div>
                                    )}

                                    {firm.stage_focus && (
                                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Focus Areas</span>
                                            </div>
                                            <span className="text-sm font-semibold">{firm.stage_focus.length}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact & Links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ExternalLink className="h-5 w-5" />
                                    Links & Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {firm.website_url && (
                                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                                        <a href={firm.website_url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="h-4 w-4 mr-2" />
                                            Visit Website
                                        </a>
                                    </Button>
                                )}

                                {firm.linkedin_url && (
                                    <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                                        <a href={firm.linkedin_url} target="_blank" rel="noopener noreferrer">
                                            <Linkedin className="h-4 w-4 mr-2" />
                                            LinkedIn Profile
                                        </a>
                                    </Button>
                                )}

                                {!firm.website_url && !firm.linkedin_url && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No contact information available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Data Source & Timestamps */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Database className="h-5 w-5" />
                                    Data Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Data Source</label>
                                    <div className="mt-2">
                                        <Badge
                                            variant="outline"
                                            className={`${InvestorSourceUtils.getSourceBadgeColor(firm.source)}`}
                                        >
                                            {InvestorSourceUtils.getSourceDescription(firm.source)}
                                        </Badge>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Created</span>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(firm.created_at)}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Last Updated</span>
                                        <div className="flex items-center gap-1 text-xs">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(firm.last_updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
