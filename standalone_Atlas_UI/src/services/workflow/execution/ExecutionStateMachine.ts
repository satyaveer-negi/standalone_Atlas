export type ExecutionState = "Created" | "Validated" | "Scheduled" | "Running" | "Paused" | "Completed" | "Failed";

export class ExecutionStateMachine {
  private currentState: ExecutionState = "Created";

  public transitionTo(nextState: ExecutionState): void {
    console.log(`[Execution State Machine] Transition: ${this.currentState} -> ${nextState}`);
    this.currentState = nextState;
  }

  public getState(): ExecutionState {
    return this.currentState;
  }
}
