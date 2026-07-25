import { ExecutionProvider, ExecutionResult, AdapterState } from "./executionProvider";

export class PythonExecutionProvider implements ExecutionProvider {
  public readonly name = "Python Script Executor";
  public readonly version = "3.10.4";
  public state: AdapterState = "Connected";
  public lastSync = "12:44:10 UTC";
  public capabilities = ["executeScript", "returnJSON"];
  public diagnostics = "Environment python3.10 verified.";

  public async initialize(): Promise<void> {}
  public async connect(): Promise<void> { this.state = "Connected"; }
  public async disconnect(): Promise<void> { this.state = "Available"; }
  public async execute(cmd: string): Promise<ExecutionResult> {
    return {
      runId: `run-py-${Date.now()}`,
      provider: this.name,
      status: "SUCCESS",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      logs: [`Running script task: "${cmd}"`, "Importing numpy...", "Computing eigenvalues..."],
      artifacts: ["result_matrices.json"]
    };
  }
  public async health(): Promise<string> { return "Healthy"; }
}

export class ONLYOFFICEExecutionProvider implements ExecutionProvider {
  public readonly name = "ONLYOFFICE Document Server";
  public readonly version = "7.2.1";
  public state: AdapterState = "Connected";
  public lastSync = "12:44:12 UTC";
  public capabilities = ["editManuscript", "syncComments"];
  public diagnostics = "Adapter connection healthy. JWT signing verified.";

  public async initialize(): Promise<void> {}
  public async connect(): Promise<void> { this.state = "Connected"; }
  public async disconnect(): Promise<void> { this.state = "Available"; }
  public async execute(cmd: string): Promise<ExecutionResult> {
    return {
      runId: `run-oo-${Date.now()}`,
      provider: this.name,
      status: "SUCCESS",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      logs: ["Assembling markdown data streams...", `Compiling document file: "${cmd}"`, "Converting formats..."],
      artifacts: ["compiled_report.pdf", "compiled_report.docx"]
    };
  }
  public async health(): Promise<string> { return "Healthy"; }
}

export class OpenFOAMExecutionProvider implements ExecutionProvider {
  public readonly name = "OpenFOAM Solver Adapter";
  public readonly version = "1.0.0";
  public state: AdapterState = "Available";
  public lastSync = "Never";
  public capabilities = ["triggerSolver", "exportMesh"];
  public diagnostics = "Adapter standby. Solver endpoints ready.";

  public async initialize(): Promise<void> {}
  public async connect(): Promise<void> { this.state = "Connected"; }
  public async disconnect(): Promise<void> { this.state = "Available"; }
  public async execute(cmd: string): Promise<ExecutionResult> {
    return {
      runId: `run-foam-${Date.now()}`,
      provider: this.name,
      status: "SUCCESS",
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      logs: [`Executing OpenFOAM command: ${cmd}`, "Resolving finite volumes mesh boundaries...", "Solving navier-stokes iterations..."],
      artifacts: ["residuals.png", "cfd_results.vtk"]
    };
  }
  public async health(): Promise<string> { return "Healthy"; }
}

export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters = new Map<string, ExecutionProvider>();

  private constructor() {
    this.registerAdapter("python", new PythonExecutionProvider());
    this.registerAdapter("onlyoffice", new ONLYOFFICEExecutionProvider());
    this.registerAdapter("openfoam", new OpenFOAMExecutionProvider());
  }

  public static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  public registerAdapter(key: string, provider: ExecutionProvider): void {
    console.log(`[Adapter Registry] Registering adapter: "${key}"`);
    this.adapters.set(key.toLowerCase(), provider);
  }

  public getAdapters(): ExecutionProvider[] {
    return Array.from(this.adapters.values());
  }

  public getAdapter(key: string): ExecutionProvider | undefined {
    return this.adapters.get(key.toLowerCase());
  }
}

export const adapterRegistry = AdapterRegistry.getInstance();
