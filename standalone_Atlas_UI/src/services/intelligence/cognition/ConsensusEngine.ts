import { AgentOpinion } from "./SpecialistAgent";
import { CouncilCharter } from "./CouncilCharter";

export interface ConsensusResult {
  agreementScore: number; // percentage
  confidenceScore: number; // percentage
  participationCoverage: string; // e.g. "3 of 3 required disciplines"
  openIssues: string[];
}

export class ConsensusEngine {
  public calculateConsensus(opinions: AgentOpinion[], charter: CouncilCharter): ConsensusResult {
    const totalCount = opinions.length;
    if (totalCount === 0) {
      return { agreementScore: 0, confidenceScore: 0, participationCoverage: "0 of 0", openIssues: ["No opinions gathered."] };
    }

    // Fraction of agents giving Accept or ConditionalAccept
    const acceptsCount = opinions.filter(o => o.verdict !== "Reject").length;
    const agreement = (acceptsCount / totalCount) * 100;

    // Confidence is average score
    const avgScore = opinions.reduce((acc, curr) => acc + curr.score, 0) / totalCount;

    // Participation
    const coveredDisciplines = opinions.map(o => o.discipline);
    const requiredAndCovered = charter.requiredDisciplines.filter(d => coveredDisciplines.includes(d as any));
    const coverageStr = `${requiredAndCovered.length} of ${charter.requiredDisciplines.length} required disciplines`;

    const openIssues: string[] = [];
    opinions.forEach(o => {
      if (o.verdict === "Reject") {
        openIssues.push(`${o.discipline} Agent rejected: ${o.findings.join(", ")}`);
      }
    });

    return {
      agreementScore: agreement,
      confidenceScore: avgScore,
      participationCoverage: coverageStr,
      openIssues
    };
  }
}

export const activeConsensusEngine = new ConsensusEngine();
