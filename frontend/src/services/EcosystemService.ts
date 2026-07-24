import { ExtensionRuntime } from "../products/ecosystem/engine/ExtensionRuntime";

export class EcosystemService {
  private runtime: ExtensionRuntime;

  constructor() {
    this.runtime = new ExtensionRuntime();
  }

  getRuntime(): ExtensionRuntime {
    return this.runtime;
  }
}
