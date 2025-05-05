'use client';
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/components/AuthProvider";
import { useUser } from "@/hooks/use-user";
import { Contact } from "@/types/contacts";
import { useInvestorFormState } from "@/hooks/user-investorFormState";
// import { InvestorFormFields } from "./investors/InvestorFormFields";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { submitInvestorForm } from "@/services/investor-form-service";
import InvestorFormFields from "./investor-profile/Investor-form-fields";

interface AddInvestorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (investor: any) => void;
  selectedContact?: Contact | null;
}

export function AddInvestorDialog({ open, onOpenChange, onAdd, selectedContact }: AddInvestorDialogProps) {
  const { user } = useUser();
  const {
    formData,
    isSubmitting,
    setIsSubmitting,
    isLoadingInvestor,
    handleFieldChange,
    handleToggleInvestment,
    validateForm,
    formErrors,
    touchedFields
  } = useInvestorFormState(selectedContact, open);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    await submitInvestorForm(
      formData,
      user,
      selectedContact,
      setIsSubmitting,
      onAdd,
      onOpenChange
    );
  };

  const dialogTitle = selectedContact ? "Edit Investor" : "Add Investor/Firm Manually";
  const submitButtonText = selectedContact 
    ? (isSubmitting ? "Updating..." : "Update Investor") 
    : (isSubmitting ? "Adding..." : "Add Investor");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {selectedContact 
              ? "Update investor information in your pipeline, contacts, and database." 
              : "Add a new investor to your pipeline, contacts, and database."}
          </DialogDescription>
        </DialogHeader>
        {isLoadingInvestor ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner className="border-profile-purple" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InvestorFormFields
              formData={formData}
              formErrors={formErrors}
              touchedFields={touchedFields}
              onFieldChange={handleFieldChange}
              onToggleInvestment={handleToggleInvestment}
            />
            
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-700 text-white hover:bg-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-profile-purple hover:bg-profile-purple/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    {submitButtonText}
                  </span>
                ) : (
                  submitButtonText
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
