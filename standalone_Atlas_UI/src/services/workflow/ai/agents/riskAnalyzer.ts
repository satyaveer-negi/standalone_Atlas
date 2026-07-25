import type { RiskAssessment } from "../models/riskAssessment";

export class RiskAnalyzer {
  public analyze(prompt: string): RiskAssessment {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    const complexityRisk = isCfd ? 30 : 15;
    const dependencyRisk = isCfd ? 20 : 5;
    const executionRisk = isCfd ? 45 : 10;
    const overallScore = Math.round((complexityRisk + dependencyRisk + executionRisk) / 3);

    return {
      overallScore,
      complexityRisk,
      dependencyRisk,
      executionRisk,
      confidence: 90,
      explanation: isCfd 
        ? "Medium risk. Utilizes OpenFOAM mesh components. Execution time may vary based on solver grid size."
        : "Low risk. Runs lightweight script matrices on local execution nodes."
    };
  }
}
