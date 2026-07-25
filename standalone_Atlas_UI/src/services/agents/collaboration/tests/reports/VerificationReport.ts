export type VerificationStatus = "Pass" | "Fail" | "Warning" | "Skipped";

export interface TestResult {
  id: string;
  name: string;
  status: VerificationStatus;
  durationMs: number;
  message: string;
  details?: any;
}

export class VerificationReport {
  private results: TestResult[] = [];

  public addResult(result: TestResult): void {
    this.results.push(result);
  }

  public getResults(): TestResult[] {
    return [...this.results];
  }

  public generateMarkdownSummary(): string {
    const passed = this.results.filter(r => r.status === "Pass").length;
    const total = this.results.length;

    return `
# EIOS Verification Report Summary
=========================================
Total Tests Run:  ${total}
Passed:           ${passed}
Failed:           ${total - passed}
Success Rate:     ${total > 0 ? Math.round((passed / total) * 100) : 0}%

Details:
${this.results.map(r => `* [${r.status}] ${r.name} (${r.durationMs}ms) - ${r.message}`).join("\n")}
=========================================
`;
  }
}
