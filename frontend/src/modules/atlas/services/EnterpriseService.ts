import { DEMO_ORGANIZATIONS } from "../products/enterprise/engine/MultiTenantStore";
import { RBACEngine } from "../products/enterprise/engine/RBACEngine";

export class EnterpriseService {
  private rbacEngine: RBACEngine;

  constructor() {
    this.rbacEngine = new RBACEngine();
  }

  getOrganizations() {
    return DEMO_ORGANIZATIONS;
  }

  getRBACEngine(): RBACEngine {
    return this.rbacEngine;
  }
}
