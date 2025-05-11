'use server'

import { cookies } from 'next/headers'
import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

// Type definition for investment mandate data
export type InvestorMandateData = {
  deal_frequency?: string | null;
  funded_amount?: number | null;
  investment_range?: string | null;
  investment_sweet_spot?: number | null;
  investment_speed?: string | null;
  anonymity_preference?: string | null;
  dealflow_frequency?: string | null;
  invest_in_spvs?: boolean;
  invest_in_pre_ipos?: boolean;
  // preferred_business_types?: string[] | null;
}

// Get investment mandate data
export async function getInvestorMandate() {
  try {
    const supabase = await createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: "Not authenticated", data: null, relatedData: null };
      }
      
      // Get main profile data - only using columns that exist in your schema
      const { data: profileData, error: profileError } = await supabase
        .from('investor_profiles')
        .select(`
          deal_frequency,
          funded_amount,
          investment_range,
          investment_sweet_spot,
          investment_speed,
          anonymity_preference,
          dealflow_frequency,
          invest_in_spvs,
          invest_in_pre_ipos
        `)
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching mandate profile:", profileError);
        return { error: `Database error: ${profileError.message}`, data: null, relatedData: null };
      }
      
      // Get regions data
      const { data: locations, error: locationsError } = await supabase
        .from('investor_locations')
        .select('location')
        .eq('investor_id', user.id);
      
      // Get stages data
      const { data: stages, error: stagesError } = await supabase
        .from('investor_stages')
        .select('stage')
        .eq('investor_id', user.id);
      
      // Get industries data
      const { data: industries, error: industriesError } = await supabase
        .from('investor_industries')
        .select('industry')
        .eq('investor_id', user.id);
      
      // Process related data - remove businessTypes
      const relatedData = {
        regions: locations ? locations.map(r => r.location) : [],
        stages: stages ? stages.map(s => s.stage) : [],
        industries: industries ? industries.map(i => i.industry) : []
      };
      
      return { 
        data: profileData || {}, 
        relatedData, 
        error: null 
      };
    } catch (err: any) {
      console.error("Error connecting to Supabase:", err);
      return { error: `Connection error: ${err.message}`, data: null, relatedData: null };
    }
  } catch (err: any) {
    console.error("Fatal error in getInvestorMandate:", err);
    return { error: `Critical error: ${err.message}`, data: null, relatedData: null };
  }
}

// Update investor mandate
export async function updateInvestorMandate({
  mainData,
  regions,
  industries,
  stages
}: {
  mainData: InvestorMandateData;
  regions: string[];
  industries: string[];
  stages: string[];
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: "Not authenticated", success: false };
    }
    
    // Update main profile data
    const updates = {
      id: user.id,
      deal_frequency: mainData.deal_frequency,
      funded_amount: mainData.funded_amount,
      investment_range: mainData.investment_range,
      investment_sweet_spot: mainData.investment_sweet_spot,
      investment_speed: mainData.investment_speed,
      anonymity_preference: mainData.anonymity_preference,
      dealflow_frequency: mainData.dealflow_frequency,
      invest_in_spvs: mainData.invest_in_spvs,
      invest_in_pre_ipos: mainData.invest_in_pre_ipos,
      updated_at: new Date().toISOString()
    };
    
    const { error: profileError } = await supabase
      .from('investor_profiles')
      .upsert(updates, { onConflict: 'id' });
    
    if (profileError) {
      console.error("Error updating mandate:", profileError);
      return { error: `Database error: ${profileError.message}`, success: false };
    }
    
    // Handle related records - first delete existing entries
    
    // Delete regions
    await supabase
      .from('investor_locations')
      .delete()
      .eq('investor_id', user.id);
      
    // Delete industries
    await supabase
      .from('investor_industries')
      .delete()
      .eq('investor_id', user.id);
      
    // Delete stages
    await supabase
      .from('investor_stages')
      .delete()
      .eq('investor_id', user.id);
    
    // Insert new records
    
    // Insert regions
    if (regions && regions.length > 0) {
      const regionsData = regions.map(region => ({
        investor_id: user.id,
        location: region
      }));
      
      const { error: regionsError } = await supabase
        .from('investor_locations')
        .insert(regionsData);
      
      if (regionsError) {
        console.error("Error inserting regions:", regionsError);
      }
    }
    
    // Insert industries
    if (industries && industries.length > 0) {
      const industriesData = industries.map(industry => ({
        investor_id: user.id,
        industry: industry
      }));
      
      const { error: industriesError } = await supabase
        .from('investor_industries')
        .insert(industriesData);
      
      if (industriesError) {
        console.error("Error inserting industries:", industriesError);
      }
    }
    
    // Insert stages
    if (stages && stages.length > 0) {
      const stagesData = stages.map(stage => ({
        investor_id: user.id,
        stage: stage
      }));
      
      const { error: stagesError } = await supabase
        .from('investor_stages')
        .insert(stagesData);
      
      if (stagesError) {
        console.error("Error inserting stages:", stagesError);
      }
    }
    
    // Revalidate the path to update the UI
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (err: any) {
    console.error("Error in updateInvestorMandate:", err);
    return { error: `Critical error: ${err.message}`, success: false };
  }
}