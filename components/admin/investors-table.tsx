"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    Edit,
    Trash2,
    Mail,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Types
interface Investor {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    company_url: string | null;
    country: string | null;
    city: string | null;
    investor_category: string | null;
    investment_preference: string | null;
    data_source: string | null;
    created_by_admin: boolean;
    introducer_name: string | null;
    introducer_email: string | null;
    created_at: string;
    stages: string[];
    sectors: string[];
    locations: string[];
    industries: string[];
}

interface InvestorsResponse {
    investors: Investor[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Sorting types
type SortField = "name" | "company" | "country" | "category" | "created_at" | "data_source";
type SortDirection = "asc" | "desc";

export function InvestorsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Filters and pagination from URL params
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
    const [sourceFilter, setSourceFilter] = useState(searchParams.get("source") || "all");
    const [countryFilter, setCountryFilter] = useState(searchParams.get("country") || "all");
    const [sortField, setSortField] = useState<SortField>((searchParams.get("sort") as SortField) || "created_at");
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        (searchParams.get("direction") as SortDirection) || "desc"
    );
    const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"));
    const [pageSize, setPageSize] = useState(Number.parseInt(searchParams.get("limit") || "25"));

    // Derived state
    const totalPages = Math.ceil(total / pageSize);

    // Update URL when filters change
    const updateURL = (params: Record<string, string | number>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());

        Object.entries(params).forEach(([key, value]) => {
            if (value && value !== "all" && value !== "") {
                newSearchParams.set(key, value.toString());
            } else {
                newSearchParams.delete(key);
            }
        });

