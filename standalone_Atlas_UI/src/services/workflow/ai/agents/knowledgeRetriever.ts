import { activeWorkflowRepository } from "../../workflowRepository";

export class KnowledgeRetriever {
  public retrieveSimilarTemplates(prompt: string): string {
    const existing = activeWorkflowRepository.getPackagesList();
    const matches = existing.filter(p => 
      p.metadata.packageName.toLowerCase().includes(prompt.toLowerCase()) ||
      p.definition.description.toLowerCase().includes(prompt.toLowerCase())
    );

    if (matches.length > 0) {
      return `Found ${matches.length} matching template assets in local repository. Grounding prompt context in: ${matches.map(m => m.metadata.packageName).join(", ")}.`;
    }
    return "No highly correlated templates found in the repository. Grounding reasoning on universal engineering schemas.";
  }
}
