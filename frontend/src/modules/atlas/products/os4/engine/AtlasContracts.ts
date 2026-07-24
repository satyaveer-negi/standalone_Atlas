export interface IEntity {
  id: string;
  name: string;
  type: string;
  components: Map<string, any>;
  version: string;
  createdAt: number;
}

export interface IComponent {
  type: string;
  properties: Record<string, any>;
}

export interface ISystem {
  name: string;
  update(entities: IEntity[], deltaTime: number): void;
}

export interface IKernel {
  initialize(): void;
  registerSystem(system: ISystem): void;
  step(deltaTime: number): void;
}

export interface IAgent {
  id: string;
  name: string;
  domain: string;
  executeTask(task: string, context: Record<string, any>): Promise<Record<string, any>>;
}

export interface ISimulationProvider {
  id: string;
  name: string;
  domainCapabilities: string[];
  runSimulation(scenarioId: string, parameters: Record<string, any>): Record<string, any>;
}

export interface IArtifact {
  uuid: string;
  type: string;
  version: string;
  owner: string;
  metadata: Record<string, any>;
  storageLocation: string;
}
