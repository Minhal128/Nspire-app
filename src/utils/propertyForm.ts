/**
 * Add-Property form rules.
 *
 * Kept out of the screen so the required-field list and the API payload can be
 * checked without a simulator (see propertyForm.check.ts).
 */

import { Country, State } from 'country-state-city';

export interface PropertyFormValues {
  propertyId: string;
  propertyName: string;
  address: string;
  countryText: string;
  stateText: string;
  cityText: string;
  postalCode: string;
  numberOfBuildings: string;
  numberOfUnits: string;
  resolvedCountryCode: string;
  resolvedStateCode: string;
  resolvedCityName: string;
}

/**
 * Required fields are exactly the fields the form renders. Country has no
 * input on this screen (web parity) so it is never required — it only arrives
 * via file import.
 *
 * Returns the error message to show, or null when the form is submittable.
 */
export const validatePropertyForm = (
  form: PropertyFormValues,
  index: number,
): string | null => {
  const label = `Property ${index + 1}`;
  if (!form.propertyName.trim()) return `${label}: Property Name is required`;
  if (!form.address.trim()) return `${label}: Address is required`;
  if (!form.stateText.trim()) return `${label}: State is required`;
  if (!form.cityText.trim()) return `${label}: City is required`;
  if (!form.postalCode.trim()) return `${label}: Postal Code is required`;
  return null;
};

/** The body POSTed to /properties (and /properties/bulk) for one form. */
export const buildPropertyPayload = (
  form: PropertyFormValues,
  index: number,
  now: number = Date.now(),
) => {
  const country = form.resolvedCountryCode || form.countryText.trim();
  const countryData = country ? Country.getCountryByCode(country) : null;
  const stateData = country
    ? State.getStateByCodeAndCountry(form.resolvedStateCode, country)
    : null;

  return {
    propertyId: form.propertyId.trim() || `PROP-${now}-${index}`,
    name: form.propertyName.trim(),
    address: form.address.trim(),
    city: form.resolvedCityName || form.cityText.trim(),
    state: form.resolvedStateCode || form.stateText.trim(),
    // Omitted entirely when unknown — the backend must not receive country: ''.
    ...(country
      ? { country, countryName: countryData?.name || form.countryText.trim() }
      : {}),
    stateName: stateData?.name || form.stateText.trim(),
    zipCode: form.postalCode.trim(),
    buildings: parseInt(form.numberOfBuildings) || 1,
    units: parseInt(form.numberOfUnits) || 1,
  };
};
