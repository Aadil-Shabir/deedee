import { createClient } from "@supabase/supabase-js";

// Server-side admin client with service key
function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

export interface EnrichmentData {
    firmId?: string;
    profileId?: string;
    firmData?: {
        website_url?: string;
        linkedin_url?: string;
        crunchbase_url?: string;
        fund_size?: number;
        check_size_range?: string;
        industries_invested?: string[];
        geographies_invested?: string[];
        investment_thesis_summary?: string;
        recent_exits?: string[];
        activity_score?: number;
    };
    contactData?: {
        linkedin_url?: string;
        phone?: string;
    };
}

export interface EnrichmentJob {
    id: string;
    type: "firm" | "contact" | "profile";
    status: "pending" | "processing" | "completed" | "failed";
    data: any;
    created_at: string;
    updated_at: string;
}

export class InvestorEnrichmentService {
    private supabase = createAdminClient();

    // Get firms that need enrichment
    async getFirmsNeedingEnrichment(limit = 10): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from("investor_firms")
                .select("*")
                .or("website_url.is.null,linkedin_url.is.null,fund_size.is.null")
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching firms for enrichment:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to fetch firms: ${error.message}`);
            }
            throw new Error("Failed to fetch firms for enrichment");
        }
    }

    // Get contacts that need enrichment
    async getContactsNeedingEnrichment(limit = 10): Promise<any[]> {
        try {
            const { data, error } = await this.supabase
                .from("investor_contacts")
                .select("*")
                .or("linkedin_url.is.null,phone.is.null")
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error("Error fetching contacts for enrichment:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to fetch contacts: ${error.message}`);
            }
            throw new Error("Failed to fetch contacts for enrichment");
        }
    }

    // Enrich firm data
    async enrichFirmData(firmId: string, enrichmentData: EnrichmentData["firmData"]): Promise<void> {
        try {
            const { error } = await this.supabase
                .from("investor_firms")
                .update({
                    ...enrichmentData,
                    last_updated_at: new Date().toISOString(),
                })
                .eq("id", firmId);

            if (error) throw error;
        } catch (error) {
            console.error("Error enriching firm data:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to enrich firm data: ${error.message}`);
            }
            throw new Error("Failed to enrich firm data");
        }
    }

    // Enrich contact data
    async enrichContactData(contactId: string, enrichmentData: EnrichmentData["contactData"]): Promise<void> {
        try {
            const { error } = await this.supabase.from("investor_contacts").update(enrichmentData).eq("id", contactId);

            if (error) throw error;
        } catch (error) {
            console.error("Error enriching contact data:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to enrich contact data: ${error.message}`);
            }
            throw new Error("Failed to enrich contact data");
        }
    }

    // Create enrichment job
    async createEnrichmentJob(type: "firm" | "contact" | "profile", data: any): Promise<string> {
        try {
            // For now, we'll just return a mock job ID
            // In a real implementation, you'd store this in a jobs table
            const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            console.log(`Created enrichment job ${jobId} for ${type}:`, data);

            return jobId;
        } catch (error) {
            console.error("Error creating enrichment job:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to create enrichment job: ${error.message}`);
            }
            throw new Error("Failed to create enrichment job");
        }
    }

    // Get enrichment job status
    async getEnrichmentJobStatus(jobId: string): Promise<EnrichmentJob | null> {
        try {
            // Mock implementation - in reality you'd query a jobs table
            return {
                id: jobId,
                type: "firm",
                status: "pending",
                data: {},
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
        } catch (error) {
            console.error("Error getting job status:", error);
            if (error instanceof Error) {
                throw new Error(`Failed to get job status: ${error.message}`);
            }
            throw new Error("Failed to get job status");
        }
    }

    // Batch enrich multiple items
    async batchEnrich(items: Array<{ type: "firm" | "contact"; id: string; data: any }>): Promise<string[]> {
        try {
            const jobIds: string[] = [];

            for (const item of items) {
                const jobId = await this.createEnrichmentJob(item.type, { id: item.id, ...item.data });
                jobIds.push(jobId);
            }

            return jobIds;
        } catch (error) {
            console.error("Error in batch enrichment:", error);
            if (error instanceof Error) {
                throw new Error(`Batch enrichment failed: ${error.message}`);
            }
            throw new Error("Batch enrichment failed");
        }
    }
}

export const enrichmentService = new InvestorEnrichmentService();
