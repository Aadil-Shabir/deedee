"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddInvestorManuallySheet } from "@/components/admin/investors/add-investor-manually-sheet";
import { AddBulkInvestorsSheet } from "@/components/admin/investors/add-bulk-investors-sheet";
import { ComprehensiveInvestorsTable } from "@/components/admin/investors/comprehensive-investors-table";
import {
    Users,
    Crown,
    TrendingUp,
    Building2,
    Calendar,
    Plus,
    Upload,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

export default function InvestorsPage() {
    const [showManualSheet, setShowManualSheet] = useState(false);
    const [showBulkSheet, setShowBulkSheet] = useState(false);

    // Mock data for stats
    const stats = [
        {
            title: "Total Investors",
            value: "2,847",
            change: "+12.5%",
            trend: "up",
            icon: Users,
            color: "text-primary",
            bgColor: "bg-primary/10",
            borderColor: "border-primary/20",
        },
        {
            title: "Total Angels",
            value: "1,234",
            change: "+8.2%",
            trend: "up",
            icon: Crown,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
            borderColor: "border-emerald-400/20",
        },
        {
            title: "Total VC",
            value: "856",
            change: "+15.3%",
            trend: "up",
            icon: TrendingUp,
            color: "text-purple-400",
            bgColor: "bg-purple-400/10",
            borderColor: "border-purple-400/20",
        },
        {
            title: "Family Office",
            value: "423",
            change: "+5.7%",
            trend: "up",
            icon: Building2,
            color: "text-amber-400",
            bgColor: "bg-amber-400/10",
            borderColor: "border-amber-400/20",
        },
        {
            title: "New Investors",
            value: "89",
            change: "+23.1%",
            trend: "up",
            icon: Calendar,
            color: "text-rose-400",
            bgColor: "bg-rose-400/10",
            borderColor: "border-rose-400/20",
        },
    ];

    return (
        <div className="space-y-8 p-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Investor Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your investor database, add new contacts, and track relationships
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => setShowBulkSheet(true)}
                        variant="outline"
                        className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 text-foreground hover-glow"
                        size="lg"
                    >
                        <Upload className="mr-2 h-5 w-5" />
                        Add Bulk Investors
                    </Button>
                    <Button
                        onClick={() => setShowManualSheet(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover-glow"
                        size="lg"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Investor Manually
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className={`border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover ${stat.borderColor}`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                                </div>
                                <div className="mt-3 flex items-center text-sm">
                                    {stat.trend === "up" ? (
                                        <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-rose-400 mr-1" />
                                    )}
                                    <span className="text-muted-foreground">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Comprehensive Investors Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">All Investors</h2>
                </div>
                <ComprehensiveInvestorsTable />
            </div>

            {/* Sheets */}
            <AddInvestorManuallySheet open={showManualSheet} onOpenChange={setShowManualSheet} />
            <AddBulkInvestorsSheet open={showBulkSheet} onOpenChange={setShowBulkSheet} />
        </div>
    );
}
