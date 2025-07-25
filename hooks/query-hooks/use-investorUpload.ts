"use client";

import { useState } from "react";
import { parse } from "papaparse";
import { read, utils } from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import type { InvestorCsvData, InvestorUploadError } from "@/types/investor";
import { InvestorSourceUtils } from "@/lib/investor-source-utils";

interface UploadInvestorsParams {
    investors: InvestorCsvData[];
}

interface UploadInvestorsResponse {
    success: boolean;
    savedInvestors: any[];
    sourceStats: Record<string, number>;
    message: string;
}

export function useInvestorUpload() {
    const [investors, setInvestors] = useState<InvestorCsvData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<InvestorUploadError[]>([]);
    const [duplicates, setDuplicates] = useState<string[]>([]);
    const queryClient = useQueryClient();

    const transformHeader = (header: string): string => {
        return header
            .toLowerCase()
            .replace(/\s+/g, "_") // Replace spaces with underscores
            .replace(/[^a-z0-9_]/g, ""); // Remove special characters
    };

    const parseArrayField = (value: string | null): string[] | null => {
        if (!value || value.trim() === "") return null;

        try {
            // Handle JSON array format like ['item1', 'item2'] or ["'item1', 'item2'"]
            if ((value.startsWith("[") && value.endsWith("]")) || (value.startsWith("['") && value.endsWith("']"))) {
                // Clean up the string and parse as JSON
                const cleanValue = value
                    .replace(/'/g, '"') // Replace single quotes with double quotes
                    .replace(/\["/g, '["') // Ensure proper JSON format
                    .replace(/"\]/g, '"]');

                const parsed = JSON.parse(cleanValue);
                return Array.isArray(parsed) ? parsed.filter((item) => item && item.trim()) : null;
            }

            // Handle comma-separated values
            return value
                .split(",")
                .map((item) => item.trim().replace(/^['"]|['"]$/g, "")) // Remove quotes from individual items
                .filter((item) => item.length > 0);
        } catch (error) {
            console.warn("Failed to parse array field:", value, error);
            // Fallback to comma-separated parsing
            return value
                .split(",")
                .map((item) => item.trim().replace(/^['"]|['"]$/g, ""))
                .filter((item) => item.length > 0);
        }
    };

    const parsePortfolioCompanies = (
        value: string | null
    ): Array<{ name: string; url?: string; industry?: string; date?: string }> | null => {
        if (!value || value.trim() === "") return null;

        try {
            // Handle JSON array format
            if (value.startsWith("[") && value.endsWith("]")) {
                const cleanValue = value.replace(/'/g, '"'); // Replace single quotes with double quotes
                const parsed = JSON.parse(cleanValue);

                if (Array.isArray(parsed)) {
                    return parsed
                        .map((item) => {
                            if (typeof item === "string") {
                                // If it's just a string, treat it as company name
                                return { name: item };
                            } else if (typeof item === "object" && item !== null) {
                                // If it's an object, extract the fields
                                return {
                                    name: item.name || item.company_name || "Unknown Company",
                                    url: item.url || item.website || item.link || undefined,
                                    industry: item.industry || item.sector || undefined,
                                    date: item.date || item.investment_date || item.year || undefined,
                                };
                            }
                            return { name: String(item) };
                        })
                        .filter((company) => company.name && company.name.trim());
                }
            }

            // Handle comma-separated company names
            return value
                .split(",")
                .map((item) => ({ name: item.trim().replace(/^['"]|['"]$/g, "") }))
                .filter((company) => company.name.length > 0);
        } catch (error) {
            console.warn("Failed to parse portfolio companies:", value, error);
            // Fallback to comma-separated parsing
            return value
                .split(",")
                .map((item) => ({ name: item.trim().replace(/^['"]|['"]$/g, "") }))
                .filter((company) => company.name.length > 0);
        }
    };

    const parseJsonField = (value: string | null): any => {
        if (!value || value.trim() === "") return null;

        try {
            const cleanValue = value.replace(/'/g, '"'); // Replace single quotes with double quotes
            return JSON.parse(cleanValue);
        } catch {
            return null;
        }
    };

    const validateInvestorData = (data: any, rowIndex: number): { isValid: boolean; errors: InvestorUploadError[] } => {
        const rowErrors: InvestorUploadError[] = [];

        // Required fields validation
        const requiredFields = [
            "firm_name",
            "website_url",
            "linkedin_url",
            "investor_type",
            "hq_location",
            "stage_focus",
            "check_size_range",
            "geographies_invested",
            "industries_invested",
            "sub_industries_invested",
            "investment_thesis_summary",
            "activity_score",
        ];

        requiredFields.forEach((field) => {
            if (!data[field] || (typeof data[field] === "string" && data[field].trim() === "")) {
                rowErrors.push({
                    row: rowIndex + 2, // +2 because of header and 0-based index
                    field,
                    message: `${field.replace(/_/g, " ")} is required`,
                    value: data[field],
                });
            }
        });

        // Removed investor_type enum validation - now accepts any text

        // Validate activity_score range
        if (data.activity_score !== null && data.activity_score !== undefined) {
            const score = Number(data.activity_score);
            if (isNaN(score) || score < 0 || score > 100) {
                rowErrors.push({
                    row: rowIndex + 2,
                    field: "activity_score",
                    message: "Activity score must be a number between 0 and 100",
                    value: data.activity_score,
                });
            }
        }

        // Validate fund_vintage_year
        if (data.fund_vintage_year !== null && data.fund_vintage_year !== undefined) {
            const year = Number(data.fund_vintage_year);
            const currentYear = new Date().getFullYear();
            if (isNaN(year) || year < 1900 || year > currentYear + 5) {
                rowErrors.push({
                    row: rowIndex + 2,
                    field: "fund_vintage_year",
                    message: `Fund vintage year must be between 1900 and ${currentYear + 5}`,
                    value: data.fund_vintage_year,
                });
            }
        }

        // Validate source if provided
        if (data.source && !InvestorSourceUtils.isValidSource(data.source)) {
            rowErrors.push({
                row: rowIndex + 2,
                field: "source",
                message: `Invalid source. Must be one of: admin, investor, founder, ai`,
                value: data.source,
            });
        }

        return {
            isValid: rowErrors.length === 0,
            errors: rowErrors,
        };
    };

    const handleFileDrop = async (acceptedFiles: File[]) => {
        setError(null);
        setErrors([]);
        setDuplicates([]);

        const file = acceptedFiles[0];
        if (!file || ![".csv", ".xlsx"].some((ext) => file.name.toLowerCase().endsWith(ext))) {
            setError("Please upload a valid CSV or XLSX file");
            return;
        }

        console.log("🔍 Processing file:", {
            name: file.name,
            size: file.size,
            type: file.type,
        });

        let data: any[] = [];

        try {
            if (file.name.toLowerCase().endsWith(".csv")) {
                console.log("📄 Processing CSV file...");
                const text = await file.text();

                const { data: csvData, errors: parseErrors } = parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader,
                    delimiter: ",",
                    quoteChar: '"',
                    escapeChar: '"',
                });

                if (parseErrors.length) {
                    console.error("CSV parsing errors:", parseErrors);
                    setError("Error parsing CSV: " + parseErrors[0].message);
                    return;
                }

                data = csvData;
            } else if (file.name.toLowerCase().endsWith(".xlsx")) {
                console.log("📊 Processing XLSX file...");
                const arrayBuffer = await file.arrayBuffer();
                const workbook = read(arrayBuffer, { type: "array" });

                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const jsonData = utils.sheet_to_json(sheet, {
                    header: 1,
                    raw: false,
                    blankrows: false,
                });

                if (jsonData.length < 2) {
                    setError("Excel file must contain at least a header row and one data row.");
                    return;
                }

                const headers = (jsonData[0] as string[]).map(transformHeader);
                const dataRows = jsonData.slice(1);

                data = dataRows.map((row: any) => {
                    const obj: any = {};
                    headers.forEach((header, index) => {
                        const value = row[index];
                        obj[header] = value === undefined || value === "" ? null : String(value).trim();
                    });
                    return obj;
                });
            }

            if (!data || data.length === 0) {
                setError("No valid data found in the file.");
                return;
            }

            console.log("✅ File processed successfully. Total rows:", data.length);
        } catch (parseError: any) {
            console.error("❌ File parsing error:", parseError);
            setError(`Error processing file: ${parseError.message}`);
            return;
        }

        // Process and validate data
        const validInvestors: InvestorCsvData[] = [];
        const allErrors: InvestorUploadError[] = [];
        const seenFirms = new Set<string>();
        const duplicateFirms: string[] = [];

        data.forEach((row, index) => {
            // Skip empty rows
            const hasData = Object.values(row).some((value) => value !== null && value !== undefined && value !== "");
            if (!hasData) return;

            // Validate data
            const { isValid, errors: rowErrors } = validateInvestorData(row, index);
            allErrors.push(...rowErrors);

            if (isValid) {
                // Check for duplicate firm names
                const firmName = row.firm_name?.toLowerCase();
                if (firmName && seenFirms.has(firmName)) {
                    if (!duplicateFirms.includes(row.firm_name)) {
                        duplicateFirms.push(row.firm_name);
                    }
                    return; // Skip duplicate
                }

                if (firmName) {
                    seenFirms.add(firmName);
                }

                // Auto-detect source using the utility function for type safety
                const detectedSource = InvestorSourceUtils.toInvestorSource(row.source);

                // Transform data with proper parsing
                const investor: InvestorCsvData = {
                    id: uuidv4(),
                    firm_name: row.firm_name || null,
                    website_url: row.website_url || null,
                    linkedin_url: row.linkedin_url || null,
                    investor_type: row.investor_type || null, // Now accepts any text
                    hq_location: row.hq_location || null,
                    other_locations: parseArrayField(row.other_locations),
                    fund_size: row.fund_size ? Number(row.fund_size) : null,
                    stage_focus: parseArrayField(row.stage_focus),
                    check_size_range: row.check_size_range || null,
                    geographies_invested: parseArrayField(row.geographies_invested),
                    industries_invested: parseArrayField(row.industries_invested),
                    sub_industries_invested: parseArrayField(row.sub_industries_invested),
                    portfolio_companies: parsePortfolioCompanies(row.portfolio_companies),
                    investment_thesis_summary: row.investment_thesis_summary || null,
                    thesis_industry_distribution: parseJsonField(row.thesis_industry_distribution),
                    fund_vintage_year: row.fund_vintage_year ? Number(row.fund_vintage_year) : null,
                    recent_exits: parseArrayField(row.recent_exits),
                    activity_score: row.activity_score ? Number(row.activity_score) : null,
                    last_updated_at: new Date().toISOString(),
                    isDuplicate: false,
                    // Auto-detected source with proper typing
                    source: detectedSource,
                };

                validInvestors.push(investor);
            }
        });

        setInvestors(validInvestors);
        setErrors(allErrors);
        setDuplicates(duplicateFirms);

        // Log source detection results
        const sourceStats = validInvestors.reduce((acc, inv) => {
            const source = inv.source || "admin";
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        console.log("📊 Source detection results:", sourceStats);

        // Set summary error message
        if (validInvestors.length === 0 && allErrors.length > 0) {
            setError(`No valid data found. Found ${allErrors.length} validation errors.`);
        } else if (allErrors.length > 0) {
            setError(
                `Found ${allErrors.length} validation errors in ${allErrors.length} rows. Valid data displayed below.`
            );
        }

        if (duplicateFirms.length > 0) {
            const duplicateMessage = `Found ${duplicateFirms.length} duplicate firm(s): ${duplicateFirms.join(", ")}`;
            setError((prev) => (prev ? `${prev} ${duplicateMessage}` : duplicateMessage));
        }

        console.log("✅ Processing completed:", {
            validInvestors: validInvestors.length,
            errors: allErrors.length,
            duplicates: duplicateFirms.length,
            sourceBreakdown: sourceStats,
        });
    };

    const clearInvestors = () => {
        setInvestors([]);
        setError(null);
        setErrors([]);
        setDuplicates([]);
    };

    const deleteInvestors = (idsToDelete: string[]) => {
        setInvestors((prev) => prev.filter((investor) => !idsToDelete.includes(investor.id!)));
    };

    const saveInvestorsMutation = useMutation<UploadInvestorsResponse, Error, UploadInvestorsParams>({
        mutationFn: async ({ investors }) => {
            console.log("🚀 Starting upload mutation for", investors.length, "investors");

            // Validate required fields but allow any investor_type
            const validatedInvestors = investors.map((investor, index) => {
                if (!investor.firm_name?.trim()) {
                    throw new Error(`Row ${index + 1}: Firm name is required`);
                }

                if (!investor.hq_location?.trim()) {
                    throw new Error(`Row ${index + 1}: Headquarters location is required`);
                }

                // Allow any text for investor_type - no validation
                if (!investor.investor_type?.trim()) {
                    throw new Error(`Row ${index + 1}: Investor type is required`);
                }

                return {
                    ...investor,
                    firm_name: investor.firm_name.trim(),
                    investor_type: investor.investor_type.trim(), // Accept any text value
                    hq_location: investor.hq_location.trim(),
                    source: investor.source || "admin",
                };
            });

            console.log("✅ Validation passed for", validatedInvestors.length, "investors");

            const response = await fetch("/api/admin/investor-firms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    investors: validatedInvestors,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log("✅ Upload successful:", result);

            return result;
        },
        onSuccess: (data) => {
            console.log("🎉 Upload mutation succeeded:", data);

            // Invalidate and refetch investor firms data
            queryClient.invalidateQueries({ queryKey: ["investor-firms"] });
            queryClient.invalidateQueries({ queryKey: ["investor-firms-stats"] });

            toast({
                title: "Upload Successful",
                description: data.message,
            });
        },
        onError: (error) => {
            console.error("❌ Upload mutation failed:", error);

            toast({
                title: "Upload Failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const saveInvestors = async () => {
        if (investors.length === 0) {
            throw new Error("No investors to save");
        }

        console.log("🚀 Hook: Starting save operation for", investors.length, "investors");

        // Group investors by source for logging
        const sourceGroups = investors.reduce((acc, inv) => {
            const source = inv.source || "admin";
            if (!acc[source]) acc[source] = [];
            acc[source].push(inv);
            return acc;
        }, {} as Record<string, InvestorCsvData[]>);

        console.log(
            "📊 Saving investors by source:",
            Object.entries(sourceGroups)
                .map(([source, invs]) => `${source}: ${invs.length}`)
                .join(", ")
        );

        try {
            const result = await saveInvestorsMutation.mutateAsync({ investors });
            console.log("✅ Hook: Save operation completed successfully");
            console.log("Saved investors:", result.savedInvestors?.length || 0);

            // Clear the local state after successful save
            setInvestors([]);
            setError(null);
            setErrors([]);
            setDuplicates([]);

            return result.savedInvestors || [];
        } catch (error: any) {
            console.error("❌ Hook: Save operation failed:", error);
            throw error;
        }
    };

    return {
        investors,
        error,
        errors,
        duplicates,
        handleFileDrop,
        clearInvestors,
        deleteInvestors,
        saveInvestors,
        saveInvestorsMutation,
    };
}
