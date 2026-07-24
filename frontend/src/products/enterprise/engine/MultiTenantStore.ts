export interface BusinessUnitNode {
  id: string;
  name: string;
  workspacesCount: number;
}

export interface OrganizationNode {
  id: string;
  name: string;
  tier: "ENTERPRISE_GOLD" | "ENTERPRISE_PLATINUM";
  businessUnits: BusinessUnitNode[];
}

export const DEMO_ORGANIZATIONS: OrganizationNode[] = [
  {
    id: "org-acme",
    name: "Acme Global Enterprise",
    tier: "ENTERPRISE_PLATINUM",
    businessUnits: [
      { id: "bu-fintech", name: "Core FinTech Systems", workspacesCount: 4 },
      { id: "bu-retail", name: "Digital E-Commerce Platform", workspacesCount: 3 },
    ],
  },
  {
    id: "org-nexus",
    name: "Nexus Cloud Software",
    tier: "ENTERPRISE_GOLD",
    businessUnits: [
      { id: "bu-saas", name: "SaaS Application Services", workspacesCount: 2 },
    ],
  },
];
