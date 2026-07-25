import { activeVerificationService } from "./engine/VerificationService";
import { TestResult } from "./reports/VerificationReport";

export class CollaborationTestSuite {
  public async runSuite(prompt: string): Promise<TestResult[]> {
    console.log("[TestSuite] Kicking off full EIOS orchestration verification...");
    return await activeVerificationService.executeVerificationProfile("Full", prompt);
  }
}

export const activeCollaborationTestSuite = new CollaborationTestSuite();
