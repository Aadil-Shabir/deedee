
/**
 * Types for CSV processing and imports
 */

export interface CsvParseResult<T> {
  data: T[];
  errors: string[];
  meta: {
    delimiter: string;
    linebreak: string;
    aborted: boolean;
    truncated: boolean;
    cursor: number;
    fields?: string[];
  };
}

export interface CsvProcessingOptions {
  header?: boolean;
  skipEmptyLines?: boolean;
  dynamicTyping?: boolean;
  delimiter?: string;
  transformHeader?: (header: string) => string;
}

export interface CsvTemplateData {
  headers: string[];
  rows: string[];
}

export interface ChunkProcessResult {
  processed: number;
  errors: number;
  errorMessages: string[];
}

export interface CsvImportHookResult {
  isUploading: boolean;
  uploadErrors: string[];
  setUploadErrors: (errors: string[]) => void;
  downloadSample: () => void;
  handleUpload: (file: File) => Promise<boolean>;
}
