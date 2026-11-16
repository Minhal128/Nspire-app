type ProgressRecordLike = {
  propertyId?: any;
  unitId?: any;
  buildingId?: any;
  inspectionType?: any;
  inspectionData?: any;
};

const normalizeString = (value: unknown): string => String(value ?? '').trim();

const normalizeToken = (value: unknown): string =>
  normalizeString(value).toLowerCase().replace(/[\s_-]+/g, '');

const INVALID_PROPERTY_TOKENS = new Set([
  '',
  'unknown',
  'null',
  'undefined',
  'objectobject',
]);

const isInvalidPropertyIdentifier = (value: unknown): boolean =>
  INVALID_PROPERTY_TOKENS.has(normalizeToken(value));

const uniqueNonEmpty = (values: unknown[]): string[] => {
  const normalized = values
    .map((value) => normalizeString(value))
    .filter((value) => value.length > 0);

  return Array.from(new Set(normalized));
};

const PLACEHOLDER_BUILDING_TOKENS = new Set([
  '',
  '-',
  'allunits',
  'allunit',
  'property',
  'unknown',
  'null',
  'undefined',
]);

const isPlaceholderBuildingValue = (value: unknown): boolean =>
  PLACEHOLDER_BUILDING_TOKENS.has(normalizeToken(value));

export const normalizeUnitIdentifier = (value: unknown): string => {
  return normalizeString(value)
    .toLowerCase()
    .replace(/^unit[\s_-]*/i, '')
    .replace(/[\s_-]+/g, '');
};

export const normalizeBuildingIdentifier = (value: unknown): string =>
  normalizeString(value).toLowerCase();

export const canonicalizeInspectionType = (
  inspectionType: unknown,
  inspectionData?: any
): string => {
  const raw = normalizeString(inspectionType);
  if (!raw) {
    return '';
  }

  const lower = raw.toLowerCase();

  if (lower === 'outside') {
    return 'Outside';
  }

  if (lower === 'inside') {
    return 'Inside';
  }

  if (lower === 'unit') {
    const fallbackUnit = normalizeString(inspectionData?.currentUnit);
    return fallbackUnit ? `Unit_${fallbackUnit}` : 'Unit';
  }

  if (lower.startsWith('unit_')) {
    const suffix = raw.slice(raw.indexOf('_') + 1).trim();
    return suffix ? `Unit_${suffix}` : 'Unit';
  }

  return raw;
};

export const buildInspectionProgressKey = ({
  propertyId,
  buildingId,
  inspectionType,
  inspectionData,
}: {
  propertyId: unknown;
  buildingId: unknown;
  inspectionType: unknown;
  inspectionData?: any;
}): string => {
  const canonicalType = canonicalizeInspectionType(inspectionType, inspectionData);
  return `inspection_responses_${normalizeString(propertyId)}_${normalizeString(buildingId)}_${canonicalType}`;
};

const getRecordPropertyCandidates = (record: ProgressRecordLike): string[] => {
  return uniqueNonEmpty([
    record?.propertyId?._id,
    typeof record?.propertyId === 'string' ? record.propertyId : '',
    record?.propertyId?.propertyId,
    record?.inspectionData?.property?._id,
    record?.inspectionData?.property?.propertyId,
  ]);
};

const getPropertyCandidates = (property: any): string[] => {
  let parsedProperty = property;

  if (typeof property === 'string') {
    const trimmed = normalizeString(property);
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        parsedProperty = JSON.parse(trimmed);
      } catch {
        parsedProperty = property;
      }
    }
  }

  return uniqueNonEmpty([
    typeof parsedProperty === 'string' ? parsedProperty : '',
    parsedProperty?._id,
    parsedProperty?.id,
    parsedProperty?.propertyId,
  ]).filter((candidate) => !isInvalidPropertyIdentifier(candidate));
};

export const doesProgressRecordMatchProperty = (
  record: ProgressRecordLike,
  property: any
): boolean => {
  const recordCandidates = getRecordPropertyCandidates(record);
  const propertyCandidates = getPropertyCandidates(property);

  if (recordCandidates.length === 0 || propertyCandidates.length === 0) {
    return false;
  }

  return recordCandidates.some((candidate) => propertyCandidates.includes(candidate));
};

const getRecordBuildingCandidates = (record: ProgressRecordLike): string[] => {
  const candidates = uniqueNonEmpty([
    record?.buildingId,
    record?.inspectionData?.buildingId,
    record?.inspectionData?.building,
    record?.inspectionData?.buildingName,
    record?.unitId,
  ]);

  return candidates.filter((candidate) => !isPlaceholderBuildingValue(candidate));
};

export const doesProgressRecordMatchBuilding = (
  record: ProgressRecordLike,
  buildingId: unknown
): boolean => {
  const target = normalizeBuildingIdentifier(buildingId);
  if (!target) {
    return false;
  }

  const candidates = getRecordBuildingCandidates(record).map(normalizeBuildingIdentifier);
  if (candidates.length === 0) {
    return false;
  }

  return candidates.includes(target);
};

