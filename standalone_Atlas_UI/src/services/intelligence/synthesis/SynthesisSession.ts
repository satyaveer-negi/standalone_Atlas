export interface SynthesisSession {
  sessionId: string;
  inputOutcomeIds: string[];
  filterCriteria: {
    domains: string[];
    minConfidence: number;
  };
  generatedArtifactIds: string[];
  synthesisMetrics: {
    durationMs: number;
    patternsSynthesizedCount: number;
  };
  timestamp: string;
}
