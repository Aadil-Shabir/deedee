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
        <div>
            <p>Dashboard Content will be here</p>
        </div>
    );
}
