
export interface ImportSheetProps {
    onClose: () => void;
    onSuccess: () => void;
    onUpload: (file: File) => Promise<boolean>;
    downloadSampleTemplate: () => void;
    uploadErrors: string[];
    setUploadErrors: (errors: string[]) => void;
    isUploading: boolean;
    title?: string;
  }
  
  export interface CsvDropzoneProps {
    file: File | null;
    setFile: (file: File | null) => void;
    setUploadErrors: (errors: string[]) => void;
  }
  