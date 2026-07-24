import { DomainPack } from "../services/ontologyEngine";

// 📦 REFERENCE KNOWLEDGE SYSTEM PACKS: Tier Scaffolding
export const REFERENCE_PACKS: Record<string, DomainPack> = {
  software: {
    systemId: "software",
    version: "1.0.0",
    ontology: {
      entities: [
        { name: "Repository", fields: ["url", "branch"], relationships: [] },
        { name: "Commit", fields: ["sha", "message", "author"], relationships: [{ target: "Repository", type: "pushed_to" }] },
        { name: "Issue", fields: ["id", "title", "status"], relationships: [{ target: "Commit", type: "resolves" }] },
      ],
      states: {
        Issue: ["OPEN", "IN_PROGRESS", "MERGING", "CLOSED"],
      },
      vocabulary: {
        primaryEntity: "Repository",
        groupName: "Workspace",
        activity: "Software Build Pipeline",
      },
    },
    capabilities: [
      { name: "triggerBuild", type: "command" },
      { name: "checkLints", type: "query" },
    ],
    viewConfig: {
      themeColor: "#10b981", // Emerald Green
      particleSpeed: 1.2,
      showDigitalTwin: false,
      defaultDashboard: "Deployment Diagnostics",
    },
  },
  openfoam: {
    systemId: "openfoam",
    version: "1.2.0",
    ontology: {
      entities: [
        { name: "SimulationRun", fields: ["runId", "solver"], relationships: [] },
        { name: "Mesh", fields: ["cellsCount", "skewness"], relationships: [] },
      ],
      states: {
        SimulationRun: ["QUEUED", "MESHING", "SOLVING", "COMPLETE"],
      },
      vocabulary: {
        primaryEntity: "Simulation",
        groupName: "Design Study",
        activity: "Fluid Solver Run",
      },
    },
    capabilities: [
      { name: "triggerSolver", type: "command" },
      { name: "getResiduals", type: "query" },
    ],
    viewConfig: {
      themeColor: "#06b6d4", // Cyan
      particleSpeed: 1.8,
      showDigitalTwin: true,
      defaultDashboard: "Mesh Residuals",
    },
  },
  literature: {
    systemId: "literature",
    version: "2.1.0",
    ontology: {
      entities: [
        { name: "Manuscript", fields: ["title", "genre"], relationships: [] },
        { name: "Character", fields: ["name", "archetype"], relationships: [{ target: "Manuscript", type: "belongs_to" }] },
      ],
      states: {
        Manuscript: ["OUTLINING", "DRAFTING", "REVISING", "PUBLISHED"],
      },
      vocabulary: {
        primaryEntity: "Manuscript",
        groupName: "Narrative Theme",
        activity: "Narrative Arc Analysis",
      },
    },
    capabilities: [
      { name: "analyzeThemes", type: "query" },
    ],
    viewConfig: {
      themeColor: "#f43f5e", // Rose Pink
      particleSpeed: 0.6,
      showDigitalTwin: false,
      defaultDashboard: "Narrative Sentiment Map",
    },
  },
  research: {
    systemId: "research",
    version: "1.0.0",
    ontology: {
      entities: [
        { name: "Paper", fields: ["title", "authors", "journal"], relationships: [] },
        { name: "Citation", fields: ["citesPaperId", "cryptedHash"], relationships: [{ target: "Paper", type: "references" }] },
        { name: "Dataset", fields: ["url", "checksum"], relationships: [{ target: "Paper", type: "backing_data" }] },
      ],
      states: {
        Paper: ["DRAFT", "UNDER_REVIEW", "ACCEPTED", "PUBLISHED"],
      },
      vocabulary: {
        primaryEntity: "Paper",
        groupName: "Research Project",
        activity: "Literature Review",
      },
    },
    capabilities: [
      { name: "verifyChecksums", type: "query" },
    ],
    viewConfig: {
      themeColor: "#eab308", // Yellow
      particleSpeed: 0.9,
      showDigitalTwin: false,
      defaultDashboard: "Citation Network Graph",
    },
  },
  education: {
    systemId: "education",
    version: "1.5.0",
    ontology: {
      entities: [
        { name: "Course", fields: ["id", "title", "difficulty"], relationships: [] },
        { name: "Lesson", fields: ["title", "content"], relationships: [{ target: "Course", type: "contained_in" }] },
      ],
      states: {
        Course: ["PLANNING", "REVIEWING", "PUBLISHED", "ARCHIVED"],
      },
      vocabulary: {
        primaryEntity: "Course",
        groupName: "Learning Path",
        activity: "Competency Mapping",
      },
    },
    capabilities: [
      { name: "evaluateAssessments", type: "command" },
    ],
    viewConfig: {
      themeColor: "#3b82f6", // Blue
      particleSpeed: 1.0,
      showDigitalTwin: false,
      defaultDashboard: "Student Progress Map",
    },
  },
};
