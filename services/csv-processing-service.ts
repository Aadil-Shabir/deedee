import Papa from "papaparse";
import { toast } from "sonner";
import { 
  CsvParseResult, 
  CsvProcessingOptions, 
  ChunkProcessResult 
} from "@/types/csv";

/**
 * Normalizes a header string to lowercase with underscores
 */
export const normalizeHeader = (header: string): string => {
  return header.trim().toLowerCase().replace(/\s+/g, '_');
};

/**
 * Parse a CSV file with consistent options
 */
export const parseCSVFile = <T>(
  file: File, 
  options?: CsvProcessingOptions
): Promise<CsvParseResult<T>> => {
  return new Promise((resolve) => {
    // Default options that ensure consistent parsing behavior
    const defaultOptions: CsvProcessingOptions = {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false, // Keep everything as strings by default
      transformHeader: normalizeHeader
    };

    // Merge with custom options
    const parseOptions = { ...defaultOptions, ...options };

    Papa.parse(file as any, {
      ...parseOptions,
      complete: (results: Papa.ParseResult<T>) => {
        const { data, errors, meta } = results;
        
        console.log("CSV parse meta information:", meta);
        console.log("Detected delimiter:", meta.delimiter);
        console.log("First few rows sample:", data.slice(0, 3));
        console.log("Headers:", meta.fields);
        
        // Transform parse errors into readable format
        const errorMessages = errors.map(err => `Row ${err.row}: ${err.message}`);
        
        resolve({
          data: data,
          errors: errorMessages,
          meta
        });
      },
      error: (error: any) => {
        console.error('CSV parsing error:', error);
        resolve({
          data: [],
          errors: [`CSV parsing error: ${error.message}`],
          meta: {} as Papa.ParseMeta
        });
      }
    });
  });
};

/**
 * Process data in chunks to avoid overwhelming the database
 */
export const processInChunks = async <T>(
  items: T[],
  processorFn: (chunk: T[]) => Promise<ChunkProcessResult>,
  chunkSize = 10,
  onProgress?: (current: number, total: number) => void
): Promise<ChunkProcessResult> => {
  const total = items.length;
  let processed = 0;
  let errors = 0;
  let errorMessages: string[] = [];
  
  for (let i = 0; i < total; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    try {
      const result = await processorFn(chunk);
      processed += result.processed;
      errors += result.errors;
      errorMessages = [...errorMessages, ...result.errorMessages];
      
      // Report progress if needed
      if (onProgress) {
        onProgress(Math.min(i + chunkSize, total), total);
      }
      
      if (total > 50 && (i + chunkSize) % 50 === 0) {
        toast.info(`Processing: ${Math.min(i + chunkSize, total)}/${total} records`);
      }
    } catch (e) {
      console.error('Exception processing chunk:', e);
      errors += chunk.length;
      errorMessages.push(`Exception: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  
  return { processed, errors, errorMessages };
};

/**
 * Validate CSV file basic properties (size, etc)
 */
export const validateCSVFile = (file: File, maxSizeInMB = 5): string[] => {
  const errors: string[] = [];
  
  // Check file size
  if (file.size > maxSizeInMB * 1024 * 1024) {
    errors.push(`File size exceeds ${maxSizeInMB}MB limit`);
  }
  
  // Check file extension (basic check)
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['csv', 'txt', 'xls', 'xlsx'];
  
  if (!extension || !validExtensions.includes(extension)) {
    errors.push(`Invalid file type. Expected: ${validExtensions.join(', ')}`);
  }
  
  return errors;
};

/**
 * Download a CSV template with provided headers and sample rows
 */
export const downloadCSVTemplate = (
  filename: string, 
  headers: string[], 
  rows: string[]
) => {
  const csvContent = headers.concat(rows).join('');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  a.click();
};
