import { EvolutionProposal } from "../evolution/EvolutionProposal";
import { EvolutionImpactAssessment } from "../evolution/EvolutionImpactAssessment";
import { EvolutionExperiment } from "../evolution/EvolutionExperiment";

export interface EvolutionMetrics {
  totalProposalsGenerated: number;
  proposalsApprovedRatio: number;
  meanExperimentSuccessScore: number;
}

export class EvolutionRepository {
  private proposals = new Map<string, EvolutionProposal>();
  private assessments = new Map<string, EvolutionImpactAssessment>();
  private experiments = new Map<string, EvolutionExperiment>();

  private metrics: EvolutionMetrics = {
    totalProposalsGenerated: 4,
    proposalsApprovedRatio: 75.0,
    meanExperimentSuccessScore: 94.6
  };

  public saveProposal(prop: EvolutionProposal): void {
    this.proposals.set(prop.proposalId, prop);
  }

  public saveAssessment(ass: EvolutionImpactAssessment): void {
    this.assessments.set(ass.assessmentId, ass);
  }

  public saveExperiment(exp: EvolutionExperiment): void {
    this.experiments.set(exp.experimentId, exp);
  }

  public getProposalsList(): EvolutionProposal[] {
    return Array.from(this.proposals.values());
  }

  public getAssessmentsList(): EvolutionImpactAssessment[] {
    return Array.from(this.assessments.values());
  }

  public getExperimentsList(): EvolutionExperiment[] {
    return Array.from(this.experiments.values());
  }

  public getMetrics(): EvolutionMetrics {
    return this.metrics;
  }

  public updateMetrics(newMetrics: Partial<EvolutionMetrics>): void {
    this.metrics = { ...this.metrics, ...newMetrics };
  }

  public clear(): void {
    this.proposals.clear();
    this.assessments.clear();
    this.experiments.clear();
  }
}

export const activeEvolutionRepository = new EvolutionRepository();
