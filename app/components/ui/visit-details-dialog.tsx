'use client'
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Visit } from "@/types/visits";
import { useUser } from "@/hooks/use-user";
import { PageVisit } from "@/types/pageVisits";
import { createClient } from "@/supabase/supabase";

interface VisitDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  investorName: string;
  company: string;
  pageName: string;
  visits: Visit[];
}

// Define page names to match the types
type PageName = 'overview' | 'dealSummary' | 'reviews' | 'questions' | 'updates' | 'dataRoom' | 'captable';

// Create properly typed dummy data structure
const DUMMY_VISITS: Record<string, Partial<Record<PageName, Visit[]>>> = {
  "John Smith": {
    overview: [
      { timestamp: "5/4/2025, 9:45 AM", duration: "4 minutes 30 seconds", source: "Email link" },
      { timestamp: "5/1/2025, 3:20 PM", duration: "2 minutes 15 seconds", source: "Direct visit" },
      { timestamp: "4/28/2025, 11:15 AM", duration: "5 minutes 45 seconds", source: "LinkedIn" },
    ],
    dealSummary: [
      { timestamp: "5/3/2025, 10:30 AM", duration: "6 minutes 20 seconds", source: "Email link" },
      { timestamp: "4/29/2025, 2:15 PM", duration: "3 minutes 40 seconds", source: "Direct visit" },
    ],
    reviews: [
      { timestamp: "5/2/2025, 4:10 PM", duration: "1 minute 50 seconds", source: "Email link" },
    ]
  },
  "Sarah Johnson": {
    overview: [
      { timestamp: "5/4/2025, 1:15 PM", duration: "3 minutes 10 seconds", source: "Direct visit" },
      { timestamp: "4/30/2025, 11:40 AM", duration: "2 minutes 5 seconds", source: "Email link" },
    ],
    dealSummary: [
      { timestamp: "5/2/2025, 9:50 AM", duration: "4 minutes 30 seconds", source: "Email link" },
    ]
  },
  "Michael Chen": {
    overview: [
      { timestamp: "5/4/2025, 8:30 AM", duration: "7 minutes 15 seconds", source: "LinkedIn" },
      { timestamp: "5/3/2025, 2:20 PM", duration: "5 minutes 40 seconds", source: "Direct visit" },
      { timestamp: "4/29/2025, 10:45 AM", duration: "4 minutes 55 seconds", source: "Email link" },
    ],
    dealSummary: [
      { timestamp: "5/2/2025, 3:15 PM", duration: "8 minutes 20 seconds", source: "Direct visit" },
      { timestamp: "4/28/2025, 9:30 AM", duration: "6 minutes 10 seconds", source: "Email link" },
    ],
    reviews: [
      { timestamp: "5/1/2025, 11:25 AM", duration: "3 minutes 45 seconds", source: "LinkedIn" },
      { timestamp: "4/27/2025, 4:40 PM", duration: "2 minutes 30 seconds", source: "Email link" },
    ],
    questions: [
      { timestamp: "4/30/2025, 1:50 PM", duration: "4 minutes 15 seconds", source: "Direct visit" },
    ],
    updates: [
      { timestamp: "5/3/2025, 10:35 AM", duration: "5 minutes 50 seconds", source: "Email link" },
      { timestamp: "4/29/2025, 3:45 PM", duration: "4 minutes 20 seconds", source: "Direct visit" },
    ]
  },
  "Emma Williams": {
    overview: [
      { timestamp: "5/4/2025, 11:20 AM", duration: "9 minutes 30 seconds", source: "Direct visit" },
      { timestamp: "5/2/2025, 4:45 PM", duration: "8 minutes 15 seconds", source: "LinkedIn" },
      { timestamp: "4/30/2025, 10:10 AM", duration: "7 minutes 45 seconds", source: "Email link" },
    ],
    dealSummary: [
      { timestamp: "5/3/2025, 1:30 PM", duration: "10 minutes 20 seconds", source: "Direct visit" },
      { timestamp: "5/1/2025, 9:45 AM", duration: "9 minutes 10 seconds", source: "Email link" },
      { timestamp: "4/28/2025, 2:50 PM", duration: "7 minutes 30 seconds", source: "LinkedIn" },
    ],
    dataRoom: [
      { timestamp: "5/2/2025, 3:10 PM", duration: "5 minutes 30 seconds", source: "Direct visit" },
      { timestamp: "4/29/2025, 11:45 AM", duration: "6 minutes 20 seconds", source: "Email link" },
    ],
    captable: [
      { timestamp: "5/1/2025, 2:25 PM", duration: "4 minutes 40 seconds", source: "Direct visit" },
      { timestamp: "4/27/2025, 9:15 AM", duration: "3 minutes 15 seconds", source: "Email link" },
    ]
  },
  "Robert Taylor": {
    overview: [
      { timestamp: "5/4/2025, 3:40 PM", duration: "12 minutes 15 seconds", source: "Direct visit" },
      { timestamp: "5/3/2025, 11:25 AM", duration: "10 minutes 45 seconds", source: "LinkedIn" },
      { timestamp: "5/2/2025, 2:15 PM", duration: "11 minutes 30 seconds", source: "Email link" },
    ],
    dealSummary: [
      { timestamp: "5/1/2025, 10:35 AM", duration: "9 minutes 50 seconds", source: "Direct visit" },
      { timestamp: "4/29/2025, 3:20 PM", duration: "8 minutes 40 seconds", source: "LinkedIn" },
      { timestamp: "4/27/2025, 1:15 PM", duration: "10 minutes 20 seconds", source: "Email link" },
    ],
    questions: [
      { timestamp: "5/2/2025, 9:25 AM", duration: "7 minutes 30 seconds", source: "Direct visit" },
      { timestamp: "4/30/2025, 2:40 PM", duration: "6 minutes 45 seconds", source: "LinkedIn" },
    ],
    updates: [
      { timestamp: "5/3/2025, 4:15 PM", duration: "9 minutes 10 seconds", source: "Direct visit" },
      { timestamp: "4/28/2025, 11:30 AM", duration: "8 minutes 25 seconds", source: "Email link" },
    ],
    dataRoom: [
      { timestamp: "5/1/2025, 3:50 PM", duration: "11 minutes 40 seconds", source: "Direct visit" },
      { timestamp: "4/29/2025, 10:15 AM", duration: "10 minutes 55 seconds", source: "Email link" },
    ],
    captable: [
      { timestamp: "4/30/2025, 9:20 AM", duration: "8 minutes 35 seconds", source: "Direct visit" },
      { timestamp: "4/26/2025, 2:10 PM", duration: "7 minutes 50 seconds", source: "LinkedIn" },
    ]
  }
};

