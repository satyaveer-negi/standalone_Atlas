export type TaskNodeStatus =
  | "Created"
  | "Planned"
  | "Queued"
  | "Running"
  | "Completed"
  | "Failed"
  | "Verified";

export interface TaskNode {
  id: string;
  objective: string;
  assignedAgentId?: string;
  status: TaskNodeStatus;
  inputs: string[];
  outputs: string[];
}
