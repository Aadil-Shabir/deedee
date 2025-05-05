import { useState, useCallback, useEffect } from "react";
import { Contact } from "@/types/contacts"; // Using the full Contact interface from contacts.ts
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/supabase/supabase";

// Dummy investor data for totals calculations
const DUMMY_INVESTORS = [
  {
    id: "inv-1",
    reservation_amount: 25000,
    investment_amount: 150000,
    founder_id: "f1"
  },
  {
    id: "inv-2",
    reservation_amount: 15000,
    investment_amount: 100000,
    founder_id: "f1"
  },
  {
    id: "inv-3",
    reservation_amount: 10000,
    investment_amount: 75000,
    founder_id: "f1"
  },
  {
    id: "inv-4",
    reservation_amount: 50000,
    investment_amount: 200000,
    founder_id: "f1"
  },
  {
    id: "inv-5",
    reservation_amount: 0,
    investment_amount: 300000,
    founder_id: "f1"
  }
];

export function useContactsState(contacts: Contact[]) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Contact | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc'
  });

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [totals, setTotals] = useState({ reservations: 0, investments: 0 });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { user } = useUser();
  
  // Keep the Supabase client reference for type compatibility
  const supabase = createClient(); 

  const fetchTotals = useCallback(async () => {
    // Comment out the original backend code
    /*
    if (!user?.id) return;
    
    try {
      // Fetch reservations
      const { data: reservations, error: reservationsError } = await supabase
        .from('investors')
        .select('reservation_amount')
        .eq('founder_id', user.id);

      if (reservationsError) throw reservationsError;

      // Fetch investments
      const { data: investments, error: investmentsError } = await supabase
        .from('investors')
        .select('investment_amount')
        .eq('founder_id', user.id);

      if (investmentsError) throw investmentsError;

      // Calculate totals
      const reservationsTotal = reservations.reduce(
        (sum, item) => sum + (item.reservation_amount || 0), 0
      );
      
      const investmentsTotal = investments.reduce(
        (sum, item) => sum + (item.investment_amount || 0), 0
      );

      setTotals({
        reservations: reservationsTotal,
        investments: investmentsTotal
      });
    } catch (error) {
      console.error("Error fetching totals:", error);
      toast.error("Failed to load investment data");
    }
    */

    // Use dummy data instead
    // Filter dummy data to match the current user if available
    const filteredInvestors = user?.id 
      ? DUMMY_INVESTORS.filter(inv => inv.founder_id === user.id)
      : DUMMY_INVESTORS;

    // Calculate totals from dummy data
    const reservationsTotal = filteredInvestors.reduce(
      (sum, item) => sum + (item.reservation_amount || 0), 0
    );
    
    const investmentsTotal = filteredInvestors.reduce(
      (sum, item) => sum + (item.investment_amount || 0), 0
    );

    // Simulate API delay
    setTimeout(() => {
      setTotals({
        reservations: reservationsTotal,
        investments: investmentsTotal
      });
      console.log("Loaded dummy investment totals:", { reservations: reservationsTotal, investments: investmentsTotal });
    }, 300);
    
  }, [user?.id]);

  // Call fetchTotals when component mounts or user changes
  useEffect(() => {
    fetchTotals();
  }, [fetchTotals]);

  const handleSort = (key: keyof Contact) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    // Handle undefined or null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    // Compare values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // Fallback for other types
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    }
  });

  const handleDelete = async () => {
    // Comment out the original backend code
    /*
    if (!selectedContact || !user?.id) return;
    
    try {
      // Delete from investors table
      const { error: investorError } = await supabase
        .from('investors')
        .delete()
        .eq('id', selectedContact.id)
        .eq('founder_id', user.id);

      if (investorError) throw investorError;

      setDeleteDialogOpen(false);
      toast.success("Contact deleted successfully");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
    */

    // Use dummy implementation instead
    if (!selectedContact) return;

    // Simulate API delay
    setTimeout(() => {
      console.log("Deleted contact (dummy):", selectedContact.id);
      setDeleteDialogOpen(false);
      toast.success("Contact deleted successfully");
    }, 500);
  };

  const handleChangeToLost = async () => {
    // Comment out the original backend code
    /*
    if (!selectedContact || !user?.id) return;
    
    try {
      // Update investor status to "Lost"
      const { error } = await supabase
        .from('investors')
        .update({ stage: 'Lost' })
        .eq('id', selectedContact.id)
        .eq('founder_id', user.id);

      if (error) throw error;

      setDeleteDialogOpen(false);
      toast.success("Contact marked as lost");
    } catch (error) {
      console.error("Error updating contact status:", error);
      toast.error("Failed to update contact status");
    }
    */

    // Use dummy implementation instead
    if (!selectedContact) return;

    // Simulate API delay
    setTimeout(() => {
      console.log("Marked contact as lost (dummy):", selectedContact.id);
      setDeleteDialogOpen(false);
      toast.success("Contact marked as lost");
    }, 500);
  };

  return {
    sortConfig,
    selectedContact,
    setSelectedContact,
    deleteDialogOpen,
    setDeleteDialogOpen,
    totals,
    filteredAndSortedContacts: sortedContacts,
    fetchTotals,
    handleSort,
    handleDelete,
    handleChangeToLost,
    selectedContacts,
    setSelectedContacts,
  };
}