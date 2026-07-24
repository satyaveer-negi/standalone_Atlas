import { SceneGraph } from "../engine/scene/SceneGraph";
import type { GraphArtifactNode, GraphArtifactEdge } from "../engine/scene/SceneGraph";
import { SemanticKnowledgeGraph } from "../engine/scene/SemanticKnowledgeGraph";
import { SceneBuilder } from "../engine/scene/SceneBuilder";
import { SceneDiffEngine } from "../engine/scene/SceneDiffEngine";
import type { Entity } from "../engine/entity/Entity";

export class ProjectAdapter {
  public static buildSemanticGraphFromERP(): SemanticKnowledgeGraph {
    const semGraph = new SemanticKnowledgeGraph();

    const repoEntity: Entity = {
      id: "repo-root",
      name: "Django-React ERP Monolith",
      type: "repository",
      position: [0, 0, 0],
      relationships: [
        { targetId: "sys-frontend", relation: "dependsOn" },
        { targetId: "sys-backend", relation: "dependsOn" },
      ],
      diagnostics: {
        complexity: 42,
        testCoverage: 91.5,
        securityScore: 95,
        couplingRisk: "LOW",
      },
    };
    semGraph.addEntity(repoEntity);

    const frontendEntity: Entity = {
      id: "sys-frontend",
      name: "React 18 SPA Systems",
      type: "system",
      position: [-10.5, 0.5, 6],
      relationships: [{ targetId: "file-tasks-tsx", relation: "imports" }],
      diagnostics: {
        complexity: 58,
        testCoverage: 88.0,
        securityScore: 92,
        couplingRisk: "LOW",
      },
    };
    semGraph.addEntity(frontendEntity);

    const backendEntity: Entity = {
      id: "sys-backend",
      name: "Django REST API Core",
      type: "system",
      position: [14, 0.5, 0],
      relationships: [{ targetId: "file-backend-views-py", relation: "calls" }],
      diagnostics: {
        complexity: 64,
        testCoverage: 94.0,
        securityScore: 89,
        couplingRisk: "MEDIUM",
      },
    };
    semGraph.addEntity(backendEntity);

    const tasksUiEntity: Entity = {
      id: "file-tasks-tsx",
      name: "Tasks.tsx",
      type: "file",
      position: [-14, 0, 8],
      relationships: [{ targetId: "file-backend-views-py", relation: "calls" }],
      diagnostics: {
        complexity: 72,
        testCoverage: 88.4,
        securityScore: 95,
        couplingRisk: "LOW",
      },
    };
    semGraph.addEntity(tasksUiEntity);

    const tasksViewEntity: Entity = {
      id: "file-backend-views-py",
      name: "views.py (TaskViewSet)",
      type: "api",
      position: [18, 0, 2],
      relationships: [{ targetId: "cnt-postgres", relation: "queries" }],
      diagnostics: {
        complexity: 64,
        testCoverage: 92.0,
        securityScore: 88,
        couplingRisk: "MEDIUM",
      },
    };
    semGraph.addEntity(tasksViewEntity);

    const dbEntity: Entity = {
      id: "cnt-postgres",
      name: "postgresql-db",
      type: "database",
      position: [14, -4, 8],
      relationships: [],
      diagnostics: {
        complexity: 30,
        testCoverage: 100,
        securityScore: 98,
        couplingRisk: "LOW",
      },
    };
    semGraph.addEntity(dbEntity);

    return semGraph;
  }

  public static buildSceneGraphFromERP(
    projectsData: any[] = [],
    workspacesData: any[] = [],
    attachmentsData: any[] = []
  ): SceneGraph {
    const sceneGraph = new SceneGraph();

    // 🌟 Level 0: Repository Energy Core
    const repoCore: GraphArtifactNode = {
      id: "repo-root",
      name: "Django-React ERP Monolith",
      category: "repo",
      level: 0,
      health: "healthy",
      position: [0, 0, 0],
      scale: [1.8, 1.8, 1.8],
      color: "#00f0ff",
      parentId: null,
      childrenIds: ["sys-frontend", "sys-backend", "sys-database"],
      aiMetadata: {
        complexityScore: 42,
        dependencyCount: 28,
        couplingRisk: "LOW",
        aiSummary: "Architecturally sound decoupled Django REST framework + React TypeScript SPA.",
        documentationScore: 92,
      },
      gitActivity: {
        lastModified: "2 minutes ago",
        author: "Antigravity AI Pair",
        commitsCount: 142,
      },
    };
    sceneGraph.addNode(repoCore);

    // 🌟 Level 1: Major Systems
    const sysFrontend: GraphArtifactNode = {
      id: "sys-frontend",
      name: "React 18 SPA Systems",
      category: "system",
      level: 1,
      health: "healthy",
      position: [-10.5, 0.5, 6],
      scale: [1.3, 1.3, 1.3],
      color: "#ec4899",
      parentId: "repo-root",
      childrenIds: ["mod-tasks-ui", "mod-projects-ui"],
      aiMetadata: {
        complexityScore: 58,
        dependencyCount: 18,
        couplingRisk: "LOW",
        aiSummary: "Vite + React 18 + Zustand + React Query modular SPA architecture.",
        documentationScore: 95,
      },
      gitActivity: {
        lastModified: "10 mins ago",
        author: "Sarah [Lead Dev]",
        commitsCount: 84,
      },
    };
    sceneGraph.addNode(sysFrontend);

    const sysBackend: GraphArtifactNode = {
      id: "sys-backend",
      name: "Django REST API Core",
      category: "system",
      level: 1,
      health: "modified",
      position: [14, 0.5, 0],
      scale: [1.3, 1.3, 1.3],
      color: "#10b981",
      parentId: "repo-root",
      childrenIds: ["mod-task-manager-api"],
      aiMetadata: {
        complexityScore: 64,
        dependencyCount: 24,
        couplingRisk: "MEDIUM",
        aiSummary: "Django REST Framework ViewSets, Celery async queues, and PostgreSQL DB.",
        documentationScore: 88,
      },
      gitActivity: {
        lastModified: "Just now",
        author: "Alex [Django Core]",
        commitsCount: 92,
      },
    };
    sceneGraph.addNode(sysBackend);

    // Connect edges
    sceneGraph.addEdge({ id: "e1", sourceId: "repo-root", targetId: "sys-frontend", relationType: "contains" });
    sceneGraph.addEdge({ id: "e2", sourceId: "repo-root", targetId: "sys-backend", relationType: "contains" });
    sceneGraph.addEdge({ id: "e3", sourceId: "sys-frontend", targetId: "sys-backend", relationType: "calls" });

    return sceneGraph;
  }
}
