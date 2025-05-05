
// Utility functions for handling page visits data

/**
 * Maps database page names to frontend keys
 */
export const mapPageNameToKey = (pageName: string): string => {
  const mapping: Record<string, string> = {
    'overview': 'overview',
    'dealSummary': 'dealSummary',
    'deal-summary': 'dealSummary',
    'reviews': 'reviews',
    'questions': 'questions',
    'updates': 'updates',
    'dataRoom': 'dataRoom',
    'files': 'dataRoom',
    'captable': 'captable'
  };
  return mapping[pageName] || pageName;
};

/**
 * Calculate investor engagement score based on visit frequency
 */
export const calculateScore = (visits: Record<string, number>): number => {
  const totalVisits = Object.values(visits).reduce((sum, count) => sum + count, 0);
  const pagesVisited = Object.keys(visits).length;
  
  // Simple algorithm: base score on total visits and breadth of pages viewed
  return Math.min(Math.round((totalVisits * 5) + (pagesVisited * 10)), 100);
};
