export interface VariablePayload {
  name: string;
  value: any;
  unit: string;
  producerAgent: string;
}

export class StateAdapter {
  private variablesMap = new Map<string, VariablePayload>();

  public writeState(name: string, payload: VariablePayload): void {
    this.variablesMap.set(name, payload);
    console.log(`[State Adapter] Synchronized "${name}" with variable store: value = ${payload.value} ${payload.unit}`);
  }

  public readState(name: string): VariablePayload | null {
    return this.variablesMap.get(name) ?? null;
  }

  public getVariablesList(): VariablePayload[] {
    return Array.from(this.variablesMap.values());
  }
}

export const activeStateAdapter = new StateAdapter();
