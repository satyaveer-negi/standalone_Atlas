import { TwinCapability } from "./TwinCapability";
import { TwinEndpoint } from "./TwinEndpoint";

export interface TwinDescriptor {
  id: string;
  name: string;
  displayName: string;
  domain: string;
  version: string;
  endpoint: TwinEndpoint;
  capabilities: TwinCapability[];
  status: "Online" | "Offline" | "Degraded" | "Synchronizing";
  owner: string;
  organization: string;
  region: string;
  tags: string[];
  supportedProtocols: string[];
  securityProfile: string;
}
