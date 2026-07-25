import { GraphValidator } from "../../graph/GraphValidator";
import { activeTestAssetsRegistry } from "../assets/testAssets";

export class GraphAssertions {
  private validator = new GraphValidator();

  public assertCycleRejection(): { passed: boolean; message: string } {
    const nodes = activeTestAssetsRegistry.getSampleCycleNodes();
    const edges = activeTestAssetsRegistry.getSampleCycleEdges();

    const result = this.validator.validateDAG(nodes, edges);
    if (result === false) {
      return { passed: true, message: "GraphValidator correctly rejected cyclic dependencies." };
    }
    return { passed: false, message: "GraphValidator failed to reject cyclic dependencies." };
  }

  public assertLinearValidity(): { passed: boolean; message: string } {
    const nodes = activeTestAssetsRegistry.getSampleLinearNodes();
    const edges = activeTestAssetsRegistry.getSampleLinearEdges();

    const result = this.validator.validateDAG(nodes, edges);
    if (result === true) {
      return { passed: true, message: "GraphValidator correctly validated linear dependencies." };
    }
    return { passed: false, message: "GraphValidator failed to validate linear dependencies." };
  }
}
