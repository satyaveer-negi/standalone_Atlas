export interface SchemaVersionRegistry {
  commandSchemaVersion: string;
  workflowSchemaVersion: string;
  camSchemaVersion: string;
  deploymentPlanSchemaVersion: string;
  analyticsSchemaVersion: string;
  extensionManifestSchemaVersion: string;
}

export const PLATFORM_SCHEMA_VERSIONS: SchemaVersionRegistry = {
  commandSchemaVersion: "v2.1.0",
  workflowSchemaVersion: "v1.4.0",
  camSchemaVersion: "v1.2.0",
  deploymentPlanSchemaVersion: "v1.1.0",
  analyticsSchemaVersion: "v1.0.0",
  extensionManifestSchemaVersion: "v2.0.0",
};
