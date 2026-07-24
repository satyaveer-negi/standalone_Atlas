import { AtlasIntermediateRepresentation } from "./atlasIntermediateRepresentation";

export interface EntityType {
  name: string;
  fields: string[];
  relationships: { target: string; type: string }[];
}

export interface DomainOntology {
  entities: EntityType[];
  states: Record<string, string[]>;
  vocabulary: Record<string, string>;
}

export interface Capability {
  name: string;
  type: "command" | "query";
  schema?: any;
}

export interface DomainPack {
  systemId: string;
  version: string;
  ontology: DomainOntology;
  capabilities: Capability[];
  viewConfig: {
    themeColor: string;
    particleSpeed: number;
    showDigitalTwin: boolean;
    defaultDashboard: string;
  };
}

export const DOMAIN_PACKS: Record<string, DomainPack> = {
  openfoam: {
    systemId: "openfoam",
    version: "1.2",
    ontology: {
      entities: [
        { name: "SimulationRun", fields: ["runId", "solver", "meshDensity"], relationships: [{ target: "Mesh", type: "uses" }] },
        { name: "Mesh", fields: ["cellsCount", "skewness"], relationships: [] },
        { name: "BoundaryCondition", fields: ["type", "value"], relationships: [{ target: "SimulationRun", type: "applies_to" }] },
      ],
      states: {
        SimulationRun: ["QUEUED", "MESHING", "SOLVING", "COMPLETE"],
      },
      vocabulary: {
        primaryEntity: "Simulation",
        groupName: "Design Study",
        activity: "Solver Run",
      },
    },
    capabilities: [
      { name: "triggerSolver", type: "command" },
      { name: "getResiduals", type: "query" },
    ],
    viewConfig: {
      themeColor: "#06b6d4",
      particleSpeed: 1.8,
      showDigitalTwin: true,
      defaultDashboard: "Mesh Residuals",
    },
  },
  jira: {
    systemId: "jira",
    version: "4.0",
    ontology: {
      entities: [
        { name: "Issue", fields: ["id", "summary", "priority"], relationships: [{ target: "Sprint", type: "belongs_to" }] },
        { name: "Sprint", fields: ["startDate", "endDate"], relationships: [] },
        { name: "Epic", fields: ["name", "color"], relationships: [{ target: "Issue", type: "groups" }] },
      ],
      states: {
        Issue: ["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"],
      },
      vocabulary: {
        primaryEntity: "Task",
        groupName: "Sprint",
        activity: "Development Cycle",
      },
    },
    capabilities: [
      { name: "updateTicketStatus", type: "command" },
      { name: "assignDeveloper", type: "command" },
    ],
    viewConfig: {
      themeColor: "#4f46e5",
      particleSpeed: 0.8,
      showDigitalTwin: false,
      defaultDashboard: "Sprint Velocity",
    },
  },
  literature: {
    systemId: "narrative_analyst",
    version: "2.1",
    ontology: {
      entities: [
        { name: "Novel", fields: ["title", "wordCount", "genre"], relationships: [{ target: "Author", type: "written_by" }] },
        { name: "Character", fields: ["name", "role", "archetype"], relationships: [{ target: "Novel", type: "appears_in" }] },
        { name: "Theme", fields: ["name", "motifCount"], relationships: [{ target: "Novel", type: "explored_in" }] },
      ],
      states: {
        Novel: ["OUTLINING", "DRAFTING", "EDITING", "TRANSLATING", "PUBLISHED"],
      },
      vocabulary: {
        primaryEntity: "Manuscript",
        groupName: "Narrative Arc",
        activity: "Literary Analysis",
      },
    },
    capabilities: [
      { name: "analyzeThemes", type: "query" },
      { name: "translateManuscript", type: "command" },
    ],
    viewConfig: {
      themeColor: "#e11d48",
      particleSpeed: 0.5,
      showDigitalTwin: false,
      defaultDashboard: "Narrative Sentiment Map",
    },
  },
};

// 🛠️ PROGRAM H1: KNOWLEDGE COMPILER
export class KnowledgeCompiler {
  public compile(pack: DomainPack): AtlasIntermediateRepresentation {
    console.log(`[H1 Compiler] Parsing manifest for "${pack.systemId}"...`);
    const air = new AtlasIntermediateRepresentation(pack.systemId, pack.version);

    // 1. Compile Ontology & Vocabularies
    pack.ontology.entities.forEach((entity) => {
      air.semantic.nodes.push({
        id: entity.name,
        type: "EntityDefinition",
        label: entity.name,
        properties: { fields: entity.fields },
      });
      entity.relationships.forEach((rel) => {
        air.semantic.edges.push({
          sourceId: entity.name,
          targetId: rel.target,
          type: rel.type,
        });
      });
    });

    // 2. Compile Capabilities
    pack.capabilities.forEach((cap) => {
      if (cap.type === "command") {
        air.capability.commands.push({ name: cap.name, endpoint: `/api/${cap.name}`, parameters: [] });
      } else {
        air.capability.queries.push({ name: cap.name, endpoint: `/api/${cap.name}`, parameters: [] });
      }
    });

    // 3. Compile Workflows & Policies
    air.workflow.states = pack.ontology.states;
    air.policy.safetyRules = {
      defaultThrottle: "10/minute",
      systemId: pack.systemId,
    };

    // 4. Compile Visualization
    air.visualization = {
      themeColor: pack.viewConfig.themeColor,
      particleSpeed: pack.viewConfig.particleSpeed,
      hudLayout: pack.viewConfig.showDigitalTwin ? "digital-twin" : "flat",
      icons: [],
    };

    // 5. Optimize AIR
    air.optimize();

    return air;
  }
}

// 🌐 PROGRAM H2: KNOWLEDGE RUNTIME
export class KnowledgeRuntime {
  private compiler = new KnowledgeCompiler();
  private loadedPackages = new Map<string, AtlasIntermediateRepresentation>();
  private activeSystemId = "openfoam";
  private listeners: ((air: AtlasIntermediateRepresentation) => void)[] = [];

  constructor() {
    this.loadPackage("openfoam");
  }

  public registerListener(callback: (air: AtlasIntermediateRepresentation) => void) {
    this.listeners.push(callback);
    const active = this.loadedPackages.get(this.activeSystemId);
    if (active) callback(active);
  }

  public loadPackage(systemId: string): void {
    const pack = DOMAIN_PACKS[systemId];
    if (!pack) return;

    // Trigger Compilation toolchain
    const compiledAIR = this.compiler.compile(pack);
    this.loadedPackages.set(systemId, compiledAIR);
    this.activeSystemId = systemId;

    console.log(`[H2 Runtime] Loaded package "${systemId}" v${pack.version} successfully.`);
    this.listeners.forEach((listener) => listener(compiledAIR));
  }

  public getActiveAIR(): AtlasIntermediateRepresentation | undefined {
    return this.loadedPackages.get(this.activeSystemId);
  }
}

export const activeKnowledgeRuntime = new KnowledgeRuntime();
