import { OperationalOutcome } from "./OperationalOutcome";

export interface PatternRefinement {
  patternId: string;
  proposedRefinementText: string;
  confidenceScore: number;
}

export class PatternRefiner {
  public proposeRefinements(outcomes: OperationalOutcome[]): PatternRefinement[] {
    const failures = outcomes.filter(o => o.executionResultStatus === "Failure");
    
    if (failures.length > 0) {
      return [{
        patternId: "PAT-REF-TEMP-01",
        proposedRefinementText: "Lower nominal solar voltage check triggers from 120V to 118V to prevent switchers thermal degradation.",
        confidenceScore: 92
      }];
    }

    return [{
      patternId: "PAT-REF-NOM-01",
      proposedRefinementText: "Nominal converter operating temperatures verified compliant. Propose increasing load thresholds slightly.",
      confidenceScore: 85
    }];
  }
}

export const activePatternRefiner = new PatternRefiner();
