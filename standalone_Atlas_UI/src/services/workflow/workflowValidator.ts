import { WorkflowPackage } from "./workflowRepository";
import { activeNodeRegistry } from "../runtime/nodeRegistry";

export interface ValidationStageResult {
  stage: "Schema" | "Capability" | "Dependency" | "Policy";
  status: "PASSED" | "FAILED";
  details: string;
}

export interface PackageValidationReport {
  packageId: string;
  overallPassed: boolean;
  stages: ValidationStageResult[];
}

// 🕸️ PROGRAM III.3: MULTI-STAGE VALILDATOR PIPELINE
export class WorkflowValidator {
  public validatePackage(pkg: WorkflowPackage): PackageValidationReport {
    const stages: ValidationStageResult[] = [];

    // 1. Schema Validation (Checks syntax structure)
    const hasSteps = pkg.definition.steps && pkg.definition.steps.length > 0;
    stages.push({
      stage: "Schema",
      status: hasSteps ? "PASSED" : "FAILED",
      details: hasSteps ? "Structural fields are intact and complete." : "Step definitions list is empty."
    });

    // 2. Capability Validation (Ensures capabilities are supported by active nodes)
    const activeNodes = activeNodeRegistry.getNodesList();
    const allCapabilities = new Set(activeNodes.flatMap(n => n.capabilities));
    const missing = pkg.metadata.requiredCapabilities.filter(cap => !allCapabilities.has(cap));

    stages.push({
      stage: "Capability",
      status: missing.length === 0 ? "PASSED" : "FAILED",
      details: missing.length === 0
        ? "All required capabilities matching online nodes."
        : `Missing capabilities support: ${missing.join(", ")}`
    });

    // 3. Dependency Validation (Checks DAG acyclic graph dependencies rules)
    const cycles = this.detectCycles(pkg.definition.dependencies);
    stages.push({
      stage: "Dependency",
      status: !cycles ? "PASSED" : "FAILED",
      details: !cycles ? "Dependency step graphs are acyclic (valid DAG)." : "Cyclic loop dependency detected."
    });

    // 4. Policy Validation (Checks compliance metadata rules)
    const authorPresent = !!pkg.metadata.author;
    stages.push({
      stage: "Policy",
      status: authorPresent ? "PASSED" : "FAILED",
      details: authorPresent ? "Author metadata compliance passed." : "Missing package ownership/author metadata."
    });

    const overallPassed = stages.every(s => s.status === "PASSED");

    return {
      packageId: pkg.packageId,
      overallPassed,
      stages
    };
  }

  private detectCycles(dependencies: { from: string; to: string }[]): boolean {
    const adjList = new Map<string, string[]>();
    for (const dep of dependencies) {
      if (!adjList.has(dep.from)) adjList.set(dep.from, []);
      adjList.get(dep.from)!.push(dep.to);
    }

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (node: string): boolean => {
      if (recStack.has(node)) return true;
      if (visited.has(node)) return false;

      visited.add(node);
      recStack.add(node);

      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) return true;
      }

      recStack.delete(node);
      return false;
    };

    for (const node of adjList.keys()) {
      if (dfs(node)) return true;
    }

    return false;
  }
}

export const activeWorkflowValidator = new WorkflowValidator();
