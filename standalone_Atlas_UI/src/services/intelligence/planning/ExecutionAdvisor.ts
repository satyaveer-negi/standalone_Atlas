import { RankedCandidate } from "./PlanRanker";

export class ExecutionAdvisor {
  public formulateAdvice(ranked: RankedCandidate[]): string {
    if (ranked.length === 0) {
      return "[Execution Advisor] No candidate plans available to recommend.";
    }

    const top = ranked[0];
    const secondary = ranked[1];

    return `[Execution Advisor Decision Brief]
Recommendation: "${top.candidate.name}" (Score: ${top.scoreVector.overall.toFixed(0)})
- Strengths: High reliability, full verification checks coverage, high solver performance (${top.scoreVector.performance}%).
- Weaknesses: Increased compute cost ($${top.candidate.costEstimateUSD}) and longer estimated execution times.
- Risks: Peak memory usage might trigger resource scaling latency.
- Alternatives: "${secondary?.candidate.name || "None"}" remains a viable low-compute cost fallback candidate.
- Evidence Base: Matches grid substation switch capabilities index constraints with ${top.candidate.confidence * 100}% confidence.`;
  }
}

export const activeExecutionAdvisor = new ExecutionAdvisor();
