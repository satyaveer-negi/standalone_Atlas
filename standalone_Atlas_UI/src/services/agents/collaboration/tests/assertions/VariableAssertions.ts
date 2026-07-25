import { VariableStore } from "../../graph/VariableStore";

export class VariableAssertions {
  public assertUnitPreservation(store: VariableStore): { passed: boolean; message: string } {
    store.clear();
    store.publishVariable("temperature", "number", "Kelvin", 300, "Verifier");
    
    const variable = store.getVariable("temperature");
    if (variable && variable.unit === "Kelvin") {
      return { passed: true, message: `Variable published successfully and unit "Kelvin" was preserved.` };
    }
    return { passed: false, message: `Variable unit mismatch or variable not found.` };
  }

  public assertTypeVerification(store: VariableStore): { passed: boolean; message: string } {
    store.clear();
    store.publishVariable("activeFlag", "boolean", "None", true, "Verifier");

    const variable = store.getVariable("activeFlag");
    if (variable && typeof variable.value === "boolean") {
      return { passed: true, message: "Variable published type matches boolean definition." };
    }
    return { passed: false, message: "Variable type verification assertion failed." };
  }
}
