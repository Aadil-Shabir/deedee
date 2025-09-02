import { createClient } from "@/supabase/supabase";
import { CaptableInvestor, CaptableSummary } from "@/types/captable";

export interface CaptableServiceInterface {
  getCaptableInvestors: (companyId: string) => Promise<CaptableInvestor[]>;
  getCaptableSummary: (companyId: string) => Promise<CaptableSummary>;
}

class SupabaseCaptableService implements CaptableServiceInterface {
  async getCaptableInvestors(companyId: string): Promise<CaptableInvestor[]> {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("fundraising_investors")
        .select(
          `
          id,
          first_name,
          last_name,
          company,
          amount,
          type,
          stage,
          valuation,
          share_price,
          num_shares,
          investment_type,
          created_at,
          updated_at,
          company_id,
          user_id,
          is_investment
        `
        )
        .eq("company_id", companyId)
        .eq("is_investment", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching captable investors:", error);
        throw new Error(error.message);
      }

      
      const { data: currentRoundData } = await supabase
        .from("fundraising_current")
        .select("current_valuation, raising_amount")
        .eq("company_id", companyId)
        .single();

      const currentValuation = currentRoundData?.current_valuation || 0; 
      const totalInvestment = (data || []).reduce(
        (sum, inv) => sum + (inv.amount || 0),
        0
      );

      
      return (data || []).map((investor) => {
        const investmentAmount = investor.amount || 0;
       
        const ownershipPercentage =
          currentValuation > 0
            ? (investmentAmount / currentValuation) * 100
            : 0;

        return {
          id: investor.id,
          investor_name:
            `${investor.first_name || ""} ${investor.last_name || ""}`.trim() ||
            investor.company ||
            "Unknown Investor",
          investment_date: investor.created_at
            ? new Date(investor.created_at).toLocaleDateString()
            : "",
          round_type: investor.stage || "N/A",
          security_type: investor.type || "N/A",
          valuation: investor.valuation ,
          share_price: investor.share_price,
          shares:
            investor.num_shares ,
          investment_amount: investmentAmount,
          ownership_percentage: Math.round(ownershipPercentage * 100) / 100,
          growth_percentage: 0, 
          company_id: investor.company_id,
          user_id: investor.user_id,
          created_at: investor.created_at,
          updated_at: investor.updated_at,
        };
      });
    } catch (error) {
      console.error("Unexpected error in getCaptableInvestors:", error);
      throw error;
    }
  }

  async getCaptableSummary(companyId: string): Promise<CaptableSummary> {
    try {
      const supabase = createClient();

      
      const { data: investorsData, error: investorsError } = await supabase
        .from("fundraising_investors")
        .select("amount, type, is_investment")
        .eq("company_id", companyId)
        .eq("is_investment", true);

      if (investorsError) {
        console.error("Error fetching investors summary:", investorsError);
        throw new Error(investorsError.message);
      }

      
      const { data: currentRoundData, error: currentRoundError } =
        await supabase
          .from("fundraising_current")
          .select("raising_amount, current_valuation, funding_type")
          .eq("company_id", companyId)
          .single();

      if (currentRoundError && currentRoundError.code !== "PGRST116") {
        console.error("Error fetching current round data:", currentRoundError);
      }

      
      const investors = investorsData || [];
      let totalEquity = 0;
      let totalDebt = 0;

      investors.forEach((investor) => {
        const amount = investor.amount || 0;
        if (investor.type === "debt") {
          totalDebt += amount;
        } else {
          totalEquity += amount;
        }
      });

      const openForInvestment = currentRoundData?.raising_amount || 0;

      return {
        total_equity: totalEquity,
        total_debt: totalDebt,
        open_for_investment: openForInvestment,
      };
    } catch (error) {
      console.error("Unexpected error in getCaptableSummary:", error);
      throw error;
    }
  }
}

// Export a singleton instance getter
let captableServiceInstance: CaptableServiceInterface | null = null;

export function getCaptableService(): CaptableServiceInterface {
  if (!captableServiceInstance) {
    captableServiceInstance = new SupabaseCaptableService();
  }
  return captableServiceInstance;
}
