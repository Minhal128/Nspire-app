/**
 * Persistent queue for backend writes made while the device is offline.
 *
 * The inspection screens already save everything to AsyncStorage before they
 * call the API, so an inspector never loses work when the connection drops —
 * but the API call itself used to be swallowed by a `console.warn` and the
 * server never heard about it. Jobs queued here survive app restarts and are
 * replayed as soon as the connection comes back.
 *
 * A job is only dropped once the server has accepted it.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import networkService from './networkService';
import inspectionService from './inspectionService';
import {
  QueuedJob,
  QueuedJobKind,
  inSendOrder,
  makeJob,
  markFailure,
  removeJob,
  upsertJob,
} from '../utils/offlineQueueCore';

const QUEUE_KEY = 'offline_request_queue_v1';

export type { QueuedJob, QueuedJobKind };

export interface FlushResult {
  sent: number;
  remaining: number;
}

export type QueueListener = (pending: number) => void;

class OfflineQueue {
  private flushing = false;
  private started = false;
  private listeners = new Set<QueueListener>();
  private unsubscribeNetwork: (() => void) | null = null;

  /* ------------------------------------------------------------------ */
  /* storage                                                             */
  /* ------------------------------------------------------------------ */

  private async read(): Promise<QueuedJob[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('offlineQueue: could not read the queue', error);
      return [];
    }
  }

  private async write(jobs: QueuedJob[]): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(jobs));
      this.notify(jobs.length);
    } catch (error) {
      console.warn('offlineQueue: could not write the queue', error);
    }
  }

  /* ------------------------------------------------------------------ */
  /* public API                                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Add a job, replacing any earlier job with the same dedupeKey.
   *
   * Every saveProgress call carries the *complete* deficiency set for its
   * property/building, so an older queued copy is strictly redundant — without
   * this, one long offline session would queue a job per keystroke-save.
   */
  async enqueue(kind: QueuedJobKind, dedupeKey: string, payload: any): Promise<void> {
    const jobs = upsertJob(await this.read(), makeJob(kind, dedupeKey, payload));
    await this.write(jobs);
    console.log(`offlineQueue: queued ${kind} (${jobs.length} pending)`);
  }

  async pendingCount(): Promise<number> {
    return (await this.read()).length;
  }

  async list(): Promise<QueuedJob[]> {
    return this.read();
  }

  async clear(): Promise<void> {
    await this.write([]);
  }

  addListener(listener: QueueListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(pending: number): void {
    this.listeners.forEach((l) => {
      try {
        l(pending);
      } catch (error) {
        console.warn('offlineQueue: listener threw', error);
      }
    });
  }

  /** Run one queued job. Throws if the server did not accept it. */
  private async run(job: QueuedJob): Promise<void> {
    switch (job.kind) {
      case 'saveProgress': {
        const res = await inspectionService.saveProgress(job.payload);
        if (res && res.success === false) {
          throw new Error(res.msg || 'server rejected saveProgress');
        }
        return;
      }
      default:
        // Unknown kind: drop it rather than blocking the queue forever.
        console.warn(`offlineQueue: dropping unknown job kind "${job.kind}"`);
    }
  }

  /**
   * Try to send everything. Jobs that fail stay queued, so nothing is lost —
   * the next reconnect picks them up again.
   */
  async flush(): Promise<FlushResult> {
    if (this.flushing) return { sent: 0, remaining: await this.pendingCount() };

    let jobs = await this.read();
    if (jobs.length === 0) return { sent: 0, remaining: 0 };

    if (!networkService.isOnline()) {
      return { sent: 0, remaining: jobs.length };
    }

    this.flushing = true;
    let sent = 0;

    try {
      for (const job of inSendOrder(jobs)) {
        // The connection can drop mid-flush; stop and keep the rest queued.
        if (!networkService.isOnline()) break;

        try {
          await this.run(job);
          jobs = removeJob(jobs, job.id);
          sent++;
          await this.write(jobs);
        } catch (error: any) {
          jobs = markFailure(jobs, job.id, String(error?.message || error));
          await this.write(jobs);
          // Keep going: one bad job must not hold up the others.
        }
      }
    } finally {
      this.flushing = false;
    }

    if (sent > 0) console.log(`offlineQueue: sent ${sent}, ${jobs.length} still pending`);
    return { sent, remaining: jobs.length };
  }

  /**
   * Start network monitoring and replay the queue whenever the connection
   * returns. Safe to call more than once.
   */
  async start(): Promise<void> {
    if (this.started) return;
    this.started = true;

    try {
      await networkService.initialize();
    } catch (error) {
      console.warn('offlineQueue: network monitoring failed to start', error);
    }

    this.unsubscribeNetwork = networkService.addListener((isConnected) => {
      if (isConnected) {
        console.log('offlineQueue: connection restored, flushing');
        this.flush().catch((e) => console.warn('offlineQueue: flush failed', e));
      }
    });

    // Anything left over from a previous run.
    this.flush().catch((e) => console.warn('offlineQueue: initial flush failed', e));
  }

  stop(): void {
    this.unsubscribeNetwork?.();
    this.unsubscribeNetwork = null;
    this.listeners.clear();
    this.started = false;
  }
}

export const offlineQueue = new OfflineQueue();
export default offlineQueue;
