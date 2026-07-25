import { WorkflowPackage, activeWorkflowRepository } from "./workflowRepository";
import { activeWorkflowValidator } from "./workflowValidator";

export interface RiskAssessment {
  overallScore: number;
  complexityRisk: number;
  dependencyRisk: number;
  executionRisk: number;
  confidence: number;
  explanation: string;
}

export interface ReviewerProfile {
  name: string;
  expertise: string;
  trustLevel: string;
}

export interface WorkflowSuggestion {
  text: string;
  type: string;
  benefit: string;
}

export interface AICopilotResult {
  generatedPackage: WorkflowPackage;
  riskAssessment: RiskAssessment;
  suggestedReviewers: ReviewerProfile[];
  suggestions: WorkflowSuggestion[];
  retrievedContext: string;
}

// 🧠 PROGRAM III.6: KNOWLEDGE RETRIEVER AGENT
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

// 🧠 PROGRAM III.6: AI AGENTS COORDINATOR (PIPELINE ORCHESTRATION ENGINE)
export class AICoordinator {
  private retriever = new KnowledgeRetriever();

  public generateWorkflowFromPrompt(prompt: string): AICopilotResult {
    // 1. Retrieve Context
    const retrievedContext = this.retriever.retrieveSimilarTemplates(prompt);

    // 2. Generate Package (Grounding on prompt content)
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const packageId = `ai-pkg-${Date.now()}`;
    
    const generatedPackage: WorkflowPackage = {
      packageId,
      metadata: {
        packageName: isCfd ? "AI-Generated CFD Solver Pipeline" : "AI-Generated Computation Pipeline",
        author: "AI-Copilot-Agent",
        domain: isCfd ? "Fluid Dynamics" : "Numerical Computation",
        version: "1.0.0",
        status: "Draft",
        requiredCapabilities: isCfd ? ["exportMesh", "triggerSolver"] : ["executeScript"],
        created: new Date().toLocaleDateString()
      },
      definition: {
        workflowId: `ai-wf-${Date.now()}`,
        name: isCfd ? "AI-Generated CFD Solver Pipeline" : "AI-Generated Computation Pipeline",
        description: `Automated DAG configuration generated from instruction: "${prompt}"`,
        version: "1.0.0",
        tags: isCfd ? ["CFD", "AI-Generated"] : ["Math", "AI-Generated"],
        steps: isCfd ? [
          { stepId: "mesh", name: "Construct geometry mesh blocks", capability: "exportMesh", state: "Ready", retries: 0 },
          { stepId: "solve", name: "Numerical simulation calculations", capability: "triggerSolver", state: "Pending", retries: 0 }
        ] : [
          { stepId: "calc", name: "Compute matrix dot products", capability: "executeScript", state: "Ready", retries: 0 }
        ],
        dependencies: isCfd ? [
          { from: "mesh", to: "solve" }
        ] : []
      },
      validationPassed: true
    };

    // 3. Score Risk
    const complexityRisk = isCfd ? 30 : 15;
    const dependencyRisk = isCfd ? 20 : 5;
    const executionRisk = isCfd ? 45 : 10;
    const overallScore = Math.round((complexityRisk + dependencyRisk + executionRisk) / 3);

    const riskAssessment: RiskAssessment = {
      overallScore,
      complexityRisk,
      dependencyRisk,
      executionRisk,
      confidence: 90,
      explanation: isCfd 
        ? "Medium risk. Utilizes OpenFOAM mesh components. Execution time may vary based on solver grid size."
        : "Low risk. Runs lightweight script matrices on local execution nodes."
    };

    // 4. Match Reviewers
    const suggestedReviewers: ReviewerProfile[] = isCfd ? [
      { name: "satyaveer-negi", expertise: "Fluid Dynamics expert", trustLevel: "Gold Partner" }
    ] : [
      { name: "HP", expertise: "Data Analytics advisor", trustLevel: "Verified Publisher" }
    ];

    // 5. Build Quality Recommendations
    const suggestions: WorkflowSuggestion[] = isCfd ? [
      { text: "Add PDF manuscript compiler report step to the end of pipeline.", type: "Optimization", benefit: "Builds automatic execution validation reports." }
    ] : [
      { text: "Register script step under cluster execution nodes instead of local host.", type: "Efficiency", benefit: "Improves overall computing latency profiles." }
    ];

    return {
      generatedPackage,
      riskAssessment,
      suggestedReviewers,
      suggestions,
      retrievedContext
    };
  }
}

export const activeAICoordinator = new AICoordinator();
