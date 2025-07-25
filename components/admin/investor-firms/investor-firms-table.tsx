"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Search,
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
    Loader2,
    AlertTriangle,
    Building2,
    MapPin,
    DollarSign,
    X,
    Filter,
    Check,
    PlusCircle,
    Send,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { InvestorSourceUtils } from "@/lib/investor-source-utils";
import type { InvestorFirmWithSource } from "@/types/investor-source";
import { toast } from "@/hooks/use-toast";
import { SendToFoundersModal } from "./send-to-founders-modal";

// Types
interface InvestorFirmsResponse {
    firms: InvestorFirmWithSource[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Sorting types
type SortField = "firm_name" | "investor_type" | "hq_location" | "fund_size" | "source" | "last_updated_at";
type SortDirection = "asc" | "desc";

// Filter types
interface FilterOption {
    label: string;
    value: string;
    count?: number;
}

export function InvestorFirmsTable() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [firms, setFirms] = useState<InvestorFirmWithSource[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: "single" | "bulk"; ids: string[]; firmName?: string }>({
        type: "bulk",
        ids: [],
    });
    const [showSendToFoundersModal, setShowSendToFoundersModal] = useState(false);

    // Filters and pagination from URL params
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedTypes, setSelectedTypes] = useState<string[]>(
        searchParams.get("types")?.split(",").filter(Boolean) || []
    );
    const [selectedSources, setSelectedSources] = useState<string[]>(
        searchParams.get("sources")?.split(",").filter(Boolean) || []
    );
    const [selectedLocations, setSelectedLocations] = useState<string[]>(
        searchParams.get("locations")?.split(",").filter(Boolean) || []
    );
    const [selectedStages, setSelectedStages] = useState<string[]>(
        searchParams.get("stages")?.split(",").filter(Boolean) || []
    );
    const [fundSizeRange, setFundSizeRange] = useState<string>(searchParams.get("fundSize") || "all");

