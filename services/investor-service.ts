
// import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@/supabase/supabase";
import { InvestorData } from "@/types/investor";

export interface InvestorsServiceInterface {
  saveInvestorData: (investorData: InvestorData) => Promise<any>;
  getInvestorByEmail: (email: string) => Promise<any>;
  getInvestorById: (id: string) => Promise<any>;
  updateInvestorData: (investorId: string, investorData: Partial<InvestorData>) => Promise<any>;
}

class SupabaseInvestorsService implements InvestorsServiceInterface {
  async saveInvestorData(investorData: InvestorData): Promise<any> {
    try {
      const supabase = await createClient(); 
      // Check if investor record exists by email
      const existingInvestor = await this.getInvestorByEmail(investorData.email);
      
      if (existingInvestor) {
        // Update existing investor
        const { data, error } = await supabase
          .from('investors')
          .update(investorData)
          .eq('id', existingInvestor.id)
          .select();
          
        if (error) {
          console.error("Error updating investor:", error);
          return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
      } else {
        // Insert new investor
        const { data, error } = await supabase
          .from('investors')
          .insert([investorData])
          .select();
          
        if (error) {
          console.error("Error inserting investor:", error);
          return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
      }
    } catch (error) {
      console.error("Unexpected error in saveInvestorData:", error);
      return null;
    }
  }

  async getInvestorByEmail(email: string): Promise<any> {
    try {
      const supabase = await createClient(); 

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('email', email)
        .limit(1);
      
      if (error) {
        console.error("Error looking up investor:", error);
        return null;
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Unexpected error in getInvestorByEmail:", error);
      return null;
    }
  }

  async getInvestorById(id: string): Promise<any> {
    try {
      const supabase = await createClient(); 

      const { data, error } = await supabase
        .from('investors')
        .select('*')
        .eq('id', id)
        .limit(1);
      
      if (error) {
        console.error("Error looking up investor by ID:", error);
        return null;
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Unexpected error in getInvestorById:", error);
      return null;
    }
  }

  async updateInvestorData(investorId: string, investorData: Partial<InvestorData>): Promise<any> {
    try {
      const supabase = await createClient(); 
      const { data, error } = await supabase
        .from('investors')
        .update(investorData)
        .eq('id', investorId)
        .select();
        
      if (error) {
        console.error("Error updating investor:", error);
        return null;
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Unexpected error in updateInvestorData:", error);
      return null;
    }
  }
}

// Export a singleton instance getter
let investorsServiceInstance: InvestorsServiceInterface | null = null;

export function getInvestorsService(): InvestorsServiceInterface {
  if (!investorsServiceInstance) {
    investorsServiceInstance = new SupabaseInvestorsService();
  }
  return investorsServiceInstance;
}
