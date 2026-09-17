/**
 * State transitions for the offline write queue.
 *
 * Kept free of React Native imports so offlineQueueCore.check.ts can exercise
 * the rules that actually matter — a queued write is never dropped until the
 * server accepts it, and one long offline session cannot grow the queue without
 * bound.
 */

export type QueuedJobKind = 'saveProgress';

export interface QueuedJob {
  id: string;
  kind: QueuedJobKind;
  /** Later jobs with the same key replace earlier ones. */
  dedupeKey: string;
  payload: any;
  queuedAt: string;
  attempts: number;
  lastError?: string;
}

/**
 * Add a job, replacing any earlier job carrying the same dedupeKey.
 *
 * Every saveProgress payload holds the *complete* deficiency set for its
 * property/building, so an older queued copy is strictly redundant — replacing
 * keeps the queue at one job per building however long the outage lasts.
 */
export const upsertJob = (jobs: QueuedJob[], job: QueuedJob): QueuedJob[] => [
  ...jobs.filter((j) => j.dedupeKey !== job.dedupeKey),
  job,
];

/** Drop a job — only ever called after the server has accepted it. */
export const removeJob = (jobs: QueuedJob[], id: string): QueuedJob[] =>
  jobs.filter((j) => j.id !== id);

/** Record a failed attempt, keeping the job queued for the next reconnect. */
export const markFailure = (jobs: QueuedJob[], id: string, error: string): QueuedJob[] =>
  jobs.map((j) => (j.id === id ? { ...j, attempts: j.attempts + 1, lastError: error } : j));

/** Jobs are replayed oldest first so the server sees them in the order made. */
export const inSendOrder = (jobs: QueuedJob[]): QueuedJob[] =>
  [...jobs].sort((a, b) => a.queuedAt.localeCompare(b.queuedAt));

export const makeJob = (
  kind: QueuedJobKind,
  dedupeKey: string,
  payload: any,
  now: number = Date.now(),
  rand: string = Math.random().toString(36).slice(2, 8),
): QueuedJob => ({
  id: `${now}-${rand}`,
  kind,
  dedupeKey,
  payload,
  queuedAt: new Date(now).toISOString(),
  attempts: 0,
});
