import { WorkflowOrchestrator } from "../products/workflows/engine/WorkflowOrchestrator";

export class WorkflowService {
  private orchestrator: WorkflowOrchestrator;

  constructor() {
    this.orchestrator = new WorkflowOrchestrator();
  }

  getOrchestrator(): WorkflowOrchestrator {
    return this.orchestrator;
  }
}
