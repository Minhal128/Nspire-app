/**
 * Coverage -> unit allocation, shared by every screen that starts an inspection.
 *
 * Mirrors the calculation the Dashboard and My Inspection screens already run
 * inline (web parity: CoverageSelectionModal + /dashboard/property-details).
 * Extracted so the Management portal starts inspections on exactly the same
 * numbers instead of adding a third copy.
 */
// ponytail: explicit .ts extension so the sibling .check.ts runs under
// `node --experimental-strip-types` (Node won't guess the extension). Metro and
// tsc (noEmit + bundler resolution) both resolve it as-is.
import { generateRandomUnitSample, isRandomSelectionAvailable } from '../services/unitSamplingService.ts';

export interface CoverageUnits {
  calculatedUnits: number;
  selectedUnits: string[];
}

/** `Unit 001`, `Unit 002`, ... — the label format used across the app. */
export const buildUnitList = (count: number): string[] =>
  Array.from({ length: Math.max(0, count) }, (_, i) => `Unit ${String(i + 1).padStart(3, '0')}`);

export function resolveCoverageUnits(
  coverage: string,
  totalUnits: number,
  propertyId: string
): CoverageUnits {
  const total = Math.max(1, totalUnits);

  if (coverage === '100') {
    return { calculatedUnits: total, selectedUnits: buildUnitList(total) };
  }

  if (coverage === '50') {
    const half = Math.ceil(total / 2);
    return { calculatedUnits: half, selectedUnits: buildUnitList(half) };
  }

  // 'random' -> NSPIRE sample. Falls back to the sqrt heuristic the existing
  // screens use when the sampler rejects the unit count.
  if (isRandomSelectionAvailable(total)) {
    try {
      const sample = generateRandomUnitSample(total, propertyId);
      return { calculatedUnits: sample.unitsToInspect, selectedUnits: sample.selectedUnits };
    } catch (error) {
      console.error('NSPIRE sampling failed, falling back:', error);
    }
  }

  const fallback = Math.min(total, Math.max(5, Math.ceil(Math.sqrt(total))));
  return { calculatedUnits: fallback, selectedUnits: buildUnitList(fallback) };
}
