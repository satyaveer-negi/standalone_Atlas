import { PlatformHealthMetrics, type PlatformHealthTelemetry } from "./PlatformHealthMetrics";

export interface GovernanceRuleConfig {
  maxTypescriptErrors: number;
  maxDjangoSystemIssues: number;
  minUnitCoveragePct: number;
  minIntegrationCoveragePct: number;
  maxTwinLatencyMs: number;
  minPredictionCalibrationPct: number;
  maxCircularDependencies: number;
}

export const DEFAULT_GOVERNANCE_CONFIG: GovernanceRuleConfig = {
  maxTypescriptErrors: 0,
  maxDjangoSystemIssues: 0,
  minUnitCoveragePct: 90.0,
  minIntegrationCoveragePct: 90.0,
  maxTwinLatencyMs: 25,
  minPredictionCalibrationPct: 95.0,
  maxCircularDependencies: 0,
};

export interface ReleaseQualityGateResult {
  typescriptCheckPassed: boolean;
  djangoCheckPassed: boolean;
  unitCoveragePassed: boolean;
  integrationCoveragePassed: boolean;
  twinLatencyPassed: boolean;
  predictionCalibrationPassed: boolean;
  noCircularDependencies: boolean;
  releaseCandidateStatus: "APPROVED_FOR_RELEASE" | "REJECTED";
}

export class PlatformGovernance {
  private metricsEngine = new PlatformHealthMetrics();

  evaluateReleaseQualityGates(customConfig?: Partial<GovernanceRuleConfig>): ReleaseQualityGateResult {
    const config: GovernanceRuleConfig = { ...DEFAULT_GOVERNANCE_CONFIG, ...customConfig };
    const telemetry: PlatformHealthTelemetry = this.metricsEngine.getPlatformHealth();

    const tsPassed = telemetry.codeHealth.typescriptErrors <= config.maxTypescriptErrors;
    const djangoPassed = telemetry.codeHealth.djangoSystemIssues <= config.maxDjangoSystemIssues;
    const unitPassed = telemetry.testHealth.unitTestCoveragePct >= config.minUnitCoveragePct;
    const intPassed = telemetry.testHealth.integrationTestCoveragePct >= config.minIntegrationCoveragePct;
    const latencyPassed = telemetry.platformMetrics.twinSyncLatencyMs <= config.maxTwinLatencyMs;
    const calibrationPassed = telemetry.platformMetrics.predictionCalibrationPct >= config.minPredictionCalibrationPct;
    const noCirc = telemetry.codeHealth.circularDependenciesCount <= config.maxCircularDependencies;

    const overall = tsPassed && djangoPassed && unitPassed && intPassed && latencyPassed && calibrationPassed && noCirc;

    return {
      typescriptCheckPassed: tsPassed,
      djangoCheckPassed: djangoPassed,
      unitCoveragePassed: unitPassed,
      integrationCoveragePassed: intPassed,
      twinLatencyPassed: latencyPassed,
      predictionCalibrationPassed: calibrationPassed,
      noCircularDependencies: noCirc,
      releaseCandidateStatus: overall ? "APPROVED_FOR_RELEASE" : "REJECTED",
    };
  }
}
