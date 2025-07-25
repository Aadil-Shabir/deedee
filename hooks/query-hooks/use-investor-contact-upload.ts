"use client";

import { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import type { InvestorContactCsvData, InvestorContactUploadError } from "@/types/investor-contact";

const REQUIRED_FIELDS = ["full_name", "email", "role_type"];

export function useInvestorContactUpload() {
    const [uploadedData, setUploadedData] = useState<InvestorContactCsvData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<InvestorContactUploadError[]>([]);
    const [duplicates, setDuplicates] = useState<InvestorContactCsvData[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const validateContact = (contact: any, rowIndex: number): InvestorContactUploadError[] => {
        const errors: InvestorContactUploadError[] = [];

        // Required fields validation
        if (!contact.full_name || contact.full_name.trim() === "") {
            errors.push({
                row: rowIndex,
                field: "full_name",
                message: "Full name is required",
                value: contact.full_name,
            });
        }

        if (!contact.email || contact.email.trim() === "") {
            errors.push({
                row: rowIndex,
                field: "email",
                message: "Email is required",
                value: contact.email,
            });
        } else {
            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contact.email)) {
                errors.push({
                    row: rowIndex,
                    field: "email",
                    message: "Invalid email format",
                    value: contact.email,
                });
            }
        }

        if (!contact.role_type || contact.role_type.trim() === "") {
            errors.push({
                row: rowIndex,
                field: "role_type",
                message: "Role type is required",
                value: contact.role_type,
            });
        }

        // Optional field validations
        if (contact.linkedin_url && contact.linkedin_url.trim() !== "") {
            try {
                new URL(contact.linkedin_url);
            } catch {
                errors.push({
                    row: rowIndex,
                    field: "linkedin_url",
                    message: "Invalid LinkedIn URL format",
                    value: contact.linkedin_url,
                });
            }
        }

        if (contact.activity_score !== null && contact.activity_score !== undefined && contact.activity_score !== "") {
            const score = Number(contact.activity_score);
            if (isNaN(score) || score < 0 || score > 100) {
                errors.push({
                    row: rowIndex,
                    field: "activity_score",
                    message: "Activity score must be a number between 0 and 100",
                    value: contact.activity_score,
                });
            }
        }

        if (contact.email_verified !== null && contact.email_verified !== undefined && contact.email_verified !== "") {
            const verified = String(contact.email_verified).toLowerCase();
            if (!["true", "false", "1", "0", "yes", "no"].includes(verified)) {
                errors.push({
                    row: rowIndex,
                    field: "email_verified",
                    message: "Email verified must be true/false, yes/no, or 1/0",
                    value: contact.email_verified,
                });
            }
        }

        return errors;
    };

    const processFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setError(null);
        setErrors([]);
        setDuplicates([]);
        setUploadedData([]);

        try {
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length < 2) {
                throw new Error("File must contain at least a header row and one data row");
            }

            const headers = jsonData[0] as string[];
            const dataRows = jsonData.slice(1) as any[][];

            // Map headers to expected field names
            const headerMap: Record<string, string> = {};
            headers.forEach((header, index) => {
                const normalizedHeader = header
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9]/g, "_");
                headerMap[index] = normalizedHeader;
            });

            const processedData: InvestorContactCsvData[] = [];
            const validationErrors: InvestorContactUploadError[] = [];
            const emailSet = new Set<string>();
            const duplicateContacts: InvestorContactCsvData[] = [];

            dataRows.forEach((row, rowIndex) => {
                const actualRowNumber = rowIndex + 2; // +2 because we skip header and arrays are 0-indexed

                // Skip empty rows
                if (!row || row.every((cell) => !cell || cell.toString().trim() === "")) {
                    return;
                }

                const contact: any = {};

                // Map row data to contact object
                row.forEach((cell, cellIndex) => {
                    const fieldName = headerMap[cellIndex];
                    if (fieldName) {
                        let value = cell;

                        // Handle boolean fields
                        if (fieldName === "email_verified") {
                            if (value !== null && value !== undefined && value !== "") {
                                const strValue = String(value).toLowerCase();
                                value = ["true", "1", "yes"].includes(strValue);
                            } else {
                                value = null;
                            }
                        }

                        // Handle numeric fields
                        if (fieldName === "activity_score") {
                            if (value !== null && value !== undefined && value !== "") {
                                const numValue = Number(value);
                                value = isNaN(numValue) ? value : numValue;
                            } else {
                                value = null;
                            }
                        }

                        // Handle string fields
                        if (typeof value === "string") {
                            value = value.trim();
                            if (value === "") value = null;
                        }

                        contact[fieldName] = value;
                    }
                });

                // Validate the contact
                const contactErrors = validateContact(contact, actualRowNumber);
                validationErrors.push(...contactErrors);

                // Check for duplicates within the file
                if (contact.email && emailSet.has(contact.email.toLowerCase())) {
                    duplicateContacts.push({
                        ...contact,
                        source: "admin",
                        isDuplicate: true,
                    });
                } else if (contact.email) {
                    emailSet.add(contact.email.toLowerCase());
                }

                // Add to processed data if no critical errors
                if (contactErrors.length === 0) {
                    processedData.push({
                        full_name: contact.full_name || "",
                        email: contact.email || "",
                        role_type: contact.role_type || "",
                        firm_id: contact.firm_id || null,
                        title: contact.title || null,
                        email_verified: contact.email_verified,
                        mobile_phone: contact.mobile_phone || null,
                        linkedin_url: contact.linkedin_url || null,
                        location: contact.location || null,
                        investor_focus_notes: contact.investor_focus_notes || null,
                        intro_method: contact.intro_method || null,
                        personal_notes: contact.personal_notes || null,
                        activity_score: contact.activity_score,
                        preferred_channel: contact.preferred_channel || null,
                        source: "admin",
                        isDuplicate: false,
                    });
                }
            });

            setUploadedData(processedData);
            setErrors(validationErrors);
            setDuplicates(duplicateContacts);

            if (processedData.length === 0 && validationErrors.length > 0) {
                setError("No valid contacts found. Please check the validation errors and try again.");
            }
        } catch (err: any) {
            console.error("File processing error:", err);
            setError(err.message || "Failed to process file. Please check the format and try again.");
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleFileDrop = useCallback(
        async (files: File[]) => {
            if (files.length === 0) return;
            await processFile(files[0]);
        },
        [processFile]
    );

    const clearData = useCallback(() => {
        setUploadedData([]);
        setError(null);
        setErrors([]);
        setDuplicates([]);
    }, []);

    const removeRow = useCallback((index: number) => {
        setUploadedData((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const removeSelectedRows = useCallback((indices: number[]) => {
        setUploadedData((prev) => prev.filter((_, i) => !indices.includes(i)));
    }, []);

    const saveContacts = useCallback(async () => {
        // This will be implemented when you're ready for the save functionality
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(uploadedData);
            }, 1000);
        });
    }, [uploadedData]);

    return {
        uploadedData,
        error,
        errors,
        duplicates,
        isProcessing,
        processFile,
        handleFileDrop,
        clearData,
        removeRow,
        removeSelectedRows,
        saveContacts,
    };
}