        router.push(`?${newSearchParams.toString()}`, { scroll: false });
    };

    // Fetch investors data
    const fetchInvestors = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageSize.toString(),
                sort: sortField,
                direction: sortDirection,
                ...(search && { search }),
                ...(categoryFilter !== "all" && { category: categoryFilter }),
                ...(sourceFilter !== "all" && { source: sourceFilter }),
                ...(countryFilter !== "all" && { country: countryFilter }),
            });

            const response = await fetch(`/api/admin/investors?${params}`);

            if (!response.ok) {
                throw new Error("Failed to fetch investors");
            }

            const data: InvestorsResponse = await response.json();
            setInvestors(data.investors);
            setTotal(data.total);
        } catch (err: any) {
            setError(err.message);
            console.error("Error fetching investors:", err);
        } finally {
            setLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        fetchInvestors();
    }, [currentPage, pageSize, sortField, sortDirection, search, categoryFilter, sourceFilter, countryFilter]);

    // Handlers
    const handleSort = (field: SortField) => {
        const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(newDirection);
        setCurrentPage(1);
        updateURL({ sort: field, direction: newDirection, page: 1 });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
        updateURL({ search: value, page: 1 });
    };

    const handleFilterChange = (type: string, value: string) => {
        setCurrentPage(1);

        switch (type) {
            case "category":
                setCategoryFilter(value);
                updateURL({ category: value, page: 1 });
                break;
            case "source":
                setSourceFilter(value);
                updateURL({ source: value, page: 1 });
                break;
            case "country":
                setCountryFilter(value);
                updateURL({ country: value, page: 1 });
                break;
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURL({ page });
    };

    const handlePageSizeChange = (size: string) => {
        const newSize = Number.parseInt(size);
        setPageSize(newSize);
        setCurrentPage(1);
        updateURL({ limit: newSize, page: 1 });
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === investors.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(investors.map((investor) => investor.id));
        }
    };

    const handleDeleteClick = () => {
        if (selectedRows.length === 0) return;
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch("/api/admin/investors", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    investorIds: selectedRows,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete investors");
            }

            const result = await response.json();
            console.log("Delete result:", result);

            // Refresh the data
            await fetchInvestors();

            // Clear selections and close dialog
            setSelectedRows([]);
            setShowDeleteDialog(false);
        } catch (error: any) {
            console.error("Delete failed:", error);
            // You could add a toast notification here instead
            alert(`Failed to delete investors: ${error.message}`);
        } finally {
            setIsDeleting(false);
        }
    };

    // Get unique values for filters
    const uniqueCategories = useMemo(() => {
        const categories = investors.map((inv) => inv.investor_category).filter(Boolean);
        return [...new Set(categories)];
    }, [investors]);

    const uniqueCountries = useMemo(() => {
        const countries = investors.map((inv) => inv.country).filter(Boolean);
        return [...new Set(countries)];
    }, [investors]);

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return sortDirection === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get initials for avatar
    const getInitials = (firstName: string | null, lastName: string | null) => {
        const first = firstName?.charAt(0) || "";
        const last = lastName?.charAt(0) || "";
        return (first + last).toUpperCase() || "?";
    };

    // Clear selections when investors change
    useEffect(() => {
        setSelectedRows((prev) => prev.filter((id) => investors.some((investor) => investor.id === id)));
    }, [investors]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-destructive mb-2">Error loading investors</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button onClick={fetchInvestors} className="mt-4">
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 p-4 sm:p-6">
                {/* Filters and Search */}
                <div className="flex flex-col gap-4">
                    {/* Search and Bulk Actions Row */}
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center space-x-2 min-w-0">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search investors..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>

                            {/* Bulk Actions */}
                            {selectedRows.length > 0 && (
                                <div className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                                        {selectedRows.length} selected
                                    </Badge>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleDeleteClick}
                                        disabled={isDeleting}
                                        className="text-xs whitespace-nowrap"
                                    >
                                        <Trash2 className="h-3 w-3 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filters Row */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                        <div className="flex flex-wrap gap-2">
                            <Select
                                value={categoryFilter}
                                onValueChange={(value) => handleFilterChange("category", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[140px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {uniqueCategories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sourceFilter} onValueChange={(value) => handleFilterChange("source", value)}>
                                <SelectTrigger className="w-full sm:w-[120px]">
                                    <SelectValue placeholder="Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sources</SelectItem>
                                    <SelectItem value="admin_import">Admin Import</SelectItem>
                                    <SelectItem value="user_registration">User Registration</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={countryFilter}
                                onValueChange={(value) => handleFilterChange("country", value)}
                            >
                                <SelectTrigger className="w-full sm:w-[120px]">
                                    <SelectValue placeholder="Country" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Countries</SelectItem>
                                    {uniqueCountries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                            {country}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border overflow-hidden">
                    <ScrollArea className="w-full">
                        <div className="min-w-[1000px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={
                                                    selectedRows.length === investors.length && investors.length > 0
                                                }
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                                disabled={isDeleting}
                                            />
                                        </TableHead>
                                        <TableHead className="w-[50px]">#</TableHead>
                                        <TableHead className="min-w-[200px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("name")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Investor
                                                {renderSortIcon("name")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[150px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("company")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Company
                                                {renderSortIcon("company")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("category")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Category
                                                {renderSortIcon("category")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("country")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Location
                                                {renderSortIcon("country")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">Stages</TableHead>
                                        <TableHead className="min-w-[120px]">Sectors</TableHead>
                                        <TableHead className="min-w-[100px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("data_source")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Source
                                                {renderSortIcon("data_source")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[100px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("created_at")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Added
                                                {renderSortIcon("created_at")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        // Loading skeleton
                                        Array.from({ length: pageSize }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                                                        <div className="space-y-1">
                                                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                                            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : investors.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={11} className="text-center py-8">
                                                <div className="text-muted-foreground">
                                                    {search ||
                                                    categoryFilter !== "all" ||
                                                    sourceFilter !== "all" ||
                                                    countryFilter !== "all"
                                                        ? "No investors found matching your filters."
                                                        : "No investors found."}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        investors.map((investor, index) => (
                                            <TableRow
                                                key={investor.id}
                                                className={`hover:bg-muted/50 ${
                                                    selectedRows.includes(investor.id)
                                                        ? "bg-primary/5 border-primary/20"
                                                        : ""
                                                }`}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(investor.id)}
                                                        onCheckedChange={() => toggleRowSelection(investor.id)}
                                                        aria-label={`Select ${investor.first_name} ${investor.last_name}`}
                                                        disabled={isDeleting}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium text-muted-foreground">
                                                    {(currentPage - 1) * pageSize + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-8 w-8 flex-shrink-0">
                                                            <AvatarImage src="/placeholder.svg" />
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(investor.first_name, investor.last_name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-medium truncate">
                                                                {investor.first_name && investor.last_name
                                                                    ? `${investor.first_name} ${investor.last_name}`
                                                                    : "N/A"}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground truncate">
                                                                {investor.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-2 min-w-0">
                                                        <span className="truncate">
                                                            {investor.company_name || "N/A"}
                                                        </span>
                                                        {investor.company_url && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-4 w-4 p-0 flex-shrink-0"
                                                                onClick={() =>
                                                                    window.open(investor.company_url!, "_blank")
                                                                }
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {investor.investor_category && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {investor.investor_category}
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium truncate">
                                                            {investor.country || "N/A"}
                                                        </div>
                                                        {investor.city && (
                                                            <div className="text-sm text-muted-foreground truncate">
                                                                {investor.city}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {investor.stages.slice(0, 2).map((stage) => (
                                                            <Badge key={stage} variant="outline" className="text-xs">
                                                                {stage}
                                                            </Badge>
                                                        ))}
                                                        {investor.stages.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{investor.stages.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {investor.sectors.slice(0, 2).map((sector) => (
                                                            <Badge key={sector} variant="outline" className="text-xs">
                                                                {sector}
                                                            </Badge>
                                                        ))}
                                                        {investor.sectors.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{investor.sectors.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={investor.created_by_admin ? "default" : "secondary"}
                                                        className="text-xs"
                                                    >
                                                        {investor.created_by_admin ? "Admin" : "User"}
                                                    </Badge>
                                                    {investor.introducer_name && (
                                                        <div className="text-xs text-muted-foreground mt-1 truncate">
                                                            by {investor.introducer_name}
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(investor.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(`/admin/investors/${investor.id}`)
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    router.push(`/admin/investors/${investor.id}/edit`)
                                                                }
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => window.open(`mailto:${investor.email}`)}
                                                            >
                                                                <Mail className="mr-2 h-4 w-4" />
                                                                Send Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </ScrollArea>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2 text-sm">
                        <p className="text-muted-foreground">
                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, total)} of{" "}
                            {total} results
                        </p>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger className="w-[70px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span className="text-muted-foreground">per page</span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center space-x-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNumber;
                                if (totalPages <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNumber}
                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(pageNumber)}
                                        className="w-8"
                                    >
                                        {pageNumber}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                                {selectedRows.length} investor{selectedRows.length > 1 ? "s" : ""}
                            </span>
                            ?
                            <br />
                            <br />
                            This action will permanently remove:
                            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                <li>Investor profiles and contact information</li>
                                <li>Investment preferences and criteria</li>
                                <li>Portfolio and relationship data</li>
                                <li>All associated metadata</li>
                            </ul>
                            <br />
                            <span className="font-semibold text-destructive">This action cannot be undone.</span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="w-full sm:w-auto"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete {selectedRows.length} Investor{selectedRows.length > 1 ? "s" : ""}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
