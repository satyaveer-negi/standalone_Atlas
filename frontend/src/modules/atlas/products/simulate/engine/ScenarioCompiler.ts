import type { ChangeSet } from "./ChangeSet";

export class ScenarioCompiler {
  compileRemoveEntityScenario(entityId: string): ChangeSet {
    return {
      id: `cs-remove-${entityId}`,
      name: `Scenario: Remove ${entityId}`,
      operations: [
        {
          type: "REMOVE_ENTITY",
          targetEntityId: entityId,
        },
      ],
    };
  }
}
