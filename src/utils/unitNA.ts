/**
 * A unit whose every answer is "N/A" was not inspected as such, and the report
 * has to say so instead of listing it like any other inspected unit.
 */

export const isAllNA = (responses: Record<string, any> | null | undefined): boolean => {
  const answers = Object.values(responses || {}).filter(
    (v) => v !== null && v !== undefined && String(v).trim() !== '',
  );
  return answers.length > 0 && answers.every((v) => v === 'N/A');
};

/** Record on a progress entry whether `unit` is all-N/A; the latest source wins. */
export const markUnitNA = (
  entry: { naUnits?: string[] },
  unit: string,
  responses: Record<string, any> | null | undefined,
): void => {
  entry.naUnits = (entry.naUnits || []).filter((u) => u !== unit);
  if (isAllNA(responses)) entry.naUnits.push(unit);
};

/** "Unit 003" -> "Unit 003 (N/A)" for units marked N/A. */
export const labelUnit = (unit: string, naUnits: string[] | undefined): string =>
  (naUnits || []).includes(unit) ? `${unit} (N/A)` : unit;

/**
 * One building can have several progress entries (backend and local). A unit
 * is N/A only if every entry that lists it also marks it N/A, so the entry with
 * real answers wins.
 */
export const isNAInAll = (
  entries: { inspectedUnits?: unknown[]; naUnits?: unknown[] }[],
  unit: string,
  norm: (u: unknown) => string = String,
): boolean => {
  const listing = entries.filter((e) => (e?.inspectedUnits || []).some((u) => norm(u) === unit));
  return listing.length > 0 && listing.every((e) => (e?.naUnits || []).some((u) => norm(u) === unit));
};
