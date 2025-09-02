"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseFiltersFromSearchParams, encodeFiltersToSearchParams } from "@/lib/utils/filter-url";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkDeleteInvestorsDialog } from "./bulk-delete-investors-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import {
    getInvestorsTable,
    type SortField,
    type SortOrder,
    type InvestorsResponse,
    type InvestorData,
} from "@/lib/services/admin-investors";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CheckCircle,
    XCircle,
    User,
    Building2,
} from "lucide-react";
import { DeleteInvestorDialog } from "./delete-investor-dialog";

import {
    InvestorsFiltersBar,
    defaultInvestorsFilters,
} from "@/components/admin/investors/filters/investors-filters-bar";

export function ComprehensiveInvestorsTable() {
    const [investors, setInvestors] = useState<InvestorData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    // Pagination and sorting
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    const [sortBy, setSortBy] = useState<SortField>("created_at");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [investorToDelete, setInvestorToDelete] = useState<InvestorData | null>(null);

    // Filters
    const [filters, setFilters] = useState(defaultInvestorsFilters());
    const debouncedFilters = useDebounce(filters, 350);

    // Router States
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    const totalPages = Math.ceil(total / pageSize);

    useEffect(() => {
        // Only on first mount: hydrate filters from URL
        const initial = parseFiltersFromSearchParams(new URLSearchParams(searchParams.toString()));
        setFilters((prev) => ({ ...prev, ...initial }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch investors data
    const fetchInvestors = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInvestorsTable({
                page: currentPage,
                limit: pageSize,
                sortBy,
                sortOrder,
                filters: debouncedFilters,
            });
            setInvestors(data.investors);
            setTotal(data.total);
        } catch (err: any) {
            setError(err.message);
            console.error("Error fetching investors:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const sp = new URLSearchParams(searchParams.toString());
        encodeFiltersToSearchParams(sp, debouncedFilters);
        sp.set("page", "1"); // reset page on filter change
        router.replace(`${pathname}?${sp.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters]);

    useEffect(() => {
        // whenever the search changes, reset to first page
        setCurrentPage(1);
    }, [debouncedSearch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedFilters]);

    useEffect(() => {
        fetchInvestors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, sortBy, sortOrder, debouncedFilters, debouncedSearch]);

    // Handlers
    const handleSort = (field: SortField) => {
        const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortOrder(newOrder);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: string) => {
        const newSize = Number.parseInt(size);
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handleDeleteClick = (investor: InvestorData) => {
        setInvestorToDelete(investor);
        setDeleteDialogOpen(true);
    };

    const handleDeleteSuccess = () => {
        // Refresh the table data
        fetchInvestors();
    };

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return sortOrder === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
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

    const currentPageIds = investors.map((i) => i.id);
    const allPageSelected = currentPageIds.length > 0 && currentPageIds.every((id) => selectedIds.has(id));
    const somePageSelected = currentPageIds.some((id) => selectedIds.has(id));
    const headerChecked: boolean | "indeterminate" = allPageSelected
        ? true
        : somePageSelected
        ? "indeterminate"
        : false;

    const toggleSelectAllOnPage = (checked: boolean | "indeterminate") => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (checked) {
                currentPageIds.forEach((id) => next.add(id));
            } else {
                currentPageIds.forEach((id) => next.delete(id));
            }
            return next;
        });
    };

    const toggleRow = (id: string, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
        });
    };

    const clearSelection = () => setSelectedIds(new Set());

    const onBulkDeleteSuccess = () => {
        clearSelection();
        fetchInvestors();
    };

    const selectedItems = investors
        .filter((inv) => selectedIds.has(inv.id))
        .map((inv) => ({ id: inv.id, email: inv.email.toLowerCase() }));

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 w-full">
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
        <div className="w-full max-w-full">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by investor name, email, or firm…"
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted"
                            onClick={() => setSearch("")}
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                    )}
                </div>
            </div>
            <InvestorsFiltersBar value={filters} onChange={setFilters} />
            <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                    {selectedIds.size > 0 ? (
                        <>
                            <span className="font-medium">{selectedIds.size}</span> selected
                            <Button variant="ghost" size="sm" className="ml-2" onClick={clearSelection}>
                                Clear
                            </Button>
                        </>
                    ) : (
                        <span>Select rows to bulk delete</span>
                    )}
                    {isBulkDeleting && (
                        <div className="mb-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
                            Deleting selected investors… Please wait.
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        disabled={selectedIds.size === 0 || isBulkDeleting}
                        onClick={() => setBulkDialogOpen(true)}
                    >
                        Delete Selected
                    </Button>
                </div>
            </div>
            {/* Table Container with Horizontal Scroll */}
            <div className="w-full max-w-full overflow-hidden border border-border/50 rounded-lg bg-card/30 backdrop-blur-md shadow-lg">
                <ScrollArea className="w-full">
                    <div className="min-w-[1200px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border/50">
                                    <TableHead className="w-[44px]">
                                        <Checkbox
                                            checked={headerChecked}
                                            onCheckedChange={(v) =>
                                                !isBulkDeleting && toggleSelectAllOnPage(Boolean(v))
                                            }
                                            disabled={isBulkDeleting}
                                            aria-label="Select all on page"
                                        />
                                    </TableHead>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead className="min-w-[250px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("first_name")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Investor
                                            {renderSortIcon("first_name")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("email")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Email
                                            {renderSortIcon("email")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("firm_name")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Firm
                                            {renderSortIcon("firm_name")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">Category</TableHead>
                                    <TableHead className="min-w-[150px]">Location</TableHead>
                                    <TableHead className="min-w-[120px]">Status</TableHead>
                                    <TableHead className="min-w-[100px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("source")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Source
                                            {renderSortIcon("source")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[100px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("activity_score")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Activity
                                            {renderSortIcon("activity_score")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="min-w-[120px]">
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort("created_at")}
                                            className="h-auto p-0 font-semibold hover:bg-transparent"
                                        >
                                            Added
                                            {renderSortIcon("created_at")}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="w-[50px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    // Loading skeleton
                                    Array.from({ length: pageSize }).map((_, index) => (
                                        <TableRow key={index} className="border-border/50">
                                            <TableCell>
                                                <div className="h-4 w-8 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                                        <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                            <TableCell>
                                                <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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
                                            <div className="text-muted-foreground">No investors found.</div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    investors.map((investor, index) => (
                                        <TableRow key={investor.id} className="hover:bg-muted/50 border-border/50">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.has(investor.id)}
                                                    onCheckedChange={(v) =>
                                                        !isBulkDeleting && toggleRow(investor.id, Boolean(v))
                                                    }
                                                    disabled={isBulkDeleting}
                                                    aria-label={`Select ${investor.email}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-muted-foreground">
                                                {(currentPage - 1) * pageSize + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                                        <AvatarImage
                                                            src={investor.profile_image_url || "/placeholder.svg"}
                                                        />
                                                        <AvatarFallback className="text-sm">
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
                                                            {investor.contact_title || "Contact"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <span className="truncate">{investor.email}</span>
                                                    {investor.email_confirmed ? (
                                                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-rose-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {investor.firm_name ? (
                                                    <div className="flex items-center space-x-2 min-w-0">
                                                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-medium truncate">
                                                                {investor.firm_name}
                                                            </div>
                                                            {investor.firm_type && (
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {investor.firm_type}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {investor.firm_website && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-4 w-4 p-0 flex-shrink-0"
                                                                onClick={() =>
                                                                    window.open(investor.firm_website!, "_blank")
                                                                }
                                                            >
                                                                <ExternalLink className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2 text-muted-foreground">
                                                        <User className="h-4 w-4" />
                                                        <span className="text-sm">Individual</span>
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {investor.investor_category && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {investor.investor_category}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div className="truncate">{investor.location || "N/A"}</div>
                                                    {investor.firm_location &&
                                                        investor.firm_location !== investor.location && (
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                Firm: {investor.firm_location}
                                                            </div>
                                                        )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-1">
                                                    <Badge
                                                        variant={investor.email_confirmed ? "default" : "secondary"}
                                                        className="text-xs w-fit"
                                                    >
                                                        {investor.email_confirmed ? "Verified" : "Unverified"}
                                                    </Badge>
                                                    {investor.contact_verified && (
                                                        <Badge variant="outline" className="text-xs w-fit">
                                                            Contact ✓
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
                                                <div className="text-xs text-muted-foreground mt-1 capitalize">
                                                    {investor.source}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-center">
                                                    {investor.activity_score ? (
                                                        <Badge variant="outline" className="text-xs">
                                                            {investor.activity_score}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-xs">-</span>
                                                    )}
                                                </div>
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
                                                                window.open(`/investors/${investor.id}`, "_blank")
                                                            }
                                                        >
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Profile
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() => handleDeleteClick(investor)}
                                                        >
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
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

            {/* Delete Confirmation Dialog */}
            {investorToDelete && (
                <DeleteInvestorDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    investor={investorToDelete}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
            <BulkDeleteInvestorsDialog
                open={bulkDialogOpen}
                onOpenChange={setBulkDialogOpen}
                items={selectedItems}
                onSuccess={() => {
                    setSelectedIds(new Set());
                    fetchInvestors();
                }}
                onPendingChange={setIsBulkDeleting}
            />
        </div>
    );
}
