import { useState, useEffect, useCallback } from "react";
import { Investor, InvestorDetails } from "@/types/investors";
import { Contact } from "@/types/contact";
import { toast } from "sonner";
import { createClient } from "@/supabase/supabase";
import { DropResult } from "react-beautiful-dnd";
import { User } from "@supabase/supabase-js";

// Define the InvestorData interface to match the DB result
interface InvestorPipelineData {
  investor_id: string;
  stage: string;
  investors: {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
    company_name?: string | null;
    investor_type?: string | null;
    email?: string | null;
    investment_amount?: number | null;
    reservation_amount?: number | null;
  };
}

// Define valid pipeline stages
type PipelineStage = 'interested' | 'discovery' | 'pitch' | 'analysis' | 'investor' | 'lost';

// Dummy data for investors
const DUMMY_INVESTORS: Record<string, Investor[]> = {
  interested: [
    {
      id: "i1",
      name: "John Smith",
      company: "Seed Capital Partners",
      type: "Angel",
      score: 75000,
      date: "2025-04-15",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John%20Smith",
      email: "john.smith@example.com"
    },
    {
      id: "i2",
      name: "Sarah Johnson",
      company: "Innovation Ventures",
      type: "VC",
      score: 120000,
      date: "2025-04-10",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Johnson",
      email: "sarah@example.com"
    }
  ],
  discovery: [
    {
      id: "d1",
      name: "Michael Chen",
      company: "Dragon Capital",
      type: "VC",
      score: 250000,
      date: "2025-04-08",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Chen",
      email: "mchen@example.com"
    }
  ],
  pitch: [],
  analysis: [
    {
      id: "a1",
      name: "Emma Williams",
      company: "Elevation Fund",
      type: "VC",
      score: 500000,
      date: "2025-04-05",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emma%20Williams",
      email: "emma@example.com"
    },
    {
      id: "a2",
      name: "David Lee",
      company: "Horizon Investments",
      type: "Angel",
      score: 150000,
      date: "2025-04-03",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=David%20Lee",
      email: "david@example.com"
    },
    {
      id: "a3",
      name: "Linda Garcia",
      company: "Startupify",
      type: "Accelerator",
      score: 100000,
      date: "2025-04-01",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Linda%20Garcia",
      email: "linda@example.com"
    }
  ],
  investor: [
    {
      id: "v1",
      name: "Robert Taylor",
      company: "Growth Partners",
      type: "VC",
      score: 700000,
      date: "2025-03-25",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Robert%20Taylor",
      email: "rtaylor@example.com"
    },
    {
      id: "v2",
      name: "Sophia Martinez",
      company: "Future Fund",
      type: "VC",
      score: 650000,
      date: "2025-03-20",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sophia%20Martinez",
      email: "sophia@example.com"
    }
  ],
  lost: [
    {
      id: "l1",
      name: "James Wilson",
      company: "First Round Capital",
      type: "VC",
      score: 300000,
      date: "2025-03-15",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Wilson",
      email: "jwilson@example.com"
    },
    {
      id: "l2",
      name: "Olivia Brown",
      company: "Angel Network",
      type: "Angel",
      score: 50000,
      date: "2025-03-10",
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Olivia%20Brown",
      email: "olivia@example.com"
    }
  ]
};

