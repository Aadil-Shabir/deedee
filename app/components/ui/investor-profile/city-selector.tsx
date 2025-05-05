
import { Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { countriesWithCities } from "@/data/countriesdata";


interface CitySelectorProps {
  selectedCountry: string;
  selectedCity: string;
  onCityChange: (city: string) => void;
  disabled?: boolean;
}

export function CitySelector({ selectedCountry, selectedCity, onCityChange, disabled = false }: CitySelectorProps) {
  const cityOptions = selectedCountry 
    ? countriesWithCities[selectedCountry as keyof typeof countriesWithCities] || []
    : [];

  return (
    <div>
      <label className="block text-sm mb-2 flex items-center">
        In what city are you living?
        <Check className="w-4 h-4 text-green-500 ml-2" />
      </label>
      {cityOptions.length > 0 ? (
        <Select
          value={selectedCity}
          onValueChange={onCityChange}
          disabled={disabled || !selectedCountry}
        >
          <SelectTrigger className={`bg-gray-800/50 border-gray-700 ${disabled ? 'opacity-70' : ''}`}>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
          <SelectContent>
            {cityOptions.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={`bg-gray-800/50 border-gray-700 ${disabled ? 'opacity-70' : ''}`}
          placeholder="Enter your city"
          disabled={disabled || !selectedCountry}
        />
      )}
    </div>
  );
}
