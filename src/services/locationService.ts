import { Country, State, City } from 'country-state-city';

export interface CountryOption {
  label: string;
  value: string;
  isoCode: string;
}

export interface StateOption {
  label: string;
  value: string;
  isoCode: string;
  countryCode: string;
}

export interface CityOption {
  label: string;
  value: string;
  stateCode: string;
  countryCode: string;
}

export interface LocationStats {
  totalCountries: number;
  totalStates: number;
  totalCities: number;
  countriesWithStates: { [key: string]: number };
  statesWithCities: { [key: string]: number };
}

// Only these 4 countries: USA, UK, Canada, Australia
const SUPPORTED_COUNTRIES = ['US', 'GB', 'CA', 'AU'];

class LocationService {
  private initialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;
    
    try {
      const countries = Country.getAllCountries().filter(c => SUPPORTED_COUNTRIES.includes(c.isoCode));
      const states = State.getAllStates().filter(s => SUPPORTED_COUNTRIES.includes(s.countryCode));
      const cities = City.getAllCities().filter(c => SUPPORTED_COUNTRIES.includes(c.countryCode));
      
      this.initialized = true;
      console.log(`LocationService initialized with ${countries.length} countries, ${states.length} states, ${cities.length} cities`);
    } catch (error) {
      console.error('Error initializing LocationService:', error);
      this.initialized = true;
    }
  }

  // Get only USA, UK, Canada, Australia
  getAllCountries(): CountryOption[] {
    try {
      const allCountries = Country.getAllCountries();
      return allCountries
        .filter(country => SUPPORTED_COUNTRIES.includes(country.isoCode))
        .map(country => ({
          label: country.name,
          value: country.isoCode,
          isoCode: country.isoCode,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error('Error getting countries:', error);
      return [];
    }
  }

  // Get all states/provinces for a country
  getStatesByCountry(countryCode: string): StateOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      return [];
    }
    
    try {
      const states = State.getStatesOfCountry(countryCode);
      if (!states || states.length === 0) return [];
      
      return states.map(state => ({
        label: state.name,
        value: state.isoCode,
        isoCode: state.isoCode,
        countryCode: state.countryCode,
      })).sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error(`Error getting states for country ${countryCode}:`, error);
      return [];
    }
  }

  // Get all cities for a country
  getCitiesByCountry(countryCode: string): CityOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      return [];
    }
    
    try {
      const cities = City.getCitiesOfCountry(countryCode);
      if (!cities || cities.length === 0) return [];
      
      return cities.map(city => ({
        label: city.name,
        value: city.name,
        stateCode: city.stateCode || '',
        countryCode: city.countryCode,
      })).sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
      console.error(`Error getting cities for country ${countryCode}:`, error);
      return [];
    }
  }

  // Get cities for a state - with fallback to all country cities for UK
  getCitiesByState(countryCode: string, stateCode: string): CityOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      return [];
    }
    
    try {
      // Try direct state lookup first
      let cities = City.getCitiesOfState(countryCode, stateCode);
      
      // If cities found, return them
      if (cities && cities.length > 0) {
        return cities.map(city => ({
          label: city.name,
          value: city.name,
          stateCode: city.stateCode || '',
          countryCode: city.countryCode,
        })).sort((a, b) => a.label.localeCompare(b.label));
      }
      
      // For UK (GB), state codes don't match city state codes
      // UK cities use ENG, WLS, SCT, NIR but states are local authorities
      // So we return all cities for the country
      if (countryCode === 'GB') {
        console.log(`UK state ${stateCode}: returning all UK cities`);
        return this.getCitiesByCountry(countryCode);
      }
      
      return [];
    } catch (error) {
      console.error(`Error getting cities for state ${stateCode} in country ${countryCode}:`, error);
      return [];
    }
  }

  // Get country by ISO code
  getCountryByCode(countryCode: string) {
    try {
      return Country.getCountryByCode(countryCode);
    } catch (error) {
      console.error(`Error getting country by code ${countryCode}:`, error);
      return null;
    }
  }

  // Get state by codes
  getStateByCode(countryCode: string, stateCode: string) {
    try {
      return State.getStateByCodeAndCountry(stateCode, countryCode);
    } catch (error) {
      console.error(`Error getting state ${stateCode} in country ${countryCode}:`, error);
      return null;
    }
  }

  // Get location statistics
  getLocationStats(): LocationStats {
    const stats: LocationStats = {
      totalCountries: SUPPORTED_COUNTRIES.length,
      totalStates: 0,
      totalCities: 0,
      countriesWithStates: {},
      statesWithCities: {},
    };

    SUPPORTED_COUNTRIES.forEach(code => {
      const stateCount = this.getStatesByCountry(code).length;
      const country = this.getCountryByCode(code);
      stats.countriesWithStates[country?.name || code] = stateCount;
      stats.totalStates += stateCount;
    });

    return stats;
  }

  // Search countries by name
  searchCountries(query: string): CountryOption[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllCountries().filter(country => 
      country.label.toLowerCase().includes(lowerQuery)
    );
  }

  // Search states by name within a country
  searchStates(countryCode: string, query: string): StateOption[] {
    const lowerQuery = query.toLowerCase();
    const states = this.getStatesByCountry(countryCode);
    return states.filter(state =>
      state.label.toLowerCase().includes(lowerQuery)
    );
  }

  // Search cities by name
  searchCities(countryCode: string, stateCode: string, query: string): CityOption[] {
    const lowerQuery = query.toLowerCase();
    const cities = this.getCitiesByState(countryCode, stateCode);
    return cities.filter(city =>
      city.label.toLowerCase().includes(lowerQuery)
    );
  }
}

export const locationService = new LocationService();
export default locationService;