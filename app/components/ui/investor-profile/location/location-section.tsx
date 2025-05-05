
// import { CountrySelector } from "../investor/CountrySelector";
// import { CitySelector } from "../investor/CitySelector";

import { CitySelector } from "../city-selector";
import { CountrySelector } from "../country-selector";

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
  return (
    <div className="space-y-8">
      <CountrySelector 
        selectedCountry={selectedCountry}
        onCountryChange={onCountryChange}
        disabled={disabled}
      />

      <CitySelector 
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        onCityChange={onCityChange}
        disabled={disabled}
      />
    </div>
  );
}
