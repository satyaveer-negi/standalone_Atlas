import { activeKnowledgeGraph } from "../../workflowKnowledgeGraph";
import { activeFederatedGraphCoordinator } from "../../workflowFederatedGraph";

export class KnowledgeRetriever {
  public retrieveSimilarTemplates(prompt: string): string {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const domainNodeId = isCfd ? "domain-cfd" : "domain-math";
    
    // 1. Fetch Local context
    const localRelated = activeKnowledgeGraph.findRelatedEntities(domainNodeId);
    let localSummary = "";
    if (localRelated.length > 0) {
      const capabilities = localRelated.filter(r => r.node.type === "Capability").map(r => r.node.label);
      localSummary = `Local Graph: Domain "${isCfd ? "Fluid Dynamics" : "Numerical Computation"}" requires capabilities (${capabilities.join(", ")}).`;
    }

    // 2. Fetch Federated remote context
    const federatedMatches = activeFederatedGraphCoordinator.coordinateFederatedQuery(prompt);
    let remoteSummary = "";
    if (federatedMatches.length > 0) {
      remoteSummary = ` Federated Graph: Retrieved adjacent node "${federatedMatches[0].entityLabel}" (${federatedMatches[0].entityType}) from source [${federatedMatches[0].sourceOrg}] (Trust: ${federatedMatches[0].trustScore * 100}%).`;
    }

    return `${localSummary}${remoteSummary}` || "No semantic paths found in local or federated nodes registries.";
  }
}
