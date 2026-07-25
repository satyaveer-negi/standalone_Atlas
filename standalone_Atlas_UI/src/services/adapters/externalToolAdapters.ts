export type AdapterState = "Available" | "Connecting" | "Connected" | "Degraded" | "Error" | "Disabled";

export interface ToolAdapter {
  name: string;
  version: string;
  state: AdapterState;
  lastSync: string;
  capabilities: string[];
  diagnostics: string;
}

// 🔌 PROGRAM V2: ADAPTER FRAMEWORK
export class ExternalToolAdapters {
  private adapters = new Map<string, ToolAdapter>();

  constructor() {
    this.seedAdapters();
  }

  private seedAdapters() {
    this.adapters.set("onlyoffice", {
      name: "ONLYOFFICE Document Server",
      version: "7.2.1",
      state: "Connected",
      lastSync: "12:44:10 UTC",
      capabilities: ["editManuscript", "syncComments"],
      diagnostics: "Adapter connection healthy. JWT signing verified."
    });

    this.adapters.set("openfoam", {
      name: "OpenFOAM Solver Adapter",
      version: "1.0.0",
      state: "Available",
      lastSync: "Never",
      capabilities: ["triggerSolver", "exportMesh"],
      diagnostics: "Adapter standby. Solver endpoints ready."
    });

    this.adapters.set("docker", {
      name: "Docker Solver Container",
      version: "20.10.15",
      state: "Connecting",
      lastSync: "Never",
      capabilities: ["spinContainer", "mountVolumes"],
      diagnostics: "Connecting to Docker daemon pipe... Pending."
    });

    this.adapters.set("matlab", {
      name: "MATLAB Control Sync",
      version: "2024.a",
      state: "Degraded",
      lastSync: "12:30:15 UTC",
      capabilities: ["runSimulink", "fetchParams"],
      diagnostics: "License verification warning: network ping delay detected."
    });

    this.adapters.set("cad", {
      name: "CAD Modeling Interface",
      version: "2.5",
      state: "Disabled",
      lastSync: "Never",
      capabilities: ["importStep", "exportDxf"],
      diagnostics: "Disabled by administrator policy configuration."
    });
  }

  public getAdaptersList(): ToolAdapter[] {
    return Array.from(this.adapters.values());
  }

  public updateAdapterState(name: string, state: AdapterState): void {
    const key = name.toLowerCase().split(" ")[0];
    const adapter = this.adapters.get(key);
    if (adapter) {
      adapter.state = state;
      adapter.lastSync = new Date().toUTCString();
      if (state === "Connected") {
        adapter.diagnostics = "Connection successfully handshaked.";
      } else if (state === "Available") {
        adapter.diagnostics = "Adapter disconnected. Standby mode.";
      }
      console.log(`[Adapter Manager] Updated adapter "${name}" state to: ${state}`);
    }
  }
}

export const activeToolAdapters = new ExternalToolAdapters();
