import { RankedCandidate } from "./PlanRanker";

export class ExecutionAdvisor {
  public formulateAdvice(ranked: RankedCandidate[]): string {
    if (ranked.length === 0) {
      return "[Execution Advisor] No candidate plans available to recommend.";
    }

    const top = ranked[0];
    return `[Execution Advisor] Recommended Action Profile is "${top.candidate.name}" with index score ${top.score.toFixed(1)}. It matches safety limits constraints guidelines and holds ${top.candidate.expectedAccuracy}% expected verification reliability.`;
  }
}

export const activeExecutionAdvisor = new ExecutionAdvisor();
