export interface CompanyData {
  id: string;
  company_name: string;
  web_url?: string | null;
  short_description?: string | null;
  full_description?: string | null;
  logo_url?: string | null;
  cover_image_url?: string | null;
  created_at: string;
  updated_at: string;
}
