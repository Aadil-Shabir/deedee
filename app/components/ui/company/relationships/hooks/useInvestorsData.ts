import { useState, useEffect, useCallback } from "react";
import { Investor, InvestorDetails } from "@/types/investors";
import { Contact } from "@/types/contact";
import { toast } from "sonner";
import { DropResult } from "react-beautiful-dnd";
import { User } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCompanyContext } from "@/context/company-context";
import { 
  getCompanyInvestors, 
  updateInvestorStage,
  addCompanyInvestor,
  updateCompanyInvestor,
  getCompanyInvestmentTotals
} from "@/actions/company-actions/actions.relationships";
import { InvestorFormData } from "@/types/investor-form";
import { submitInvestorByCompanyName } from "@/actions/actions.investor-form";

// Define valid pipeline stages
type PipelineStage = 'interested' | 'discovery' | 'pitch' | 'analysis' | 'investor' | 'lost';

// Define the return type of the hook for better type safety
interface InvestorsDataResult {
  investors: Record<string, Investor[]>;
  contacts: Contact[];
  selectedInvestor: InvestorDetails | null;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  handleAddInvestor: (investor: InvestorFormData) => void;
  handleDragEnd: (result: DropResult) => void;
  handleCardClick: (investor: Investor) => void;
  handleEditContact: (contact: Contact) => void;
  refreshData: () => Promise<void>;
  fetchInvestors: () => Promise<void>;
  isLoading: boolean;
}

