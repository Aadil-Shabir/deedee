
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
// import { ImportSheet } from "@/features/csv-import/ImportSheet";
import { useContactsImport } from "./useContactsImport";
import { useUser } from "@/hooks/use-user";
import { ImportSheet } from "../csv-import/import-sheet";

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ImportContactsDialog({
  open,
  onOpenChange,
  onSuccess,
}: ImportContactsDialogProps) {
  const { user } = useUser();
  
  const {
    isUploading,
    uploadErrors,
    setUploadErrors,
    downloadSample,
    handleUpload
  } = useContactsImport({
    userId: user?.id || '',
    userEmail: user?.email || '',
    userName: `${user?.user_metadata?.first_name || ''} ${user?.user_metadata?.last_name || ''}`.trim(),
    onSuccess: () => {
      onSuccess();
      onOpenChange(false);
    }
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-white mb-4">
            Upload New Investor Contacts
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <ImportSheet
          onClose={() => onOpenChange(false)}
          onSuccess={onSuccess}
          onUpload={handleUpload}
          downloadSampleTemplate={downloadSample}
          uploadErrors={uploadErrors}
          setUploadErrors={setUploadErrors}
          isUploading={isUploading}
          title="Import Contacts"
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
