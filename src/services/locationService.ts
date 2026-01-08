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

// Supported countries with full state and city data
const SUPPORTED_COUNTRIES = ['US', 'CA', 'GB', 'AU'];

class LocationService {
  private countries: CountryOption[] = [];
  private states: StateOption[] = [];
  private cities: CityOption[] = [];
  private initialized = false;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (this.initialized) return;

    try {
      // Get all countries
      const allCountries = Country.getAllCountries();
      this.countries = allCountries
        .filter(country => SUPPORTED_COUNTRIES.includes(country.isoCode))
        .map(country => ({
          label: country.name,
          value: country.isoCode,
          isoCode: country.isoCode,
        }));

      // Get all states for supported countries
      const allStates = State.getAllStates();
      this.states = allStates
        .filter(state => SUPPORTED_COUNTRIES.includes(state.countryCode))
        .map(state => ({
          label: state.name,
          value: state.isoCode,
          isoCode: state.isoCode,
          countryCode: state.countryCode,
        }));

      // Get all cities for supported countries
      const allCities = City.getAllCities();
      this.cities = allCities
        .filter(city => SUPPORTED_COUNTRIES.includes(city.countryCode))
        .map(city => ({
          label: city.name,
          value: city.name,
          stateCode: city.stateCode || '',
          countryCode: city.countryCode,
        }));

      this.initialized = true;
      console.log(`LocationService initialized with ${this.countries.length} countries, ${this.states.length} states, ${this.cities.length} cities`);
    } catch (error) {
      console.error('Error initializing LocationService:', error);
      this.initialized = true; // Prevent infinite retry
    }
  }

  // Get all supported countries (USA, UK, Canada, Australia)
  getAllCountries(): CountryOption[] {
    return this.countries.sort((a, b) => a.label.localeCompare(b.label));
  }

  // Get all states/provinces for a specific country
  getStatesByCountry(countryCode: string): StateOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      console.warn(`Country ${countryCode} is not supported`);
      return [];
    }

    try {
      const states = State.getStatesOfCountry(countryCode);
      if (!states) return [];
      
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

  // Get all cities for a specific country
  getCitiesByCountry(countryCode: string): CityOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      console.warn(`Country ${countryCode} is not supported`);
      return [];
    }

    try {
      const cities = City.getCitiesOfCountry(countryCode);
      if (!cities) return [];
      
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

  // Get all cities for a specific state
  getCitiesByState(countryCode: string, stateCode: string): CityOption[] {
    if (!SUPPORTED_COUNTRIES.includes(countryCode)) {
      console.warn(`Country ${countryCode} is not supported`);
      return [];
    }

    try {
      const cities = City.getCitiesOfState(countryCode, stateCode);
      if (!cities) return [];
      
      return cities.map(city => ({
        label: city.name,
        value: city.name,
        stateCode: city.stateCode || '',
        countryCode: city.countryCode,
      })).sort((a, b) => a.label.localeCompare(b.label));
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

  // Get comprehensive location statistics
  getLocationStats(): LocationStats {
    const stats: LocationStats = {
      totalCountries: this.countries.length,
      totalStates: this.states.length,
      totalCities: this.cities.length,
      countriesWithStates: {},
      statesWithCities: {},
    };

    // Count states per country
    this.countries.forEach(country => {
      const stateCount = this.getStatesByCountry(country.isoCode).length;
      stats.countriesWithStates[country.label] = stateCount;
    });

    // Count cities per state (sample for performance)
    const sampleStates = this.states.slice(0, 20); // Sample first 20 states
    sampleStates.forEach(state => {
      const cityCount = this.getCitiesByState(state.countryCode, state.isoCode).length;
      const stateKey = `${state.label}, ${this.getCountryByCode(state.countryCode)?.name}`;
      stats.statesWithCities[stateKey] = cityCount;
    });

    return stats;
  }

  // Get popular countries (all 4 supported countries)
  getPopularCountries(): CountryOption[] {
    return this.getAllCountries();
  }

  // Search countries by name (within supported countries)
  searchCountries(query: string): CountryOption[] {
    const lowerQuery = query.toLowerCase();
    return this.countries.filter(country => 
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

  // Search cities by name within a state
  searchCities(countryCode: string, stateCode: string, query: string): CityOption[] {
    const lowerQuery = query.toLowerCase();
    const cities = this.getCitiesByState(countryCode, stateCode);
    return cities.filter(city =>
      city.label.toLowerCase().includes(lowerQuery)
    );
  }

  // Get supported countries list
  getSupportedCountries(): string[] {
    return [...SUPPORTED_COUNTRIES];
  }

  // Check if country is supported
  isCountrySupported(countryCode: string): boolean {
    return SUPPORTED_COUNTRIES.includes(countryCode);
  }
}

export const locationService = new LocationService();
export default locationService;