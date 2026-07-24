import { StudioDesignerEngine } from "../products/studio/engine/StudioDesignerEngine";

export class StudioService {
  private designer: StudioDesignerEngine;

  constructor() {
    this.designer = new StudioDesignerEngine();
  }

  getDesigner(): StudioDesignerEngine {
    return this.designer;
  }
}
