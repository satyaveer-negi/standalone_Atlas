export interface FederationAgreement {
  agreementId: string;
  partnerOrganization: string;
  trustScore: number; // 0-100
  sharingRules: string[];
  status: "ACTIVE" | "PENDING";
}

export class EnterpriseFederation {
  getAgreements(): FederationAgreement[] {
    return [
      {
        agreementId: "agr-partner-acme",
        partnerOrganization: "Acme Global Enterprise (FinTech Division)",
        trustScore: 98,
        sharingRules: [
          "Share Canonical Architecture Model (CAM) Specs",
          "Share Security & Governance Policy Packs",
          "Hide Proprietary Source Code ASTs",
        ],
        status: "ACTIVE",
      },
    ];
  }
}
