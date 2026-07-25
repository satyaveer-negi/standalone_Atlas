import type { WorkflowSuggestion } from "../models/workflowSuggestion";

export class QualityAdvisor {
  public advise(prompt: string): WorkflowSuggestion[] {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    return isCfd ? [
      { text: "Add PDF manuscript compiler report step to the end of pipeline.", type: "Optimization", benefit: "Builds automatic execution validation reports." }
    ] : [
      { text: "Register script step under cluster execution nodes instead of local host.", type: "Efficiency", benefit: "Improves overall computing latency profiles." }
    ];
  }
}
