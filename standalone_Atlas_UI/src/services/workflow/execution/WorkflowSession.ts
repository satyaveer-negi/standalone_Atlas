import { ExecutionStateMachine, ExecutionState } from "./ExecutionStateMachine";

export interface NodeExecutionTelemetry {
  nodeId: string;
  status: "Pending" | "Running" | "Success" | "Fail";
  startTime?: string;
  endTime?: string;
}

export class WorkflowSession {
  public id: string;
  public workflowId: string;
  public stateMachine = new ExecutionStateMachine();
  public nodeTelemetryList: NodeExecutionTelemetry[] = [];
  public startTime = new Date().toISOString();

  constructor(id: string, workflowId: string) {
    this.id = id;
    this.workflowId = workflowId;
  }

  public updateNodeTelemetry(nodeId: string, status: "Pending" | "Running" | "Success" | "Fail"): void {
    let telemetry = this.nodeTelemetryList.find(t => t.nodeId === nodeId);
    if (!telemetry) {
      telemetry = { nodeId, status };
      this.nodeTelemetryList.push(telemetry);
    }
    telemetry.status = status;
    if (status === "Running") {
      telemetry.startTime = new Date().toISOString();
    } else if (status === "Success" || status === "Fail") {
      telemetry.endTime = new Date().toISOString();
    }
  }
}
