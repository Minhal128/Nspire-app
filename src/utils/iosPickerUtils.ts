import { ActionSheetIOS, Platform } from 'react-native';

export interface PickerOption {
  label: string;
  value: string;
}

export const showIOSActionSheet = (
  title: string,
  options: PickerOption[],
  onSelect: (value: string) => void
) => {
  if (Platform.OS !== 'ios') {
    return;
  }

  const actionOptions = ['Cancel', ...options.map(option => option.label)];
  const values = ['', ...options.map(option => option.value)];

  ActionSheetIOS.showActionSheetWithOptions(
    {
      options: actionOptions,
      cancelButtonIndex: 0,
      title,
    },
    (buttonIndex) => {
      if (buttonIndex !== 0) { // Not cancel
        onSelect(values[buttonIndex]);
      }
    }
  );
};

// Common picker options
export const LANGUAGE_OPTIONS: PickerOption[] = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Italian', value: 'it' },
];

export const TIMEZONE_OPTIONS: PickerOption[] = [
  { label: 'UTC-8 (PST)', value: 'PST' },
  { label: 'UTC-5 (EST)', value: 'EST' },
  { label: 'UTC+0 (GMT)', value: 'GMT' },
  { label: 'UTC+1 (CET)', value: 'CET' },
  { label: 'UTC+10 (AEST)', value: 'AEST' },
  { label: 'UTC-7 (MST)', value: 'MST' },
];

// Comprehensive US States (all 50 states + territories)
export const US_STATE_OPTIONS: PickerOption[] = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'Guam', value: 'GU' },
  { label: 'Virgin Islands', value: 'VI' },
];

// Canadian Provinces and Territories
export const CANADA_PROVINCE_OPTIONS: PickerOption[] = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland and Labrador', value: 'NL' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' },
];

// UK Countries and Regions
export const UK_REGION_OPTIONS: PickerOption[] = [
  { label: 'England', value: 'ENG' },
  { label: 'Scotland', value: 'SCT' },
  { label: 'Wales', value: 'WLS' },
  { label: 'Northern Ireland', value: 'NIR' },
];

// Australian States and Territories
export const AUSTRALIA_STATE_OPTIONS: PickerOption[] = [
  { label: 'Australian Capital Territory', value: 'ACT' },
  { label: 'New South Wales', value: 'NSW' },
  { label: 'Northern Territory', value: 'NT' },
  { label: 'Queensland', value: 'QLD' },
  { label: 'South Australia', value: 'SA' },
  { label: 'Tasmania', value: 'TAS' },
  { label: 'Victoria', value: 'VIC' },
  { label: 'Western Australia', value: 'WA' },
];

export const INSPECTION_STATUS_OPTIONS: PickerOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const DATE_RANGE_OPTIONS: PickerOption[] = [
  { label: 'Last 7 days', value: '7days' },
  { label: 'Last 30 days', value: '30days' },
  { label: 'Last 3 months', value: '3months' },
  { label: 'Last 6 months', value: '6months' },
  { label: 'Last year', value: '1year' },
  { label: 'All time', value: 'all' },
];

export const LOGIN_TYPE_OPTIONS: PickerOption[] = [
  { label: 'Inspector', value: 'inspector' },
  { label: 'Management', value: 'management' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'Administrator', value: 'admin' },
  { label: 'Other', value: 'other' },
];

export const PROPERTY_TYPE_OPTIONS: PickerOption[] = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
  { label: 'Mixed Use', value: 'mixed-use' },
  { label: 'Retail', value: 'retail' },
  { label: 'Office', value: 'office' },
];

export const UNIT_SELECTION_OPTIONS: PickerOption[] = [
  { label: 'Random Units (NSPIRE)', value: 'random_32' },
  { label: 'Select unit 50%', value: 'select_50' },
  { label: 'Select unit 100%', value: 'select_100' },
];

// Helper function to get state options by country
export const getStateOptionsByCountry = (countryCode: string): PickerOption[] => {
  switch (countryCode) {
    case 'US':
      return US_STATE_OPTIONS;
    case 'CA':
      return CANADA_PROVINCE_OPTIONS;
    case 'GB':
      return UK_REGION_OPTIONS;
    case 'AU':
      return AUSTRALIA_STATE_OPTIONS;
    default:
      return [];
  }
};