import { useState } from "react";
// import { supabase } from "@/integrations/supabase";
import { toast } from "sonner";
// import { 
//   parseCSVFile, 
//   validateCSVFile 
// } from "@/services/csvProcessingService";
// import { downloadContactsSampleTemplate } from "@/utils/csvTemplateUtils";
import { CsvImportHookResult } from "@/types/csv";
import { parseCSVFile, validateCSVFile } from "@/services/csv-processing-service";
import { createClient } from "@/supabase/supabase";
import { downloadContactsSampleTemplate } from "@/utils/csv-template-utils";

interface UseContactsImportProps {
  userId: string;
  userEmail: string;
  userName?: string;
  onSuccess: () => void;
}

export function useContactsImport({ 
  userId, 
  userEmail,
  userName = '',
  onSuccess 
}: UseContactsImportProps): CsvImportHookResult {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const downloadSample = () => {
    downloadContactsSampleTemplate();
  };

  const handleUpload = async (file: File) => {
    if (!file || !userId) return false;

    setIsUploading(true);
    try {
      // Validate the file
      const fileErrors = validateCSVFile(file);
      if (fileErrors.length > 0) {
        toast.error(fileErrors[0]);
        setUploadErrors(fileErrors);
        return false;
      }
      
      // Parse the CSV file
      const results = await parseCSVFile(file);
      
      if (results.errors.length > 0) {
        toast.error(`CSV parsing error: ${results.errors[0]}`);
        setUploadErrors(results.errors);
        return false;
      }
      
      if (!Array.isArray(results.data) || results.data.length === 0) {
        toast.error("No valid data found in CSV file");
        setUploadErrors(["No valid data found in CSV file"]);
        return false;
      }
      
      // Transform data for contacts
      const contacts = results.data.map((row: any) => ({
        founder_id: userId,
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        company_name: row["company_name"] || row["investor_firm"],
        full_name: row["full_name"] || `${row["primary_contact_first_name"] || ''} ${row["primary_contact_last_name"] || ''}`.trim(),
        email: row["email"] || row["primary_contact_email"] || row["general_email"],
        investor_type: row["investor_type"],
        stage: row["stage"] || row["funding_stage"] || "Discovery",
        phone: row["phone"] || row["primary_contact_mobile"],
        linkedin_url: row["linkedin_url"] || row["primary_contact_linkedin"],
        notes: row["notes"],
        hq_country: row["hq_country"],
        hq_city: row["hq_city"],
        hq_geography: row["hq_geography"] || (row["hq_city"] && row["hq_country"] ? `${row["hq_city"]}, ${row["hq_country"]}` : null)
      }));

      // Filter out empty rows
      const validContacts = contacts.filter((contact: any) => 
        contact.email || contact.full_name || contact.company_name
      );

      if (validContacts.length === 0) {
        setUploadErrors(['No valid contacts found in CSV']);
        throw new Error('No valid contacts found in CSV');
      } 

      const supabase = await createClient(); 

      const { error } = await supabase
        .from('contacts')
        .insert(validContacts);

      if (error) throw error;
      
      // For each contact, also add to investors_data table if it's an investor
      const investorsData = validContacts.map(contact => ({
        investor_firm: contact.company_name,
        primary_contact_first_name: contact.full_name.split(' ')[0],
        primary_contact_last_name: contact.full_name.split(' ').slice(1).join(' '),
        primary_contact_email: contact.email,
        primary_contact_mobile: contact.phone,
        primary_contact_linkedin: contact.linkedin_url,
        investor_type: contact.investor_type,
        // Add the introducer information
        introducer: userName || userEmail,
        introducer_email: userEmail,
        // Set relationship status to unverified
        relationship_status: "unverified",
        notes: contact.notes,
        avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
      }));
      
      if (investorsData.length > 0) {
        const { error: investorsError } = await supabase
          .from('investors_data')
          .insert(investorsData);
          
        if (investorsError) {
          console.error('Error inserting investors data:', investorsError);
          // Don't fail the whole operation, just log the error
        }
      }

      onSuccess();
      toast.success(`Successfully imported ${validContacts.length} contacts`);
      return true;
    } catch (error) {
      console.error('Error uploading contacts:', error);
      toast.error('Failed to import contacts');
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadErrors,
    setUploadErrors,
    downloadSample,
    handleUpload
  };
}
