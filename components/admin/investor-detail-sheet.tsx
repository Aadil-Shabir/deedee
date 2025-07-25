"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Globe, ExternalLink, MapPin, DollarSign, Activity, FileText, Briefcase } from "lucide-react";
import type { InvestorCsvData } from "@/types/investor";

interface InvestorDetailSheetProps {
    investor: InvestorCsvData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InvestorDetailSheet({ investor, open, onOpenChange }: InvestorDetailSheetProps) {
    if (!investor) return null;

    const formatArrayValue = (value: string[] | null, emptyText = "Not specified") => {
        if (!value || value.length === 0) return emptyText;
        return value.join(", ");
    };

    const formatCurrency = (value: number | null) => {
        if (!value) return "Not disclosed";
        if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toLocaleString()}`;
    };

    const getInvestorTypeColor = (type: string | null) => {
        switch (type) {
            case "VC":
                return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200";
            case "Angel":
                return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
            case "CVC":
                return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200";
            case "FO":
                return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200";
            case "Fund of Funds":
                return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900 dark:text-pink-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200";
        }
    };

    const getActivityScoreColor = (score: number | null) => {
        if (!score) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
        if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
        if (score >= 40) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="flex-shrink-0">
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <SheetTitle className="text-xl font-bold flex items-center gap-2 mb-2">
                                <Building className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{investor.firm_name || "Unknown Firm"}</span>
                            </SheetTitle>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className={`${getInvestorTypeColor(investor.investor_type)}`}>
                                    {investor.investor_type || "Unknown Type"}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`${getActivityScoreColor(investor.activity_score)}`}
                                >
                                    Activity: {investor.activity_score || "N/A"}
                                </Badge>
                            </div>
                            <SheetDescription className="text-sm">
                                {investor.hq_location || "Location not specified"}
                            </SheetDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                            {investor.website_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(investor.website_url!, "_blank")}
                                    className="h-8"
                                >
                                    <Globe className="h-3 w-3 mr-1" />
                                    Website
                                </Button>
                            )}
                            {investor.linkedin_url && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.open(investor.linkedin_url!, "_blank")}
                                    className="h-8"
                                >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    LinkedIn
                                </Button>
                            )}
                        </div>
                    </div>
                </SheetHeader>

                <Separator className="my-4" />

                <ScrollArea className="flex-1">
                    <div className="space-y-6 pr-4">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building className="h-4 w-4" />
                                    Basic Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Firm Name</label>
                                        <p className="text-sm mt-1">{investor.firm_name || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Investor Type
                                        </label>
                                        <p className="text-sm mt-1">{investor.investor_type || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">HQ Location</label>
                                        <p className="text-sm mt-1">{investor.hq_location || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Fund Vintage Year
                                        </label>
                                        <p className="text-sm mt-1">{investor.fund_vintage_year || "Not specified"}</p>
                                    </div>
                                </div>
                                {investor.other_locations && investor.other_locations.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Other Locations
                                        </label>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {investor.other_locations.map((location, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {location}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Investment Details */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <DollarSign className="h-4 w-4" />
                                    Investment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Fund Size</label>
                                        <p className="text-sm mt-1 font-medium">{formatCurrency(investor.fund_size)}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Check Size Range
                                        </label>
                                        <p className="text-sm mt-1 font-medium">
                                            {investor.check_size_range || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Stage Focus</label>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {investor.stage_focus && investor.stage_focus.length > 0 ? (
                                            investor.stage_focus.map((stage, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {stage}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Geographic & Industry Focus */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Geographic & Industry Focus
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Geographies Invested
                                    </label>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {investor.geographies_invested && investor.geographies_invested.length > 0 ? (
                                            investor.geographies_invested.map((geography, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {geography}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Industries Invested
                                    </label>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {investor.industries_invested && investor.industries_invested.length > 0 ? (
                                            investor.industries_invested.map((industry, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {industry}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Sub-Industries</label>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {investor.sub_industries_invested &&
                                        investor.sub_industries_invested.length > 0 ? (
                                            investor.sub_industries_invested.map((subIndustry, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {subIndustry}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Investment Thesis */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Investment Thesis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Thesis Summary</label>
                                    <p className="text-sm mt-1 leading-relaxed">
                                        {investor.investment_thesis_summary || "No thesis summary available"}
                                    </p>
                                </div>
                                {investor.thesis_industry_distribution && (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Industry Distribution
                                        </label>
                                        <div className="mt-2 space-y-2">
                                            {Object.entries(investor.thesis_industry_distribution).map(
                                                ([industry, percentage]) => (
                                                    <div key={industry} className="flex items-center justify-between">
                                                        <span className="text-sm capitalize">{industry}</span>
                                                        <Badge variant="outline" className="text-xs">
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

                        {/* Portfolio & Exits */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Portfolio & Exits
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {investor.portfolio_companies && investor.portfolio_companies.length > 0 ? (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                            Portfolio Companies ({investor.portfolio_companies.length})
                                        </label>
                                        <div className="space-y-3 max-h-60 overflow-y-auto">
                                            {investor.portfolio_companies.slice(0, 20).map((company, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start justify-between p-3 bg-muted/30 rounded-lg"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium truncate">{company.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {company.industry && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {company.industry}
                                                                </Badge>
                                                            )}
                                                            {company.date && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {company.date}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                                        {company.url && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-6 w-6 p-0"
                                                                onClick={() => window.open(company.url, "_blank")}
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {investor.portfolio_companies.length > 20 && (
                                                <p className="text-xs text-muted-foreground text-center py-2">
                                                    ... and {investor.portfolio_companies.length - 20} more companies
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Portfolio Companies
                                        </label>
                                        <p className="text-sm mt-1 text-muted-foreground">
                                            No portfolio companies listed
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Recent Exits</label>
                                    {investor.recent_exits && investor.recent_exits.length > 0 ? (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {investor.recent_exits.map((exit, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {exit}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm mt-1 text-muted-foreground">No recent exits listed</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Activity & Metadata */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Activity className="h-4 w-4" />
                                    Activity & Metadata
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Activity Score
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className={`${getActivityScoreColor(investor.activity_score)}`}
                                            >
                                                {investor.activity_score || "N/A"}
                                            </Badge>
                                            {investor.activity_score && (
                                                <span className="text-xs text-muted-foreground">/ 100</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Updated
                                        </label>
                                        <p className="text-sm mt-1">
                                            {investor.last_updated_at
                                                ? new Date(investor.last_updated_at).toLocaleDateString()
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
