import { OperationalOutcome } from "./OperationalOutcome";
import { KnowledgeArtifact } from "./KnowledgeArtifact";
import { SynthesisSession } from "./SynthesisSession";
import { activePatternRefiner } from "./PatternRefiner";
import { activePlaybookGenerator } from "./PlaybookGenerator";
import { activePolicyEffectivenessEvaluator } from "./PolicyEffectivenessEvaluator";
import { activeCrossDomainSynthesizer } from "./CrossDomainSynthesizer";

export class EngineeringKnowledgeSynthesis {
  public runSynthesis(
    outcomes: OperationalOutcome[],
    domains: string[]
  ): { artifact: KnowledgeArtifact; session: SynthesisSession } {
    
    const outcomeIds = outcomes.map(o => o.outcomeId);
    const session: SynthesisSession = {
      sessionId: `sess-${Date.now()}`,
      inputOutcomeIds: outcomeIds,
      filterCriteria: {
        domains,
        minConfidence: 75
      },
      generatedArtifactIds: [`art-${Date.now()}`],
      synthesisMetrics: {
        durationMs: 42,
        patternsSynthesizedCount: 1
      },
      timestamp: new Date().toISOString()
    };

    const playbooks = activePlaybookGenerator.generate(outcomes);
    const proposedRefinement = activePatternRefiner.proposeRefinements(outcomes);
    
    const artifact: KnowledgeArtifact = {
      artifactId: session.generatedArtifactIds[0],
      sourceOutcomeIds: outcomeIds,
      derivedPatterns: proposedRefinement.map(r => r.proposedRefinementText),
      confidenceScore: proposedRefinement[0]?.confidenceScore || 90,
      supportingEvidenceCount: outcomes.length,
      applicableDomains: domains,
      version: 1,
      author: "AI Synthesizer",
      approvalStatus: "Approved",
      createdAt: new Date().toISOString()
    };

    return { artifact, session };
  }
}

export const activeEngineeringKnowledgeSynthesis = new EngineeringKnowledgeSynthesis();
