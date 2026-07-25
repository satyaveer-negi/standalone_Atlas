import { activeAICoordinator } from "./workflowAICopilot";
import { activeWorkflowEngine } from "./workflowEngine";
import { activeKnowledgeGraph } from "./workflowKnowledgeGraph";

export type AgentState = "Idle" | "Planning" | "Executing" | "Learning";

export interface AgentLog {
  timestamp: string;
  stage: string;
  message: string;
}

export interface LearningRecord {
  nodeId: string;
  outcome: string;
  metricScore: number;
}

// 🤖 PROGRAM III.8: AUTONOMOUS ENGINEERING AGENT ENGINE (CLOSED-LOOP RUNTIME ASSISTANT)
export class AutonomousAgentEngine {
  private currentState: AgentState = "Idle";
  private logs: AgentLog[] = [];
  private learningStore: LearningRecord[] = [];

  public getState(): AgentState {
    return this.currentState;
  }

  public getLogs(): AgentLog[] {
    return [...this.logs];
  }

  public getLearningRecords(): LearningRecord[] {
    return [...this.learningStore];
  }

  public async runAutonomousCycleAsync(taskInstruction: string): Promise<void> {
    this.logs = [];
    this.logStep("PLAN", `Initiating autonomous task sequence: "${taskInstruction}"`);
    this.currentState = "Planning";

    // 1. PLAN: Retrieve grounding context and generate workflow using AI Coordinator
    const copilotRes = activeAICoordinator.generateWorkflowFromPrompt(taskInstruction);
    this.logStep("PLAN", `AI Generator output generated: "${copilotRes.generatedPackage.metadata.packageName}". Grounded in context.`);

    // 2. RESOLVE: Build execution context and optimize capabilities mapping
    this.currentState = "Planning";
    this.logStep("RESOLVE", `Optimizing steps mapping. Required Capabilities: (${copilotRes.generatedPackage.metadata.requiredCapabilities.join(", ")})`);
    
    // 3. EXECUTE: Spin up instance and run steps sequentially
    this.currentState = "Executing";
    this.logStep("EXECUTE", `Spawning workflow instance: "${copilotRes.generatedPackage.definition.workflowId}"`);
    const instance = activeWorkflowEngine.createInstance(copilotRes.generatedPackage.definition.workflowId);
    
    for (const step of instance.steps) {
      this.logStep("EXECUTE", `Running step "${step.stepId}" (assigned capability: ${step.capability})`);
      await activeWorkflowEngine.runInstanceStep(instance.instanceId, step.stepId);
    }
    this.logStep("EXECUTE", `All DAG steps completed. Outcome: SUCCESS.`);

    // 4. EVALUATE (LEARN): Feed results back into semantic Engineering Knowledge Graph
    this.currentState = "Learning";
    const learningNodeId = `learn-feedback-${Date.now()}`;
    const metricScore = 94; // simulated efficiency
    
    activeKnowledgeGraph.addNode(learningNodeId, "Execution", `Execution feedback on prompt "${taskInstruction}"`, {
      metricScore,
      status: "Optimized",
      timestamp: new Date().toLocaleTimeString()
    });
    // Add relationship edges linking learning node to domain
    const isCfd = taskInstruction.toLowerCase().includes("cfd") || taskInstruction.toLowerCase().includes("fluid") || taskInstruction.toLowerCase().includes("mesh");
    activeKnowledgeGraph.addEdge(isCfd ? "domain-cfd" : "domain-math", learningNodeId, "LEARNED_FROM");

    this.learningStore.push({
      nodeId: learningNodeId,
      outcome: `Graph Node "${learningNodeId}" created, linked to ${isCfd ? "domain-cfd" : "domain-math"}`,
      metricScore
    });

    this.logStep("LEARN", `Closed-loop learning finished. Knowledge Graph enriched with execution node: "${learningNodeId}" (Score: ${metricScore}%)`);
    this.currentState = "Idle";
  }

  private logStep(stage: string, message: string) {
    this.logs.push({
      timestamp: new Date().toLocaleTimeString(),
      stage,
      message
    });
    console.log(`[Autonomous Agent][${stage}] ${message}`);
  }
}

export const activeAutonomousAgentEngine = new AutonomousAgentEngine();
