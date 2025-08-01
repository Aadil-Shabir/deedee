import * as XLSX from "xlsx";

export interface ParsedInvestorData {
    // Required fields
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    city: string;
    invests_via_company: boolean;

    // Optional fields
    company_name?: string;
    investor_type?: string;
    title?: string;
}

interface ParseResult {
    success: boolean;
    data: ParsedInvestorData[];
    errors: string[];
    warnings: string[];
}

// Simplified column mapping
const COLUMN_MAPPINGS: Record<string, string[]> = {
    // Required fields
    first_name: ["first_name", "first name", "firstname", "fname", "given_name", "forename"],
    last_name: ["last_name", "last name", "lastname", "lname", "surname", "family_name"],
    email: ["email", "email_address", "email address", "e-mail", "e_mail", "contact_email"],
    country: ["country", "location_country", "hq_country", "base_country"],
    city: ["city", "location_city", "hq_city", "base_city"],
    invests_via_company: [
        "invests_via_company",
        "invests via company",
        "company_investor",
        "company investor",
        "investment_type",
        "investor_category",
    ],

    // Optional fields
    company_name: ["company_name", "company name", "firm_name", "firm name", "company", "firm", "organization"],
    investor_type: ["investor_type", "investor type", "type", "firm_type", "category"],
    title: ["title", "job_title", "job title", "position", "role", "designation"],
};

function findColumnIndex(headers: string[], fieldName: string): number {
    const possibleNames = COLUMN_MAPPINGS[fieldName] || [fieldName];

    // First try exact matches
    for (const name of possibleNames) {
        const index = headers.findIndex((header) => header.toLowerCase().trim() === name.toLowerCase().trim());
        if (index !== -1) return index;
    }

    // Then try partial matches
    for (const name of possibleNames) {
        const index = headers.findIndex(
            (header) =>
                header.toLowerCase().trim().includes(name.toLowerCase().trim()) ||
                name.toLowerCase().trim().includes(header.toLowerCase().trim())
        );
        if (index !== -1) return index;
    }

    return -1;
}

function parseBoolean(value: any): boolean {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        const lower = value.toLowerCase().trim();
        return ["true", "yes", "1", "company", "via company", "firm"].includes(lower);
    }
    if (typeof value === "number") return value === 1;
    return false;
}

function validateRequiredFields(data: Partial<ParsedInvestorData>, rowIndex: number): string[] {
    const errors: string[] = [];

    // Always required fields
    const requiredFields = [
        { field: "first_name", name: "First Name" },
        { field: "last_name", name: "Last Name" },
        { field: "email", name: "Email" },
        { field: "country", name: "Country" },
        { field: "city", name: "City" },
    ];

    for (const { field, name } of requiredFields) {
        const value = (data as any)[field];
        if (!value || (typeof value === "string" && !value.trim())) {
            errors.push(`Row ${rowIndex}: Missing required field '${name}'`);
        }
    }

    // Conditional validation for company investors
    if (data.invests_via_company) {
        if (!data.company_name || !data.company_name.trim()) {
            errors.push(`Row ${rowIndex}: Company Name is required when 'Invests via Company' is true`);
        }
        if (!data.investor_type || !data.investor_type.trim()) {
            errors.push(`Row ${rowIndex}: Investor Type is required when 'Invests via Company' is true`);
        }
    }

    // Email validation
    if (data.email && typeof data.email === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email.trim())) {
            errors.push(`Row ${rowIndex}: Invalid email format: ${data.email}`);
        }
    }

    return errors;
}

function sanitizeValue(value: any): string {
    if (value === null || value === undefined) return "";
    return String(value).trim();
}

