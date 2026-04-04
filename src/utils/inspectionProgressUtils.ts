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
