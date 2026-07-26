export interface EvidenceSource {
  sourceType: "Simulation" | "DigitalTwin" | "KnowledgeGraph" | "VerificationReport";
  description: string;
  confidenceRating: number;
}

export class EvidenceAggregator {
  public aggregateEvidence(): EvidenceSource[] {
    return [
      { sourceType: "Simulation", description: "Matlab linear approximations solvers output data logs.", confidenceRating: 88 },
      { sourceType: "DigitalTwin", description: "Substation switcher Twin observed voltage telemetry records.", confidenceRating: 95 },
      { sourceType: "VerificationReport", description: "Visual workflow port validation compiler reports.", confidenceRating: 99 }
    ];
  }
}

export const activeEvidenceAggregator = new EvidenceAggregator();
