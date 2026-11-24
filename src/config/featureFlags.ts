/**
 * Features that are switched off, not removed.
 *
 * Both were switched off at the client's request ("Final correction",
 * 24 Nov 2026, items A and B): using either one in the middle of an inspection
 * cleared the unit inspection. While a flag is false its buttons are not drawn
 * at all, its handlers refuse to run and its screen sends you back; all of
 * them are still in the code. Set a flag to true to bring its button and its
 * screen back.
 *
 * One thing is not behind them: an inspection that is 100% done. Under the
 * building table, View Summary and Export Reports are drawn again once every
 * task is done, because that is the way to the report and the only way the app
 * finishes an inspection.
 *
 * The website keeps the same two switches in inspire-web/lib/featureFlags.ts.
 */

/** "Export Reports" under the building table: the app's name for the website's "Export In Progress". */
export const EXPORT_IN_PROGRESS_ENABLED: boolean = false;

/** "Summary" / "View Summary" of an inspection still in progress, and the InspectionSummary screen they open. */
export const IN_PROGRESS_SUMMARY_ENABLED: boolean = false;
