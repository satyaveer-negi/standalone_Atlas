import { useAtlasStore } from "../store/atlasStore";
import type { AtlasNode, AtlasGraph } from "./AtlasTypes";

export class AtlasAPI {
  static selectNode(nodeId: string | null) {
    useAtlasStore.getState().setSelectedNode(nodeId);
  }

  static hoverNode(nodeId: string | null) {
    useAtlasStore.getState().setHoveredNode(nodeId);
  }

  static toggleAutoRotate() {
    useAtlasStore.getState().toggleAutoRotate();
  }

  static setCameraMode(mode: any) {
    useAtlasStore.getState().setCameraMode(mode);
  }
}
