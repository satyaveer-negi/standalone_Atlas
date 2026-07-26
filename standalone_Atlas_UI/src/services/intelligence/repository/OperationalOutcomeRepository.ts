import { OperationalOutcome } from "../synthesis/OperationalOutcome";
import { KnowledgeArtifact } from "../synthesis/KnowledgeArtifact";
import { SynthesisSession } from "../synthesis/SynthesisSession";

export class OperationalOutcomeRepository {
  private outcomes = new Map<string, OperationalOutcome>();
  private artifacts = new Map<string, KnowledgeArtifact>();
  private sessions = new Map<string, SynthesisSession>();

  public saveOutcome(out: OperationalOutcome): void {
    this.outcomes.set(out.outcomeId, out);
  }

  public saveArtifact(art: KnowledgeArtifact): void {
    this.artifacts.set(art.artifactId, art);
  }

  public saveSession(sess: SynthesisSession): void {
    this.sessions.set(sess.sessionId, sess);
  }

  public getOutcomesList(): OperationalOutcome[] {
    return Array.from(this.outcomes.values());
  }

  public getArtifactsList(): KnowledgeArtifact[] {
    return Array.from(this.artifacts.values());
  }

  public getSessionsList(): SynthesisSession[] {
    return Array.from(this.sessions.values());
  }

  public clear(): void {
    this.outcomes.clear();
    this.artifacts.clear();
    this.sessions.clear();
  }
}

export const activeOperationalOutcomeRepository = new OperationalOutcomeRepository();
