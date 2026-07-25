import { adapterRegistry } from "../adapters/adapterRegistry";
import { ExecutionResult } from "../adapters/executionProvider";

export interface QueuedJob {
  jobId: string;
  providerKey: string;
  command: string;
  status: "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  retries: number;
}

// ⚙️ PROGRAM II.2: EXECUTION MANAGER (CENTRAL ORCHESTRATOR)
export class ExecutionManager {
  private queue: QueuedJob[] = [];

  public getQueueList(): QueuedJob[] {
    return this.queue;
  }

  public async executeJob(providerKey: string, command: string): Promise<ExecutionResult> {
    const jobId = `job-${Date.now()}`;
    const job: QueuedJob = {
      jobId,
      providerKey,
      command,
      status: "QUEUED",
      retries: 0,
    };
    this.queue.push(job);

    console.log(`[Execution Manager] Job "${jobId}" queued for provider: "${providerKey}"`);
    job.status = "RUNNING";

    const adapter = adapterRegistry.getAdapter(providerKey);
    if (!adapter) {
      job.status = "FAILED";
      throw new Error(`No execution provider registered for key: "${providerKey}"`);
    }

    try {
      const result = await adapter.execute(command);
      job.status = "COMPLETED";
      return result;
    } catch (error) {
      if (job.retries < 2) {
        job.retries++;
        console.log(`[Execution Manager] Retrying Job "${jobId}". Retry count: ${job.retries}`);
        return this.executeJob(providerKey, command);
      }
      job.status = "FAILED";
      throw error;
    }
  }

  public cancelJob(jobId: string): void {
    const job = this.queue.find(j => j.jobId === jobId);
    if (job) {
      job.status = "CANCELLED";
      console.log(`[Execution Manager] Job "${jobId}" cancelled by administrator.`);
    }
  }
}

export const activeExecutionManager = new ExecutionManager();
