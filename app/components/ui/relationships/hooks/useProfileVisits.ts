import { useState, useEffect } from "react";
import { PageVisit } from "@/types/visits";
import { PageVisitSummary } from "@/types/pageVisits";
import { mapPageNameToKey, calculateScore } from "../utils/pageVisitUtils";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/supabase/supabase";

// Define dummy data for page visits
const DUMMY_PAGE_VISITS: PageVisit[] = [
  {
    id: "inv-1",
    investorName: "John Smith",
    company: "Seed Capital Partners",
    stage: "interested",
    score: 85,
    visits: {
      overview: 12,
      dealSummary: 8,
      reviews: 3,
      questions: 2,
      updates: 5,
      dataRoom: 1,
      captable: 0
    }
  },
  {
    id: "inv-2",
    investorName: "Sarah Johnson",
    company: "Innovation Ventures",
    stage: "discovery",
    score: 72,
    visits: {
      overview: 8,
      dealSummary: 6,
      reviews: 2,
      questions: 1,
      updates: 4,
      dataRoom: 0,
      captable: 0
    }
  },
  {
    id: "inv-3",
    investorName: "Michael Chen",
    company: "Dragon Capital",
    stage: "pitch",
    score: 93,
    visits: {
      overview: 15,
      dealSummary: 10,
      reviews: 5,
      questions: 3,
      updates: 7,
      dataRoom: 4,
      captable: 2
    }
  },
  {
    id: "inv-4",
    investorName: "Emma Williams",
    company: "Elevation Fund",
    stage: "analysis",
    score: 97,
    visits: {
      overview: 20,
      dealSummary: 14,
      reviews: 8,
      questions: 6,
      updates: 12,
      dataRoom: 7,
      captable: 5
    }
  },
  {
    id: "inv-5",
    investorName: "Robert Taylor",
    company: "Growth Partners",
    stage: "investor",
    score: 99,
    visits: {
      overview: 25,
      dealSummary: 18,
      reviews: 12,
      questions: 10,
      updates: 15,
      dataRoom: 9,
      captable: 8
    }
  },
  {
    id: "inv-6",
    investorName: "James Wilson",
    company: "First Round Capital",
    stage: "lost",
    score: 45,
    visits: {
      overview: 4,
      dealSummary: 2,
      reviews: 1,
      questions: 0,
      updates: 2,
      dataRoom: 0,
      captable: 0
    }
  },
  {
    id: "inv-7",
    investorName: "Olivia Brown",
    company: "Angel Network",
    stage: "lost",
    score: 32,
    visits: {
      overview: 2,
      dealSummary: 1,
      reviews: 0,
      questions: 0,
      updates: 1,
      dataRoom: 0,
      captable: 0
    }
  }
];

