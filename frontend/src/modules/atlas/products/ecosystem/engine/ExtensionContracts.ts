export type ExtensionCategory =
  | "CONNECTOR"
  | "WORKFLOW"
  | "MANIFEST_GENERATOR"
  | "POLICY_PACK"
  | "ANALYTICS_PACK"
  | "AI_CAPABILITY"
  | "VISUALIZATION";

export interface ExtensionManifest {
  id: string;
  name: string;
  version: string;
  sdkVersion: string;
  author: string;
  category: ExtensionCategory;
  capabilities: string[];
  permissions: string[];
  dependencies: string[];
  minimumPlatformVersion: string;
  status: "REGISTERED" | "ACTIVATED" | "DEACTIVATED" | "ERROR";
}

export const DEMO_EXTENSIONS: ExtensionManifest[] = [
  {
    id: "ext-nomad-gen",
    name: "HashiCorp Nomad Manifest Generator",
    version: "1.2.0",
    sdkVersion: "v2.0",
    author: "Atlas Core Team",
    category: "MANIFEST_GENERATOR",
    capabilities: ["generate:nomad_job"],
    permissions: ["read:architecture_ast"],
    dependencies: [],
    minimumPlatformVersion: "v5.5.0",
    status: "ACTIVATED",
  },
  {
    id: "ext-aws-cloudwatch",
    name: "AWS CloudWatch Observability Connector",
    version: "2.0.1",
    sdkVersion: "v2.0",
    author: "DevOps OpsTeam",
    category: "CONNECTOR",
    capabilities: ["ingest:cloudwatch_alarms"],
    permissions: ["emit:engineering_commands"],
    dependencies: ["ext-nomad-gen"],
    minimumPlatformVersion: "v5.2.0",
    status: "ACTIVATED",
  },
  {
    id: "ext-k8s-sec-policy",
    name: "Kubernetes Security Governance Policy Pack",
    version: "1.0.4",
    sdkVersion: "v2.0",
    author: "SecOps Guild",
    category: "POLICY_PACK",
    capabilities: ["validate:k8s_rbac"],
    permissions: ["read:deployment_plan"],
    dependencies: [],
    minimumPlatformVersion: "v5.1.0",
    status: "ACTIVATED",
  },
];
