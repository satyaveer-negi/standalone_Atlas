import { WorkflowEvent } from "./workflowEvents";
import { WorkflowInstance, WorkflowState, StepState } from "./workflowDefinition";

// 🕸️ PROGRAM III.2: EVENT-SOURCING STATE REDUCER
export function workflowReducer(state: WorkflowInstance, event: WorkflowEvent): WorkflowInstance {
  const next = { ...state, steps: state.steps.map(s => ({ ...s })) };

  switch (event.eventType) {
    case "WorkflowCreated":
      next.definitionId = event.payload.definitionId;
      next.state = "Draft";
      break;

    case "StepStarted":
      next.state = "Running";
      const startingStep = next.steps.find(s => s.stepId === event.stepId);
      if (startingStep) {
        startingStep.state = "Running";
      }
      break;

    case "SchedulingDecisionMade":
      const scheduledStep = next.steps.find(s => s.stepId === event.stepId);
      if (scheduledStep) {
        scheduledStep.assignedNode = event.payload.decision.selectedNode.name;
      }
      break;

    case "StepCompleted":
      const completedStep = next.steps.find(s => s.stepId === event.stepId);
      if (completedStep) {
        completedStep.state = "Completed";
        completedStep.elapsedTimeMs = event.payload.durationMs;
      }
      break;

    case "WorkflowCompleted":
      next.state = "Completed";
      break;

    case "StepFailed":
      const failedStep = next.steps.find(s => s.stepId === event.stepId);
      if (failedStep) {
        failedStep.state = "Failed";
      }
      next.state = "Failed";
      break;
  }

  return next;
}

// 🕸️ PROGRAM III.2: WORKFLOW REPLAY ENGINE
export class ReplayEngine {
  private events: WorkflowEvent[] = [];
  private cursor = 0;
  private reconstructedState: WorkflowInstance | null = null;

  public loadHistory(events: WorkflowEvent[], initialStepsCount = 3): void {
    this.events = [...events].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    this.cursor = 0;
    this.reconstructedState = {
      instanceId: events[0]?.workflowId || "replay-inst",
      definitionId: "",
      state: "Draft",
      steps: [
        { stepId: "mesh", name: "Generate Mesh Geometry", capability: "exportMesh", state: "Pending", retries: 0 },
        { stepId: "solve", name: "Numerical Navier-Stokes Solving", capability: "triggerSolver", state: "Pending", retries: 0 },
        { stepId: "report", name: "Compile PDF Documentation Report", capability: "editManuscript", state: "Pending", retries: 0 }
      ],
      activeNodeCount: 0
    };
  }

  public stepForward(): WorkflowInstance | null {
    if (this.cursor >= this.events.length || !this.reconstructedState) return this.reconstructedState;

    const nextEvent = this.events[this.cursor];
    this.reconstructedState = workflowReducer(this.reconstructedState, nextEvent);
    this.cursor++;
    console.log(`[Replay Engine] Applied seq ${nextEvent.sequenceNumber} (${nextEvent.eventType})`);
    return this.reconstructedState;
  }

  public playAll(): WorkflowInstance | null {
    while (this.cursor < this.events.length) {
      this.stepForward();
    }
    return this.reconstructedState;
  }

  public getCursorPosition(): number {
    return this.cursor;
  }

  public getTotalSteps(): number {
    return this.events.length;
  }
}

export const activeReplayEngine = new ReplayEngine();