// Dummy data for contacts
const DUMMY_CONTACTS: Contact[] = [
  {
    id: "c1",
    company_name: "Seed Capital Partners",
    full_name: "John Smith",
    email: "john.smith@example.com",
    last_modified: "2025-04-15",
    investor_type: "Angel",
    stage: "interested",
    founder_id: "f1",
    created_at: "2025-01-10",
    phone: "+1-555-123-4567",
    linkedin_url: "https://linkedin.com/in/johnsmith",
    notes: "Met at Startup Conference 2025",
    hq_geography: "San Francisco",
    visit_count: 5,
    match_rate: 85,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=John%20Smith",
    investments: "SaaS, FinTech",
    investment_type: "Seed",
    investor_relations: "Warm",
    funding_stage: "Seed"
  },
  {
    id: "c2",
    company_name: "Innovation Ventures",
    full_name: "Sarah Johnson",
    email: "sarah@example.com",
    last_modified: "2025-04-10",
    investor_type: "VC",
    stage: "interested",
    founder_id: "f1",
    created_at: "2025-01-15",
    phone: "+1-555-234-5678",
    linkedin_url: "https://linkedin.com/in/sarahjohnson",
    notes: "Introduced by David from Tech Incubator",
    hq_geography: "New York",
    visit_count: 3,
    match_rate: 72,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Johnson",
    investments: "AI, Healthcare",
    investment_type: "Series A",
    investor_relations: "Cold",
    funding_stage: "Series A"
  },
  {
    id: "c3",
    company_name: "Dragon Capital",
    full_name: "Michael Chen",
    email: "mchen@example.com",
    last_modified: "2025-04-08",
    investor_type: "VC",
    stage: "discovery",
    founder_id: "f1",
    created_at: "2025-01-20",
    phone: "+1-555-345-6789",
    linkedin_url: "https://linkedin.com/in/michaelchen",
    notes: "Focuses on SaaS investments",
    hq_geography: "Hong Kong",
    visit_count: 7,
    match_rate: 91,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Chen",
    investments: "SaaS, Enterprise",
    investment_type: "Series B",
    investor_relations: "Warm",
    funding_stage: "Series B"
  },
  {
    id: "c4",
    company_name: "Elevation Fund",
    full_name: "Emma Williams",
    email: "emma@example.com",
    last_modified: "2025-04-05",
    investor_type: "VC",
    stage: "analysis",
    founder_id: "f1",
    created_at: "2025-01-25",
    phone: "+1-555-456-7890",
    linkedin_url: "https://linkedin.com/in/emmawilliams",
    notes: "Requested financial projections",
    hq_geography: "Boston",
    visit_count: 9,
    match_rate: 94,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emma%20Williams",
    investments: "Deep Tech, ML",
    investment_type: "Series A",
    investor_relations: "Warm",
    funding_stage: "Series A"
  },
  {
    id: "c5",
    company_name: "Growth Partners",
    full_name: "Robert Taylor",
    email: "rtaylor@example.com",
    last_modified: "2025-03-25",
    investor_type: "VC",
    stage: "investor",
    founder_id: "f1",
    created_at: "2025-01-30",
    phone: "+1-555-567-8901",
    linkedin_url: "https://linkedin.com/in/roberttaylor",
    notes: "Led our Series A",
    hq_geography: "Austin",
    visit_count: 15,
    match_rate: 98,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Robert%20Taylor",
    investments: "B2B SaaS, MarTech",
    investment_type: "Series A",
    investor_relations: "Committed",
    funding_stage: "Series A"
  },
  {
    id: "l1",
    company_name: "First Round Capital",
    full_name: "James Wilson",
    email: "jwilson@example.com",
    last_modified: "2025-03-15",
    investor_type: "VC",
    stage: "lost",
    founder_id: "f1",
    created_at: "2025-02-05",
    phone: "+1-555-678-9012",
    linkedin_url: "https://linkedin.com/in/jameswilson",
    notes: "Passed due to early stage",
    hq_geography: "San Francisco",
    visit_count: 2,
    match_rate: 45,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=James%20Wilson",
    investments: "Consumer Tech",
    investment_type: "Seed",
    investor_relations: "Cold",
    funding_stage: "Seed"
  },
  {
    id: "l2",
    company_name: "Angel Network",
    full_name: "Olivia Brown",
    email: "olivia@example.com",
    last_modified: "2025-03-10",
    investor_type: "Angel",
    stage: "lost",
    founder_id: "f1", 
    created_at: "2025-02-10",
    phone: "+1-555-789-0123",
    linkedin_url: "https://linkedin.com/in/oliviabrown",
    notes: "Passed due to industry focus",
    hq_geography: "Los Angeles",
    visit_count: 1,
    match_rate: 32,
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Olivia%20Brown",
    investments: "E-commerce",
    investment_type: "Angel",
    investor_relations: "Cold",
    funding_stage: "Pre-seed"
  }
];

// Define the return type of the hook for better type safety
interface InvestorsDataResult {
  investors: Record<string, Investor[]>;
  contacts: Contact[];
  selectedInvestor: InvestorDetails | null;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  handleAddInvestor: (investor: InvestorDetails) => void;
  handleDragEnd: (result: DropResult) => void;
  handleCardClick: (investor: Investor) => void;
  handleEditContact: (contact: Contact) => void;
  refreshData: () => Promise<void>;
  fetchInvestors: () => Promise<void>; // Added this explicitly
}

