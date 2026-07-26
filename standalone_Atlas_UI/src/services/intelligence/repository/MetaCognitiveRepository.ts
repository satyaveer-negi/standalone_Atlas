import { MetaCognitiveAssessment } from "../meta/MetaCognitiveAssessment";
import { CognitiveBenchmark, initialCognitiveBenchmarks } from "../meta/CognitiveBenchmark";
import { CognitiveEpisode } from "../meta/CognitiveEpisode";
import { CognitiveHealth } from "../meta/MetaCognitiveEvaluator";

export class MetaCognitiveRepository {
  private assessments = new Map<string, MetaCognitiveAssessment>();
  private benchmarks = new Map<string, CognitiveBenchmark>();
  private episodes: CognitiveEpisode[] = [];
  
  private health: CognitiveHealth = {
    overallHealthScore: 92.5,
    componentHealths: {
      Planning: 95,
      Reasoning: 95,
      Retrieval: 95,
      Verification: 95,
      Governance: 95,
      Learning: 95,
      KnowledgeSynthesis: 95,
      Evolution: 75
    },
    driftDetected: false
  };

  constructor() {
    initialCognitiveBenchmarks.forEach(b => this.benchmarks.set(b.benchmarkId, b));
  }

  public saveAssessment(ass: MetaCognitiveAssessment): void {
    this.assessments.set(ass.assessmentId, ass);
  }

  public saveBenchmark(bench: CognitiveBenchmark): void {
    this.benchmarks.set(bench.benchmarkId, bench);
  }

  public addEpisode(ep: CognitiveEpisode): void {
    this.episodes.push(ep);
  }

  public getAssessmentsList(): MetaCognitiveAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getBenchmarksList(): CognitiveBenchmark[] {
    return Array.from(this.benchmarks.values());
  }

  public getEpisodesList(): CognitiveEpisode[] {
    return this.episodes;
  }

  public getHealth(): CognitiveHealth {
    return this.health;
  }

  public updateHealth(newHealth: CognitiveHealth): void {
    this.health = newHealth;
  }

  public clear(): void {
    this.assessments.clear();
    this.episodes = [];
  }
}

export const activeMetaCognitiveRepository = new MetaCognitiveRepository();
