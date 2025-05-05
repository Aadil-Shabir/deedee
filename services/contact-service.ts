
// import { supabase } from "@/integrations/supabase/client";
import { createClient } from "@/supabase/supabase";
import { Contact } from "@/types/contacts";
import { toast } from "sonner";

export interface ContactsServiceInterface {
  saveContactData: (contactData: Partial<Contact>, existingContactId?: string) => Promise<Contact | null>;
  getContactByEmail: (email: string, founderId: string) => Promise<Contact | null>;
  deleteContact: (contactId: string, founderId: string) => Promise<boolean>;
  updateContactStatus: (contactId: string, founderId: string, status: string) => Promise<boolean>;
}

class SupabaseContactsService implements ContactsServiceInterface {
  async saveContactData(contactData: Partial<Contact>, existingContactId?: string): Promise<Contact | null> {
    try {
        const supabase = await createClient(); 
      if (existingContactId) {
        // Update existing contact
        const { data, error } = await supabase
          .from('contacts')
          .update(contactData)
          .eq('id', existingContactId)
          .select();
          
        if (error) {
          console.error("Error updating contact:", error);
          return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
      } else {
        // Insert new contact
        const { data, error } = await supabase
          .from('contacts')
          .insert({
            ...contactData,
            created_at: new Date().toISOString()
          })
          .select();
          
        if (error) {
          console.error("Error inserting contact:", error);
          return null;
        }
        
        return data && data.length > 0 ? data[0] : null;
      }
    } catch (error) {
      console.error("Unexpected error in saveContactData:", error);
      return null;
    }
  }

  async getContactByEmail(email: string, founderId: string): Promise<Contact | null> {
    try {
        const supabase = await createClient(); 

      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('email', email)
        .eq('founder_id', founderId)
        .limit(1);
      
      if (error) {
        console.error("Error fetching contact by email:", error);
        return null;
      }
      
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Unexpected error in getContactByEmail:", error);
      return null;
    }
  }

  async deleteContact(contactId: string, founderId: string): Promise<boolean> {
    try {
        const supabase = await createClient(); 

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId)
        .eq('founder_id', founderId);

      if (error) {
        console.error("Error deleting contact:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error in deleteContact:", error);
      return false;
    }
  }

  async updateContactStatus(contactId: string, founderId: string, status: string): Promise<boolean> {
    try {
        const supabase = await createClient(); 

      const { error } = await supabase
        .from('contacts')
        .update({ stage: status })
        .eq('id', contactId)
        .eq('founder_id', founderId);

      if (error) {
        console.error("Error updating contact status:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Unexpected error in updateContactStatus:", error);
      return false;
    }
  }
}

// Export a singleton instance getter
let contactsServiceInstance: ContactsServiceInterface | null = null;

export function getContactsService(): ContactsServiceInterface {
  if (!contactsServiceInstance) {
    contactsServiceInstance = new SupabaseContactsService();
  }
  return contactsServiceInstance;
}
