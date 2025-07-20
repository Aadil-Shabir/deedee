"use client";

import { useState } from "react";
import { parse } from "papaparse";
import { read, utils } from "xlsx";
import { v4 as uuidv4 } from "uuid";
import type { InvestorCsvData } from "@/types/investor";

export function useInvestorUpload() {
    const [investors, setInvestors] = useState<InvestorCsvData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);

    const transformHeader = (header: string): string => {
        return header
            .replace(/\s+/g, "") // Remove spaces
            .replace(/^(.)(.*)$/, (_, first, rest) => first.toUpperCase() + rest); // Capitalize first letter
    };

    const checkForDuplicates = async (emails: string[]) => {
        try {
            const response = await fetch("/api/admin/investors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "checkDuplicates",
                    investors: emails,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to check duplicates");
            }

            const data = await response.json();
            return data.duplicates || [];
        } catch (err) {
            console.error("Error checking duplicates:", err);
            return [];
        }
    };

    const handleFileDrop = async (acceptedFiles: File[]) => {
        setError(null);
        setDuplicateEmails([]);

        const file = acceptedFiles[0];
        if (!file || ![".csv", ".xlsx"].some((ext) => file.name.toLowerCase().endsWith(ext))) {
            setError("Please upload a valid CSV or XLSX file");
            return;
        }

        let data: InvestorCsvData[] = [];

        if (file.name.toLowerCase().endsWith(".csv")) {
            // Parse CSV
            const text = await file.text();
            const { data: csvData, errors } = parse<InvestorCsvData>(text, {
                header: true,
                skipEmptyLines: true,
                transformHeader,
            });

            if (errors.length) {
                setError("Error parsing CSV: " + errors[0].message);
                return;
            }
            data = csvData;
        } else if (file.name.toLowerCase().endsWith(".xlsx")) {
            // Parse XLSX
            const arrayBuffer = await file.arrayBuffer();
            const workbook = read(arrayBuffer, { type: "array" });
            const sheetName =
                workbook.SheetNames.find((name) => name.toLowerCase() === "sample csv") || workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json<InvestorCsvData>(sheet, {
                header: 1,
                raw: false,
                blankrows: false,
            });

            // Convert to object with PascalCase headers
            const headers = jsonData[0] as string[];
            const transformedHeaders = headers.map(transformHeader);
            data = jsonData.slice(1).map((row) => {
                const obj: Partial<InvestorCsvData> = {};
                headers.forEach((header, index) => {
                    const value = (row as any[])[index];
                    obj[transformedHeaders[index] as keyof InvestorCsvData] =
                        value === undefined || value === "" ? null : value;
                });
                return obj as InvestorCsvData;
            });
        }

        console.log("Parsed data:", data);

        // Validate mandatory fields and collect valid rows
        const validInvestors: InvestorCsvData[] = [];
        const seenEmails = new Set<string>(); // Track emails within the file
        const fileDuplicates: string[] = []; // Track duplicate emails found in file
        let firstInvalidRowError: string | null = null;

        data.forEach((row, index) => {
            // Skip empty rows
            const hasData = Object.values(row).some((value) => value !== null && value !== undefined && value !== "");
            if (!hasData) {
                return;
            }

            console.log(`Validating row ${index + 2}:`, row);
            const mandatoryFields = [
                { field: "InvestorFirm", value: row.InvestorFirm },
                { field: "InvestmentType", value: row.InvestmentType },
                { field: "InvestorType", value: row.InvestorType },
                { field: "InvestorRelations", value: row.InvestorRelations },
                { field: "BusinessStages", value: row.BusinessStages },
                { field: "HQGeography", value: row.HQGeography },
                { field: "HQCountry", value: row.HQCountry },
                { field: "HQCity", value: row.HQCity },
                { field: "GeneralEmail", value: row.GeneralEmail },
                { field: "PrimaryContactEmail", value: row.PrimaryContactEmail },
                { field: "PrimaryContactFirstName", value: row.PrimaryContactFirstName },
                { field: "PrimaryContactLastName", value: row.PrimaryContactLastName },
            ];

            const missingFields = mandatoryFields.filter((f) => !f.value || f.value === "");
            console.log(`Row ${index + 2} missing fields:`, missingFields);

            if (missingFields.length > 0 && !firstInvalidRowError) {
                firstInvalidRowError = `Missing ${missingFields[0].field} in row ${index + 2}`;
            } else if (missingFields.length === 0) {
                const email = row.PrimaryContactEmail!;

                // Check for duplicates within the file
                if (seenEmails.has(email)) {
                    console.log(`🔄 Duplicate email found in file: ${email} (row ${index + 2}) - skipping`);
                    if (!fileDuplicates.includes(email)) {
                        fileDuplicates.push(email);
                    }
                    return; // Skip this row - we already have this email
                }

                // Add email to seen set
                seenEmails.add(email);

                validInvestors.push({
                    id: uuidv4(),
                    InvestorFirm: row.InvestorFirm,
                    InvestmentType: row.InvestmentType,
                    InvestorType: row.InvestorType,
                    InvestorRelations: row.InvestorRelations,
                    BusinessStages: row.BusinessStages,
                    HQGeography: row.HQGeography,
                    HQCountry: row.HQCountry,
                    HQCity: row.HQCity,
                    GeneralEmail: row.GeneralEmail,
                    PrimaryContactEmail: row.PrimaryContactEmail,
                    PrimaryContactFirstName: row.PrimaryContactFirstName,
                    PrimaryContactLastName: row.PrimaryContactLastName,
                    FundingStage: row.FundingStage || null,
                    RelationshipStatus: row.RelationshipStatus || null,
                    Investments: row.Investments || null,
                    BusinessType: row.BusinessType || null,
                    Sector: row.Sector || null,
                    BusinessKind: row.BusinessKind || null,
                    PreferredVerticals: row.PreferredVerticals || null,
                    WebUrl: row.WebUrl || null,
                    Crunchbase: row.Crunchbase || null,
                    PrimaryContactFunction: row.PrimaryContactFunction || null,
                    PrimaryContactMobile: row.PrimaryContactMobile || null,
                    PrimaryContactLinkedin: row.PrimaryContactLinkedin || null,
                    PrimaryContactTwitter: row.PrimaryContactTwitter || null,
                    SecondaryContactFirstName: row.SecondaryContactFirstName || null,
                    SecondaryContactLastName: row.SecondaryContactLastName || null,
                    SecondaryContactEmail: row.SecondaryContactEmail || null,
                    SecondaryContactLinkedin: row.SecondaryContactLinkedin || null,
                    SecondaryContactTwitter: row.SecondaryContactTwitter || null,
                    SecondaryContactFunction: row.SecondaryContactFunction || null,
                    SecondaryContactMobile: row.SecondaryContactMobile || null,
                    Introducer: row.Introducer || null,
                    IntroducerEmail: row.IntroducerEmail || null,
                    isDuplicate: false, // Will be set after database check
                });
            }
        });

        console.log(`📊 File processing summary:`);
        console.log(`   - Total rows processed: ${data.length}`);
        console.log(`   - Valid unique investors: ${validInvestors.length}`);
        console.log(`   - Duplicates within file: ${fileDuplicates.length}`);
        if (fileDuplicates.length > 0) {
            console.log(`   - Duplicate emails in file: ${fileDuplicates.join(", ")}`);
        }

        // Check for duplicates in the database (only for unique emails from file)
        const uniqueEmails = validInvestors.map((inv) => inv.PrimaryContactEmail!);
        const existingEmails = await checkForDuplicates(uniqueEmails);
        setDuplicateEmails(existingEmails);

        // Mark database duplicates
        validInvestors.forEach((investor) => {
            if (existingEmails.includes(investor.PrimaryContactEmail!)) {
                investor.isDuplicate = true;
            }
        });

        setInvestors(validInvestors);

        // Handle error messages including duplicates
        let errorMessage = "";
        if (firstInvalidRowError && validInvestors.length === 0) {
            errorMessage = firstInvalidRowError;
        } else if (firstInvalidRowError) {
            errorMessage = firstInvalidRowError + " (valid rows displayed)";
        } else if (validInvestors.length === 0) {
            errorMessage = "No valid data found in the file";
        }

        // Add file duplicate message
        if (fileDuplicates.length > 0) {
            const fileDuplicateMessage = `Found ${
                fileDuplicates.length
            } duplicate email(s) within the file (kept first occurrence): ${fileDuplicates.join(", ")}`;
            errorMessage = errorMessage ? `${errorMessage}. ${fileDuplicateMessage}` : fileDuplicateMessage;
        }

        // Add database duplicate message
        if (existingEmails.length > 0) {
            const dbDuplicateMessage = `Found ${
                existingEmails.length
            } email(s) already in database: ${existingEmails.join(", ")}`;
            errorMessage = errorMessage ? `${errorMessage}. ${dbDuplicateMessage}` : dbDuplicateMessage;
        }

        if (errorMessage) {
            setError(errorMessage);
        }
    };

    const saveInvestors = async () => {
        console.log("🚀 Hook: Starting save operation...");
        console.log("Saving investors data:", investors);
        console.log("Total investors to save:", investors.length);

        try {
            const response = await fetch("/api/admin/investors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    action: "saveInvestors",
                    investors: investors,
                }),
            });

            console.log("📡 API Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ API Error response:", errorData);

                // Throw a more detailed error
                const errorMessage =
                    errorData.details || errorData.error || `HTTP ${response.status}: Failed to save investors`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("✅ Save response:", data);

            if (!data.success) {
                throw new Error(data.error || "Save operation was not successful");
            }

            return data.savedInvestors;
        } catch (error: any) {
            console.error("❌ Hook: Save operation failed:", error);

            // Re-throw with more context
            if (error.name === "TypeError" && error.message.includes("fetch")) {
                throw new Error(
                    "Network error: Unable to connect to the server. Please check your connection and try again."
                );
            }

            throw error; // Re-throw the original error
        }
    };

    const clearInvestors = () => {
        setInvestors([]);
        setError(null);
        setDuplicateEmails([]);
    };

    const deleteInvestors = (idsToDelete: string[]) => {
        setInvestors((prevInvestors) => prevInvestors.filter((investor) => !idsToDelete.includes(investor.id!)));
    };

    return {
        investors,
        error,
        duplicateEmails,
        handleFileDrop,
        clearInvestors,
        deleteInvestors,
        saveInvestors,
    };
}
