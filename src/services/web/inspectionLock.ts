/**
 * One property is inspected at a time.
 *
 * A property is "in progress" from the moment one of its areas -- a building's
 * Outside or Inside, or a unit -- has saved progress, until all of them have.
 * While one is in progress no other property can be inspected, unless the
 * first is finished or put on hold.
 *
 * The rule used to be written out twice, and the two copies disagreed. The
 * property page refused a property whenever ANY other one was part-way
 * through, so two part-inspected properties each locked the other and neither
 * could be opened again. It also ignored hold, the one way out its own message
 * offered. My Inspection took whichever part-inspected property came first in
 * the list.
 *
 * Both pages now ask this file, and the answer is a single property: the one
 * that was worked on last. That one is never locked. Every other property is,
 * and the message names it.
 *
 * "In progress" is exactly what the property lists show as In Progress: the
 * same count of started areas over the same total. A report having been
 * exported does not end it -- that happens mid-inspection too, and counting it
 * would hand the lock to an older property while this one is still open.
 */

export interface LockProperty {
  _id: string
  name?: string
  status?: string
  buildings?: number
  units?: number
  calculatedUnits?: number | null
  buildingDetails?: { unitsForInspection?: number }[] | null
}

export interface LockProgressRecord {
  propertyId?: string | { _id?: string } | null
  buildingId?: string
  unitId?: string
  inspectionType?: string
  updatedAt?: string
}

export interface PropertyActivity {
  /** Share of the property's areas that have been started, 0 to 100. */
  percent: number
  /** When one of its areas was last saved, in ms; 0 when that is not known. */
  lastSavedAt: number
}

const recordPropertyId = (record: LockProgressRecord): string => {
  const ref = record?.propertyId
  return String((ref && typeof ref === "object" ? ref._id : ref) ?? "")
}

/** The area a record belongs to, or null for records that are not an area (a report draft). */
const areaOf = (record: LockProgressRecord): string | null => {
  const type = String(record?.inspectionType || "").toLowerCase()
  const building = record?.buildingId || "B1"
  if (type.startsWith("unit_")) return `${building}_unit_${record.unitId}`
  if (type === "inside" || type === "outside") return `${building}_${type}`
  return null
}

/** Areas a property has to inspect: Outside and Inside for each building, plus its units. */
export const totalAreas = (property: LockProperty): number => {
  const units =
    property.buildingDetails && property.buildingDetails.length > 0
      ? property.buildingDetails.reduce((sum, b) => sum + (b.unitsForInspection || 0), 0)
      : property.calculatedUnits ?? property.units ?? 0
  return (property.buildings || 0) * 2 + units
}

/** Started areas and the last save, per property id. */
const collectActivity = (records: LockProgressRecord[]) => {
  const byProperty = new Map<string, { areas: Set<string>; lastSavedAt: number }>()
  for (const record of records || []) {
    const area = areaOf(record)
    if (!area) continue
    const id = recordPropertyId(record)
    if (!id) continue
    let entry = byProperty.get(id)
    if (!entry) {
      entry = { areas: new Set(), lastSavedAt: 0 }
      byProperty.set(id, entry)
    }
    entry.areas.add(area)
    const savedAt = Date.parse(record.updatedAt || "")
    if (!Number.isNaN(savedAt) && savedAt > entry.lastSavedAt) entry.lastSavedAt = savedAt
  }
  return byProperty
}

/** How far along one property is, from every saved record. */
export const propertyActivity = (property: LockProperty, records: LockProgressRecord[]): PropertyActivity => {
  const entry = collectActivity(records).get(String(property._id))
  const total = totalAreas(property)
  return {
    percent: entry && total > 0 ? Math.min(100, Math.round((entry.areas.size / total) * 100)) : 0,
    lastSavedAt: entry ? entry.lastSavedAt : 0,
  }
}

/**
 * The property being inspected right now, or null when none is.
 *
 * Started, not finished and not on hold -- and, of those, the one saved to
 * last. Picking a single one is what keeps two part-inspected properties from
 * locking each other out.
 */
export const findActiveInspection = <P extends LockProperty>(
  properties: P[],
  records: LockProgressRecord[],
): P | null => {
  const activity = collectActivity(records)
  let active: P | null = null
  let activeSavedAt = -1
  for (const property of properties || []) {
    if (property.status === "hold") continue
    const entry = activity.get(String(property._id))
    if (!entry) continue
    const total = totalAreas(property)
    const percent = total > 0 ? Math.min(100, Math.round((entry.areas.size / total) * 100)) : 0
    if (percent <= 0 || percent >= 100) continue
    if (entry.lastSavedAt > activeSavedAt) {
      active = property
      activeSavedAt = entry.lastSavedAt
    }
  }
  return active
}

/**
 * The property that has to be finished or put on hold before `propertyId` can
 * be inspected, or null when it is free to go. Never the property itself.
 */
export const blockingInspection = <P extends LockProperty>(
  propertyId: string,
  properties: P[],
  records: LockProgressRecord[],
): P | null => {
  const active = findActiveInspection(properties, records)
  return active && String(active._id) !== String(propertyId) ? active : null
}
