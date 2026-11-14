/**
 * The last answer to "which areas of this building have been inspected", kept
 * on the device.
 *
 * The property screen, the categories screen and the unit list all draw their
 * progress from the server's /inspections/unit-status answer and nothing else.
 * With no signal that request fails, and every building read "Not started"
 * however much of it had been inspected. inspectionService keeps each answer
 * under these keys and falls back to it; these are the pure parts, so they can
 * be checked without a device.
 */

export type CachedUnitStatus = {
  success: boolean;
  statuses: Array<{
    unitLabel: string;
    normalizedUnitKey: string;
    isInspected: boolean;
    inspectedAt?: string;
    sourceInspectionType?: string;
  }>;
  unitStatusMap: Record<string, boolean>;
  [key: string]: any;
};

export const unitStatusCacheKey = (propertyId: unknown, buildingId: unknown): string =>
  `unit_status_cache_${String(propertyId ?? '').trim()}_${String(buildingId ?? '').trim()}`;

/** What was stored, or null if there is nothing usable there. */
export const parseCachedUnitStatus = (raw: string | null | undefined): CachedUnitStatus | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.statuses)) return null;
    return { ...parsed, success: true, unitStatusMap: parsed.unitStatusMap || {} };
  } catch {
    return null;
  }
};

/**
 * The cached answer with one more area marked inspected: 'Outside', 'Inside'
 * or a unit's name. Used when an area is finished offline, so it shows as done
 * while its save is still queued. Marking the same area twice changes nothing.
 */
export const withInspectedLabel = (
  cached: CachedUnitStatus | null,
  unitLabel: unknown,
  at: string = new Date().toISOString(),
): CachedUnitStatus => {
  const base: CachedUnitStatus = cached || { success: true, statuses: [], unitStatusMap: {} };
  const label = String(unitLabel ?? '').trim();
  if (!label) return base;

  const key = label.toLowerCase();
  const already = base.statuses.some(
    (status) => status.isInspected && String(status.unitLabel ?? '').trim().toLowerCase() === key,
  );
  if (already) return base;

  return {
    ...base,
    statuses: [...base.statuses, { unitLabel: label, normalizedUnitKey: key, isInspected: true, inspectedAt: at }],
    unitStatusMap: { ...base.unitStatusMap, [key]: true },
  };
};
