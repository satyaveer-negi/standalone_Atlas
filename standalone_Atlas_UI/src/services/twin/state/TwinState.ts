import { StateVersion } from "./StateVersion";

export interface TwinState {
  propertyName: string;
  value: any;
  unit: string;
  versionInfo: StateVersion;
}
