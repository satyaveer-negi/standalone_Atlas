import { activeSharedTaskGraph } from "../../graph/SharedTaskGraph";

export class Pillar1ComplianceTests {
  public verifyPillar1(): { passed: boolean; message: string; score: number } {
    // Assert that TaskGraph carries no governance metadata nodes or policies
    const nodes = activeSharedTaskGraph.getNodes();
    const leakageNode = nodes.find(n => n.objective.toLowerCase().includes("signature") || n.objective.toLowerCase().includes("approve"));
    
    if (!leakageNode) {
      return { passed: true, message: "Pillar 1 PASSED: Operational execution remains isolated from governance signature gates.", score: 100 };
    }
    return { passed: false, message: "Pillar 1 FAILED: Detected governance leakage in scheduling objectives.", score: 0 };
  }
}
