import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { CsvDropzone } from "./CsvDropzone";
import { toast } from "sonner";
// import { ImportSheetProps } from "./types";
import { CsvDropzone } from "./csv-dropzone";
import { ImportSheetProps } from "@/types/Props";

export const ImportSheet = ({
  onClose,
  onSuccess,
  onUpload,
  downloadSampleTemplate,
  uploadErrors,
  setUploadErrors,
  isUploading,
  title = "Import Data"
}: ImportSheetProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const success = await onUpload(file);
    if (success) {
      setFile(null);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-300">Download sample file:</span>
        <Button 
          variant="outline" 
          onClick={downloadSampleTemplate}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          Sample CSV File
        </Button>
      </div>

      {uploadErrors.length > 0 && (
        <Alert variant="destructive" className="bg-red-950 border-red-800 text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-1">Errors encountered:</div>
            <ul className="text-sm list-disc list-inside">
              {uploadErrors.map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <CsvDropzone 
        file={file}
        setFile={setFile}
        setUploadErrors={setUploadErrors}
      />

      <div className="flex justify-end gap-4 pt-4">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-700 text-white hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="bg-profile-purple hover:bg-profile-purple/90"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};
