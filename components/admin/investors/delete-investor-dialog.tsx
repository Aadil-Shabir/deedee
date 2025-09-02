"use client";

import { useMemo } from "react";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useDeleteInvestor } from "@/hooks/query-hooks/use-delete-investor";

interface DeleteInvestorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    investor: {
        id: string;
        first_name: string | null;
        last_name: string | null;
        email: string;
        firm_name: string | null;
    };
    onDeleteSuccess: () => void;
}

export function DeleteInvestorDialog({ open, onOpenChange, investor, onDeleteSuccess }: DeleteInvestorDialogProps) {
    const del = useDeleteInvestor();
    const isDeleting = del.isPending;

    const investorName = useMemo(() => {
        return investor.first_name && investor.last_name
            ? `${investor.first_name} ${investor.last_name}`
            : investor.email;
    }, [investor]);

    const handleDelete = async () => {
        const p = del.mutateAsync(investor.id);

        toast.promise(p, {
            loading: "Deleting investor…",
            success: () => {
                onDeleteSuccess(); // refresh local table state if you keep any
                onOpenChange(false); // close dialog
                return "Investor deleted successfully";
            },
            error: (e) => e?.message || "Failed to delete investor",
        });

        await p; // ensures the toast handlers run in order
    };

    return (
        <AlertDialog open={open} onOpenChange={(o) => !isDeleting && onOpenChange(o)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Delete Investor
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <p>
                            Are you sure you want to delete <strong>{investorName}</strong>?
                        </p>
                        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm">
                            <p className="font-medium text-destructive mb-2">This action will permanently delete:</p>
                            <ul className="list-disc list-inside space-y-1 text-destructive/80">
                                <li>User account and authentication</li>
                                <li>Investor profile and all personal data</li>
                                <li>Contact information</li>
                                {/* If firms remain, consider removing the next line */}
                                {investor.firm_name && <li>Associated firm data (only if your backend chooses to)</li>}
                            </ul>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            <strong>This action cannot be undone.</strong>
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            "Delete Investor"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
