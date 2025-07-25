"use client";

import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search, Users, Building2, Mail, Loader2, AlertTriangle, Send, UserCheck, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types
interface Founder {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    company_function: string | null;
    company_name: string | null;
    company_id: string | null;
}

interface SendToFoundersModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedFirmIds: string[];
    selectedFirmNames: string[];
    onSuccess: () => void;
}

export function SendToFoundersModal({
    open,
    onOpenChange,
    selectedFirmIds,
    selectedFirmNames,
    onSuccess,
}: SendToFoundersModalProps) {
    // State
    const [founders, setFounders] = useState<Founder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedFounders, setSelectedFounders] = useState<string[]>([]);
    const [sending, setSending] = useState(false);

    // Filtered founders based on search
    const filteredFounders = useMemo(() => {
        if (!search.trim()) return founders;

        const searchLower = search.toLowerCase();
        return founders.filter(
            (founder) =>
                founder.first_name?.toLowerCase().includes(searchLower) ||
                founder.last_name?.toLowerCase().includes(searchLower) ||
                founder.email?.toLowerCase().includes(searchLower) ||
                founder.company_function?.toLowerCase().includes(searchLower) ||
                founder.company_name?.toLowerCase().includes(searchLower)
        );
    }, [founders, search]);

    // Fetch founders
    const fetchFounders = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/admin/founders");

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch founders");
            }

            const data = await response.json();
            setFounders(data.founders || []);
        } catch (err: any) {
            console.error("❌ Error fetching founders:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load founders when modal opens
    useEffect(() => {
        if (open) {
            fetchFounders();
            setSearch("");
            setSelectedFounders([]);
        }
    }, [open]);

    // Handle founder selection
    const toggleFounderSelection = (founderId: string) => {
        setSelectedFounders((prev) =>
            prev.includes(founderId) ? prev.filter((id) => id !== founderId) : [...prev, founderId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedFounders.length === filteredFounders.length) {
            setSelectedFounders([]);
        } else {
            setSelectedFounders(filteredFounders.map((founder) => founder.id));
        }
    };

    // Handle sending firms to founders
    const handleSendToFounders = async () => {
        if (selectedFounders.length === 0) {
            toast({
                title: "No founders selected",
                description: "Please select at least one founder to send the investor firms to.",
                variant: "destructive",
            });
            return;
        }

        setSending(true);

        try {
            const response = await fetch("/api/admin/founder-contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    founderIds: selectedFounders,
                    investorFirmIds: selectedFirmIds,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to send investor firms to founders");
            }

            const result = await response.json();

            // Show success toast
            toast({
                title: "Success!",
                description: result.message,
            });

            // Show additional info if there were duplicates
            if (result.duplicateCount > 0) {
                toast({
                    title: "Note",
                    description: `${result.duplicateCount} contact${
                        result.duplicateCount > 1 ? "s" : ""
                    } already existed and ${result.duplicateCount > 1 ? "were" : "was"} skipped.`,
                });
            }

            // Close modal and trigger success callback
            onOpenChange(false);
            onSuccess();
        } catch (error: any) {
            console.error("❌ Send to founders failed:", error);
            toast({
                title: "Error",
                description: `Failed to send investor firms: ${error.message}`,
                variant: "destructive",
            });
        } finally {
            setSending(false);
        }
    };

    // Get initials for avatar
    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
    };

    // Format company function
    const formatCompanyFunction = (func: string | null) => {
        if (!func) return "Founder";
        return func;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-6 pb-0">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-primary" />
                            Send to Founders
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            Send the selected investor firm{selectedFirmIds.length > 1 ? "s" : ""} to founder contacts.
                            <div className="mt-2 flex flex-wrap gap-1">
                                {selectedFirmNames.slice(0, 3).map((name) => (
                                    <Badge key={name} variant="secondary" className="text-xs">
                                        {name}
                                    </Badge>
                                ))}
                                {selectedFirmNames.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{selectedFirmNames.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 min-h-0 px-6 pb-0">
                    <div className="space-y-4 h-full flex flex-col">
                        {/* Search */}
                        <div className="relative flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search founders by name, email, or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {/* Selection Summary */}
                        {filteredFounders.length > 0 && (
                            <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {filteredFounders.length} founder{filteredFounders.length > 1 ? "s" : ""} found
                                        {search && " (filtered)"}
                                    </span>
                                </div>
                                {filteredFounders.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={toggleSelectAll}
                                        className="h-auto p-1 text-xs hover:bg-transparent hover:text-primary"
                                    >
                                        {selectedFounders.length === filteredFounders.length
                                            ? "Deselect All"
                                            : "Select All"}
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Selected Founders Summary */}
                        {selectedFounders.length > 0 && (
                            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20 flex-shrink-0">
                                <UserCheck className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium text-primary">
                                    {selectedFounders.length} founder{selectedFounders.length > 1 ? "s" : ""} selected
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedFounders([])}
                                    className="ml-auto h-6 w-6 p-0 hover:bg-primary/10"
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        )}

                        {/* Founders List - This is the scrollable area */}
                        <div className="flex-1 min-h-0">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Loading founders...</span>
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">{error}</p>
                                        <Button variant="outline" size="sm" onClick={fetchFounders}>
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            ) : filteredFounders.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            {search ? "No founders match your search" : "No founders found"}
                                        </p>
                                        {search && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSearch("")}
                                                className="mt-2"
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <ScrollArea className="h-full">
                                    <div className="space-y-2 pr-4">
                                        {filteredFounders.map((founder, index) => (
                                            <div key={founder.id}>
                                                <div
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                                                        selectedFounders.includes(founder.id)
                                                            ? "bg-primary/5 border-primary/30"
                                                            : "border-border hover:border-primary/20"
                                                    }`}
                                                    onClick={() => toggleFounderSelection(founder.id)}
                                                >
                                                    <Checkbox
                                                        checked={selectedFounders.includes(founder.id)}
                                                        onChange={() => toggleFounderSelection(founder.id)}
                                                        className="flex-shrink-0"
                                                    />

                                                    <Avatar className="h-10 w-10 flex-shrink-0">
                                                        <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                                                            {getInitials(founder.first_name, founder.last_name)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-sm truncate">
                                                                {founder.first_name} {founder.last_name}
                                                            </h4>
                                                            <Badge variant="outline" className="text-xs flex-shrink-0">
                                                                {formatCompanyFunction(founder.company_function)}
                                                            </Badge>
                                                        </div>

                                                        <div className="space-y-1">
                                                            {founder.company_name && (
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Building2 className="h-3 w-3 flex-shrink-0" />
                                                                    <span className="truncate">
                                                                        {founder.company_name}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                <Mail className="h-3 w-3 flex-shrink-0" />
                                                                <span className="truncate">{founder.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {index < filteredFounders.length - 1 && <Separator className="my-2" />}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex-shrink-0 p-6 pt-4 border-t bg-background">
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={sending}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendToFounders}
                            disabled={sending || selectedFounders.length === 0}
                            className="w-full sm:w-auto"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send to {selectedFounders.length} Founder{selectedFounders.length !== 1 ? "s" : ""}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
