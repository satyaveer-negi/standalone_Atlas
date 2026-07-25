import { WorkflowDefinition, WorkflowInstance, WorkflowStep, WorkflowState, StepState } from "./workflowDefinition";
import { activeRuntimeScheduler } from "../runtime/scheduler";
import { activeExecutionManager } from "../runtime/executionManager";

// 🕸️ PROGRAM III.0: GENERALIZED WORKFLOW ORCHESTRATOR ENGINE
export class WorkflowEngine {
  private templates = new Map<string, WorkflowDefinition>();
  private instances = new Map<string, WorkflowInstance>();

  constructor() {
    this.seedTemplates();
  }

  private seedTemplates() {
    // 1. CFD mesh & solve pipeline Template
    this.templates.set("wf-cfd", {
      workflowId: "wf-cfd",
      name: "CFD Simulation DAG Pipeline",
      description: "Generates mesh coordinates, runs finite volumes solver, and compiles results",
      version: "1.2.0",
      tags: ["CFD", "OpenFOAM"],
      steps: [
        { stepId: "mesh", name: "Generate Mesh Geometry", capability: "exportMesh", state: "Ready", retries: 0 },
        { stepId: "solve", name: "Numerical Navier-Stokes Solving", capability: "triggerSolver", state: "Pending", retries: 0 },
        { stepId: "report", name: "Compile PDF Documentation Report", capability: "editManuscript", state: "Pending", retries: 0 }
      ],
      dependencies: [
        { from: "mesh", to: "solve" },
        { from: "solve", to: "report" }
      ]
    });

    // 2. Data Analytics template
    this.templates.set("wf-data", {
      workflowId: "wf-data",
      name: "Scientific Script Analysis Pipeline",
      description: "Runs script arrays computing matrices and exports doc layout file",
      version: "1.0.4",
      tags: ["Python", "ONLYOFFICE"],
      steps: [
        { stepId: "script", name: "Python Array Evaluation", capability: "executeScript", state: "Ready", retries: 0 },
        { stepId: "doc", name: "Document Page Layout Compilation", capability: "editManuscript", state: "Pending", retries: 0 }
      ],
      dependencies: [
        { from: "script", to: "doc" }
      ]
    });
  }

  public getTemplatesList(): WorkflowDefinition[] {
    return Array.from(this.templates.values());
  }

  public getInstancesList(): WorkflowInstance[] {
    return Array.from(this.instances.values());
  }

  public createInstance(defId: string): WorkflowInstance {
    const template = this.templates.get(defId);
    if (!template) throw new Error(`Template not found: ${defId}`);

    const instanceId = `inst-${Date.now()}`;
    const instance: WorkflowInstance = {
      instanceId,
      definitionId: defId,
      state: "Draft",
      steps: template.steps.map(s => ({ ...s, state: "Pending" })),
      activeNodeCount: 0
    };

    // Initialize first steps to Ready
    instance.steps[0].state = "Ready";

    this.instances.set(instanceId, instance);
    console.log(`[Workflow Engine] Created workflow instance "${instanceId}" from definition "${defId}"`);
    return instance;
  }

  public async runInstanceStep(instanceId: string, stepId: string): Promise<void> {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    const step = instance.steps.find(s => s.stepId === stepId);
    if (!step || step.state !== "Ready") return;

    instance.state = "Running";
    step.state = "Running";

    // 1. Scheduler Node Selection
    const selectedNode = activeRuntimeScheduler.scheduleTask(step.capability);
    step.assignedNode = selectedNode.name;
    instance.activeNodeCount = 1;

    console.log(`[Workflow Engine] Step "${stepId}" scheduled on node: "${selectedNode.name}"`);

    // 2. Dispatch to Execution Manager
    try {
      const adapterKey = selectedNode.nodeId === "node-local" ? "openfoam" : "python";
      const start = Date.now();
      await activeExecutionManager.executeJob(adapterKey, `run-step-${stepId}`);
      step.elapsedTimeMs = Date.now() - start;
      step.state = "Completed";

      // Enable dependent steps
      const template = this.templates.get(instance.definitionId);
      if (template) {
        const nextSteps = template.dependencies.filter(d => d.from === stepId).map(d => d.to);
        for (const nsId of nextSteps) {
          const ns = instance.steps.find(s => s.stepId === nsId);
          if (ns) ns.state = "Ready";
        }
      }

      // Check if all steps completed
      const activePending = instance.steps.some(s => s.state !== "Completed");
      if (!activePending) {
        instance.state = "Completed";
      }
    } catch (err) {
      step.state = "Failed";
      instance.state = "Failed";
    }
  }
}

export const activeWorkflowEngine = new WorkflowEngine();
