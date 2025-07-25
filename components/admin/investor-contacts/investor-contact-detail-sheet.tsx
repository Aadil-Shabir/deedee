"use client";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Building,
    User,
    Activity,
    MessageSquare,
    ExternalLink,
    CheckCircle,
    Clock,
} from "lucide-react";
import type { InvestorContactCsvData } from "@/types/investor-contact";

interface InvestorContactDetailSheetProps {
    contact: InvestorContactCsvData | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InvestorContactDetailSheet({ contact, open, onOpenChange }: InvestorContactDetailSheetProps) {
    if (!contact) return null;

    const getRoleTypeBadgeColor = (roleType: string | null) => {
        if (!roleType) return "bg-muted text-muted-foreground border-border";

        const lowerType = roleType.toLowerCase();
        if (lowerType.includes("decision") || lowerType.includes("partner")) {
            return "bg-primary/10 text-primary border-primary/20";
        } else if (lowerType.includes("analyst")) {
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        } else if (lowerType.includes("support")) {
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
        return "bg-muted text-muted-foreground border-border";
    };

    const getIntroMethodBadgeColor = (method: string | null) => {
        if (!method) return "bg-muted text-muted-foreground border-border";

        const lowerMethod = method.toLowerCase();
        if (lowerMethod.includes("cold")) {
            return "bg-red-500/10 text-red-400 border-red-500/20";
        } else if (lowerMethod.includes("intro")) {
            return "bg-green-500/10 text-green-400 border-green-500/20";
        } else if (lowerMethod.includes("event")) {
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        }
        return "bg-muted text-muted-foreground border-border";
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contact Details
                    </SheetTitle>
                    <SheetDescription>Complete information for {contact.full_name}</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Basic Information</h3>
                        </div>
                        <Separator />

                        <div className="grid gap-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm font-medium">{contact.full_name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground">Role Type</label>
                                </div>
                                <div className="col-span-2">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${getRoleTypeBadgeColor(contact.role_type)}`}
                                    >
                                        {contact.role_type}
                                    </Badge>
                                </div>
                            </div>

                            {contact.title && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">Title</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm">{contact.title}</p>
                                    </div>
                                </div>
                            )}

                            {contact.firm_id && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">Firm ID</label>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                            {contact.firm_id}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Contact Information</h3>
                        </div>
                        <Separator />

                        <div className="grid gap-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <p className="text-sm">{contact.email}</p>
                                        {contact.email_verified && (
                                            <Badge
                                                variant="outline"
                                                className="text-xs bg-green-50 text-green-700 border-green-200"
                                            >
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {contact.mobile_phone && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Mobile Phone
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{contact.mobile_phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.linkedin_url && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Linkedin className="h-4 w-4 text-muted-foreground" />
                                            <Button
                                                variant="link"
                                                className="h-auto p-0 text-sm text-blue-600 hover:underline"
                                                onClick={() => window.open(contact.linkedin_url!, "_blank")}
                                            >
                                                View LinkedIn Profile
                                                <ExternalLink className="h-3 w-3 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.location && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">Location</label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <p className="text-sm">{contact.location}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.preferred_channel && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Preferred Channel
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <Badge variant="outline" className="text-xs">
                                            {contact.preferred_channel}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Professional Information</h3>
                        </div>
                        <Separator />

                        <div className="grid gap-4">
                            {contact.intro_method && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Intro Method
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${getIntroMethodBadgeColor(contact.intro_method)}`}
                                        >
                                            {contact.intro_method}
                                        </Badge>
                                    </div>
                                </div>
                            )}

                            {contact.activity_score !== null && contact.activity_score !== undefined && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Activity Score
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-muted-foreground" />
                                            <Badge variant="outline" className="text-xs">
                                                {contact.activity_score}/100
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.investor_focus_notes && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">Focus Notes</label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="bg-muted p-3 rounded-lg">
                                            <p className="text-sm">{contact.investor_focus_notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {contact.personal_notes && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Personal Notes
                                        </label>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="bg-muted p-3 rounded-lg">
                                            <MessageSquare className="h-4 w-4 text-muted-foreground mb-2" />
                                            <p className="text-sm">{contact.personal_notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <h3 className="text-lg font-semibold">Metadata</h3>
                        </div>
                        <Separator />

                        <div className="grid gap-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="text-sm font-medium text-muted-foreground">Source</label>
                                </div>
                                <div className="col-span-2">
                                    <Badge variant="outline" className="text-xs">
                                        {contact.source || "Admin Import"}
                                    </Badge>
                                </div>
                            </div>

                            {contact.isDuplicate && (
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                    </div>
                                    <div className="col-span-2">
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                                        >
                                            Duplicate Detected
                                        </Badge>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
