/**
 * Inspection coverage options.
 *
 * Labels and order match the web portal's CoverageSelectionModal so the two
 * surfaces read identically. Every screen that offers a coverage choice
 * (Dashboard, My Inspection, Building Inspection) uses this list.
 */
export const COVERAGE_OPTIONS = [
  { label: 'Random Sample', value: 'random', description: 'Automatically select a random sample based on NSPIRE guidelines' },
  { label: '50% - Half Units', value: '50', description: 'Inspect half of all units (randomly selected)' },
  { label: '100% - All Units', value: '100', description: 'Inspect every unit in the property' },
];

export default COVERAGE_OPTIONS;
