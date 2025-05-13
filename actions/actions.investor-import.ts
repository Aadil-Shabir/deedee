"use server"

import { createClient } from "@/supabase/server";
import { mapFormDataToDatabase } from "@/utils/investor-mapping";
import { revalidatePath } from "next/cache";

interface InvestorImportData {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  company_name?: string;
  investor_type?: string;
  stage?: string; 
  country?: string;
  city?: string;
  amount?: string;
  is_investment?: boolean;
  investment_type?: string;
  interest_rate?: string;
  valuation?: string;
  num_shares?: string;
}

export async function bulkImportInvestors(
  investors: InvestorImportData[],
  userId: string
): Promise<{ 
  success: boolean; 
  error?: string; 
  imported: number;
  skipped: number;
  failed: number;
  message: string;
}> {
  try {
    if (!investors || investors.length === 0) {
      return { 
        success: false, 
        error: "No investors to import", 
        imported: 0,
        skipped: 0,
        failed: 0,
        message: "No investors to import"
      };
    }

    const supabase = await createClient();
    
    // Track success/failure counts
    let imported = 0;
    let skipped = 0;
    let failed = 0;
    let errorMessages: string[] = [];
    
    // Process investors one by one
    for (const investorData of investors) {
      try {
        // Extract name parts
        let firstName = investorData.first_name || "";
        let lastName = investorData.last_name || "";
        
        // If only full_name is provided, split it
        if (!firstName && !lastName && investorData.full_name) {
          const nameParts = investorData.full_name.split(' ');
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(' ') || firstName;
        }
        
        // Skip if we don't have enough info
        if (!firstName || !lastName) {
          failed++;
          errorMessages.push(`Missing name for investor: ${investorData.full_name || investorData.email || 'Unknown'}`);
          continue;
        }
        
        // Skip if no company name
        const companyName = investorData.company_name || "";
        if (!companyName) {
          failed++;
          errorMessages.push(`Missing company for: ${firstName} ${lastName}`);
          continue;
        }

        // Find or create company by name
        let companyId: string | null = null;
        
        // First look for exact match
        const { data: exactMatch } = await supabase
          .from('companies')
          .select('id')
          .eq('company_name', companyName.trim())
          .eq('owner_id', userId)
          .limit(1)
          .single();
        
        if (exactMatch?.id) {
          companyId = exactMatch.id;
        } else {
          // Look for fuzzy match (case insensitive)
          const { data: fuzzyMatches } = await supabase
            .from('companies')
            .select('id')
            .ilike('company_name', `%${companyName.trim()}%`)
            .eq('owner_id', userId)
            .limit(1);
          
          if (fuzzyMatches && fuzzyMatches.length > 0) {
            companyId = fuzzyMatches[0].id;
          } else {
            // Create a new company
            const { data: newCompany, error: createError } = await supabase
              .from('companies')
              .insert({
                company_name: companyName.trim(),
                owner_id: userId,
                short_description: `Company profile for ${companyName.trim()}`
              })
              .select('id')
              .single();
            
            if (createError) {
              failed++;
              errorMessages.push(`Failed to create company for ${firstName} ${lastName}: ${createError.message}`);
              continue;
            }
            
            companyId = newCompany.id;
          }
        }
        
        // Prepare data for database insertion
        let amount = null;
        if (investorData.amount) {
          // Remove currency symbols, commas, etc and convert to number
          amount = parseFloat(investorData.amount.replace(/[^0-9.-]+/g, ""));
        }
        
        // Standardize investment type
        let investmentType = (investorData.investment_type || 'equity').toLowerCase();
        if (!['equity', 'debt'].includes(investmentType)) {
          investmentType = 'equity';
        }
        
        // Parse numeric fields
        const interestRate = investorData.interest_rate ? parseFloat(investorData.interest_rate) : null;
        const valuation = investorData.valuation ? parseFloat(investorData.valuation) : null;
        const numShares = investorData.num_shares ? parseFloat(investorData.num_shares) : null;
        
        // Calculate share price if possible
        let sharePrice = null;
        if (amount && numShares && numShares > 0) {
          sharePrice = amount / numShares;
        }
        
        // Create the investor record
        const investorRecord = {
          user_id: userId,
          company_id: companyId,
          first_name: firstName,
          last_name: lastName,
          company: companyName,
          email: investorData.email || null,
          type: investorData.investor_type || null,
          stage: investorData.stage || "interested",
          country: investorData.country || null,
          city: investorData.city || null,
          amount: amount,
          is_investment: !!investorData.is_investment,
          investment_type: investmentType,
          interest_rate: interestRate,
          valuation: valuation,
          num_shares: numShares,
          share_price: sharePrice,
          updated_at: new Date().toISOString()
        };
        
        // Insert into database - catch unique constraint violations
        const { error: insertError } = await supabase
          .from("fundraising_investors")
          .insert(investorRecord);
        
        if (insertError) {
          // Check specifically for unique constraint violation on email
          if (insertError.code === '23505' && insertError.message.includes('unique_investor_email_per_user')) {
            console.log(`Skipping duplicate email: ${investorData.email} for ${firstName} ${lastName}`);
            skipped++;
          } else {
            failed++;
            errorMessages.push(`Failed to insert ${firstName} ${lastName}: ${insertError.message}`);
          }
          continue;
        }
        
        imported++;
      } catch (err: any) {
        failed++;
        errorMessages.push(`Error processing investor: ${err.message}`);
      }
    }

    // Revalidate the data cache
    revalidatePath("/relationships");
    
    return { 
      success: imported > 0, 
      imported,
      skipped,
      failed,
      message: `Successfully imported ${imported} investors. ${skipped > 0 ? `Skipped ${skipped} duplicate records.` : ''} ${failed > 0 ? `Failed to import ${failed} investors.` : ''}`,
      error: errorMessages.length > 0 ? errorMessages.slice(0, 5).join('\n') + (errorMessages.length > 5 ? `\n...and ${errorMessages.length - 5} more errors` : '') : undefined
    };
  } catch (error: any) {
    console.error("Error in bulkImportInvestors:", error);
    return { 
      success: false, 
      error: error.message || "An unknown error occurred during import", 
      imported: 0,
      skipped: 0,
      failed: 0,
      message: "Import failed"
    };
  }
}