export async function parseInvestorFile(file: File): Promise<ParseResult> {
    console.log("🚀 Starting parseInvestorFile with:", {
        name: file.name,
        size: file.size,
        type: file.type,
    });

    const errors: string[] = [];
    const warnings: string[] = [];

    try {
        // File validation
        if (!file) {
            return { success: false, data: [], errors: ["No file provided"], warnings: [] };
        }

        // File size validation (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            return {
                success: false,
                data: [],
                errors: [`File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds 10MB limit`],
                warnings: [],
            };
        }

        // File type validation
        const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-excel", // .xls
            "text/csv", // .csv
            "application/csv",
        ];

        const hasValidType = validTypes.includes(file.type) || file.name.match(/\.(xlsx|xls|csv)$/i);
        if (!hasValidType) {
            return {
                success: false,
                data: [],
                errors: [`Invalid file type. Please upload an Excel (.xlsx, .xls) or CSV file.`],
                warnings: [],
            };
        }

        // Read file
        const buffer = await file.arrayBuffer();

        // Parse with XLSX
        const workbook = XLSX.read(buffer, {
            type: "array",
            cellDates: true,
            cellNF: false,
            cellText: false,
        });

        if (!workbook.SheetNames.length) {
            return { success: false, data: [], errors: ["No sheets found in the file"], warnings: [] };
        }

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            blankrows: false,
        }) as any[][];

        if (jsonData.length < 2) {
            return {
                success: false,
                data: [],
                errors: ["File must contain at least a header row and one data row"],
                warnings: [],
            };
        }

        // Process headers
        const rawHeaders = jsonData[0] || [];
        const headers = rawHeaders.map((header: any) => sanitizeValue(header));
        console.log("📋 Headers found:", headers);

        // Validate required columns
        const requiredFields = ["first_name", "last_name", "email", "country", "city", "invests_via_company"];
        const missingFields: string[] = [];

        for (const field of requiredFields) {
            const colIndex = findColumnIndex(headers, field);
            if (colIndex === -1) {
                missingFields.push(field);
            }
        }

        if (missingFields.length > 0) {
            return {
                success: false,
                data: [],
                errors: [
                    `Missing required columns: ${missingFields.join(", ")}`,
                    `Available columns: ${headers.join(", ")}`,
                    "Please ensure your file contains all required columns.",
                ],
                warnings: [],
            };
        }

        // Process data rows
        const dataRows = jsonData.slice(1);
        const parsedData: ParsedInvestorData[] = [];
        const emailSet = new Set<string>();

        console.log("🔄 Processing", dataRows.length, "data rows");

        for (let i = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            const rowIndex = i + 2; // +2 because we start from row 1 and skip header

            // Skip completely empty rows
            if (!row || row.every((cell: any) => !cell || sanitizeValue(cell) === "")) {
                console.log(`⏭️ Skipping empty row ${rowIndex}`);
                continue;
            }

            const rowData: Partial<ParsedInvestorData> = {};

            // Parse all fields
            for (const [fieldName] of Object.entries(COLUMN_MAPPINGS)) {
                const colIndex = findColumnIndex(headers, fieldName);

                if (colIndex !== -1 && colIndex < row.length) {
                    const rawValue = row[colIndex];

                    if (rawValue !== null && rawValue !== undefined && sanitizeValue(rawValue) !== "") {
                        const value = sanitizeValue(rawValue);

                        try {
                            switch (fieldName) {
                                case "invests_via_company":
                                    (rowData as any)[fieldName] = parseBoolean(rawValue);
                                    break;
                                default:
                                    (rowData as any)[fieldName] = value;
                            }
                        } catch (error: any) {
                            console.warn(`⚠️ Error parsing field ${fieldName} in row ${rowIndex}:`, error);
                            warnings.push(`Row ${rowIndex}: Error parsing ${fieldName}: ${error.message}`);
                        }
                    }
                }
            }

            // Set default for invests_via_company if not provided
            if (rowData.invests_via_company === undefined) {
                rowData.invests_via_company = false;
            }

            // Validate required fields
            const fieldErrors = validateRequiredFields(rowData, rowIndex);
            if (fieldErrors.length > 0) {
                console.error(`❌ Validation errors for row ${rowIndex}:`, fieldErrors);
                errors.push(...fieldErrors);
                continue;
            }

            // Check for duplicate emails within file
            const email = rowData.email!.toLowerCase().trim();
            if (emailSet.has(email)) {
                const errorMsg = `Row ${rowIndex}: Duplicate email found earlier in the file: ${email}`;
                console.error("❌", errorMsg);
                errors.push(errorMsg);
                continue;
            }
            emailSet.add(email);

            // Add warnings for missing optional fields
            if (rowData.invests_via_company && !rowData.company_name) {
                warnings.push(`Row ${rowIndex}: Company name missing for company investor`);
            }
            if (rowData.invests_via_company && !rowData.investor_type) {
                warnings.push(`Row ${rowIndex}: Investor type missing for company investor`);
            }

            console.log(`✅ Successfully parsed row ${rowIndex}:`, {
                email: rowData.email,
                name: `${rowData.first_name} ${rowData.last_name}`,
                investsViaCompany: rowData.invests_via_company,
                company: rowData.company_name,
            });

            parsedData.push(rowData as ParsedInvestorData);
        }

        console.log("📊 Parsing complete:", {
            totalRows: dataRows.length,
            parsedRows: parsedData.length,
            errors: errors.length,
            warnings: warnings.length,
        });

        // Final validation
        if (parsedData.length === 0) {
            if (errors.length > 0) {
                return { success: false, data: [], errors, warnings };
            } else {
                return {
                    success: false,
                    data: [],
                    errors: ["No valid data rows found in the file"],
                    warnings,
                };
            }
        }

        console.log("✅ File parsing completed successfully");
        return {
            success: true,
            data: parsedData,
            errors,
            warnings,
        };
    } catch (error: any) {
        console.error("💥 Unexpected error in parseInvestorFile:", error);
        return {
            success: false,
            data: [],
            errors: [`Unexpected error while parsing file: ${error.message}`],
            warnings,
        };
    }
}

export function generateSampleCSV(): string {
    const headers = [
        // Required fields
        "first_name",
        "last_name",
        "email",
        "country",
        "city",
        "invests_via_company",

        // Optional fields
        "company_name",
        "investor_type",
        "title",
    ];

    const sampleRows = [
        [
            "John",
            "Doe",
            "john.doe@example.com",
            "United States",
            "San Francisco",
            "true", // invests via company
            "Acme Ventures",
            "VC",
            "Managing Partner",
        ],
        [
            "Jane",
            "Smith",
            "jane.smith@example.com",
            "United Kingdom",
            "London",
            "false", // individual investor
            "Beta Capital", // optional company association
            "", // no investor type for individual
            "Investment Director",
        ],
        [
            "Bob",
            "Wilson",
            "bob.wilson@gmail.com",
            "Canada",
            "Toronto",
            "false", // individual investor
            "", // no company
            "", // no investor type
            "",
        ],
    ];

    const csvLines = [headers.join(","), ...sampleRows.map((row) => row.map((cell) => `"${cell}"`).join(","))];

    return csvLines.join("\n");
}
