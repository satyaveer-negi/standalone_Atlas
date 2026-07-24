export interface WorkspaceRepository {
  id: string;
  name: string;
  path: string;
  type: "frontend" | "backend" | "microservice" | "docs" | "infra";
}

export interface WorkspaceService {
  id: string;
  name: string;
  endpoint: string;
  type: "web" | "database" | "cache" | "queue";
}

export interface WorkspaceContext {
  id: string;
  name: string;
  repositories: WorkspaceRepository[];
  services: WorkspaceService[];
  environments: ("development" | "staging" | "production")[];
}

export class WorkspaceManager {
  private activeWorkspace: WorkspaceContext;

  constructor(initialWorkspace?: WorkspaceContext) {
    this.activeWorkspace = initialWorkspace || {
      id: "ws-default",
      name: "ERP Monolith Workspace",
      repositories: [
        { id: "repo-frontend", name: "frontend", path: "frontend/src", type: "frontend" },
        { id: "repo-backend", name: "backend", path: "backend/task_manager", type: "backend" },
      ],
      services: [
        { id: "svc-web", name: "Django REST API", endpoint: "http://localhost:8000", type: "web" },
        { id: "svc-db", name: "PostgreSQL DB", endpoint: "localhost:5432", type: "database" },
      ],
      environments: ["development"],
    };
  }

  getWorkspace(): WorkspaceContext {
    return this.activeWorkspace;
  }

  setWorkspace(workspace: WorkspaceContext) {
    this.activeWorkspace = workspace;
  }
}
