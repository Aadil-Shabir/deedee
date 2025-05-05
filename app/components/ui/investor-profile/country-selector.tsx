
import { Check, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { countryKeys, countryNameMap } from "@/data/countriesdata";

interface CountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  disabled?: boolean;
}

export function CountrySelector({ selectedCountry, onCountryChange, disabled = false }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const filteredCountries = searchTerm.trim() === "" 
    ? countryKeys 
    : countryKeys.filter(country => 
        countryNameMap[country as keyof typeof countryNameMap]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full" ref={dropdownRef}>
      <label className="block text-sm mb-2 flex items-center">
        In what country are you located?
        <Check className="w-4 h-4 text-green-500 ml-2" />
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-md text-white text-left ${
            disabled ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={disabled}
        >
          <span>
            {selectedCountry
              ? countryNameMap[selectedCountry as keyof typeof countryNameMap]
              : "Select a country"}
          </span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white text-sm"
                autoFocus
              />
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length === 0 ? (
                <div className="p-2 text-gray-400 text-sm">No countries found</div>
              ) : (
                <div className="py-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country}
                      type="button"
                      onClick={() => {
                        onCountryChange(country);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 ${
                        selectedCountry === country ? "bg-gray-700 text-white" : "text-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedCountry === country ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {countryNameMap[country as keyof typeof countryNameMap]}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
