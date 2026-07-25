import type { ReviewerProfile } from "../models/reviewerProfile";

export class ReviewerMatcher {
  public match(prompt: string): ReviewerProfile[] {
    const isCfd = prompt.toLowerCase().includes("cfd") || prompt.toLowerCase().includes("fluid") || prompt.toLowerCase().includes("mesh");
    return isCfd ? [
      { name: "satyaveer-negi", expertise: "Fluid Dynamics expert", trustLevel: "Gold Partner" }
    ] : [
      { name: "HP", expertise: "Data Analytics advisor", trustLevel: "Verified Publisher" }
    ];
  }
}
