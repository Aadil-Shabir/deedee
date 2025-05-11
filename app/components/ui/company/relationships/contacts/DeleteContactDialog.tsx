
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
// import { Contact } from "@/types/contact";

interface DeleteContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onChangeToLost: () => void;
}

export function DeleteContactDialog({
  open,
  onOpenChange,
  onDelete,
  onChangeToLost,
}: DeleteContactDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gray-900 border-gray-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Delete Investor Record</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Are you sure you want to permanently delete this investor record? 
            Alternatively, you may change status to lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="outline"
            className="border-yellow-600 text-yellow-500 hover:bg-yellow-600/10"
            onClick={onChangeToLost}
          >
            Change to Lost
          </Button>
          <AlertDialogAction
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onDelete}
          >
            Yes, delete permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
