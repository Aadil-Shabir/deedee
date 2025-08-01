"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    UserCheck,
    Building2,
    Home,
    UserPlus,
    Plus,
    Upload,
    TrendingUp,
    Activity,
    Calendar,
    CheckCircle,
    Clock,
} from "lucide-react";
import { AddInvestorManuallySheet } from "@/components/admin/investors/add-investor-manually-sheet";
import { AddBulkInvestorsSheet } from "@/components/admin/investors/add-bulk-investors-sheet";

export default function InvestorManagementPage() {
    const [showManualSheet, setShowManualSheet] = useState(false);
    const [showBulkSheet, setShowBulkSheet] = useState(false);

    // Mock data for stats
    const stats = {
        totalInvestors: 1247,
        totalAngels: 523,
        totalVC: 412,
        familyOffice: 186,
        newInvestors: 34,
    };

    return (
        <div className="min-h-screen bg-background p-6 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold gradient-text">Investor Management</h1>
                    <p className="text-lg text-muted-foreground">
                        Manage your investor database, add new investors, and track engagement
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() => setShowManualSheet(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover-glow"
                        size="lg"
                    >
                        <UserPlus className="mr-2 h-5 w-5" />
                        Add Investor Manually
                    </Button>
                    <Button
                        onClick={() => setShowBulkSheet(true)}
                        variant="outline"
                        className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 text-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                        size="lg"
                    >
                        <Upload className="mr-2 h-5 w-5" />
                        Add Bulk Investors
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total Investors */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/80">Total Investors</CardTitle>
                        <div className="p-2 bg-primary/20 rounded-lg">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">
                            {stats.totalInvestors.toLocaleString()}
                        </div>
                        <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                            <span className="text-sm text-emerald-400">+12.5%</span>
                            <span className="text-sm text-muted-foreground ml-1">from last month</span>
                        </div>
                        <Badge variant="secondary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                            Active Database
                        </Badge>
                    </CardContent>
                </Card>

                {/* Total Angels */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/80">Total Angels</CardTitle>
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <UserCheck className="h-5 w-5 text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.totalAngels.toLocaleString()}</div>
                        <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                            <span className="text-sm text-emerald-400">+8.2%</span>
                            <span className="text-sm text-muted-foreground ml-1">from last month</span>
                        </div>
                        <Badge
                            variant="secondary"
                            className="mt-3 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        >
                            Individual Investors
                        </Badge>
                    </CardContent>
                </Card>

                {/* Total VC */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/80">Total VC</CardTitle>
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Building2 className="h-5 w-5 text-purple-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.totalVC.toLocaleString()}</div>
                        <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                            <span className="text-sm text-emerald-400">+15.7%</span>
                            <span className="text-sm text-muted-foreground ml-1">from last month</span>
                        </div>
                        <Badge
                            variant="secondary"
                            className="mt-3 bg-purple-500/10 text-purple-400 border-purple-500/20"
                        >
                            Venture Capital
                        </Badge>
                    </CardContent>
                </Card>

                {/* Family Office */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/80">Family Office</CardTitle>
                        <div className="p-2 bg-amber-500/20 rounded-lg">
                            <Home className="h-5 w-5 text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.familyOffice.toLocaleString()}</div>
                        <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                            <span className="text-sm text-emerald-400">+5.3%</span>
                            <span className="text-sm text-muted-foreground ml-1">from last month</span>
                        </div>
                        <Badge variant="secondary" className="mt-3 bg-amber-500/10 text-amber-400 border-amber-500/20">
                            Private Wealth
                        </Badge>
                    </CardContent>
                </Card>

                {/* New Investors */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-foreground/80">New Investors</CardTitle>
                        <div className="p-2 bg-rose-500/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-rose-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.newInvestors.toLocaleString()}</div>
                        <div className="flex items-center mt-2">
                            <TrendingUp className="h-4 w-4 text-emerald-400 mr-1" />
                            <span className="text-sm text-emerald-400">+22.1%</span>
                            <span className="text-sm text-muted-foreground ml-1">this month</span>
                        </div>
                        <Badge variant="secondary" className="mt-3 bg-rose-500/10 text-rose-400 border-rose-500/20">
                            This Month
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground flex items-center">
                            <Activity className="mr-2 h-5 w-5 text-primary" />
                            Quick Actions
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary"
                            onClick={() => setShowManualSheet(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Single Investor
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                            onClick={() => setShowBulkSheet(true)}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            Bulk Import
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            View All Investors
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-amber-400" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Latest investor updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <p className="text-sm text-foreground">New investor added</p>
                                <p className="text-xs text-muted-foreground">2 minutes ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-foreground">Bulk import completed</p>
                                <p className="text-xs text-muted-foreground">1 hour ago</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-foreground">Database updated</p>
                                <p className="text-xs text-muted-foreground">3 hours ago</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Status */}
                <Card className="border-border/50 bg-card/30 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg text-foreground flex items-center">
                            <CheckCircle className="mr-2 h-5 w-5 text-emerald-400" />
                            System Status
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">Current system health</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Database</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Healthy</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">API Status</span>
                            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Last Backup</span>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">2 hours ago</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sheets */}
            <AddInvestorManuallySheet open={showManualSheet} onOpenChange={setShowManualSheet} />
            <AddBulkInvestorsSheet open={showBulkSheet} onOpenChange={setShowBulkSheet} />
        </div>
    );
}
