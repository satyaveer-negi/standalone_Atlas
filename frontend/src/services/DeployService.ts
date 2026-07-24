import { DeploymentPlanner, type CanonicalDeploymentPlan } from "../products/deploy/engine/DeploymentPlanModel";
import { PREDEFINED_ENVIRONMENTS, type EnvironmentType } from "../products/deploy/engine/EnvironmentModel";

export class DeployService {
  private planner: DeploymentPlanner;

  constructor() {
    this.planner = new DeploymentPlanner();
  }

  getEnvironments() {
    return PREDEFINED_ENVIRONMENTS;
  }

  createPlan(env: EnvironmentType): CanonicalDeploymentPlan {
    return this.planner.createCanonicalPlan(
      {
        id: "ast-101",
        title: "ERP Microservices System",
        services: [
          { id: "srv-frontend", name: "React Tasks SPA", type: "api" },
          { id: "srv-backend", name: "Django TaskViewSet REST", type: "microservice" },
          { id: "srv-db", name: "PostgreSQL Database", type: "database" },
        ],
        relationships: [],
      },
      env
    );
  }
}
