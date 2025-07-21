"use client";

import { useState, useEffect } from "react";
import { useInvestorUpload } from "@/hooks/query-hooks/use-investorUpload";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, Save } from "lucide-react";
import {
    Upload,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    User,
    Building,
    Mail,
    Globe,
    TrendingUp,
    Users,
    CheckCircle,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import type { InvestorCsvData } from "@/types/investor";

export default function Admin() {
    const { investors, error, handleFileDrop, clearInvestors, deleteInvestors, saveInvestors } = useInvestorUpload();
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [animateCards, setAnimateCards] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const toggleRow = (id: string) => {
        setExpandedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === investors.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(investors.map((investor) => investor.id!));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return;

        setIsDeleting(true);

        // Simulate API call delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use the hook's delete function
        deleteInvestors(selectedRows);

        // Clear selections
        setSelectedRows([]);
        setIsDeleting(false);
    };

    const handleSave = async () => {
        if (investors.length === 0) return;

        setIsSaving(true);
        setSaveSuccess(false);
        setSaveError(null); // Clear previous errors

        try {
            console.log("🚀 Starting save operation...");

            // Call the save function from the hook
            const savedData = await saveInvestors();

            console.log("=== SAVE OPERATION COMPLETED ===");
            console.log("Saved investors:", savedData);
            console.log("Number of investors saved:", savedData.length);
            console.log("Selected rows at time of save:", selectedRows);

            setSaveSuccess(true);

            // Reset success state after animation
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            console.error("❌ Save failed:", err);

            // Extract meaningful error message
            let errorMessage = "Failed to save investors";
            if (err.message) {
                errorMessage = err.message;
            } else if (typeof err === "string") {
                errorMessage = err;
            }

            setSaveError(errorMessage);

            // Clear error after 10 seconds
            setTimeout(() => setSaveError(null), 10000);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle upload with animation
    const handleFileDropWithAnimation = async (files: File[]) => {
        setIsUploading(true);
        setUploadSuccess(false);
        setAnimateCards(false);
        setSelectedRows([]); // Clear selections on new upload
        setSaveSuccess(false); // Clear save success state
        setSaveError(null); // Clear save error state

        try {
            await handleFileDrop(files);

            // Simulate processing time for better UX
            await new Promise((resolve) => setTimeout(resolve, 800));

            setUploadSuccess(true);
            setAnimateCards(true);

            // Reset success state after animation
            setTimeout(() => setUploadSuccess(false), 2000);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "text/csv": [".csv"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
        },
        onDrop: handleFileDropWithAnimation,
        multiple: false,
        disabled: isUploading,
    });

    // Animate cards when data loads
    useEffect(() => {
        if (investors.length > 0 && animateCards) {
            const timer = setTimeout(() => setAnimateCards(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [investors.length, animateCards]);

    // Clear selections when investors change
    useEffect(() => {
        setSelectedRows((prev) => prev.filter((id) => investors.some((investor) => investor.id === id)));
    }, [investors]);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Header */}
            <header className="flex h-[77px] shrink-0 items-center gap-2 border-b px-4 py-4">
                <div className="">
                    <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-foreground">Investor Management</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Upload and manage investor data from CSV or XLSX files
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8 max-w-7xl">
                    {/* Upload Section */}
                    <Card className="mb-6 sm:mb-8 transition-all duration-300 hover:shadow-md">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                                Upload Investor Data
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div
                                {...getRootProps()}
                                className={`
                  border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 
                  text-center transition-all duration-300 cursor-pointer 
                  min-h-[120px] sm:min-h-[140px] flex flex-col 
                  items-center justify-center relative overflow-hidden
                  ${
                      isDragActive
                          ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
                          : isUploading
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                          : uploadSuccess
                          ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                          : "border-muted hover:border-primary/50 hover:bg-muted/20"
                  }
                  ${isUploading ? "animate-pulse" : ""}
                `}
                            >
                                <input {...getInputProps()} />

                                {/* Upload States */}
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 mx-auto mb-2 sm:mb-3 animate-spin text-blue-500" />
                                        <p className="text-xs sm:text-sm lg:text-base text-blue-600 dark:text-blue-400 font-medium">
                                            Processing your file...
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Please wait while we parse your data
                                        </p>
                                    </>
                                ) : uploadSuccess ? (
                                    <>
                                        <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 mx-auto mb-2 sm:mb-3 text-green-500 animate-bounce" />
                                        <p className="text-xs sm:text-sm lg:text-base text-green-600 dark:text-green-400 font-medium">
                                            Upload successful!
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Your data has been processed
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Upload
                                            className={`
                        h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 mx-auto mb-2 sm:mb-3 
                        transition-all duration-300
                        ${isDragActive ? "text-primary scale-110" : "text-muted-foreground"}
                      `}
                                        />
                                        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md">
                                            {isDragActive
                                                ? "Drop the file here..."
                                                : "Drag & drop a CSV or XLSX file here, or click to select"}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70 mt-1">
                                            Supports .csv and .xlsx files
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Upload Error */}
                            {error && (
                                <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="break-words">{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Save Error */}
                            {saveError && (
                                <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <div className="font-medium mb-1">Save Failed</div>
                                        <div className="text-sm break-words">{saveError}</div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Save Success */}
                            {saveSuccess && (
                                <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200 animate-in slide-in-from-top-2 duration-300">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription>
                                        <div className="font-medium">Save Successful!</div>
                                        <div className="text-sm">All investors have been saved to the database.</div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                <Button
                                    variant="outline"
                                    className="text-xs sm:text-sm flex-1 sm:flex-none bg-transparent transition-all duration-200 hover:scale-105"
                                    onClick={() => {
                                        clearInvestors();
                                        setSelectedRows([]);
                                        setSaveSuccess(false);
                                        setSaveError(null);
                                    }}
                                    disabled={(!investors.length && !error) || isUploading || isSaving}
                                >
                                    Clear Data
                                </Button>

                                {/* Save Button - appears when investors are loaded */}
                                {investors.length > 0 && (
                                    <Button
                                        className={`
                      text-xs sm:text-sm flex-1 sm:flex-none transition-all duration-200 hover:scale-105
                      ${saveSuccess ? "bg-green-600 hover:bg-green-700" : ""}
                      ${saveError ? "bg-red-600 hover:bg-red-700" : ""}
                    `}
                                        onClick={handleSave}
                                        disabled={isSaving || isUploading}
                                    >
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                Saving...
                                            </>
                                        ) : saveSuccess ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Saved!
                                            </>
                                        ) : saveError ? (
                                            <>
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Retry Save
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-3 w-3 mr-1" />
                                                Save Data
                                            </>
                                        )}
                                    </Button>
                                )}

                                {investors.length > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className={`
                      text-xs sm:text-sm px-2 py-1 self-start sm:self-center
                      transition-all duration-300
                      ${animateCards ? "animate-bounce" : ""}
                    `}
                                    >
                                        {investors.length} investor{investors.length !== 1 ? "s" : ""} loaded
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Data Preview */}
                    {investors.length > 0 && (
                        <Card
                            className={`
                transition-all duration-500 ease-out
                ${animateCards ? "animate-in slide-in-from-bottom-4 fade-in" : ""}
              `}
                        >
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
                                        <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Investor Data Preview
                                    </CardTitle>
                                    <div className="flex items-center gap-3">
                                        {selectedRows.length > 0 && (
                                            <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                                                <Badge variant="secondary" className="text-xs sm:text-sm">
                                                    {selectedRows.length} selected
                                                </Badge>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="text-xs sm:text-sm h-8 px-3 transition-all duration-200 hover:scale-105"
                                                    onClick={handleBulkDelete}
                                                    disabled={isDeleting || isSaving}
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3 mr-1" />
                                                    )}
                                                    Delete{" "}
                                                    {selectedRows.length > 1 ? `${selectedRows.length} items` : "item"}
                                                </Button>
                                            </div>
                                        )}
                                        <Badge variant="outline" className="text-xs sm:text-sm">
                                            {investors.length} records
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 sm:p-6">
                                {/* Desktop/Tablet Table View */}
                                <div className="hidden md:block">
                                    <ScrollArea className="w-full">
                                        <div className="min-w-[800px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-12">
                                                            <Checkbox
                                                                checked={
                                                                    selectedRows.length === investors.length &&
                                                                    investors.length > 0
                                                                }
                                                                onCheckedChange={toggleSelectAll}
                                                                aria-label="Select all"
                                                                className="transition-all duration-200"
                                                                disabled={isSaving}
                                                            />
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Contact
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Firm
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Type
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Business Stages
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Location
                                                        </TableHead>
                                                        <TableHead className="text-xs lg:text-sm font-medium">
                                                            Relations
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {investors.map((investor: InvestorCsvData, index) => {
                                                        const isSelected = selectedRows.includes(investor.id!);
                                                        return (
                                                            <TableRow
                                                                key={investor.id}
                                                                className={`
                                  transition-all duration-200
                                  ${isSelected ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"}
                                  ${animateCards ? `animate-in slide-in-from-left-4 fade-in` : ""}
                                  ${isSaving ? "opacity-60" : ""}
                                `}
                                                                style={{
                                                                    animationDelay: animateCards
                                                                        ? `${index * 50}ms`
                                                                        : undefined,
                                                                    animationFillMode: "both",
                                                                }}
                                                            >
                                                                <TableCell className="py-3">
                                                                    <Checkbox
                                                                        checked={isSelected}
                                                                        onCheckedChange={() =>
                                                                            toggleRowSelection(investor.id!)
                                                                        }
                                                                        aria-label={`Select ${investor.PrimaryContactFirstName} ${investor.PrimaryContactLastName}`}
                                                                        className="transition-all duration-200"
                                                                        disabled={isSaving}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <div className="space-y-1">
                                                                        <p className="text-xs lg:text-sm font-medium">
                                                                            {investor.PrimaryContactFirstName}{" "}
                                                                            {investor.PrimaryContactLastName}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground break-all">
                                                                            {investor.PrimaryContactEmail}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-xs lg:text-sm py-3">
                                                                    {investor.InvestorFirm}
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {investor.InvestorType}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="text-xs lg:text-sm py-3">
                                                                    {investor.BusinessStages || "N/A"}
                                                                </TableCell>
                                                                <TableCell className="text-xs lg:text-sm py-3">
                                                                    {investor.HQCountry}
                                                                </TableCell>
                                                                <TableCell className="py-3">
                                                                    <Badge
                                                                        variant={
                                                                            investor.InvestorRelations
                                                                                ? "default"
                                                                                : "outline"
                                                                        }
                                                                        className="text-xs"
                                                                    >
                                                                        {investor.InvestorRelations || "N/A"}
                                                                    </Badge>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </ScrollArea>
                                </div>

                                {/* Mobile Card Layout */}
                                <div className="block md:hidden px-3 sm:px-4">
                                    {/* Mobile Select All */}
                                    <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                checked={
                                                    selectedRows.length === investors.length && investors.length > 0
                                                }
                                                onCheckedChange={toggleSelectAll}
                                                aria-label="Select all"
                                                disabled={isSaving}
                                            />
                                            <span className="text-sm font-medium">Select All</span>
                                        </div>
                                        {selectedRows.length > 0 && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="text-xs h-8 px-3"
                                                onClick={handleBulkDelete}
                                                disabled={isDeleting || isSaving}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                ) : (
                                                    <Trash2 className="h-3 w-3 mr-1" />
                                                )}
                                                Delete ({selectedRows.length})
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-3 sm:space-y-4">
                                        {investors.map((investor: InvestorCsvData, index) => {
                                            const isSelected = selectedRows.includes(investor.id!);
                                            return (
                                                <Card
                                                    key={investor.id}
                                                    className={`
                            shadow-sm transition-all duration-300 hover:shadow-md
                            ${isSelected ? "ring-2 ring-primary/20 bg-primary/5" : ""}
                            ${animateCards ? `animate-in slide-in-from-right-4 fade-in` : ""}
                            ${isSaving ? "opacity-60" : ""}
                          `}
                                                    style={{
                                                        animationDelay: animateCards ? `${index * 100}ms` : undefined,
                                                        animationFillMode: "both",
                                                    }}
                                                >
                                                    <CardContent className="p-3 sm:p-4">
                                                        {/* Selection and Main Info Row */}
                                                        <div className="flex items-start gap-3 mb-3">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() => toggleRowSelection(investor.id!)}
                                                                aria-label={`Select ${investor.PrimaryContactFirstName} ${investor.PrimaryContactLastName}`}
                                                                className="mt-1"
                                                                disabled={isSaving}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <p className="text-sm font-medium truncate">
                                                                        {investor.PrimaryContactFirstName}{" "}
                                                                        {investor.PrimaryContactLastName}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <Building className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <p className="text-xs text-muted-foreground truncate">
                                                                        {investor.InvestorFirm}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {investor.HQCountry}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 flex-shrink-0 transition-transform duration-200 hover:scale-110"
                                                                onClick={() => toggleRow(investor.id!)}
                                                                aria-label={
                                                                    expandedRows.includes(investor.id!)
                                                                        ? "Collapse"
                                                                        : "Expand"
                                                                }
                                                                disabled={isSaving}
                                                            >
                                                                {expandedRows.includes(investor.id!) ? (
                                                                    <ChevronUp className="h-4 w-4" />
                                                                ) : (
                                                                    <ChevronDown className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>

                                                        {/* Type and Status Badges */}
                                                        <div className="flex flex-wrap gap-2 mb-3 ml-6">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {investor.InvestorType}
                                                            </Badge>
                                                            {investor.InvestorRelations && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    {investor.InvestorRelations}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Expanded Details */}
                                                        {expandedRows.includes(investor.id!) && (
                                                            <div className="pt-3 border-t space-y-2 animate-in slide-in-from-top-2 duration-200 ml-6">
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <span className="text-xs font-medium">Email:</span>
                                                                    <span className="text-xs text-muted-foreground break-all">
                                                                        {investor.PrimaryContactEmail}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <TrendingUp className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                                                    <span className="text-xs font-medium">
                                                                        Business Stages:
                                                                    </span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {investor.BusinessStages || "N/A"}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Empty State */}
                    {investors.length === 0 && !error && !isUploading && (
                        <Card className="text-center py-12 transition-all duration-300 hover:shadow-md">
                            <CardContent>
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <h3 className="text-lg font-medium mb-2">No data uploaded yet</h3>
                                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                    Upload a CSV or XLSX file to view and manage your investor data
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
