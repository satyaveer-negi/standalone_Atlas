import { TaskNode, TaskNodeStatus } from "./TaskNode";
import { TaskEdge } from "./TaskEdge";
import { GraphValidator } from "./GraphValidator";
import { activeCollabEventBus } from "../events/EventBus";

export class SharedTaskGraph {
  private nodes: TaskNode[] = [];
  private edges: TaskEdge[] = [];
  private validator = new GraphValidator();

  public addNode(node: TaskNode): void {
    this.nodes.push(node);
    activeCollabEventBus.publish("TaskCreated", { nodeId: node.id, objective: node.objective });
  }

  public addEdge(edge: TaskEdge): void {
    this.edges.push(edge);
  }

  public validate(): boolean {
    return this.validator.validateDAG(this.nodes, this.edges);
  }

  public updateNodeStatus(nodeId: string, status: TaskNodeStatus): void {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.status = status;
      if (status === "Running") {
        activeCollabEventBus.publish("TaskStarted", { nodeId });
      } else if (status === "Completed") {
        activeCollabEventBus.publish("TaskCompleted", { nodeId });
      } else if (status === "Failed") {
        activeCollabEventBus.publish("TaskFailed", { nodeId });
      }
    }
  }

  public getNodes(): TaskNode[] {
    return [...this.nodes];
  }

  public getEdges(): TaskEdge[] {
    return [...this.edges];
  }

  public clear(): void {
    this.nodes = [];
    this.edges = [];
  }
}

export const activeSharedTaskGraph = new SharedTaskGraph();
