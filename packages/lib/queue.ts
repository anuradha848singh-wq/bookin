import { logError } from "./logger";

// A very basic in-memory queue stub for async tasks (e.g., CRM sync, webhooks)
// In production, replace this with a real queue (e.g., BullMQ, AWS SQS, or Redis Streams).

type TaskHandler = (payload: any) => Promise<void>;

class AsyncQueueStub {
  private handlers: Map<string, TaskHandler> = new Map();

  // Register a worker for a specific task type
  public register(taskType: string, handler: TaskHandler) {
    this.handlers.set(taskType, handler);
  }

  // Enqueue a task to be processed asynchronously
  public async enqueue(taskType: string, payload: any, delayMs: number = 0) {
    const handler = this.handlers.get(taskType);
    if (!handler) {
      logError(`[Queue] No handler registered for task type: ${taskType}`);
      return;
    }

    // Fire and forget
    setTimeout(async () => {
      try {
        await handler(payload);
      } catch (err: any) {
        logError(`[Queue] Task ${taskType} failed`, err);
      }
    }, delayMs);
  }
}

export const queue = new AsyncQueueStub();

// Register default stubs for CRM and Analytics
queue.register("crm.sync", async (payload) => {
  console.log(`[CRM Stub] Syncing payload:`, payload);
});

queue.register("analytics.track", async (payload) => {
  console.log(`[Analytics Stub] Tracking event:`, payload);
});
