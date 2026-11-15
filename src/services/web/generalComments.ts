/**
 * General comments.
 *
 * Every section of an inspection -- Outside, Inside, each unit -- ends in a
 * "General Comment" item: a note and any number of photos. It is an
 * observation, not a deficiency. It has no severity and costs no points, so
 * it does not belong in the deficiency tables or in any total; the summary
 * and the report list them in a block of their own, "General Comments".
 *
 * They are stored among the findings all the same, and in more than one
 * shape:
 *   - the website: one finding per photo, nspireCode "GEN-NOTE";
 *   - the app: one entry per photo, deficiency.name "General Comment";
 *   - a flag, isGeneralComment, on rows that have been through a report.
 * This file is the one place that knows all of them. Before it, the website
 * showed "General comment saved!" and kept neither the note nor the photo.
 */

export const GENERAL_COMMENT_CODE = "GEN-NOTE"

export interface GeneralCommentEntry {
  building: string
  unit: string
  /** "Outside", "Inside" or "Unit". */
  area: string
  note: string
  photos: string[]
}

const text = (value: unknown): string => String(value ?? "").trim()

/** "General Comment", "26. General Comment", "General Comment - Door": only ever the comment item. */
const GENERAL_COMMENT_NAME = /^(\d+\.\s*)?general comment/i

/** True for a finding that is a general comment rather than a deficiency. */
export const isGeneralCommentFinding = (finding: any): boolean => {
  if (!finding || typeof finding !== "object") return false
  if (finding.isGeneralComment === true) return true
  if (finding.nspireCode === GENERAL_COMMENT_CODE) return true
  return [
    finding.deficiency?.name,
    finding.deficiencyName,
    finding.title,
    finding.name,
    finding.itemName,
    finding.item,
  ].some((name) => GENERAL_COMMENT_NAME.test(text(name)))
}

/** Everything that is a deficiency: the findings without the general comments. */
export const withoutGeneralComments = <T>(findings: T[] | null | undefined): T[] =>
  (findings || []).filter((finding) => !isGeneralCommentFinding(finding))

const photoUrl = (value: unknown): string =>
  text(typeof value === "string" ? value : (value as any)?.url ?? (value as any)?.uri)

/**
 * The pictures one finding carries.
 *
 * A finding from the phone can hold the same picture twice: imageUrl once it
 * has uploaded, and imageUri, the file on that phone. The uploaded one is the
 * one anybody else can open, so it wins and the other is not a second photo.
 */
export const generalCommentPhotos = (finding: any): string[] => {
  const photos: string[] = []
  const add = (value: unknown) => {
    const url = photoUrl(value)
    if (url && !photos.includes(url)) photos.push(url)
  }
  add(text(finding?.imageUrl) || text(finding?.imageUri))
  for (const list of [finding?.photos, finding?.images]) {
    if (Array.isArray(list)) list.forEach(add)
  }
  return photos
}

/**
 * What was written. The website fills `description` with the item's own name
 * when nothing was typed, which is a label, not a comment.
 */
const noteOf = (finding: any): string => {
  const typed = text(finding?.notes) || text(finding?.note) || text(finding?.comments)
  if (typed) return typed
  const description = text(finding?.description)
  if (!description || description === "-" || GENERAL_COMMENT_NAME.test(description)) return ""
  return description
}

const areaOf = (finding: any): string => {
  const area = text(finding?._area) || text(finding?.area)
  const token = area.toLowerCase()
  if (token.startsWith("out")) return "Outside"
  if (token.startsWith("in")) return "Inside"
  if (token.startsWith("unit")) return "Unit"
  return area || "-"
}

const buildingOf = (finding: any): string =>
  text(finding?.buildingInspectionId) || text(finding?.building) || text(finding?.buildingName) || "-"

const unitOf = (finding: any): string => text(finding?._unit ?? finding?.unit) || "-"

/**
 * Tells two general-comment findings apart where the page drops findings that
 * read alike. A comment with three photos is three findings with the same
 * title and the same words; without this only the first photo survives.
 * Empty for a deficiency, so its key is what it always was.
 */
export const generalCommentDedupeToken = (finding: any): string =>
  isGeneralCommentFinding(finding)
    ? `|gc:${generalCommentPhotos(finding).join(",")}|${noteOf(finding)}`.toLowerCase()
    : ""

/**
 * The general comments among `findings`, one entry per comment: the photos of
 * findings that share a place and a note are gathered under it.
 */
export const collectGeneralComments = (findings: any[] | null | undefined): GeneralCommentEntry[] => {
  const byKey = new Map<string, GeneralCommentEntry>()
  for (const finding of findings || []) {
    if (!isGeneralCommentFinding(finding)) continue
    const fresh: GeneralCommentEntry = {
      building: buildingOf(finding),
      unit: unitOf(finding),
      area: areaOf(finding),
      note: noteOf(finding),
      photos: [],
    }
    const key = [fresh.building, fresh.unit, fresh.area, fresh.note].join("|").toLowerCase()
    const entry = byKey.get(key) || fresh
    for (const photo of generalCommentPhotos(finding)) {
      if (!entry.photos.includes(photo)) entry.photos.push(photo)
    }
    byKey.set(key, entry)
  }
  // A comment has something to say or something to show.
  return Array.from(byKey.values()).filter((entry) => entry.note || entry.photos.length > 0)
}

/** Where a comment was made: "B1 - Unit 003 - Unit", "B2 - Outside". */
export const generalCommentHeading = (entry: GeneralCommentEntry): string => {
  // Outside and Inside belong to the building; the phone files the building's
  // own name as their "unit", which would only say it twice.
  const unit =
    entry.area === "Unit" && entry.unit !== "-" && entry.unit.toLowerCase() !== entry.building.toLowerCase()
      ? entry.unit
      : ""
  return [entry.building !== "-" ? entry.building : "", unit, entry.area !== "-" ? entry.area : ""]
    .filter(Boolean)
    .join(" • ")
}

/**
 * The entries as findings again, one per photo, for saving with a finished
 * inspection: its record is built from the report's rows, and the comments
 * are no longer among those.
 */
export const generalCommentFindings = (entries: GeneralCommentEntry[] | null | undefined): any[] =>
  (entries || []).flatMap((entry, index) =>
    (entry.photos.length > 0 ? entry.photos : [""]).map((photo, photoIndex) => ({
      id: `GC-${index + 1}-${photoIndex + 1}`,
      isGeneralComment: true,
      nspireCode: GENERAL_COMMENT_CODE,
      title: "General Comment",
      deficiencyName: "General Comment",
      building: entry.building,
      unit: entry.unit,
      area: entry.area,
      notes: entry.note,
      comments: entry.note,
      imageUri: photo,
      severity: "Low",
      deductionPts: 0,
      status: "Open",
    })),
  )
