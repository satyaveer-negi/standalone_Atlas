import { KnowledgeTrustRecord } from "./KnowledgeTrustRecord";

export class TrustEvaluator {
  public evaluateTrust(
    artifactId: string,
    provenanceChain: string[],
    evidenceQuality: number,
    validationHistory: string[],
    integrityStatus: "Valid" | "Invalid" | "Unverified"
  ): KnowledgeTrustRecord {
    const isTampered = integrityStatus === "Invalid";
    
    // Weighted trustScore score logic: evidence 60%, integrity status 40%
    let integrityWeight = 0;
    if (integrityStatus === "Valid") integrityWeight = 40;
    if (integrityStatus === "Unverified") integrityWeight = 20;

    const rawScore = (evidenceQuality * 0.6) + integrityWeight;
    const trustScore = isTampered ? 0 : Math.round(rawScore);

    return {
      recordId: `ktr-${artifactId}-${Date.now()}`,
      artifactId,
      provenanceChain,
      evidenceQuality,
      validationHistory,
      integrityStatus,
      trustScore,
      confidenceLineage: [evidenceQuality, trustScore],
      expiryDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString() // 30 days validation limit
    };
  }
}

export const activeTrustEvaluator = new TrustEvaluator();
