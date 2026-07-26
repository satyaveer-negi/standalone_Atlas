import { EngineeringDecision } from "../cognition/EngineeringDecision";

export interface DecisionHistoryEntry {
  decisionId: string;
  verdict: "Approved" | "PolicyViolation";
  makerName: string;
  consensusScore: number;
  timestamp: string;
}

export class DecisionHistory {
  private entries: DecisionHistoryEntry[] = [
    {
      decisionId: "dec-historical-01",
      verdict: "Approved",
      makerName: "HP (Chief Architect)",
      consensusScore: 92,
      timestamp: new Date().toISOString()
    }
  ];

  public recordDecision(dec: EngineeringDecision, agreementScore: number): void {
    this.entries.push({
      decisionId: dec.id,
      verdict: dec.approvalStatus,
      makerName: dec.approvedBy,
      consensusScore: agreementScore,
      timestamp: dec.timestamp
    });
  }

  public getHistory(): DecisionHistoryEntry[] {
    return this.entries;
  }
}

export const activeDecisionHistory = new DecisionHistory();
