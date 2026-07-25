import { WorkflowGraph } from "../model/WorkflowGraph";
import { WorkflowSession } from "./WorkflowSession";
import { activeWorkflowScheduler } from "./WorkflowScheduler";
import { activeSharedTaskGraph } from "../../agents/collaboration/graph/SharedTaskGraph";

export class WorkflowExecutionBridge {
  public executeGraph(graph: WorkflowGraph, workflowId: string): WorkflowSession {
    const sortedNodes = graph.sortTopologically();
    const session = new WorkflowSession(`sess-${Date.now()}`, workflowId);
    
    activeWorkflowScheduler.queueSession(session);
    session.stateMachine.transitionTo("Running");

    // Clear old task DAG
    activeSharedTaskGraph.clear();

    // Map visual nodes to EIOS task DAG
    sortedNodes.forEach(node => {
      session.updateNodeTelemetry(node.id, "Running");
      
      activeSharedTaskGraph.addNode({
        id: node.id,
        goal: node.name,
        assignedAgent: node.type === "AgentNode" ? "CoordinatorAgent" : "CFDAgent",
        status: "Pending",
        dependencies: [] // Connections determine order of execution
      });

      session.updateNodeTelemetry(node.id, "Success");
    });

    session.stateMachine.transitionTo("Completed");
    return session;
  }
}

export const activeWorkflowExecutionBridge = new WorkflowExecutionBridge();
