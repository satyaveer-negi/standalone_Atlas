export interface OperationalPolicy {
  voltageLimitMax: number;
  temperatureLimitMax: number;
  notificationChannels: string[];
  reassessmentFrequencySeconds: number;
  autoReevaluateDecision: boolean;
}

export class RuntimePolicyEngine {
  private activePolicy: OperationalPolicy = {
    voltageLimitMax: 120,
    temperatureLimitMax: 350,
    notificationChannels: ["email", "teams-webhook", "operator-hud"],
    reassessmentFrequencySeconds: 5,
    autoReevaluateDecision: true
  };

  public getPolicy(): OperationalPolicy {
    return this.activePolicy;
  }

  public updatePolicy(newPolicy: Partial<OperationalPolicy>): void {
    this.activePolicy = { ...this.activePolicy, ...newPolicy };
  }
}

export const activeRuntimePolicyEngine = new RuntimePolicyEngine();