// Define dummy page visit summaries to match backend structure
const DUMMY_PAGE_VISIT_SUMMARY: PageVisitSummary[] = [
  { investor_id: "inv-1", page_name: "overview", visit_count: 12, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-1", page_name: "deal_summary", visit_count: 8, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-1", page_name: "reviews", visit_count: 3, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-1", page_name: "questions", visit_count: 2, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-1", page_name: "updates", visit_count: 5, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-1", page_name: "data_room", visit_count: 1, company_name: "Seed Capital Partners", founder_id: "founder-1", last_visit: new Date().toISOString() },
  
  { investor_id: "inv-2", page_name: "overview", visit_count: 8, company_name: "Innovation Ventures", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-2", page_name: "deal_summary", visit_count: 6, company_name: "Innovation Ventures", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-2", page_name: "reviews", visit_count: 2, company_name: "Innovation Ventures", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-2", page_name: "questions", visit_count: 1, company_name: "Innovation Ventures", founder_id: "founder-1", last_visit: new Date().toISOString() },
  { investor_id: "inv-2", page_name: "updates", visit_count: 4, company_name: "Innovation Ventures", founder_id: "founder-1", last_visit: new Date().toISOString() },
  
  // Additional data for other investors...
];

// Dummy investor data to match backend structure
const DUMMY_INVESTORS = [
  {
    id: "inv-1",
    first_name: "John",
    last_name: "Smith",
    company_name: "Seed Capital Partners",
    stage: "interested"
  },
  {
    id: "inv-2",
    first_name: "Sarah",
    last_name: "Johnson",
    company_name: "Innovation Ventures",
    stage: "discovery"
  },
  {
    id: "inv-3",
    first_name: "Michael",
    last_name: "Chen",
    company_name: "Dragon Capital",
    stage: "pitch"
  },
  {
    id: "inv-4",
    first_name: "Emma",
    last_name: "Williams",
    company_name: "Elevation Fund",
    stage: "analysis"
  },
  {
    id: "inv-5",
    first_name: "Robert",
    last_name: "Taylor",
    company_name: "Growth Partners",
    stage: "investor"
  },
  {
    id: "inv-6",
    first_name: "James",
    last_name: "Wilson",
    company_name: "First Round Capital",
    stage: "lost"
  },
  {
    id: "inv-7",
    first_name: "Olivia",
    last_name: "Brown",
    company_name: "Angel Network",
    stage: "lost"
  }
];

export function useProfileVisits(initialPageVisits: PageVisit[] = []) {
  const { user } = useUser();
  const [pageVisits, setPageVisits] = useState<PageVisit[]>(initialPageVisits.length > 0 ? initialPageVisits : DUMMY_PAGE_VISITS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchVisitData();
    }
  }, [user]);

  const fetchVisitData = async () => {
    setIsLoading(true);
    
    // Comment out the original backend code
    /*
    const supabase = await createClient(); 
    try {
      // Get summary of visits using Edge Function
      const { data: summaryData, error: summaryError } = await supabase.functions.invoke('get_page_visits_summary', {
        body: { founder_id: user?.id }
      });

      if (summaryError || !summaryData) {
        console.error('Error fetching visit summary:', summaryError);
        setIsLoading(false);
        return;
      }

      // Get investor details for the visits
      const investorSet = new Set((summaryData as PageVisitSummary[])?.map(item => item.investor_id) || []);
      const investorIds = Array.from(investorSet);
      
      if (investorIds.length === 0) {
        setPageVisits([]);
        setIsLoading(false);
        return;
      }

      const { data: investorsData, error: investorsError } = await supabase
        .from('investors')
        .select('id, first_name, last_name, company_name, stage')
        .in('id', investorIds);

      if (investorsError) {
        console.error('Error fetching investor details:', investorsError);
        setIsLoading(false);
        return;
      }

      // Map investors to their visits
      const investorsMap = investorsData?.reduce((acc, investor) => {
        acc[investor.id] = {
          name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim(),
          company: investor.company_name || '',
          stage: investor.stage || 'Interested'
        };
        return acc;
      }, {} as Record<string, { name: string; company: string; stage: string }>);

      // Group visits by investor
      const visitsMap = (summaryData as PageVisitSummary[])?.reduce((acc, visit) => {
        if (!acc[visit.investor_id]) {
          acc[visit.investor_id] = {
            visits: {}
          };
        }
        
        // Map page_name to our frontend naming convention
        const pageKey = mapPageNameToKey(visit.page_name);
        
        acc[visit.investor_id].visits[pageKey] = visit.visit_count;
        return acc;
      }, {} as Record<string, { visits: Record<string, number> }>);

      // Create page visits data structure
      const formattedVisits: PageVisit[] = investorIds.map(id => {
        const investor = investorsMap?.[id] || { name: 'Unknown', company: 'Unknown', stage: 'Unknown' };
        const visits = visitsMap?.[id]?.visits || {};
        
        return {
          id,
          investorName: investor.name,
          company: investor.company,
          stage: investor.stage,
          score: calculateScore(visits),
          visits: {
            overview: visits.overview || 0,
            dealSummary: visits.dealSummary || 0,
            reviews: visits.reviews || 0,
            questions: visits.questions || 0,
            updates: visits.updates || 0,
            dataRoom: visits.dataRoom || 0,
            captable: visits.captable || 0
          }
        };
      });

      setPageVisits(formattedVisits);
    } catch (error) {
      console.error('Error in fetchVisitData:', error);
    } finally {
      setIsLoading(false);
    }
    */

    // Use dummy data instead
    try {
      // Simulate API delay
      setTimeout(() => {
        // Use the DUMMY_PAGE_VISITS directly since it's already in the correct format
        setPageVisits(DUMMY_PAGE_VISITS);
        console.log("Loaded dummy page visit data");
        setIsLoading(false);
      }, 800);
      
      // Alternatively, you can simulate the processing flow with dummy data
      // by uncommenting this block:
      /*
      // Get investor details for the visits
      const summaryData = DUMMY_PAGE_VISIT_SUMMARY;
      const investorsData = DUMMY_INVESTORS;
      
      // Get unique investor IDs
      const investorSet = new Set(summaryData.map(item => item.investor_id));
      const investorIds = Array.from(investorSet);
      
      // Map investors to their visits
      const investorsMap = investorsData.reduce((acc, investor) => {
        acc[investor.id] = {
          name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim(),
          company: investor.company_name || '',
          stage: investor.stage || 'Interested'
        };
        return acc;
      }, {} as Record<string, { name: string; company: string; stage: string }>);

      // Group visits by investor
      const visitsMap = summaryData.reduce((acc, visit) => {
        if (!acc[visit.investor_id]) {
          acc[visit.investor_id] = {
            visits: {}
          };
        }
        
        // Map page_name to our frontend naming convention
        const pageKey = mapPageNameToKey(visit.page_name);
        
        acc[visit.investor_id].visits[pageKey] = visit.visit_count;
        return acc;
      }, {} as Record<string, { visits: Record<string, number> }>);

      // Create page visits data structure
      const formattedVisits: PageVisit[] = investorIds.map(id => {
        const investor = investorsMap[id] || { name: 'Unknown', company: 'Unknown', stage: 'Unknown' };
        const visits = visitsMap[id]?.visits || {};
        
        return {
          id,
          investorName: investor.name,
          company: investor.company,
          stage: investor.stage,
          score: calculateScore(visits),
          visits: {
            overview: visits.overview || 0,
            dealSummary: visits.dealSummary || 0,
            reviews: visits.reviews || 0,
            questions: visits.questions || 0,
            updates: visits.updates || 0,
            dataRoom: visits.dataRoom || 0,
            captable: visits.captable || 0
          }
        };
      });

      setTimeout(() => {
        setPageVisits(formattedVisits);
        setIsLoading(false);
      }, 800);
      */
    } catch (error) {
      console.error('Error in fetchVisitData (dummy):', error);
      setIsLoading(false);
    }
  };

  return {
    pageVisits,
    isLoading,
    fetchVisitData
  };
}