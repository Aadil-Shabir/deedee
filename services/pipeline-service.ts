
// import { supabase } from "@/integrations/supabase/client";

import { createClient } from "@/supabase/supabase";

export interface PipelineServiceInterface {
  createPipeline: (investorId: string, founderId: string, stage: string) => Promise<boolean>;
  updatePipeline: (investorId: string, founderId: string, stage: string) => Promise<boolean>;
  getPipeline: (investorId: string, founderId: string) => Promise<any>;
}

class SupabasePipelineService implements PipelineServiceInterface {
  async createPipeline(investorId: string, founderId: string, stage: string): Promise<boolean> {
    try {
      const supabase = await createClient(); 
      const { error } = await supabase
        .from('investor_pipeline')
        .insert([{
          investor_id: investorId,
          founder_id: founderId,
          stage: stage,
          status: 'active',
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString()
        }]);
      
      if (error) {
        console.error("Error creating pipeline:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error in createPipeline:", error);
      return false;
    }
  }

  async updatePipeline(investorId: string, founderId: string, stage: string): Promise<boolean> {
    try {
      const supabase = await createClient(); 
      const { error } = await supabase
        .from('investor_pipeline')
        .update({
          stage: stage,
          last_activity: new Date().toISOString()
        })
        .eq('investor_id', investorId)
        .eq('founder_id', founderId);
        
      if (error) {
        console.error("Error updating pipeline:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error in updatePipeline:", error);
      return false;
    }
  }

  async getPipeline(investorId: string, founderId: string): Promise<any> {
    try {
        const supabase = await createClient(); 
      const { data, error } = await supabase
        .from('investor_pipeline')
        .select('*')
        .eq('investor_id', investorId)
        .eq('founder_id', founderId)
        .limit(1);
      
      if (error) {
        console.error("Error getting pipeline:", error);
        return null;
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Unexpected error in getPipeline:", error);
      return null;
    }
  }
}

// Export a singleton instance getter
let pipelineServiceInstance: PipelineServiceInterface | null = null;

export function getPipelineService(): PipelineServiceInterface {
  if (!pipelineServiceInstance) {
    pipelineServiceInstance = new SupabasePipelineService();
  }
  return pipelineServiceInstance;
}
