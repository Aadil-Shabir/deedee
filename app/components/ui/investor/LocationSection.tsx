'use client'
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import countries from '@/lib/data/countries';

interface LocationSectionProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  disabled?: boolean;
}

export function LocationSection({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  disabled = false
}: LocationSectionProps) {
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCountries(countries);
      return;
    }
    
    const filtered = countries.filter(country => 
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchQuery]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select
          value={selectedCountry}
          onValueChange={onCountryChange}
          disabled={disabled}
        >
          <SelectTrigger id="country" className="bg-gray-800/50 border-gray-700">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
            <Input 
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2 bg-gray-800"
            />
            {filteredCountries.map((country) => (
              <SelectItem 
                key={country.code} 
                value={country.code}
                className="hover:bg-gray-800"
              >
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          placeholder="Enter city"
          className="bg-gray-800/50 border-gray-700"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}