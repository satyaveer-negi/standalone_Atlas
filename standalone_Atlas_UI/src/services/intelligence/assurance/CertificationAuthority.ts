export type AuthorityRoleType = 
  | "AutomatedGate" 
  | "ReviewBoard" 
  | "ComplianceOfficer"
  | "DomainExpert"
  | "ExternalRegulator";

export interface CertificationAuthority {
  authorityId: string;
  name: string;
  role: AuthorityRoleType;
  signatureKey: string;
}

export const initialCertificationAuthorities: CertificationAuthority[] = [
  {
    authorityId: "auth-auto-gate",
    name: "Automated EIOS Compliance Gate",
    role: "AutomatedGate",
    signatureKey: "sig-key-automated-sha256"
  },
  {
    authorityId: "auth-board-council",
    name: "Platform Governance Review Board",
    role: "ReviewBoard",
    signatureKey: "sig-key-council-board-ed25519"
  },
  {
    authorityId: "auth-compliance-officer",
    name: "Chief Quality & Compliance Officer",
    role: "ComplianceOfficer",
    signatureKey: "sig-key-compliance-officer-rsa"
  }
];
