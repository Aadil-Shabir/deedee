"use client";

import { useState, useEffect } from "react";
import { useInvestorContactUpload } from "@/hooks/query-hooks/use-investor-contact-upload";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InvestorContactDetailSheet } from "@/components/admin/investor-contacts/investor-contact-detail-sheet";
import {
    Upload,
    AlertCircle,
    Trash2,
    Save,
    CheckCircle,
    Loader2,
    AlertTriangle,
    Users,
    MapPin,
    Mail,
    Phone,
    Activity,
    Eye,
    Info,
    X,
} from "lucide-react";
import type { InvestorContactCsvData } from "@/types/investor-contact";
import { useRouter } from "next/navigation";

export default function InvestorContactsUploadPage() {
    const {
        uploadedData,
        error,
        errors,
        duplicates,
        handleFileDrop,
        clearData,
        removeRow,
        removeSelectedRows,
        saveContacts,
    } = useInvestorContactUpload();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showErrors, setShowErrors] = useState(false);
    const [selectedContact, setSelectedContact] = useState<InvestorContactCsvData | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const router = useRouter();

    const toggleRowSelection = (id: string) => {
        setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === uploadedData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(uploadedData.map((contact, index) => index.toString()));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedRows.length === 0) return;
        setIsDeleting(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        removeSelectedRows(selectedRows.map((id) => Number.parseInt(id)));
        setSelectedRows([]);
        setIsDeleting(false);
    };

    const handleSave = async () => {
        if (uploadedData.length === 0) return;

        setIsSaving(true);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            console.log("🚀 Starting save operation...");
            console.log("📊 Contacts to save:", uploadedData.length);

            const savedData = await saveContacts();

            console.log("=== SAVE OPERATION COMPLETED ===");
            console.log("Saved contacts:", savedData.length);

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err: any) {
            console.error("❌ Save failed:", err);

            let errorMessage = "Failed to save contacts";
            if (err.message) {
                errorMessage = err.message;
            } else if (typeof err === "string") {
                errorMessage = err;
            }

            // Check if this is a setup error
            if (errorMessage.includes("Database setup") || errorMessage.includes("doesn't exist")) {
                setSaveError("Database setup required. Click here to set up the database.");
                // Add a click handler to the error message
                document.querySelector(".setup-error-link")?.addEventListener("click", () => {
                    router.push("/admin/setup");
                });
            } else {
                setSaveError(errorMessage);
            }

            setTimeout(() => setSaveError(null), 10000);
        } finally {
            setIsSaving(false);
        }
    };

    const handleViewDetails = (contact: InvestorContactCsvData) => {
        setSelectedContact(contact);
        setSheetOpen(true);
    };

    const handleFileDropWithAnimation = async (files: File[]) => {
        setIsUploading(true);
        setUploadSuccess(false);
        setSelectedRows([]);
        setShowErrors(false);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            await handleFileDrop(files);
            await new Promise((resolve) => setTimeout(resolve, 800));
            setUploadSuccess(true);
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

    const formatArrayValue = (value: string[] | null) => {
        if (!value || value.length === 0) return "—";
        if (value.length <= 2) return value.join(", ");
        return `${value.slice(0, 2).join(", ")} +${value.length - 2}`;
    };

    const getRoleTypeBadgeColor = (roleType: string | null) => {
        if (!roleType) return "bg-muted text-muted-foreground border-border";

        const lowerType = roleType.toLowerCase();
        if (lowerType.includes("decision") || lowerType.includes("partner")) {
            return "bg-primary/10 text-primary border-primary/20";
        } else if (lowerType.includes("analyst")) {
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        } else if (lowerType.includes("support")) {
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
        return "bg-muted text-muted-foreground border-border";
    };

    const getIntroMethodBadgeColor = (method: string | null) => {
        if (!method) return "bg-muted text-muted-foreground border-border";

        const lowerMethod = method.toLowerCase();
        if (lowerMethod.includes("cold")) {
            return "bg-red-500/10 text-red-400 border-red-500/20";
        } else if (lowerMethod.includes("intro")) {
            return "bg-green-500/10 text-green-400 border-green-500/20";
        } else if (lowerMethod.includes("event")) {
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        }
        return "bg-muted text-muted-foreground border-border";
    };

    useEffect(() => {
        setSelectedRows((prev) => prev.filter((id) => uploadedData.some((_, index) => index.toString() === id)));
    }, [uploadedData]);

    return (
        <>
            <div className="flex flex-col gap-6 p-4 sm:p-6 w-full max-w-full">
                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Upload Investor Contacts</h1>
                    <p className="text-muted-foreground">Import investor contact data from CSV or Excel files</p>
                </div>

                {/* Upload Section */}
                <Card className="transition-all duration-300 hover:shadow-md">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Data Import
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div
                            {...getRootProps()}
                            className={`
                border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer 
                min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden
                ${
                    isDragActive
                        ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
                        : isUploading
                        ? "border-primary/60 bg-primary/5"
                        : uploadSuccess
                        ? "border-green-500/60 bg-green-500/5"
                        : "border-muted hover:border-primary/50 hover:bg-muted/20"
                }
                ${isUploading ? "animate-pulse" : ""}
              `}
                        >
                            <input {...getInputProps()} />

                            {isUploading ? (
                                <>
                                    <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                                    <p className="text-lg text-primary font-medium">Processing your file...</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Parsing and validating contact data
                                    </p>
                                </>
                            ) : uploadSuccess ? (
                                <>
                                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500 animate-bounce" />
                                    <p className="text-lg text-green-400 font-medium">Upload successful!</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Your data has been processed and validated
                                    </p>
                                </>
                            ) : (
                                <>
                                    <Upload
                                        className={`
                      h-12 w-12 mx-auto mb-4 transition-all duration-300
                      ${isDragActive ? "text-primary scale-110" : "text-muted-foreground"}
                    `}
                                    />
                                    <p className="text-lg text-muted-foreground max-w-md">
                                        {isDragActive
                                            ? "Drop the file here..."
                                            : "Drag & drop a CSV or XLSX file here, or click to select"}
                                    </p>
                                    <p className="text-sm text-muted-foreground/70 mt-2">
                                        Supports .csv and .xlsx files with investor contact data
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Error Display */}
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
                                    <div
                                        className={`text-sm break-words ${
                                            saveError.includes("Database setup")
                                                ? "cursor-pointer setup-error-link underline"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            if (saveError.includes("Database setup")) {
                                                router.push("/admin/setup");
                                            }
                                        }}
                                    >
                                        {saveError}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Save Success */}
                        {saveSuccess && (
                            <Alert className="border-green-500/20 bg-green-500/5 text-green-400 animate-in slide-in-from-top-2 duration-300">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <AlertDescription>
                                    <div className="font-medium">Save Successful!</div>
                                    <div className="text-sm">
                                        All investor contacts have been saved to the database.
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Source Detection Info */}
                        {uploadedData.length > 0 && (
                            <Alert className="border-primary/20 bg-primary/5 text-primary">
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="font-medium mb-1">Data Source Detected</div>
                                    <div className="text-sm">
                                        All {uploadedData.length} records will be saved as{" "}
                                        <Badge variant="outline" className="mx-1 text-xs">
                                            Admin Import
                                        </Badge>
                                        (no source column found, defaulting to admin)
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Validation Errors */}
                        {errors.length > 0 && (
                            <Alert className="border-orange-500/20 bg-orange-500/5 text-orange-400">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">Found {errors.length} validation errors</div>
                                            <div className="text-sm mt-1">
                                                Click to {showErrors ? "hide" : "view"} detailed error list
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowErrors(!showErrors)}
                                            className="text-orange-400 hover:bg-orange-500/10"
                                        >
                                            {showErrors ? <X className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                                        </Button>
                                    </div>

                                    {showErrors && (
                                        <div className="mt-4 max-h-40 overflow-y-auto">
                                            <Separator className="mb-2" />
                                            {errors.slice(0, 10).map((err, index) => (
                                                <div
                                                    key={index}
                                                    className="text-xs py-1 border-b border-orange-500/20 last:border-0"
                                                >
                                                    <span className="font-medium">Row {err.row}:</span> {err.message}
                                                    {err.value && (
                                                        <span className="text-orange-300 ml-1">({err.value})</span>
                                                    )}
                                                </div>
                                            ))}
                                            {errors.length > 10 && (
                                                <div className="text-xs text-orange-300 mt-2">
                                                    ... and {errors.length - 10} more errors
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    clearData();
                                    setSelectedRows([]);
                                    setShowErrors(false);
                                    setSaveSuccess(false);
                                    setSaveError(null);
                                }}
                                disabled={(!uploadedData.length && !error) || isUploading || isSaving}
                                className="flex-1 sm:flex-none"
                            >
                                Clear Data
                            </Button>

                            {uploadedData.length > 0 && (
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving || isUploading}
                                    className={`
                    flex-1 sm:flex-none transition-all duration-200 hover:scale-105
                    ${saveSuccess ? "bg-green-600 hover:bg-green-700" : ""}
                    ${saveError ? "bg-red-600 hover:bg-red-700" : ""}
                  `}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Saving to Database...
                                        </>
                                    ) : saveSuccess ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Saved!
                                        </>
                                    ) : saveError ? (
                                        <>
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Retry Save
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save to Database
                                        </>
                                    )}
                                </Button>
                            )}

                            {uploadedData.length > 0 && (
                                <Badge variant="secondary" className="self-start sm:self-center px-3 py-1">
                                    {uploadedData.length} contact{uploadedData.length !== 1 ? "s" : ""} loaded
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Preview */}
                {uploadedData.length > 0 && (
                    <Card className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Contact Data Preview
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                    {selectedRows.length > 0 && (
                                        <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-200">
                                            <Badge variant="secondary">{selectedRows.length} selected</Badge>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleBulkDelete}
                                                disabled={isDeleting || isSaving}
                                            >
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                Delete{" "}
                                                {selectedRows.length > 1 ? `${selectedRows.length} items` : "item"}
                                            </Button>
                                        </div>
                                    )}
                                    <Badge variant="outline">{uploadedData.length} records</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 w-full overflow-hidden">
                            <div className="w-full overflow-x-auto">
                                <div className="min-w-[1300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead className="w-12 bg-muted/50">
                                                    <Checkbox
                                                        checked={
                                                            selectedRows.length === uploadedData.length &&
                                                            uploadedData.length > 0
                                                        }
                                                        onCheckedChange={toggleSelectAll}
                                                        disabled={isSaving}
                                                    />
                                                </TableHead>
                                                <TableHead className="min-w-[200px] bg-muted/50 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        Contact Name
                                                    </div>
                                                </TableHead>
                                                <TableHead className="min-w-[200px] font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4" />
                                                        Email
                                                    </div>
                                                </TableHead>
                                                <TableHead className="min-w-[120px] font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className="h-4 w-4 rounded-full p-0" />
                                                        Role Type
                                                    </div>
                                                </TableHead>
                                                <TableHead className="min-w-[150px] font-semibold">Title</TableHead>
                                                <TableHead className="min-w-[160px] font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4" />
                                                        Location
                                                    </div>
                                                </TableHead>
                                                <TableHead className="min-w-[120px] font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4" />
                                                        Phone
                                                    </div>
                                                </TableHead>
                                                <TableHead className="min-w-[120px] font-semibold">
                                                    Intro Method
                                                </TableHead>
                                                <TableHead className="min-w-[100px] font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Activity className="h-4 w-4" />
                                                        Activity Score
                                                    </div>
                                                </TableHead>
                                                <TableHead className="w-20 font-semibold">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {uploadedData.map((contact, index) => {
                                                const isSelected = selectedRows.includes(index.toString());
                                                return (
                                                    <TableRow
                                                        key={index}
                                                        className={`
                      transition-all duration-200 hover:bg-muted/30
                      ${isSelected ? "bg-primary/5 border-primary/20" : ""}
                      ${isSaving ? "opacity-60" : ""}
                    `}
                                                    >
                                                        <TableCell className="bg-background">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onCheckedChange={() =>
                                                                    toggleRowSelection(index.toString())
                                                                }
                                                                disabled={isSaving}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="bg-background">
                                                            <div className="font-medium text-sm">
                                                                {contact.full_name || "—"}
                                                            </div>
                                                            {contact.firm_id && (
                                                                <div className="text-xs text-muted-foreground">
                                                                    Firm: {contact.firm_id}
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{contact.email || "—"}</div>
                                                            {contact.email_verified && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-xs bg-green-50 text-green-700 border-green-200 mt-1"
                                                                >
                                                                    Verified
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${getRoleTypeBadgeColor(
                                                                    contact.role_type
                                                                )}`}
                                                            >
                                                                {contact.role_type || "—"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{contact.title || "—"}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{contact.location || "—"}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm">{contact.mobile_phone || "—"}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {contact.intro_method ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`text-xs ${getIntroMethodBadgeColor(
                                                                        contact.intro_method
                                                                    )}`}
                                                                >
                                                                    {contact.intro_method}
                                                                </Badge>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className="text-xs">
                                                                {contact.activity_score || "—"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleViewDetails(contact)}
                                                                className="h-8 w-8 p-0 hover:bg-muted"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty State */}
                {uploadedData.length === 0 && !error && !isUploading && (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Upload className="h-16 w-16 mx-auto mb-6 text-muted-foreground/30" />
                            <h3 className="text-xl font-semibold mb-3">Ready to Import Contact Data</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                Upload a CSV or Excel file containing investor contact information to get started. We'll
                                validate the data and show you a preview before saving.
                            </p>
                            <div className="text-sm text-muted-foreground">
                                <p className="mb-2">Required fields include:</p>
                                <div className="flex flex-wrap justify-center gap-2 mb-4">
                                    {["Full Name", "Email", "Role Type"].map((field) => (
                                        <Badge key={field} variant="outline" className="text-xs">
                                            {field}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    💡 <strong>Tip:</strong> Include optional fields like firm_id, title, phone,
                                    location, etc. for more complete contact profiles.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Detail Sheet */}
            <InvestorContactDetailSheet contact={selectedContact} open={sheetOpen} onOpenChange={setSheetOpen} />
        </>
    );
}
