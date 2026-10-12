/**
 * Where recorded deficiencies live on the device, and how to find the ones
 * belonging to a single inspection item again.
 *
 * DeficiencyDetailScreen writes these draft snapshots and reads them back when
 * an item marked OD is reopened; LocationInspectionScreen's OD modal reads the
 * same ones so it can show what was recorded instead of a blank "no record"
 * panel. Both screens must agree on the key list, on the area/unit strings and
 * on the match, so all three live here rather than in either screen.
 */

export type SavedFindingScope = {
  propertyId: string;
  buildingLabel: string;
  /** 'Outside' | 'Inside' | 'Unit' */
  area: string;
  unit: string;
};

const token = (value: unknown): string => String(value ?? '').trim().toLowerCase();

/**
 * 'Units' and 'Unit' are the same bucket. InspectionSummaryScreen stamps the
 * plural on entries that reach it without an _area, so compare on this.
 */
const areaToken = (value: unknown): string => {
  const area = token(value);
  return area === 'units' ? 'unit' : area;
};

export function savedFindingScope(args: {
  property?: any;
  buildingId?: unknown;
  isOutside: boolean;
  isUnit: boolean;
  currentUnit?: string | null;
  selectedUnits?: string[] | null;
}): SavedFindingScope {
  const { property, buildingId, isOutside, isUnit, currentUnit, selectedUnits } = args;
  const buildingLabel = String(
    buildingId || property?.building || property?.buildingName || '',
  ).trim();

  return {
    propertyId: String(property?._id || property?.id || property?.propertyId || 'unknown'),
    buildingLabel,
    area: isOutside ? 'Outside' : (isUnit ? 'Unit' : 'Inside'),
    unit: isUnit ? (currentUnit || selectedUnits?.[0] || '-') : (buildingLabel || '-'),
  };
}

/** Every key a draft snapshot for this property/building may have been written under. */
export function draftStorageKeys(scope: SavedFindingScope): string[] {
  const { propertyId, buildingLabel } = scope;
  return Array.from(new Set([
    `saved_inspection_${propertyId}`,
    `saved_inspection_${propertyId}_${buildingLabel || 'Building'}`,
    `saved_inspection_${propertyId}_${buildingLabel || 'default'}`,
  ]));
}

/**
 * What makes two saved entries the same deficiency: the QR id it was given when
 * recorded. dedupeKey is area|unit|item|deficiency name, which a second
 * deficiency of the same type on the same item (or a second photo) shares — keyed
 * on that first, the second one overwrote the first on every save.
 */
export const findingIdentity = (entry: any): string =>
  token(entry?.deficiencyQRId || entry?.dedupeKey || entry?.id || entry?._id);

/**
 * The deficiencies recorded against one item, newest snapshot wins.
 * Item ids repeat across Outside/Inside/Unit, so match on name + area + unit.
 */
export function findingsForItem(
  rawPayloads: (string | null | undefined)[],
  scope: SavedFindingScope,
  itemName: unknown,
): any[] {
  const found = new Map<string, any>();

  rawPayloads.forEach((raw, payloadIndex) => {
    if (!raw) return;

    let payload: any;
    try {
      payload = JSON.parse(raw) || {};
    } catch {
      return;
    }

    const entries = (Array.isArray(payload?.deficiencies) ? payload.deficiencies : []).length > 0
      ? payload.deficiencies
      : (Array.isArray(payload?.findings) ? payload.findings : []);

    entries.forEach((entry: any, index: number) => {
      if (!entry || typeof entry !== 'object') return;
      if (token(entry.itemName ?? entry.item) !== token(itemName)) return;
      if (areaToken(entry._area ?? entry.area) !== areaToken(scope.area)) return;
      if (token(entry._unit ?? entry.unit) !== token(scope.unit)) return;
      found.set(findingIdentity(entry) || `${payloadIndex}:${index}`, entry);
    });
  });

  return Array.from(found.values());
}
