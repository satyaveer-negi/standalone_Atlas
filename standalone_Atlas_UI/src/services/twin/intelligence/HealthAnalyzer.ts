import { TwinState } from "../state/TwinState";

export class HealthAnalyzer {
  public evaluateHealthScore(states: TwinState[]): number {
    if (states.length === 0) return 100;
    
    // Simple heuristic: average the confidence metrics of active parameters
    const totalConfidence = states.reduce((sum, s) => sum + s.versionInfo.confidence, 0);
    return Math.round((totalConfidence / states.length) * 100);
  }
}
