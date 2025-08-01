"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Loader2, User, MapPin, Briefcase } from "lucide-react";
import { investorTypes } from "@/lib/constants/investor-constants";
import { Country, City } from "country-state-city";
import { useAddManualInvestor } from "@/hooks/query-hooks/use-manual-investor";

interface AddInvestorManuallySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface CountryData {
    name: string;
    code: string;
}

interface CityData {
    name: string;
}

export function AddInvestorManuallySheet({ open, onOpenChange }: AddInvestorManuallySheetProps) {
    // Form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [investsViaCompany, setInvestsViaCompany] = useState(false);
    const [investorType, setInvestorType] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [title, setTitle] = useState("");

    // Location data
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [cities, setCities] = useState<CityData[]>([]);

    // Mutations
    const addInvestorMutation = useAddManualInvestor();

    // Load countries on mount
    useEffect(() => {
        try {
            const countryData = Country.getAllCountries().map((country) => ({
                name: country.name,
                code: country.isoCode,
            }));
            setCountries(countryData);
        } catch (error) {
            console.error("Failed to load countries:", error);
            // Fallback countries
            setCountries([
                { name: "United States", code: "US" },
                { name: "United Kingdom", code: "GB" },
                { name: "Canada", code: "CA" },
                { name: "Germany", code: "DE" },
                { name: "France", code: "FR" },
                { name: "India", code: "IN" },
                { name: "Japan", code: "JP" },
                { name: "Australia", code: "AU" },
                { name: "Singapore", code: "SG" },
            ]);
        }
    }, []);

    // Load cities when country changes
    useEffect(() => {
        if (country) {
            try {
                const selectedCountry = countries.find((c) => c.name === country);
                if (selectedCountry) {
                    const cityData =
                        City.getCitiesOfCountry(selectedCountry.code)?.map((city) => ({
                            name: city.name,
                        })) || [];
                    setCities(cityData);
                    setCity(""); // Reset city when country changes
                }
            } catch (error) {
                console.error("Failed to load cities:", error);
                setCities([]);
            }
        } else {
            setCities([]);
            setCity("");
        }
    }, [country, countries]);

    // Handle investment type toggle
    const handleInvestmentTypeChange = (checked: boolean) => {
        setInvestsViaCompany(checked);
        if (!checked) {
            // If switching to individual, clear investor type but keep company name as optional
            setInvestorType("");
        }
    };

    // Form validation
    const isFormValid = () => {
        const basicFieldsValid = firstName.trim() && lastName.trim() && email.trim() && country && city;
        if (investsViaCompany) {
            // If invests via company, investor type and company name are required
            return basicFieldsValid && investorType && companyName.trim();
        } else {
            // If individual investor, basic fields are enough
            return basicFieldsValid;
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (!isFormValid()) return;

        const formData = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            investsViaCompany,
            investorType: investsViaCompany ? investorType : undefined,
            companyName: companyName.trim() || undefined,
            country,
            city,
            title: title.trim() || undefined,
        };

        addInvestorMutation.mutate(formData, {
            onSuccess: () => {
                handleReset();
                onOpenChange(false);
            },
        });
    };

    // Reset form
    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setInvestsViaCompany(false);
        setInvestorType("");
        setCompanyName("");
        setCountry("");
        setCity("");
        setTitle("");
    };

    // Handle sheet close
    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen && !addInvestorMutation.isPending) {
            handleReset();
        }
        onOpenChange(newOpen);
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-hidden flex flex-col">
                <SheetHeader className="flex-shrink-0">
                    <SheetTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Add Investor Manually
                    </SheetTitle>
                    <SheetDescription>
                        Add a new investor to your database with their contact information.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="space-y-6 py-4">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            disabled={addInvestorMutation.isPending}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Smith"
                                            disabled={addInvestorMutation.isPending}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john.smith@example.com"
                                        disabled={addInvestorMutation.isPending}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Chief Executive Officer"
                                        disabled={addInvestorMutation.isPending}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Investment Type */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" />
                                    Investment Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="investmentType">Invests via Company *</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Toggle on if this investor invests through a company/firm, off if they
                                            invest individually
                                        </p>
                                    </div>
                                    <Switch
                                        id="investmentType"
                                        checked={investsViaCompany}
                                        onCheckedChange={handleInvestmentTypeChange}
                                        disabled={addInvestorMutation.isPending}
                                    />
                                </div>

                                {investsViaCompany && (
                                    <div className="space-y-4 pt-4 border-t">
                                        <div className="space-y-2">
                                            <Label htmlFor="investorType">Investor Type *</Label>
                                            <Select
                                                value={investorType}
                                                onValueChange={setInvestorType}
                                                disabled={addInvestorMutation.isPending}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select investor type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <ScrollArea className="h-[200px]">
                                                        {investorTypes
                                                            .filter(
                                                                (type) =>
                                                                    type.label !== "Individual" &&
                                                                    type.label !== "Angel Investor"
                                                            )
                                                            .map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="companyName">Company Name *</Label>
                                            <Input
                                                id="companyName"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="Acme Ventures"
                                                disabled={addInvestorMutation.isPending}
                                            />
                                        </div>
                                    </div>
                                )}

                                {!investsViaCompany && (
                                    <div className="pt-4 border-t">
                                        <div className="space-y-4">
                                            <div>
                                                <Label>Individual Investor</Label>
                                                <p className="text-sm text-muted-foreground">
                                                    This investor will be marked as an individual investor.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="companyNameOptional">Company Name (Optional)</Label>
                                                <Input
                                                    id="companyNameOptional"
                                                    value={companyName}
                                                    onChange={(e) => setCompanyName(e.target.value)}
                                                    placeholder="Associated company (optional)"
                                                    disabled={addInvestorMutation.isPending}
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    If provided, we'll create a firm entry and link this investor as a
                                                    contact.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="investorTypeOptional">Investor Type (Optional)</Label>
                                                <Select
                                                    value={investorType}
                                                    onValueChange={setInvestorType}
                                                    disabled={addInvestorMutation.isPending}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select investor type (optional)" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <ScrollArea className="h-[200px]">
                                                            {investorTypes.map((type) => (
                                                                <SelectItem key={type.value} value={type.value}>
                                                                    {type.label}
                                                                </SelectItem>
                                                            ))}
                                                        </ScrollArea>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* HQ Location */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    HQ Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country *</Label>
                                        <Select
                                            value={country}
                                            onValueChange={setCountry}
                                            disabled={addInvestorMutation.isPending}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select country" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <ScrollArea className="h-[200px]">
                                                    {countries.map((countryItem) => (
                                                        <SelectItem key={countryItem.code} value={countryItem.name}>
                                                            {countryItem.name}
                                                        </SelectItem>
                                                    ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Select
                                            value={city}
                                            onValueChange={setCity}
                                            disabled={addInvestorMutation.isPending || !country}
                                        >
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={country ? "Select city" : "Select country first"}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <ScrollArea className="h-[200px]">
                                                    {cities.map((cityItem) => (
                                                        <SelectItem key={cityItem.name} value={cityItem.name}>
                                                            {cityItem.name}
                                                        </SelectItem>
                                                    ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Form Preview */}
                        {(firstName || lastName || email) && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="text-sm space-y-1">
                                        {(firstName || lastName) && (
                                            <p>
                                                <span className="font-medium">Name:</span> {firstName} {lastName}
                                            </p>
                                        )}
                                        {email && (
                                            <p>
                                                <span className="font-medium">Email:</span> {email}
                                            </p>
                                        )}
                                        {title && (
                                            <p>
                                                <span className="font-medium">Title:</span> {title}
                                            </p>
                                        )}
                                        <p>
                                            <span className="font-medium">Investment Type:</span>{" "}
                                            {investsViaCompany ? "Via Company" : "Individual"}
                                        </p>
                                        {investorType && (
                                            <p>
                                                <span className="font-medium">Investor Type:</span> {investorType}
                                            </p>
                                        )}
                                        {companyName && (
                                            <p>
                                                <span className="font-medium">Company:</span> {companyName}
                                            </p>
                                        )}
                                        {(country || city) && (
                                            <p>
                                                <span className="font-medium">Location:</span> {city}
                                                {city && country && ", "}
                                                {country}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>

                <Separator className="my-4" />

                <div className="flex justify-end space-x-2 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={addInvestorMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isFormValid() || addInvestorMutation.isPending}
                        className="min-w-[120px]"
                    >
                        {addInvestorMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <User className="mr-2 h-4 w-4" />
                                Add Investor
                            </>
                        )}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