// Create a function to generate fallback visits based on type definition
const generateFallbackVisits = (): Visit[] => {
  return [
    { 
      timestamp: new Date().toLocaleString(), 
      duration: `${Math.floor(Math.random() * 10) + 1} minutes ${Math.floor(Math.random() * 60)} seconds`, 
      source: "Direct visit" 
    },
    { 
      timestamp: new Date(Date.now() - 86400000).toLocaleString(), 
      duration: `${Math.floor(Math.random() * 5) + 1} minutes ${Math.floor(Math.random() * 60)} seconds`, 
      source: "Email link" 
    },
    { 
      timestamp: new Date(Date.now() - 172800000).toLocaleString(), 
      duration: `${Math.floor(Math.random() * 3) + 1} minutes ${Math.floor(Math.random() * 60)} seconds`, 
      source: "LinkedIn" 
    }
  ];
};

export const VisitDetailsDialog = ({
  open,
  onOpenChange,
  investorName,
  company,
  pageName,
  visits: initialVisits,
}: VisitDetailsDialogProps) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [visits, setVisits] = useState<Visit[]>(initialVisits);

  useEffect(() => {
    if (open && investorName) {
      fetchVisitDetails();
    }
  }, [open, investorName, pageName]);

  // Convert page name to database format
  const getPageNameForQuery = (): PageName => {
    const mapping: Record<string, PageName> = {
      'Overview': 'overview',
      'Deal Summary': 'dealSummary',
      'Reviews': 'reviews',
      'Questions': 'questions',
      'Updates': 'updates',
      'Data Room': 'dataRoom',
      'Cap Table': 'captable'
    };
    
    return mapping[pageName] || 'overview';
  };

  const fetchVisitDetails = async () => {
    setIsLoading(true);
    
    // Comment out the real backend code
    /*
    const supabase = await createClient(); 
    try {
      // Get investor ID from name
      const { data: investorsData, error: investorsError } = await supabase
        .from('investors')
        .select('id')
        .ilike('first_name', `%${investorName.split(' ')[0]}%`)
        .limit(1);
      
      if (investorsError || !investorsData || investorsData.length === 0) {
        console.error('Error fetching investor:', investorsError);
        setIsLoading(false);
        return;
      }

      const investorId = investorsData[0].id;
      
      // Get detailed visit data using Edge Function
      const { data: visitsData, error } = await supabase.functions.invoke('get_page_visits_by_investor', {
        body: {
          investor_id: investorId,
          page_name: getPageNameForQuery()
        }
      });
      
      if (error || !visitsData) {
        console.error('Error fetching visits:', error);
        setIsLoading(false);
        return;
      }

      // Format visit data for display
      const formattedVisits: Visit[] = (visitsData as PageVisit[]).map(visit => ({
        timestamp: new Date(visit.visit_timestamp).toLocaleString(),
        duration: visit.duration ? `${visit.duration} seconds` : 'Unknown',
        source: visit.source || 'Direct visit'
      }));

      setVisits(formattedVisits.length > 0 ? formattedVisits : initialVisits);
    } catch (error) {
      console.error('Error in fetchVisitDetails:', error);
    } finally {
      setIsLoading(false);
    }
    */

    // Instead, use dummy data
    try {
      // Simulate API loading delay
      setTimeout(() => {
        const pageKey = getPageNameForQuery();
        const dummyVisitsForInvestor = DUMMY_VISITS[investorName] || {};
        
        // Get visits for the specific page
        let pageVisits = dummyVisitsForInvestor[pageKey];
        
        // If no specific data found for this investor or page, use fallback data
        if (!pageVisits || pageVisits.length === 0) {
          console.log(`No dummy data found for ${investorName} on ${pageKey}, using fallback`);
          
          // Generate fallback visits based on the Visit type
          pageVisits = generateFallbackVisits();
        }
        
        console.log(`Loaded dummy visit data for ${investorName} on ${pageName}`);
        setVisits(pageVisits);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error in fetchVisitDetails (dummy):', error);
      setVisits(initialVisits);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {pageName} Visits by {investorName}
            <span className="block text-sm text-gray-400 mt-1">
              {company}
            </span>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-profile-purple"></div>
          </div>
        ) : (
          <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {visits.length === 0 ? (
              <p className="text-gray-400 text-center">No detailed visit data available.</p>
            ) : (
              visits.map((visit, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="text-white mb-2 md:mb-0">
                    <span className="block font-medium">{visit.timestamp}</span>
                    <span className="text-sm text-gray-400">
                      Duration: {visit.duration}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Source: {visit.source}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};