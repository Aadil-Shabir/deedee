// Using country-state-city package for comprehensive location data
import { Country, City } from "country-state-city";

export interface CountryOption {
    value: string;
    label: string;
    code: string;
}

export interface CityOption {
    value: string;
    label: string;
    countryCode: string;
}

export class LocationService {
    /**
     * Get all countries
     */
    static getAllCountries(): CountryOption[] {
        try {
            const countries = Country.getAllCountries();
            return countries
                .map((country) => ({
                    value: country.isoCode.toLowerCase(),
                    label: country.name,
                    code: country.isoCode,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
        } catch (error) {
            console.error("Error loading countries:", error);
            // Fallback countries
            return [
                { value: "us", label: "United States", code: "US" },
                { value: "gb", label: "United Kingdom", code: "GB" },
                { value: "ca", label: "Canada", code: "CA" },
                { value: "de", label: "Germany", code: "DE" },
                { value: "fr", label: "France", code: "FR" },
                { value: "in", label: "India", code: "IN" },
                { value: "jp", label: "Japan", code: "JP" },
                { value: "au", label: "Australia", code: "AU" },
                { value: "sg", label: "Singapore", code: "SG" },
            ];
        }
    }

    /**
     * Get cities by country code
     */
    static getCitiesByCountry(countryCode: string): CityOption[] {
        try {
            const upperCountryCode = countryCode.toUpperCase();
            const cities = City.getCitiesOfCountry(upperCountryCode);

            if (!cities || cities.length === 0) {
                return [];
            }

            return cities
                .map((city) => ({
                    value: city.name.toLowerCase().replace(/\s+/g, "-"),
                    label: city.name,
                    countryCode: city.countryCode,
                }))
                .sort((a, b) => a.label.localeCompare(b.label));
        } catch (error) {
            console.error("Error loading cities for country:", countryCode, error);
            return [];
        }
    }

    /**
     * Get cities by country name (helper function)
     */
    static getCitiesByCountryName(countryName: string): CityOption[] {
        try {
            // Find country by name first
            const countries = Country.getAllCountries();
            const country = countries.find((c) => c.name === countryName);

            if (!country) {
                console.error("Country not found:", countryName);
                return [];
            }

            return this.getCitiesByCountry(country.isoCode);
        } catch (error) {
            console.error("Error loading cities for country name:", countryName, error);
            return [];
        }
    }

    /**
     * Get country name by code
     */
    static getCountryByCode(countryCode: string): CountryOption | null {
        try {
            const country = Country.getCountryByCode(countryCode.toUpperCase());
            if (!country) return null;

            return {
                value: country.isoCode.toLowerCase(),
                label: country.name,
                code: country.isoCode,
            };
        } catch (error) {
            console.error("Error getting country by code:", countryCode, error);
            return null;
        }
    }

    /**
     * Format location string
     */
    static formatLocation(city?: string, country?: string): string {
        const parts = [city, country].filter(Boolean);
        return parts.join(", ");
    }
}

// Export convenience functions for easier usage
export const getCountries = () => LocationService.getAllCountries();
export const getCitiesByCountry = (countryCode: string) => LocationService.getCitiesByCountry(countryCode);
export const getCitiesByCountryName = (countryName: string) => LocationService.getCitiesByCountryName(countryName);
export const getCountryByCode = (countryCode: string) => LocationService.getCountryByCode(countryCode);
export const formatLocation = (city?: string, country?: string) => LocationService.formatLocation(city, country);
