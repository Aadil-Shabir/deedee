"use client";
import { useEffect } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useBulkDeleteInvestors, BulkDeleteItem } from "@/hooks/query-hooks/use-bulk-delete-investors";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: BulkDeleteItem[]; // { id, email } for each selected row
    onSuccess: () => void; // refresh table + clear selection
    onPendingChange?: (b: boolean) => void;
};

export function BulkDeleteInvestorsDialog({ open, onOpenChange, items, onSuccess, onPendingChange }: Props) {
    const { mutate, isPending, data, error } = useBulkDeleteInvestors();

    useEffect(() => {
        onPendingChange?.(isPending);
    }, [isPending, onPendingChange]);

    // Show final result while dialog is still open, then close it.
    useEffect(() => {
        if (!open) return;
        if (!isPending && data) {
            // Friendly message from server; no "check console"
            const msg = data.message || `Deleted ${data.successCount}.`;
            if (data.failureCount === 0) {
                toast.success(msg);
            } else {
                toast.warning(msg);
            }
            onSuccess();
            onOpenChange(false);
        }
    }, [isPending, data, open, onOpenChange, onSuccess]);

    useEffect(() => {
        if (open && error) {
            toast.error((error as Error).message || "Bulk delete failed");
        }
    }, [error, open]);

    const onConfirm = () => {
        if (items.length === 0 || isPending) return;
        mutate(items);
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => !isPending && onOpenChange(o)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete {items.length} selected {items.length === 1 ? "investor" : "investors"}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes investor profiles, contacts, preferences, and linked auth users. Firms remain if
                        referenced elsewhere.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    {/* IMPORTANT: use a normal Button, not AlertDialogAction (which auto-closes). */}
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                            </>
                        ) : (
                            "Delete Selected"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
