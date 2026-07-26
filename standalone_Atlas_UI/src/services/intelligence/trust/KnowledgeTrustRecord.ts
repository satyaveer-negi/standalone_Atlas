export interface KnowledgeTrustRecord {
  recordId: string;
  artifactId: string;
  provenanceChain: string[]; // Custody history
  evidenceQuality: number; // 0-100 score
  validationHistory: string[];
  integrityStatus: "Valid" | "Invalid" | "Unverified";
  trustScore: number; // 0-100 calculated
  confidenceLineage: number[];
  expiryDate: string;
}