export function useInvestorsData(user: User | null): InvestorsDataResult {
  const [investors, setInvestors] = useState<Record<string, Investor[]>>(DUMMY_INVESTORS);
  const [contacts, setContacts] = useState<Contact[]>(DUMMY_CONTACTS);
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorDetails | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchInvestors = useCallback(async () => {
    // Commented out actual backend call in favor of dummy data
    /*
    if (!user) return;
    
    const supabase = createClient(); 
    try {
      const { data: investorsData, error: investorsError } = await supabase
        .from('investor_pipeline')
        .select(`
          investor_id,
          stage,
          investors (
            id,
            first_name,
            last_name,
            company_name,
            investor_type,
            email,
            investment_amount,
            reservation_amount
          )
        `)
        .eq('founder_id', user.id)
        .eq('status', 'active');

      if (investorsError) throw investorsError;

      const { data: contactsData, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('founder_id', user.id);

      if (contactsError) throw contactsError;

      const investorsByStage: Record<string, Investor[]> = {
        interested: [],
        discovery: [],
        pitch: [],
        analysis: [],
        investor: [],
        lost: []
      };

      // Safe handling of null/undefined data
      if (investorsData) {
        // Type assertion to help TypeScript understand the structure
        (investorsData as InvestorPipelineData[]).forEach((item) => {
          if (item && item.investors) {
            const investor = item.investors;
            const stage = item.stage || 'interested';
            
            if (!investorsByStage[stage]) {
              investorsByStage[stage] = [];
            }
            
            const fullName = `${investor.first_name || ''} ${investor.last_name || ''}`.trim();
            const totalAmount = (Number(investor.investment_amount) || 0) + (Number(investor.reservation_amount) || 0);
            
            investorsByStage[stage].push({
              id: investor.id,
              name: fullName || 'Unknown',
              company: investor.company_name || '',
              type: investor.investor_type || '',
              score: totalAmount,
              date: new Date().toISOString().split('T')[0],
              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName || 'Unknown')}`,
              email: investor.email || ''
            });
          }
        });
      }

      setInvestors(investorsByStage);
      setContacts(contactsData || []);
    */

    // Simulate API delay
    setTimeout(() => {
      setInvestors(DUMMY_INVESTORS);
      setContacts(DUMMY_CONTACTS);
      console.log("Loaded dummy data instead of backend call");
    }, 500);
    
    /*
    } catch (error) {
      console.error('Error fetching investors data:', error);
      toast.error('Failed to load investors data');
    }
    */
  }, [user]);

  useEffect(() => {
    fetchInvestors();
  }, [fetchInvestors]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;
    
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    try {
      // Commented out actual backend updates
      /*
      const supabase = createClient();
      
      const { error } = await supabase
        .from('investor_pipeline')
        .update({ 
          stage: destination.droppableId,
          last_activity: new Date().toISOString()
        })
        .eq('investor_id', draggableId)
        .eq('founder_id', user.id);

      if (error) throw error;

      const { error: investorError } = await supabase
        .from('investors')
        .update({ stage: destination.droppableId })
        .eq('id', draggableId);

      if (investorError) throw investorError;
      
      const allInvestors = Object.values(investors).flat();
      const matchingInvestor = allInvestors.find(investor => investor.id === draggableId);
        
      if (matchingInvestor?.email) {
        const { error: contactError } = await supabase
          .from('contacts')
          .update({ stage: destination.droppableId })
          .eq('email', matchingInvestor.email)
          .eq('founder_id', user.id);
          
        if (contactError) {
          console.error('Error updating contact:', contactError);
        }
      }
      */

      // Front-end only update (no backend)
      // Create a deep copy of the investors object
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
      
      if (matchingInvestor?.email) {
        const newContacts = contacts.map(contact => {
          if (contact.email === matchingInvestor.email) {
            return { 
              ...contact, 
              stage: destination.droppableId,
              last_modified: new Date().toISOString().split('T')[0]
            };
          }
          return contact;
        });
        
        setContacts(newContacts);
      }
      
      toast.success(`Moved investor to ${destination.droppableId}`);
      
    } catch (error) {
      console.error('Error updating investor stage:', error);
      toast.error('Failed to update investor stage');
    }
  };

  const handleCardClick = (investor: Investor) => {
    // Convert Investor to InvestorDetails with correct types
    const investorDetails: InvestorDetails = {
      id: investor.id,
      name: investor.name,
      company: investor.company,
      type: investor.type,
      score: investor.score,
      date: investor.date,
      avatar: investor.avatar,
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

  const handleAddInvestor = (newInvestor: InvestorDetails) => {
    console.log("Investor added/updated:", newInvestor);
    
    // Create an investor object from the details
    const investor: Investor = {
      id: newInvestor.id || `new-${Date.now()}`,
      name: newInvestor.name,
      company: newInvestor.company,
      type: newInvestor.type,
      score: newInvestor.score,
      date: new Date().toISOString().split('T')[0],
      avatar: newInvestor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newInvestor.name)}`,
      email: newInvestor.email
    };
    
    // Add to the interested stage by default
    const newInvestors = { ...investors };
    newInvestors.interested.push(investor);
    setInvestors(newInvestors);
    
    // Also add as a contact if not already present
    if (newInvestor.email && !contacts.some(c => c.email === newInvestor.email)) {
      const contact: Contact = {
        id: `new-contact-${Date.now()}`,
        company_name: newInvestor.company || "",
        full_name: newInvestor.name,
        email: newInvestor.email,
        last_modified: new Date().toISOString().split('T')[0],
        investor_type: newInvestor.type || "Unknown",
        stage: "interested",
        founder_id: user?.id || "dummy-founder",
        created_at: new Date().toISOString().split('T')[0],
        phone: newInvestor.phone,
        linkedin_url: "",
        notes: "",
        hq_geography: "",
        visit_count: 0,
        match_rate: 0,
        avatar: newInvestor.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newInvestor.name)}`
      };
      
      setContacts([...contacts, contact]);
    }
    
    toast.success("Investor added successfully!");
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

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
    refreshData: fetchInvestors,  
    fetchInvestors // Explicitly return the fetchInvestors function
  };
}
