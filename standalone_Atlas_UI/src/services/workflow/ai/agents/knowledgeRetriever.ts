import { activeKnowledgeGraph } from "../../workflowKnowledgeGraph";

export class KnowledgeRetriever {
  public retrieveSimilarTemplates(prompt: string): string {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const domainNodeId = isCfd ? "domain-cfd" : "domain-math";
    
    const related = activeKnowledgeGraph.findRelatedEntities(domainNodeId);
    if (related.length > 0) {
      const capabilities = related.filter(r => r.node.type === "Capability").map(r => r.node.label);
      const reviewers = related.filter(r => r.node.type === "Reviewer").map(r => r.node.label);
      return `Grounding Context in Semantic Knowledge Graph: Domain "${isCfd ? "Fluid Dynamics" : "Numerical Computation"}" requires capabilities (${capabilities.join(", ")}) and matches Reviewer Profile (${reviewers.join(", ")}).`;
    }
    return "No semantic paths found in Knowledge Graph. Defaulting to general schema guidelines.";
  }
}
