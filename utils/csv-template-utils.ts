
import { downloadCSVTemplate } from "@/services/csv-processing-service";
import { CsvTemplateData } from "@/types/csv";
// import { downloadCSVTemplate } from "@/services/csvProcessingService";

/**
 * Get sample investor data for CSV template
 */
export const getInvestorSampleData = (): CsvTemplateData => {
  // Define all headers exactly matching the expected column structure
  const headers = [
    "Investor Firm,Investments,Investor Type,Investment Type,Investor Relations,Funding Stage," +
    "Business Stages,Business Type,Sector,Business Kind,Preferred Verticals," +
    "HQ Geography,HQ Country,HQ City,Web Url,Crunchbase,General Email," +
    "Primary Contact First Name,Primary Contact Last Name,Primary Contact Email,Primary Contact Function," +
    "Primary Contact Mobile,Primary Contact Linkedin,Primary Contact Twitter," +
    "Secondary Contact First Name,Secondary Contact Last Name,Secondary Contact Email," +
    "Secondary Contact Linkedin,Secondary Contact Twitter,Secondary Contact Function,Secondary Contact Mobile," +
    "Notes\n"
  ];
  
  // Sample rows with data for each column - ensuring commas within fields are properly quoted
  const rows = [
    // First sample row with properly quoted fields
    "\"Acme Ventures\",\"50M USD\",\"VC\",\"Equity\",\"Direct\",\"Series A\"," +
    "\"Early Stage, Growth\",\"SaaS, Marketplace\",\"Technology, Fintech\",\"B2B\",\"AI, Blockchain, SaaS\"," +
    "\"North America\",\"USA\",\"San Francisco\",\"https://acmeventures.com\",\"https://crunchbase.com/acmeventures\",\"info@acmeventures.com\"," +
    "\"John\",\"Smith\",\"john@acmeventures.com\",\"Partner\"," +
    "\"+14155551234\",\"https://linkedin.com/in/johnsmith\",\"https://twitter.com/johnsmith\"," +
    "\"Jane\",\"Doe\",\"jane@acmeventures.com\"," +
    "\"https://linkedin.com/in/janedoe\",\"https://twitter.com/janedoe\",\"Associate\",\"+14155556789\"," +
    "\"Interested in AI startups\"\n",
    
    // Second sample row with properly quoted fields
    "\"Blue Capital\",\"100M USD\",\"Angel\",\"Convertible Note\",\"Syndicate\",\"Seed\"," +
    "\"Pre-Seed, Seed\",\"Consumer, Hardware\",\"HealthTech, CleanTech\",\"B2C\",\"Health, Climate\"," +
    "\"Europe\",\"UK\",\"London\",\"https://bluecapital.com\",\"https://crunchbase.com/bluecapital\",\"contact@bluecapital.com\"," +
    "\"David\",\"Brown\",\"david@bluecapital.com\",\"Managing Director\"," +
    "\"+447911123456\",\"https://linkedin.com/in/davidbrown\",\"https://twitter.com/davidbrown\"," +
    "\"Sarah\",\"Williams\",\"sarah@bluecapital.com\"," +
    "\"https://linkedin.com/in/sarahwilliams\",\"https://twitter.com/sarahwilliams\",\"Investment Manager\",\"+447911789012\"," +
    "\"Looking for European startups\"\n"
  ];
  
  return { headers, rows };
};

/**
 * Download an investor CSV template
 */
export const downloadInvestorSampleTemplate = () => {
  const { headers, rows } = getInvestorSampleData();
  downloadCSVTemplate('investors_template.csv', headers, rows);
};

/**
 * Get sample contacts data for CSV template
 */
export const getContactsSampleData = (): CsvTemplateData => {
  // Define headers
  const headers = [
    "Full Name,Email,Company Name,Investor Type,Stage,Phone,LinkedIn URL,Notes,HQ Country,HQ City\n"
  ];
  
  // Sample rows
  const rows = [
    "\"John Smith\",\"john@example.com\",\"Acme Ventures\",\"VC\",\"Discovery\",\"+14155551234\"," +
    "\"https://linkedin.com/in/johnsmith\",\"Met at TechCrunch event\",\"USA\",\"San Francisco\"\n",
    
    "\"Sarah Johnson\",\"sarah@example.com\",\"Blue Capital\",\"Angel\",\"Meeting\",\"+447911123456\"," +
    "\"https://linkedin.com/in/sarahjohnson\",\"Interested in SaaS startups\",\"UK\",\"London\"\n"
  ];
  
  return { headers, rows };
};

/**
 * Download a contacts CSV template
 */
export const downloadContactsSampleTemplate = () => {
  const { headers, rows } = getContactsSampleData();
  downloadCSVTemplate('contacts_template.csv', headers, rows);
};
