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

    // Get all countries
    const allCountries = Country.getAllCountries();
    this.countries = allCountries.map(country => ({
      label: country.name,
      value: country.isoCode,
      isoCode: country.isoCode,
    }));

    // Get all states
    const allStates = State.getAllStates();
    this.states = allStates.map(state => ({
      label: state.name,
      value: state.isoCode,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    }));

    // Get all cities
    const allCities = City.getAllCities();
    this.cities = allCities.map(city => ({
      label: city.name,
      value: city.name,
      stateCode: city.stateCode || '',
      countryCode: city.countryCode,
    }));

    this.initialized = true;
  }

  // Get all countries (filtered to specific countries only)
  getAllCountries(): CountryOption[] {
    const allowedCountries = ['US', 'CA', 'GB', 'AU'];
    return this.countries
      .filter(country => allowedCountries.includes(country.isoCode))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  // Get states by country
  getStatesByCountry(countryCode: string): StateOption[] {
    const states = State.getStatesOfCountry(countryCode);
    return states.map(state => ({
      label: state.name,
      value: state.isoCode,
      isoCode: state.isoCode,
      countryCode: state.countryCode,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }

  // Get cities by country
  getCitiesByCountry(countryCode: string): CityOption[] {
    const cities = City.getCitiesOfCountry(countryCode);
    if (!cities) return [];
    return cities.map(city => ({
      label: city.name,
      value: city.name,
      stateCode: city.stateCode || '',
      countryCode: city.countryCode,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }

  // Get cities by state
  getCitiesByState(countryCode: string, stateCode: string): CityOption[] {
    const cities = City.getCitiesOfState(countryCode, stateCode);
    if (!cities) return [];
    return cities.map(city => ({
      label: city.name,
      value: city.name,
      stateCode: city.stateCode || '',
      countryCode: city.countryCode,
    })).sort((a, b) => a.label.localeCompare(b.label));
  }

  // Get country by ISO code
  getCountryByCode(countryCode: string) {
    return Country.getCountryByCode(countryCode);
  }

  // Get state by codes
  getStateByCode(countryCode: string, stateCode: string) {
    return State.getStateByCodeAndCountry(stateCode, countryCode);
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

    // Count cities per state
    this.states.forEach(state => {
      const cityCount = this.getCitiesByState(state.countryCode, state.isoCode).length;
      const stateKey = `${state.label}, ${this.getCountryByCode(state.countryCode)?.name}`;
      stats.statesWithCities[stateKey] = cityCount;
    });

    return stats;
  }

  // Get popular countries (only the 4 allowed countries)
  getPopularCountries(): CountryOption[] {
    const allowedCodes = ['US', 'CA', 'GB', 'AU'];
    return allowedCodes
      .map(code => this.countries.find(country => country.isoCode === code))
      .filter(Boolean) as CountryOption[];
  }

  // Search countries by name (only within allowed countries)
  searchCountries(query: string): CountryOption[] {
    const lowerQuery = query.toLowerCase();
    const allowedCountries = ['US', 'CA', 'GB', 'AU'];
    return this.countries
      .filter(country => allowedCountries.includes(country.isoCode))
      .filter(country => country.label.toLowerCase().includes(lowerQuery));
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
}

export const locationService = new LocationService();
export default locationService;