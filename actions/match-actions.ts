'use server'

import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

// Type interface for match criteria
interface MatchCriteria {
  keywords?: string;
  notes?: string;
  industries?: string[];
  stages?: string[];
  locations?: string[];
  minInvestment?: number;
  maxInvestment?: number;
}

// Get company matches based on criteria
export async function getCompanyMatches(criteria: MatchCriteria) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', data: null };
    }
    
    // Start building the query
    let query = supabase.from('companies').select('*');
    
    // Add search filters for keywords using textSearch
    if (criteria.keywords) {
      const keywordTerms = criteria.keywords.split(/[\s,]+/).filter(Boolean);
      
      if (keywordTerms.length > 0) {
        // Instead of trying to use OR directly with complex conditions,
        // we'll use individual filters for each term
        keywordTerms.forEach(term => {
          const termLike = `%${term}%`;
          
          // Add filter for company_name
          query = query.or(`company_name.ilike.${termLike},short_description.ilike.${termLike},full_description.ilike.${termLike}`);
        });
      }
    }
    
    // Add filters for industries if provided
    if (criteria.industries && criteria.industries.length > 0) {
      // Use a simpler approach with textSearch for industry matching
      // In a real app, you'd have an industries table and relationship
      const industryTerms = criteria.industries.map(industry => `%${industry}%`);
      industryTerms.forEach(term => {
        query = query.or(`short_description.ilike.${term}`);
      });
    }
    
    // Execute query with pagination
    const { data, error } = await query.limit(20);
    
    if (error) {
      throw error;
    }

    // Save search in match history
    const { error: historyError } = await supabase
      .from('investor_match_history')
      .insert({
        investor_id: user.id,
        search_query: criteria.keywords || '',
        search_criteria: criteria,
        results_count: data?.length || 0,
        saved_count: 0
      });

    if (historyError) {
      console.error('Error saving match history:', historyError);
    }
    
    // Add match score (in a real app, this would be more sophisticated)
    const enhancedResults = data?.map(company => ({
      ...company,
      match_score: Math.floor(Math.random() * 30) + 70 // Random score between 70-99% for demo
    })) || [];
    
    // Sort by match score
    enhancedResults.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
    
    return { data: enhancedResults, error: null };
  } catch (error: any) {
    console.error('Error finding company matches:', error);
    return { error: error.message, data: null };
  }
}

// Save a matched company to user's saved matches
export async function saveCompanyMatch(companyId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated', success: false };
    }
    
    // Add to investor_saved_matches table (you'll need to create this table)
    const { error } = await supabase
      .from('investor_saved_matches')
      .insert({
        investor_id: user.id,
        company_id: companyId
      });
      
    if (error) {
      // Check if it's a unique constraint error (already saved)
      if (error.code === '23505') { // PostgreSQL unique violation code
        return { error: 'You have already saved this company', success: false };
      }
      throw error;
    }
    
    // Update count in the latest match history record
    const { data: latestHistory } = await supabase
      .from('investor_match_history')
      .select('id, saved_count')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (latestHistory) {
      const { error: updateError } = await supabase
        .from('investor_match_history')
        .update({
          saved_count: (latestHistory.saved_count || 0) + 1
        })
        .eq('id', latestHistory.id);
      
      if (updateError) {
        console.error('Error updating match history saved count:', updateError);
      }
    }
    
    revalidatePath('/investor/profile');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error saving company match:', error);
    return { error: error.message, success: false };
  }
}

// Get match history for current user
export async function getMatchHistory() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('investor_match_history')
      .select('*')
      .eq('investor_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Error fetching match history:', error);
    return [];
  }
}3