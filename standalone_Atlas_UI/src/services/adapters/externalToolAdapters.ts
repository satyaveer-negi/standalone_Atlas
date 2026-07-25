import { adapterRegistry } from "./adapterRegistry";
import { AdapterState, ExecutionProvider } from "./executionProvider";

export type { AdapterState };
export type ToolAdapter = ExecutionProvider;

// 🔌 BRIDGING API TO DECOUPLED ADAPTER REGISTRY
export const activeToolAdapters = {
  getAdaptersList: () => adapterRegistry.getAdapters(),
  updateAdapterState: (name: string, state: AdapterState) => {
    const key = name.toLowerCase().split(" ")[0];
    const adapter = adapterRegistry.getAdapter(key);
    if (adapter) {
      adapter.state = state;
      adapter.lastSync = new Date().toUTCString();
      if (state === "Connected") {
        adapter.diagnostics = "Handshake connection verified.";
      } else {
        adapter.diagnostics = "Adapter standby mode. Disconnected.";
      }
    }
  }
};
