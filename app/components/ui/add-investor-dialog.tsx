"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Contact } from "@/types/contact";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AddInvestorForm } from "./company/fundraising/add-investor-form";
import { InvestorFormData } from "@/types/investor-form";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { mapContactToInvestorForm } from "@/utils/investor-mapping";
import { submitInvestorByCompanyName } from "@/actions/actions.investor-form";
import { useCompanyContext } from "@/context/company-context";

interface AddInvestorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (investor: InvestorFormData) => void; // Update to use InvestorFormData explicitly
  selectedContact?: Contact | null;
}

export function AddInvestorDialog({
  open,
  onOpenChange,
  onAdd,
  selectedContact,
}: AddInvestorDialogProps) {
  const { user } = useUser();
  const { activeCompanyId } = useCompanyContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<
    Partial<InvestorFormData>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(open);

  // Sync internal state with prop
  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  // Handle dialog open state changes safely
  const handleOpenChange = useCallback(
    (newOpenState: boolean) => {
      // If we're trying to close while submitting, prevent that
      if (isSubmitting && !newOpenState) return;

      // Update internal state first
      setInternalOpen(newOpenState);

      // Only call parent handler if actually changing
      if (open !== newOpenState) {
        onOpenChange(newOpenState);
      }
    },
    [isSubmitting, onOpenChange, open]
  );

  // Handle form cancellation
  const handleCancel = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

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
  const handleSubmit = useCallback(
    async (formData: InvestorFormData) => {
      if (!user?.id) {
        toast.error("You must be logged in to add investors");
        return {
          success: false,
          error: "You must be logged in to add investors",
        };
      }

      if (!activeCompanyId) {
        toast.error("No company selected. Please select a company first.");
        return { success: false, error: "No company selected" };
      }

      setIsSubmitting(true);

      try {
        // Enhance the form data with company ID for direct submission
        const enhancedFormData = {
          ...formData,
          companyId: activeCompanyId,
        };

        // Use the server action that handles company lookup by name
        const response = await submitInvestorByCompanyName(
          enhancedFormData,
          user.id
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to save investor");
        }

        // Show success message
        toast.success(
          selectedContact?.id
            ? "Investor updated successfully"
            : "Investor added successfully"
        );

        // Call the onAdd callback with the complete form data
        onAdd(formData);

        // Close the dialog
        onOpenChange(false);

        return { success: true };
      } catch (error: any) {
        console.error("Error saving investor:", error);
        toast.error(error.message || "Failed to save investor");
        return {
          success: false,
          error: error.message || "Failed to save investor",
        };
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, selectedContact, onAdd, onOpenChange, activeCompanyId]
  );

  const dialogTitle = selectedContact ? "Edit Investor" : "Add Investor";

  return (
    <Dialog open={internalOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-gray-900 border-gray-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto"
        // Ensure the dialog content properly handles outside clicks
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
        // Ensure escape key is handled properly
        onEscapeKeyDown={(e) => {
          if (isSubmitting) {
            e.preventDefault();
          }
        }}
      >
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
            onCancel={handleCancel}
            initialData={initialFormData}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