    const [sortField, setSortField] = useState<SortField>((searchParams.get("sort") as SortField) || "last_updated_at");
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        (searchParams.get("direction") as SortDirection) || "desc"
    );
    const [currentPage, setCurrentPage] = useState(Number.parseInt(searchParams.get("page") || "1"));
    const [pageSize, setPageSize] = useState(Number.parseInt(searchParams.get("limit") || "25"));

    // Derived state
    const totalPages = Math.ceil(total / pageSize);
    const hasActiveFilters =
        search ||
        selectedTypes.length > 0 ||
        selectedSources.length > 0 ||
        selectedLocations.length > 0 ||
        selectedStages.length > 0 ||
        fundSizeRange !== "all";

    // Update URL when filters change
    const updateURL = (params: Record<string, string | number | string[]>) => {
        const newSearchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    newSearchParams.set(key, value.join(","));
                }
            } else if (value && value !== "all" && value !== "") {
                newSearchParams.set(key, value.toString());
            }
        });

        router.push(`?${newSearchParams.toString()}`, { scroll: false });
    };

    // Get all unique filter options from firms data
    const filterOptions = useMemo(() => {
        const types = new Map<string, number>();
        const sources = new Map<string, number>();
        const locations = new Map<string, number>();
        const stages = new Map<string, number>();

        firms.forEach((firm) => {
            // Types
            if (firm.investor_type) {
                types.set(firm.investor_type, (types.get(firm.investor_type) || 0) + 1);
            }

            // Sources
            if (firm.source) {
                sources.set(firm.source, (sources.get(firm.source) || 0) + 1);
            }

            // Locations
            if (firm.hq_location) {
                locations.set(firm.hq_location, (locations.get(firm.hq_location) || 0) + 1);
            }

            // Stages
            if (firm.stage_focus) {
                firm.stage_focus.forEach((stage) => {
                    stages.set(stage, (stages.get(stage) || 0) + 1);
                });
            }
        });

        return {
            types: Array.from(types.entries()).map(([value, count]) => ({ label: value, value, count })),
            sources: Array.from(sources.entries()).map(([value, count]) => ({
                label: InvestorSourceUtils.getSourceDescription(value),
                value,
                count,
            })),
            locations: Array.from(locations.entries()).map(([value, count]) => ({ label: value, value, count })),
            stages: Array.from(stages.entries()).map(([value, count]) => ({ label: value, value, count })),
        };
    }, [firms]);

    // Fund size options
    const fundSizeOptions: FilterOption[] = [
        { label: "All Sizes", value: "all" },
        { label: "Under $10M", value: "under-10m" },
        { label: "$10M - $50M", value: "10m-50m" },
        { label: "$50M - $100M", value: "50m-100m" },
        { label: "$100M - $500M", value: "100m-500m" },
        { label: "$500M - $1B", value: "500m-1b" },
        { label: "Over $1B", value: "over-1b" },
    ];

    // Fetch firms data
    const fetchFirms = async () => {
        console.log("🔄 Starting to fetch investor firms...");
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: pageSize.toString(),
                ...(search && { search }),
                ...(selectedTypes.length > 0 && { types: selectedTypes.join(",") }),
                ...(selectedSources.length > 0 && { sources: selectedSources.join(",") }),
                ...(selectedLocations.length > 0 && { locations: selectedLocations.join(",") }),
                ...(selectedStages.length > 0 && { stages: selectedStages.join(",") }),
                ...(fundSizeRange !== "all" && { fundSize: fundSizeRange }),
            });

            const url = `/api/admin/investor-firms?${params}`;
            console.log("📡 Fetching from URL:", url);

            const response = await fetch(url);
            console.log("📥 Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Response not OK:", errorText);
                throw new Error(`Failed to fetch investor firms: ${response.status} ${response.statusText}`);
            }

            const data: InvestorFirmsResponse = await response.json();
            console.log("✅ Received data:", {
                firmsCount: data.firms?.length || 0,
                total: data.total,
                page: data.page,
                limit: data.limit,
                totalPages: data.totalPages,
            });

            setFirms(data.firms || []);
            setTotal(data.total || 0);
        } catch (err: any) {
            console.error("❌ Error fetching investor firms:", err);
            setError(err.message);
        } finally {
            setLoading(false);
            console.log("🏁 Fetch completed");
        }
    };

    // Effects
    useEffect(() => {
        console.log("🔄 useEffect triggered - fetching firms");
        fetchFirms();
    }, [
        currentPage,
        pageSize,
        search,
        selectedTypes,
        selectedSources,
        selectedLocations,
        selectedStages,
        fundSizeRange,
    ]);

    // Handlers
    const handleSort = (field: SortField) => {
        const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortDirection(newDirection);
        setCurrentPage(1);
        updateURL({
            sort: field,
            direction: newDirection,
            page: 1,
            types: selectedTypes,
            sources: selectedSources,
            locations: selectedLocations,
            stages: selectedStages,
            fundSize: fundSizeRange,
            search,
        });
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
        updateURL({
            search: value,
            page: 1,
            types: selectedTypes,
            sources: selectedSources,
            locations: selectedLocations,
            stages: selectedStages,
            fundSize: fundSizeRange,
        });
    };

    const handleFilterChange = (type: string, values: string[]) => {
        setCurrentPage(1);

        const updateParams = {
            page: 1,
            search,
            types: selectedTypes,
            sources: selectedSources,
            locations: selectedLocations,
            stages: selectedStages,
            fundSize: fundSizeRange,
        };

        switch (type) {
            case "types":
                setSelectedTypes(values);
                updateParams.types = values;
                break;
            case "sources":
                setSelectedSources(values);
                updateParams.sources = values;
                break;
            case "locations":
                setSelectedLocations(values);
                updateParams.locations = values;
                break;
            case "stages":
                setSelectedStages(values);
                updateParams.stages = values;
                break;
            case "fundSize":
                setFundSizeRange(values[0] || "all");
                updateParams.fundSize = values[0] || "all";
                break;
        }

        updateURL(updateParams);
    };

    const clearAllFilters = () => {
        setSearch("");
        setSelectedTypes([]);
        setSelectedSources([]);
        setSelectedLocations([]);
        setSelectedStages([]);
        setFundSizeRange("all");
        setCurrentPage(1);
        updateURL({ search: "", types: [], sources: [], locations: [], stages: [], fundSize: "all", page: 1 });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        updateURL({
            page,
            search,
            types: selectedTypes,
            sources: selectedSources,
            locations: selectedLocations,
            stages: selectedStages,
            fundSize: fundSizeRange,
        });
    };

    const handlePageSizeChange = (size: string) => {
        const newSize = Number.parseInt(size);
        setPageSize(newSize);
        setCurrentPage(1);
        updateURL({
            limit: newSize,
            page: 1,
            search,
            types: selectedTypes,
            sources: selectedSources,
            locations: selectedLocations,
            stages: selectedStages,
            fundSize: fundSizeRange,
        });
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === firms.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(firms.map((firm) => firm.id));
        }
    };

    // Delete handlers
    const handleBulkDeleteClick = () => {
        if (selectedRows.length === 0) return;
        setDeleteTarget({ type: "bulk", ids: selectedRows });
        setShowDeleteDialog(true);
    };

    const handleSingleDeleteClick = (firmId: string, firmName: string) => {
        setDeleteTarget({ type: "single", ids: [firmId], firmName });
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);

        try {
            console.log(`🗑️ Starting delete operation for ${deleteTarget.ids.length} firms:`, deleteTarget.ids);

            const response = await fetch("/api/admin/investor-firms", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firmIds: deleteTarget.ids,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete firms");
            }

            const result = await response.json();
            console.log("✅ Delete result:", result);

            // Update local state by removing deleted firms
            setFirms((prevFirms) => prevFirms.filter((firm) => !deleteTarget.ids.includes(firm.id)));
            setTotal((prevTotal) => prevTotal - deleteTarget.ids.length);

            // Clear selections and close dialog
            setSelectedRows([]);
            setShowDeleteDialog(false);

            // Show success toast
            toast({
                title: "Success",
                description: `Successfully deleted ${deleteTarget.ids.length} investor firm${
                    deleteTarget.ids.length > 1 ? "s" : ""
                }`,
            });

            // Refresh the data to ensure consistency
            await fetchFirms();
        } catch (error: any) {
            console.error("❌ Delete failed:", error);
            toast({
                title: "Error",
                description: `Failed to delete firms: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleViewDetails = (firmId: string) => {
        router.push(`/investor/${firmId}`);
    };

    const handleEdit = (firmId: string) => {
        router.push(`/admin/investors/${firmId}/edit`);
    };

    // Render sort icon
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        return sortDirection === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Format currency
    const formatCurrency = (value: number | null) => {
        if (!value) return "—";
        if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
        return `$${value.toLocaleString()}`;
    };

    // Get initials for avatar
    const getInitials = (firmName: string) => {
        return firmName
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Clear selections when firms change
    useEffect(() => {
        setSelectedRows((prev) => prev.filter((id) => firms.some((firm) => firm.id === id)));
    }, [firms]);

    // Multi-select filter component
    const MultiSelectFilter = ({
        title,
        options,
        selected,
        onSelectionChange,
        icon: Icon,
    }: {
        title: string;
        options: FilterOption[];
        selected: string[];
        onSelectionChange: (values: string[]) => void;
        icon: any;
    }) => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed bg-transparent">
                    <Icon className="mr-2 h-4 w-4" />
                    {title}
                    {selected.length > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selected.length}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selected.length > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selected.length} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selected.includes(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selected.includes(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                onSelectionChange(selected.filter((value) => value !== option.value));
                                            } else {
                                                onSelectionChange([...selected, option.value]);
                                            }
                                        }}
                                    >
                                        <div
                                            className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary ${
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            }`}
                                        >
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span>{option.label}</span>
                                        {option.count && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {option.count}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selected.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => onSelectionChange([])}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );

    // Debug logging
    console.log("🔍 Current state:", {
        loading,
        error,
        firmsCount: firms.length,
        total,
        currentPage,
        pageSize,
        selectedRows: selectedRows.length,
    });

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Error loading investor firms</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <Button onClick={fetchFirms}>Try Again</Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Investor Firms
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage and view all investor firms in your database
                            </p>
                        </div>

                        {/* Bulk Actions */}
                        {selectedRows.length > 0 && (
                            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                <Badge variant="secondary" className="text-xs">
                                    {selectedRows.length} selected
                                </Badge>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowSendToFoundersModal(true)}
                                        disabled={isDeleting}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Send to Founders
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkDeleteClick}
                                        disabled={isDeleting}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Selected
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search firms, types, locations..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <MultiSelectFilter
                            title="Type"
                            options={filterOptions.types}
                            selected={selectedTypes}
                            onSelectionChange={(values) => handleFilterChange("types", values)}
                            icon={Building2}
                        />

                        <MultiSelectFilter
                            title="Source"
                            options={filterOptions.sources}
                            selected={selectedSources}
                            onSelectionChange={(values) => handleFilterChange("sources", values)}
                            icon={Filter}
                        />

                        <MultiSelectFilter
                            title="Location"
                            options={filterOptions.locations}
                            selected={selectedLocations}
                            onSelectionChange={(values) => handleFilterChange("locations", values)}
                            icon={MapPin}
                        />

                        <MultiSelectFilter
                            title="Stage"
                            options={filterOptions.stages}
                            selected={selectedStages}
                            onSelectionChange={(values) => handleFilterChange("stages", values)}
                            icon={PlusCircle}
                        />

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border-dashed bg-transparent">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Fund Size
                                    {fundSizeRange !== "all" && (
                                        <>
                                            <Separator orientation="vertical" className="mx-2 h-4" />
                                            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                                {fundSizeOptions.find((opt) => opt.value === fundSizeRange)?.label}
                                            </Badge>
                                        </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                                <Command>
                                    <CommandList>
                                        <CommandGroup>
                                            {fundSizeOptions.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => handleFilterChange("fundSize", [option.value])}
                                                >
                                                    <div
                                                        className={`mr-2 flex h-4 w-4 items-center justify-center rounded-full border border-primary ${
                                                            fundSizeRange === option.value
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50"
                                                        }`}
                                                    >
                                                        {fundSizeRange === option.value && (
                                                            <div className="h-2 w-2 rounded-full bg-current" />
                                                        )}
                                                    </div>
                                                    <span>{option.label}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 lg:px-3">
                                Reset
                                <X className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {search && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: {search}
                                    <X className="h-3 w-3 cursor-pointer" onClick={() => handleSearch("")} />
                                </Badge>
                            )}
                            {selectedTypes.map((type) => (
                                <Badge key={type} variant="secondary" className="gap-1">
                                    Type: {type}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() =>
                                            handleFilterChange(
                                                "types",
                                                selectedTypes.filter((t) => t !== type)
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                            {selectedSources.map((source) => (
                                <Badge key={source} variant="secondary" className="gap-1">
                                    Source: {InvestorSourceUtils.getSourceDescription(source)}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() =>
                                            handleFilterChange(
                                                "sources",
                                                selectedSources.filter((s) => s !== source)
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                            {selectedLocations.map((location) => (
                                <Badge key={location} variant="secondary" className="gap-1">
                                    Location: {location}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() =>
                                            handleFilterChange(
                                                "locations",
                                                selectedLocations.filter((l) => l !== location)
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                            {selectedStages.map((stage) => (
                                <Badge key={stage} variant="secondary" className="gap-1">
                                    Stage: {stage}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() =>
                                            handleFilterChange(
                                                "stages",
                                                selectedStages.filter((s) => s !== stage)
                                            )
                                        }
                                    />
                                </Badge>
                            ))}
                            {fundSizeRange !== "all" && (
                                <Badge variant="secondary" className="gap-1">
                                    Fund Size: {fundSizeOptions.find((opt) => opt.value === fundSizeRange)?.label}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => handleFilterChange("fundSize", ["all"])}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                            Showing{" "}
                            {loading
                                ? "..."
                                : `${(currentPage - 1) * pageSize + 1} to ${Math.min(
                                      currentPage * pageSize,
                                      total
                                  )} of ${total}`}{" "}
                            results
                            {hasActiveFilters && " (filtered)"}
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Show</span>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-8 w-16 bg-transparent">
                                        {pageSize}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-32 p-0" align="end">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {[10, 25, 50, 100].map((size) => (
                                                    <CommandItem
                                                        key={size}
                                                        onSelect={() => handlePageSizeChange(size.toString())}
                                                    >
                                                        <Check
                                                            className={`mr-2 h-4 w-4 ${
                                                                pageSize === size ? "opacity-100" : "opacity-0"
                                                            }`}
                                                        />
                                                        {size}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <span>per page</span>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="border rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedRows.length === firms.length && firms.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                                disabled={isDeleting || loading}
                                            />
                                        </TableHead>
                                        <TableHead className="min-w-[280px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("firm_name")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                <Building2 className="mr-2 h-4 w-4" />
                                                Firm Name
                                                {renderSortIcon("firm_name")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("investor_type")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Type
                                                {renderSortIcon("investor_type")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[160px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("hq_location")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                <MapPin className="mr-2 h-4 w-4" />
                                                Location
                                                {renderSortIcon("hq_location")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[120px]">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort("fund_size")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                <DollarSign className="mr-2 h-4 w-4" />
                                                Fund Size
                                                {renderSortIcon("fund_size")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="min-w-[140px]">Stage Focus</TableHead>
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
                                                onClick={() => handleSort("last_updated_at")}
                                                className="h-auto p-0 font-semibold hover:bg-transparent"
                                            >
                                                Updated
                                                {renderSortIcon("last_updated_at")}
                                            </Button>
                                        </TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
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
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                                                            <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-6 w-20 bg-muted animate-pulse rounded-full" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                                                        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : firms.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Building2 className="h-12 w-12 text-muted-foreground/50" />
                                                    <div>
                                                        <h3 className="font-medium text-muted-foreground">
                                                            {hasActiveFilters
                                                                ? "No firms match your filters"
                                                                : "No investor firms found"}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground/70 mt-1">
                                                            {hasActiveFilters
                                                                ? "Try adjusting your search criteria"
                                                                : "Upload some data to get started"}
                                                        </p>
                                                    </div>
                                                    {hasActiveFilters && (
                                                        <Button variant="outline" size="sm" onClick={clearAllFilters}>
                                                            Clear Filters
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        firms.map((firm) => (
                                            <TableRow
                                                key={firm.id}
                                                className={`hover:bg-muted/30 transition-colors ${
                                                    selectedRows.includes(firm.id)
                                                        ? "bg-primary/5 border-l-2 border-l-primary"
                                                        : ""
                                                }`}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedRows.includes(firm.id)}
                                                        onCheckedChange={() => toggleRowSelection(firm.id)}
                                                        aria-label={`Select ${firm.firm_name}`}
                                                        disabled={isDeleting}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                                            <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                                                {getInitials(firm.firm_name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="font-semibold text-sm truncate">
                                                                {firm.firm_name}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                                                {firm.website_url && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-4 w-4 p-0 hover:text-primary"
                                                                        onClick={() =>
                                                                            window.open(firm.website_url!, "_blank")
                                                                        }
                                                                    >
                                                                        <ExternalLink className="h-3 w-3" />
                                                                    </Button>
                                                                )}
                                                                <span className="truncate">
                                                                    {firm.website_url
                                                                        ? new URL(firm.website_url).hostname
                                                                        : "No website"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-xs font-medium">
                                                        {firm.investor_type}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-medium">{firm.hq_location}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm font-semibold">
                                                        {formatCurrency(firm.fund_size)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {firm.stage_focus?.slice(0, 2).map((stage) => (
                                                            <Badge key={stage} variant="outline" className="text-xs">
                                                                {stage}
                                                            </Badge>
                                                        ))}
                                                        {firm.stage_focus && firm.stage_focus.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{firm.stage_focus.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs font-medium ${InvestorSourceUtils.getSourceBadgeColor(
                                                            firm.source
                                                        )}`}
                                                    >
                                                        {InvestorSourceUtils.getSourceDescription(firm.source)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(firm.last_updated_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleViewDetails(firm.id)}
                                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(firm.id)}
                                                            className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleViewDetails(firm.id)}
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEdit(firm.id)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Firm
                                                                </DropdownMenuItem>
                                                                {firm.website_url && (
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            window.open(firm.website_url!, "_blank")
                                                                        }
                                                                    >
                                                                        <ExternalLink className="mr-2 h-4 w-4" />
                                                                        Visit Website
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    className="text-destructive focus:text-destructive"
                                                                    onClick={() =>
                                                                        handleSingleDeleteClick(firm.id, firm.firm_name)
                                                                    }
                                                                    disabled={isDeleting}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Firm
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {!loading && firms.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            <div className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                    className="hidden sm:flex"
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
                                    Previous
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
                                                className="w-9 h-9"
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
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                    className="hidden sm:flex"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            {deleteTarget.type === "single" ? (
                                <>
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-foreground">"{deleteTarget.firmName}"</span>?
                                </>
                            ) : (
                                <>
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold text-foreground">
                                        {deleteTarget.ids.length} investor firm{deleteTarget.ids.length > 1 ? "s" : ""}
                                    </span>
                                    ?
                                </>
                            )}
                            <br />
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
                                    Delete{" "}
                                    {deleteTarget.type === "single"
                                        ? "Firm"
                                        : `${deleteTarget.ids.length} Firm${deleteTarget.ids.length > 1 ? "s" : ""}`}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Send to Founders Modal */}
            <SendToFoundersModal
                open={showSendToFoundersModal}
                onOpenChange={setShowSendToFoundersModal}
                selectedFirmIds={selectedRows}
                selectedFirmNames={firms.filter((firm) => selectedRows.includes(firm.id)).map((firm) => firm.firm_name)}
                onSuccess={() => {
                    setSelectedRows([]);
                    fetchFirms();
                }}
            />
        </>
    );
}
