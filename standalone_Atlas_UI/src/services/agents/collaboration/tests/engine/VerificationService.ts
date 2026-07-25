import { VerificationEngine } from "./VerificationEngine";
import { TestResult } from "../reports/VerificationReport";

export type VerificationProfile = "Quick" | "Compliance" | "Full";

export class VerificationService {
  private engine = new VerificationEngine();
  private lastResults: TestResult[] = [];

  public async executeVerificationProfile(profile: VerificationProfile, targetPrompt: string): Promise<TestResult[]> {
    console.log(`[Verification Service] Triggering profile "${profile}" evaluation...`);
    
    const report = await this.engine.runFullSuite(targetPrompt);
    const results = report.getResults();

    // Filter results based on profile mapping
    if (profile === "Quick") {
      this.lastResults = results.filter(r => !r.id.startsWith("compliance"));
    } else if (profile === "Compliance") {
      this.lastResults = results.filter(r => r.id.startsWith("compliance"));
    } else {
      this.lastResults = results;
    }

    return [...this.lastResults];
  }

  public getHistory(): TestResult[] {
    return [...this.lastResults];
  }
}

export const activeVerificationService = new VerificationService();