export const extractInspectionTypeTokenFromProgressKey = (
  key: string,
  prefix: string
): string => {
  if (!key.startsWith(prefix)) {
    return '';
  }

  return key.slice(prefix.length);
};

export const isOutsideInspectionTypeToken = (inspectionTypeToken: unknown): boolean =>
  normalizeString(inspectionTypeToken).toLowerCase() === 'outside';

export const isInsideInspectionTypeToken = (inspectionTypeToken: unknown): boolean =>
  normalizeString(inspectionTypeToken).toLowerCase() === 'inside';

export const isUnitInspectionTypeToken = (inspectionTypeToken: unknown): boolean => {
  const token = normalizeString(inspectionTypeToken).toLowerCase();
  return token === 'unit' || token.startsWith('unit_');
};

export const extractUnitSuffixFromInspectionTypeToken = (inspectionTypeToken: unknown): string => {
  const token = normalizeString(inspectionTypeToken);
  const tokenLower = token.toLowerCase();

  if (tokenLower === 'unit') {
    return '';
  }

  if (!tokenLower.startsWith('unit_')) {
    return '';
  }

  return token.slice(token.indexOf('_') + 1).trim();
};

/**
 * Percentage of inspection tasks completed for a property.
 *
 * Mirrors the web portal (/dashboard, /dashboard/inspection-status): a property's
 * work is one "inside" and one "outside" pass per building, plus one pass per unit
 * allocated for inspection. Each distinct pass seen in the progress records counts once.
 */
export const calculatePropertyProgressPercent = (
  property: {
    _id?: string;
    id?: string;
    buildings?: number;
    units?: number;
    calculatedUnits?: number;
    buildingDetails?: { unitsForInspection?: number }[];
  },
  progressRecords: any[],
): number => {
  const propId = property._id || property.id;
  const own = (progressRecords || []).filter(
    (p: any) => p?.propertyId === propId || p?.propertyId?._id === propId,
  );

  const uniqueTasks = new Set<string>();
  own.forEach((p: any) => {
    const type = String(p?.inspectionType || '').toLowerCase();
    const buildingId = p?.buildingId || 'B1';
    if (type.startsWith('unit_')) {
      uniqueTasks.add(`${buildingId}_unit_${p.unitId}`);
    } else if (type === 'inside' || type === 'outside') {
      uniqueTasks.add(`${buildingId}_${type}`);
    }
  });

  const allocatedUnits = property.buildingDetails && property.buildingDetails.length > 0
    ? property.buildingDetails.reduce((sum, b) => sum + (b?.unitsForInspection || 0), 0)
    : property.calculatedUnits !== undefined ? property.calculatedUnits : (property.units ?? 0);

  const totalTasks = ((property.buildings || 0) * 2) + allocatedUnits;
  if (totalTasks <= 0) return 0;
  return Math.min(100, Math.round((uniqueTasks.size / totalTasks) * 100));
};

/**
 * One unit of one building as a key, however the two were written down:
 * "Unit 003" in "b2" and "3" in "B2" are the same unit.
 */
export const inspectedUnitKey = (building: unknown, unit: unknown): string => {
  const name = String(unit ?? '').trim().toUpperCase().replace(/^UNIT[\s_-]*/, '').replace(/^0+(?=\d)/, '');
  return `${String(building ?? '').trim().toUpperCase() || 'B1'}|${name}`;
};

/**
 * The units of a property that have a progress record of their own: the units
 * an inspector has been through. A report's "Total Unit Inspected" counts
 * these together with any unit a finding names.
 */
export const inspectedUnitKeys = (propertyId: string | undefined, progressRecords: any[]): string[] => {
  const keys = new Set<string>();
  (progressRecords || []).forEach((p: any) => {
    if (propertyId && !(p?.propertyId === propertyId || p?.propertyId?._id === propertyId)) return;
    const type = String(p?.inspectionType || '').toLowerCase();
    const unit = String(p?.unitId ?? '').trim();
    if (!type.startsWith('unit') || !unit) return;
    keys.add(inspectedUnitKey(p?.buildingId, unit));
  });
  return [...keys];
};

/**
 * Count findings after collapsing duplicates that describe the same defect.
 * Same key as the web portal so the two surfaces report identical numbers.
 */
export const countUniqueDeficiencies = (findings: any[] | undefined): number => {
  if (!findings || findings.length === 0) return 0;
  const seen = new Set<string>();
  findings.forEach((f: any) => {
    const areaStr = String(f?.area || f?.subCategory || f?.category || '').toLowerCase();
    const titleStr = String(f?.title || f?.deficiencyName || f?.name || '').toLowerCase();
    const descStr = String(f?.description || f?.details || f?.deficiencyDetails || '').toLowerCase();
    const bldgStr = String(f?.building || f?.buildingName || '').toLowerCase();
    const unitStr = String(f?.unit || f?.unitNumber || '').toLowerCase();
    if (!titleStr && !descStr) return;
    seen.add(`${areaStr}|${bldgStr}|${unitStr}|${titleStr}|${descStr}`);
  });
  return seen.size;
};
