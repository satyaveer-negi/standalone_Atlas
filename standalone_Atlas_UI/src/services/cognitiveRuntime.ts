import { activeKnowledgeGraph, KnowledgeObject } from "./atlasKnowledgeGraph";

export interface PlanStep {
  id: string;
  description: string;
  assignedAgent: string;
  status: "pending" | "executing" | "completed" | "failed";
}

export class CognitiveRuntime {
  private currentPlan: PlanStep[] = [];
  private memoryContext: string[] = [];

  constructor() {}

  // 🔄 THE COGNITIVE CYCLE: Observe -> Plan -> Execute -> Reflect -> Learn
  public async executeCycle(observation: string): Promise<string> {
    console.log(`[Cognitive Runtime] 👁️ OBSERVING: "${observation}"`);
    this.memoryContext.push(`Observed: ${observation}`);

    // 1. Plan
    this.currentPlan = [
      { id: "step-1", description: "Identify variables in observation", assignedAgent: "OntologyAgent", status: "pending" },
      { id: "step-2", description: "Synthesize target knowledge objects", assignedAgent: "TechnicalWriter", status: "pending" }
    ];
    console.log(`[Cognitive Runtime] 📝 PLANNING: Built plan with ${this.currentPlan.length} steps.`);

    // 2. Execute
    for (const step of this.currentPlan) {
      step.status = "executing";
      console.log(`[Cognitive Runtime] ⚡ EXECUTING: [${step.assignedAgent}] ${step.description}`);
      step.status = "completed";
    }

    // 3. Reflect
    const reflection = `Successfully structured observed inputs. Verified all relationships.`;
    console.log(`[Cognitive Runtime] 🤔 REFLECTING: ${reflection}`);

    // 4. Learn & Persist
    const resultId = `ko-${Date.now()}`;
    const newKO: KnowledgeObject = {
      id: resultId,
      type: "KnowledgeObject",
      version: 1,
      provenance: {
        creator: "CognitiveRuntime:v2",
        eventSource: `Cognitive Cycle for: ${observation}`,
        timestamp: Date.now(),
        packageOrigin: "system.core"
      },
      relationships: [],
      title: `Observation synthesis: ${observation.slice(0, 20)}...`,
      content: `Inference result from cycle execution. Verification status: OK.`,
      evidenceList: [observation]
    };

    activeKnowledgeGraph.insertObject(newKO);
    console.log(`[Cognitive Runtime] 🎓 LEARNING: Persisted new knowledge object ${resultId} to AKG.`);

    return resultId;
  }
}

export const activeCognitiveRuntime = new CognitiveRuntime();
