export interface AgentOpinion {
  agentId: string;
  discipline: "CFD" | "PowerSystems" | "Controls" | "Optimization" | "Safety" | "Economics";
  verdict: "Accept" | "ConditionalAccept" | "Reject";
  score: number; // 0-100
  evidenceRefs: string[];
  findings: string[];
}

export class SpecialistAgent {
  constructor(
    public id: string,
    public name: string,
    public discipline: "CFD" | "PowerSystems" | "Controls" | "Optimization" | "Safety" | "Economics"
  ) {}

  public review(intentGoal: string, variables: Record<string, number>): AgentOpinion {
    const isSafe = !variables.temperature || variables.temperature < 350;
    
    // Simulate domain logic
    let score = 85;
    let verdict: "Accept" | "ConditionalAccept" | "Reject" = "Accept";
    const findings: string[] = [];

    if (this.discipline === "CFD" && intentGoal.includes("drag")) {
      score = 92;
      findings.push("Fluid dynamics mesh resolution checks pass.");
    } else if (this.discipline === "Safety" && !isSafe) {
      score = 45;
      verdict = "Reject";
      findings.push("Safety Violation: Substation switcher heat limit exceeded.");
    } else if (this.discipline === "PowerSystems") {
      score = 88;
      findings.push("Substation switch voltage is within limits.");
    }

    return {
      agentId: this.id,
      discipline: this.discipline,
      verdict,
      score,
      evidenceRefs: ["sim-run-12", "graph-ontology-check"],
      findings
    };
  }
}
