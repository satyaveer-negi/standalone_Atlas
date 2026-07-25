import { activeKnowledgeGraph } from "../../../services/workflow/workflowKnowledgeGraph";

export interface LearningRecord {
  nodeId: string;
  outcome: string;
  metricScore: number;
}

export class LearningManager {
  private learningStore: LearningRecord[] = [];

  public getRecords(): LearningRecord[] {
    return [...this.learningStore];
  }

  public recordLearningOutcome(objective: string, score: number): LearningRecord {
    const learningNodeId = `learn-feedback-${Date.now()}`;
    
    // Enrich local semantic Knowledge Graph database
    activeKnowledgeGraph.addNode(learningNodeId, "Execution", `Execution feedback on prompt "${objective}"`, {
      metricScore: score,
      status: "Optimized",
      timestamp: new Date().toLocaleTimeString()
    });

    const isCfd = objective.toLowerCase().includes("cfd") || objective.toLowerCase().includes("fluid") || objective.toLowerCase().includes("mesh");
    activeKnowledgeGraph.addEdge(isCfd ? "domain-cfd" : "domain-math", learningNodeId, "LEARNED_FROM");

    const record: LearningRecord = {
      nodeId: learningNodeId,
      outcome: `Knowledge Graph node "${learningNodeId}" created, linked to ${isCfd ? "domain-cfd" : "domain-math"}`,
      metricScore: score
    };

    this.learningStore.push(record);
    console.log(`[Learning Manager] Feedback logged successfully under node: ${learningNodeId}`);
    return record;
  }
}
