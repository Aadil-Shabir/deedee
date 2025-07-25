import type { InvestorSource } from "@/types/investor-source";

export class InvestorSourceUtils {
    /**
     * Type guard to check if a string is a valid InvestorSource
     */
    static isValidSource(source: string): source is InvestorSource {
        return ["admin", "investor", "founder", "ai"].includes(source);
    }

    /**
     * Safely convert a string to InvestorSource with fallback
     */
    static toInvestorSource(source: string | null | undefined): InvestorSource {
        if (!source || typeof source !== "string") {
            return "admin";
        }

        const cleanSource = source.toLowerCase().trim();
        return this.isValidSource(cleanSource) ? cleanSource : "admin";
    }

    /**
     * Get human-readable source description
     */
    static getSourceDescription(source: string): string {
        switch (source) {
            case "admin":
                return "Admin Upload";
            case "investor":
                return "Self-Registered";
            case "founder":
                return "Added by Founder";
            case "ai":
                return "AI Discovery";
            default:
                return "Unknown Source";
        }
    }

    /**
     * Get source badge color - updated to match your color scheme
     */
    static getSourceBadgeColor(source: string): string {
        switch (source) {
            case "admin":
                return "bg-primary/10 text-primary border-primary/20";
            case "investor":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "founder":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "ai":
                return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    }

    /**
     * Get the table name that created_by_id references based on source
     */
    static getReferencedTable(source: string): string | null {
        switch (source) {
            case "investor":
                return "investor_profiles";
            case "founder":
                return "founder_profiles"; // or whatever your founder table is called
            case "admin":
            case "ai":
                return null; // No reference for admin or AI
            default:
                return null;
        }
    }
}
