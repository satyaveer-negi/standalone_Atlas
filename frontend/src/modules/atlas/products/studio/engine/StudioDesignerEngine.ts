import type { ArchitectureASTModel, ServiceAST } from "./ArchitectureAST";

export class StudioDesignerEngine {
  private model: ArchitectureASTModel;

  constructor(initialTitle: string = "New Microservice Architecture") {
    this.model = {
      id: `arch-${Date.now()}`,
      title: initialTitle,
      services: [
        { id: "srv-frontend", name: "React Tasks SPA", type: "api" },
        { id: "srv-backend", name: "Django TaskViewSet API", type: "microservice" },
        { id: "srv-db", name: "PostgreSQL Database", type: "database" },
      ],
      relationships: [
        { sourceId: "srv-frontend", targetId: "srv-backend", type: "calls" },
        { sourceId: "srv-backend", targetId: "srv-db", type: "queries" },
      ],
    };
  }

  addService(name: string, type: ServiceAST["type"]) {
    const newId = `srv-${Date.now()}`;
    this.model.services.push({ id: newId, name, type });
    return newId;
  }

  connectNodes(sourceId: string, targetId: string, type: "calls" | "queries" | "reads_cache" = "calls") {
    this.model.relationships.push({ sourceId, targetId, type });
  }

  getModel(): ArchitectureASTModel {
    return this.model;
  }
}