export function useInvestorsData(user: User | null): InvestorsDataResult {
  const [investors, setInvestors] = useState<Record<string, Investor[]>>({
    interested: [],
    discovery: [],
    pitch: [],
    analysis: [],
    investor: [],
    lost: []
  });
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const queryClient = useQueryClient();
  const { activeCompanyId } = useCompanyContext();
  
  // Query to fetch investors data
  const { 
    data: investorsData, 
    refetch: refetchInvestorsData,
    isLoading: isInvestorsLoading
  } = useQuery({
    queryKey: ['investors', activeCompanyId],
    queryFn: async () => {
      if (!activeCompanyId) {
        return { fundraisingInvestors: [], investorProfiles: [], error: "No active company" };
      }
      
      return getCompanyInvestors(activeCompanyId);
    },
    enabled: !!activeCompanyId,
  });
  
  // Query to fetch investment totals
  const { 
    data: totalsData,
    refetch: refetchTotals
  } = useQuery({
    queryKey: ['investment-totals', activeCompanyId],
    queryFn: async () => {
      if (!activeCompanyId) {
        return { reservations: 0, investments: 0, error: "No active company" };
      }
      
      return getCompanyInvestmentTotals(activeCompanyId);
    },
    enabled: !!activeCompanyId,
  });
  
  // Mutation to update investor stage
  const updateInvestorStageMutation = useMutation({
    mutationFn: async ({ investorId, stage }: { investorId: string, stage: string }) => {
      const result = await updateInvestorStage(investorId, stage);
      if (!result.success) {
        throw new Error(result.error || "Failed to update stage");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investors', activeCompanyId] });
      queryClient.invalidateQueries({ queryKey: ['investment-totals', activeCompanyId] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update investor stage: ${error.message}`);
    }
  });
  
  // Mutation to add/update investor using server actions
  const addInvestorMutation = useMutation({
    mutationFn: async (formData: InvestorFormData) => {
      if (!activeCompanyId) {
        throw new Error("No active company selected");
      }
      
      formData.companyId = activeCompanyId;
      
      // Use submitInvestorByCompanyName directly
      const result = await submitInvestorByCompanyName(formData, user?.id || '');
      
      if (!result.success) {
        throw new Error(result.error || "Failed to add investor");
      }
      
      return result;
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['investors', activeCompanyId] });
      queryClient.invalidateQueries({ queryKey: ['investment-totals', activeCompanyId] });
    },
    onError: (error: any) => {
      toast.error(`Failed to add investor: ${error.message}`);
    }
  });
  
  // Process the fetched data into our component's state
  useEffect(() => {
    if (investorsData && !investorsData.error) {
      const { fundraisingInvestors, investorProfiles } = investorsData;
      
      // Create the structure for stages
      const investorsByStage: Record<string, Investor[]> = {
        interested: [],
        discovery: [],
        pitch: [],
        analysis: [],
        investor: [],
        lost: []
      };
      
      // Process fundraising investors
      if (fundraisingInvestors && fundraisingInvestors.length > 0) {
        fundraisingInvestors.forEach(investor => {
          // Default to 'interested' if stage is not provided or invalid
          const stage = investor.stage || 'interested';
          
          if (!Object.keys(investorsByStage).includes(stage)) {
            investorsByStage.interested.push({
              id: investor.id,
              name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim() || 'Unknown',
              company: investor.company || '',
              type: investor.type || '',
              score: investor.amount || 0,
              date: new Date(investor.created_at || new Date()).toISOString().split('T')[0],
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${investor.first_name || ''} ${investor.last_name || ''}`.trim() || 'Unknown')}`,
              email: investor.email || ''
            });
          } else {
            investorsByStage[stage as PipelineStage].push({
              id: investor.id,
              name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim() || 'Unknown',
              company: investor.company || '',
              type: investor.type || '',
              score: investor.amount || 0,
              date: new Date(investor.created_at || new Date()).toISOString().split('T')[0],
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${investor.first_name || ''} ${investor.last_name || ''}`.trim() || 'Unknown')}`,
              email: investor.email || ''
            });
          }
        });
      }
      
      // Process investor profiles (if any match with the company)
      if (investorProfiles && investorProfiles.length > 0) {
        investorProfiles.forEach(profile => {
          // Default to 'interested' for new connections
          const stage = 'interested';
          
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          
          // Check if this investor is already in our list by email
          const existingInSomeStage = Object.values(investorsByStage).flat().some(
            inv => inv.email === profile.email && profile.email
          );
          
          if (!existingInSomeStage) {
            investorsByStage[stage].push({
              id: profile.id,
              name: fullName || 'Unknown',
              company: profile.company_name || '',
              type: profile.investor_category || 'Angel',
              score: 0, // No score available from profiles
              date: new Date(profile.created_at || new Date()).toISOString().split('T')[0],
              avatar: profile.profile_image_url || 
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'Unknown')}`,
              email: profile.email || ''
            });
          }
        });
      }
      
      setInvestors(investorsByStage);
      
      // Also update contacts
      const newContacts: Contact[] = [];
      
      // Add fundraising investors to contacts
      fundraisingInvestors.forEach(investor => {
        newContacts.push({
          id: investor.id,
          company_name: investor.company || '',
          full_name: `${investor.first_name || ''} ${investor.last_name || ''}`.trim(),
          email: investor.email || '',
          last_modified: new Date(investor.updated_at || new Date()).toISOString().split('T')[0],
          investor_type: investor.type || '',
          stage: investor.stage || 'interested',
          founder_id: investor.user_id, 
          created_at: new Date(investor.created_at || new Date()).toISOString().split('T')[0],
          phone: '', 
          linkedin_url: '',
          notes: '',
          hq_geography: investor.country || '',
          visit_count: 0,
          match_rate: 0,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${investor.first_name || ''} ${investor.last_name || ''}`.trim())}`,
          investments: '',
          investment_type: investor.investment_type || '',
          investor_relations: '',
          funding_stage: ''
        });
      });
      
      // Also add profiles if they're not already in contacts
      investorProfiles.forEach(profile => {
        const email = profile.email || '';
        if (!newContacts.some(c => c.email === email && email)) {
          newContacts.push({
            id: profile.id,
            company_name: profile.company_name || '',
            full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
            email: email,
            last_modified: new Date(profile.updated_at || new Date()).toISOString().split('T')[0],
            investor_type: profile.investor_category || '',
            stage: 'interested',
            founder_id: user?.id || '', 
            created_at: new Date(profile.created_at || new Date()).toISOString().split('T')[0],
            phone: '',
            linkedin_url: '',
            notes: '',
            hq_geography: profile.country || '',
            visit_count: 0,
            match_rate: 0,
            avatar: profile.profile_image_url || 
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(`${profile.first_name || ''} ${profile.last_name || ''}`.trim())}`,
            investments: '',
            investment_type: '',
            investor_relations: '',
            funding_stage: ''
          });
        }
      });
      
      setContacts(newContacts);
    } else if (investorsData?.error) {
      toast.error(`Failed to load investors: ${investorsData.error}`);
    }
  }, [investorsData, user?.id]);
  
  // Function to fetch investors
  const fetchInvestors = useCallback(async () => {
    await refetchInvestorsData();
    await refetchTotals();
  }, [refetchInvestorsData, refetchTotals]);
  
  // Initial load
  useEffect(() => {
    if (user && activeCompanyId) {
      fetchInvestors();
    }
  }, [user, activeCompanyId, fetchInvestors]);
  
  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      // Optimistic update: Update the UI immediately for better UX
      const newInvestors = JSON.parse(JSON.stringify(investors));
      
      // Make sure the arrays exist
      if (!newInvestors[source.droppableId]) {
        newInvestors[source.droppableId] = [];
      }
      
      if (!newInvestors[destination.droppableId]) {
        newInvestors[destination.droppableId] = [];
      }
      
      // Remove from source and add to destination
      const movedInvestorArray = newInvestors[source.droppableId].splice(source.index, 1);
      
      if (movedInvestorArray && movedInvestorArray.length > 0) {
        const movedInvestor = movedInvestorArray[0];
        newInvestors[destination.droppableId].splice(destination.index, 0, movedInvestor);
      }
      
      setInvestors(newInvestors);

      // Update matching contact stage if one exists with the same email
      const allInvestors = Object.values(investors).flat();
      const matchingInvestor = allInvestors.find(investor => investor.id === draggableId);
      
      if (matchingInvestor) {
        // Update contact list UI
        const newContacts = contacts.map(contact => {
          if (contact.id === matchingInvestor.id || (matchingInvestor.email && contact.email === matchingInvestor.email)) {
            return { 
              ...contact, 
              stage: destination.droppableId,
              last_modified: new Date().toISOString().split('T')[0]
            };
          }
          return contact;
        });
        
        setContacts(newContacts);
        
        // Call the backend to update the stage
        updateInvestorStageMutation.mutate({
          investorId: draggableId,
          stage: destination.droppableId
        });
      }
      
      toast.success(`Moved investor to ${destination.droppableId}`);
      
    } catch (error: any) {
      console.error('Error updating investor stage:', error);
      toast.error('Failed to update investor stage');
    }
  };

  const handleCardClick = (investor: Investor) => {
    // Convert Investor to InvestorDetails with correct types
    const investorDetails: InvestorDetails = {
      id: investor.id,
      name: investor.name,
      company: investor.company || '',
      type: investor.type || '',
      score: investor.score || 0,
      date: investor.date || new Date().toISOString().split('T')[0],
      avatar: investor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(investor.name)}`,
      email: investor.email || '',
      phone: '', // Default value for optional properties
      website: '',
      stage: '', // Will be populated from the pipeline if available
      visits: [
        { page: "overview", count: 5, lastVisit: new Date().toISOString() },
        { page: "dealSummary", count: 3, lastVisit: new Date().toISOString() },
        { page: "team", count: 2, lastVisit: new Date().toISOString() }
      ] // Add some dummy visit data
    };
    setSelectedInvestor(investorDetails);
    setDetailsOpen(true);
  };

  // Updated handleAddInvestor function that passes the complete form data
  const handleAddInvestor = (formData: InvestorFormData) => {
    if (!activeCompanyId) {
      toast.error("No company selected. Please select a company first.");
      return;
    }
    
    // Add any default values needed
    const enrichedFormData = {
      ...formData,
      stage: formData.stage || 'interested',
      investmentType: formData.investmentType || 'equity',
      isInvestment: formData.isInvestment || false
    };
    
    addInvestorMutation.mutate(enrichedFormData, {
      onSuccess: () => {
        toast.success("Investor added successfully!");
        fetchInvestors(); // Refresh the data
      }
    });
  };
  
  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Function to refresh data
  const refreshData = useCallback(async () => {
    await fetchInvestors();
  }, [fetchInvestors]);

  return {
    investors,
    contacts,
    selectedInvestor,
    detailsOpen,
    setDetailsOpen,
    selectedContact,
    setSelectedContact,
    handleAddInvestor,
    handleDragEnd,
    handleCardClick,
    handleEditContact,
    refreshData,
    fetchInvestors,
    isLoading: isInvestorsLoading
  };
}
