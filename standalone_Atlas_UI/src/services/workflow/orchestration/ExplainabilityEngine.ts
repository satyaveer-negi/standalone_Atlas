export interface EvidenceNode {
  propertyName: string;
  currentValue: any;
  thresholdLimit: number;
  ruleExplanation: string;
  sourceConfidence: number;
}

export class ExplainabilityEngine {
  public traceRecommendation(recommendation: string): EvidenceNode[] {
    console.log(`[Explainability Engine] Tracing evidence for recommendation: "${recommendation}"`);
    return [
      {
        propertyName: "solarOutput",
        currentValue: 75,
        thresholdLimit: 90,
        ruleExplanation: "High generation drops due to cloud coverage, requires dispatch adjustments.",
        sourceConfidence: 0.99
      },
      {
        propertyName: "chargeLevel",
        currentValue: 62,
        thresholdLimit: 20,
        ruleExplanation: "ESS Storage levels are within healthy buffer limits. Discharging allowed.",
        sourceConfidence: 0.98
      }
    ];
  }
}

export const activeExplainabilityEngine = new ExplainabilityEngine();
