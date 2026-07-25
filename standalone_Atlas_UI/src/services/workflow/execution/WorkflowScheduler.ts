import { WorkflowSession } from "./WorkflowSession";

export class WorkflowScheduler {
  private sessions = new Map<string, WorkflowSession>();

  public queueSession(session: WorkflowSession): void {
    this.sessions.set(session.id, session);
    session.stateMachine.transitionTo("Scheduled");
  }

  public getSession(id: string): WorkflowSession | null {
    return this.sessions.get(id) ?? null;
  }
}

export const activeWorkflowScheduler = new WorkflowScheduler();
