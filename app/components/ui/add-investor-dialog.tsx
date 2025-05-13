'use client';
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Contact } from "@/types/contact";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddInvestorForm } from "./company/fundraising/add-investor-form";
import { InvestorFormData } from "@/types/investor-form";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { mapContactToInvestorForm } from "@/utils/investor-mapping";
import { submitInvestorByCompanyName } from "@/actions/actions.investor-form";

interface AddInvestorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (investor: any) => void;
  selectedContact?: Contact | null;
}

export function AddInvestorDialog({ 
  open, 
  onOpenChange, 
  onAdd, 
  selectedContact
}: AddInvestorDialogProps) {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<Partial<InvestorFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Load initial data when selectedContact changes
  useEffect(() => {
    const loadInitialData = async () => {
      if (selectedContact && open) {
        setIsLoading(true);
        try {
          const data = await mapContactToInvestorForm(selectedContact);
          setInitialFormData(data);
        } catch (error) {
          console.error("Error loading contact data:", error);
          toast.error("Failed to load contact data");
        } finally {
          setIsLoading(false);
        }
      } else if (open) {
        setInitialFormData({});
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [selectedContact, open]);

  // Handle form submission
  const handleSubmit = useCallback(async (formData: InvestorFormData) => {
    if (!user?.id) {
      toast.error("You must be logged in to add investors");
      return { success: false, error: "You must be logged in to add investors" };
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the new server action that handles company lookup by name
      const response = await submitInvestorByCompanyName(formData, user.id);
      
      if (!response.success) {
        throw new Error(response.error || "Failed to save investor");
      }
      
      // Show success message
      toast.success(
        selectedContact?.id 
          ? "Investor updated successfully" 
          : "Investor added successfully"
      );
      
      // Call the onAdd callback with the result
      onAdd(response.data);
      
      // Close the dialog
      onOpenChange(false);
      
      return { success: true };
    } catch (error: any) {
      console.error("Error saving investor:", error);
      toast.error(error.message || "Failed to save investor");
      return { success: false, error: error.message || "Failed to save investor" };
    } finally {
      setIsSubmitting(false);
    }
  }, [user, selectedContact, onAdd, onOpenChange]);

  const dialogTitle = selectedContact ? "Edit Investor" : "Add Investor";
  
  return (
    <Dialog open={open} onOpenChange={(value) => !isSubmitting && onOpenChange(value)}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedContact 
              ? "Update investor information in your pipeline, contacts, and database." 
              : "Add a new investor to your pipeline, contacts, and database."}
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <AddInvestorForm
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            initialData={initialFormData}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}