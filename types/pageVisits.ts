
// Custom types for the page_visits table
export interface PageVisit {
  id: string;
  investor_id: string;
  page_name: string;
  visit_timestamp: string;
  duration: number | null;
  source: string | null;
  founder_id: string | null;
  company_name: string | null;
  created_at: string;
}

export interface PageVisitSummary {
  company_name: string | null;
  founder_id: string | null;
  investor_id: string;
  page_name: string;
  visit_count: number;
  last_visit: string;
}

// Type for API responses
export interface PageVisitResponse {
  data: PageVisit[] | null;
  error: any;
}

export interface PageVisitSummaryResponse {
  data: PageVisitSummary[] | null;
  error: any;
}
