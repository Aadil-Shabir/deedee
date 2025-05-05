
export interface PageVisit {
  id: string;
  investorName: string;
  company: string;
  stage: string;
  score: number;
  visits: {
    overview: number;
    dealSummary: number;
    reviews: number;
    questions: number;
    updates: number;
    dataRoom: number;
    captable: number;
  };
}

export interface Visit {
  timestamp: string;
  duration: string;
  source: string;
}
