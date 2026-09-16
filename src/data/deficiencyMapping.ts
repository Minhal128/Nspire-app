/**
 * Deficiency options for the inspection screens.
 *
 * The data and the lookup behaviour here are the web build's, unchanged:
 *   - the options come from src/data/web/*, copied verbatim from inspire-web/lib
 *   - the section -> mapping choice and the exact/fuzzy item match are the same
 *     ones app/dashboard/inspection-category/[id]/page.tsx uses
 *
 * Web presents one flat list of deficiencies per item, so there is no
 * subcategory step here either — hasSubcategories() always returns false.
 */

import {
  outsideDeficiencyMapping,
  insideDeficiencyMapping,
  type DeficiencyDetail,
} from './web/webDeficiencyMapping';
import { unitDeficiencyMapping } from './web/webUnitDeficiencyMapping';
import { ALL_OUTSIDE_DEFICIENCIES } from './web/outsideAppData';
import { ALL_UNIT_CATEGORIES } from './web/insideAppData';
import { ALL_INSIDE_CATEGORIES } from './web/unitAppData';

export interface DeficiencyOption {
  id: string;
  name: string;
  detail: string;
  criteria: string;
  severity: 'Life-Threatening' | 'Severe' | 'Moderate' | 'Low';
  repairBy: string;
  points: string;
  code?: string;
  codeReference?: string;
}

export interface ItemDeficiencies {
  itemName: string;
  deficiencies: DeficiencyOption[];
}

const UNIT_LOCATION_NAMES = [
  'unit',
  'attic/loft',
  'basement',
  'bathroom1',
  'bathroom2',
  'bathroom3',
  'bedroom 1',
  'bedroom 2',
  'bedroom 3',
  'bedroom 4',
  'bedroom 5',
  'closet',
  'dinning area',
  'entryway(front/rear',
  'garage',
  'hallway/stairs',
  'home office/study',
  'kitchen',
  'laundry room',
  'living room',
  'location',
  'mechanical room',
  'office',
  'other',
  'patio/porch/balcony',
  'storage room',
];

/**
 * Check if a location is a unit location (specific room like Basement, Bedroom, etc.)
 * NOT "Outside" and NOT "Inside" - these are specific room locations
 */
export function isUnitLocation(location: string): boolean {
  if (!location) return false;
  const loc = location.toLowerCase().trim();

  // Outside and Inside are NOT unit locations
  if (loc === 'outside' || loc === 'inside') {
    return false;
  }

  // Check if it matches any unit location name
  return UNIT_LOCATION_NAMES.some(unitLoc =>
    loc === unitLoc ||
    loc.includes(unitLoc) ||
    unitLoc.includes(loc)
  );
}

/**
 * `codeReference` is on the raw NSPIRE options but web's convertToUIDetail drops
 * it, so recover it by id rather than editing the copied web files.
 */
const codeReferenceById = new Map<string, string>();
{
  const note = (d: any) => {
    if (d?.id && d.codeReference) codeReferenceById.set(String(d.id), String(d.codeReference));
  };
  const walk = (node: any, seen = new Set<any>()) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) { node.forEach(n => walk(n, seen)); return; }
    if (Array.isArray(node.deficiencies)) node.deficiencies.forEach(note);
    for (const [k, v] of Object.entries(node)) {
      if (k !== 'deficiencies' && v && typeof v === 'object') walk(v, seen);
    }
  };
  walk(ALL_OUTSIDE_DEFICIENCIES);
  walk(ALL_UNIT_CATEGORIES);
  walk(ALL_INSIDE_CATEGORIES);
}

function toOption(d: DeficiencyDetail): DeficiencyOption {
  return {
    id: d.id,
    // Passed through exactly as the mapping produced it — web's two adapters
    // differ on trimming (deficiencyMapping trims, unitDeficiencyMapping does not),
    // so normalising here would drift from one of them.
    name: d.selected,
    detail: d.detail,
    criteria: d.criteria,
    severity: d.healthAndSafety as DeficiencyOption['severity'],
    repairBy: d.repairBy || '',
    points: d.pointsFormula || '',
    code: d.codeAndCompliance,
    codeReference: codeReferenceById.get(String(d.id)),
  };
}

/** Web's section -> mapping assignment (the names are swapped on purpose). */
function mappingFor(locationType?: string): Record<string, DeficiencyDetail[]> {
  const loc = (locationType || '').toLowerCase();
  if (loc === 'outside') return outsideDeficiencyMapping;
  if (loc === 'inside') return unitDeficiencyMapping;
  return insideDeficiencyMapping; // unit locations
}

/** Web's exact-then-fuzzy item match. */
function lookup(mapping: Record<string, DeficiencyDetail[]>, itemName: string): DeficiencyDetail[] {
  if (!itemName) return [];
  const baseName = itemName.replace(/^\d+\.\s+/, '').trim();

  const exactKey = Object.keys(mapping).find(k => k.toLowerCase() === baseName.toLowerCase());
  if (exactKey) return mapping[exactKey] || [];

  const matchedKey = Object.keys(mapping).find(k => {
    const nk = k.toLowerCase();
    const nb = baseName.toLowerCase();
    if (nb.includes(nk) || nk.includes(nb)) return true;
    // Special case for Paint to be more resilient
    if (nb.includes('paint') && nk.includes('paint')) return true;
    return false;
  });
  return matchedKey ? (mapping[matchedKey] || []) : [];
}

export const getDeficienciesForItem = (
  itemName: string,
  locationType?: string,
): ItemDeficiencies => ({
  itemName,
  deficiencies: lookup(mappingFor(locationType), itemName).map(toOption),
});

/** Web shows a single flat list per item — there is no subcategory step. */
export const hasSubcategories = (_itemName: string, _locationType?: string): boolean => false;

export const getSubcategoriesForItem = (
  _itemName: string,
  _locationType?: string,
): { id: string; name: string }[] => [];

export const getDeficienciesForSubcategory = (
  subcategoryName: string,
  locationType?: string,
  _parentCategory?: string,
): ItemDeficiencies => ({
  itemName: subcategoryName,
  deficiencies: lookup(mappingFor(locationType), subcategoryName).map(toOption),
});
