import { HealthAnalyzer } from "./HealthAnalyzer";
import { AnomalyDetector, AnomalyRecord } from "./AnomalyDetector";
import { PredictionEngine } from "./PredictionEngine";
import { RecommendationEngine } from "./RecommendationEngine";
import { activeTwinStateEngine } from "../state/TwinStateEngine";
import { activeTwinRepository } from "../core/TwinRepository";
import { TwinState } from "../state/TwinState";

export interface IntelligentDiagnosis {
  twinId: string;
  healthScore: number;
  anomaliesList: AnomalyRecord[];
  recommendations: string[];
  projectedMetrics: Record<string, any>;
}

export class TwinIntelligence {
  private health = new HealthAnalyzer();
  private detector = new AnomalyDetector();
  private prediction = new PredictionEngine();
  private recommendation = new RecommendationEngine();

  public diagnoseTwin(twinId: string): IntelligentDiagnosis {
    const twin = activeTwinRepository.getTwin(twinId);
    const activeStates: TwinState[] = [];
    const projectedMetrics: Record<string, any> = {};

    if (twin) {
      twin.entities.forEach(ent => {
        Object.keys(ent.properties).forEach(prop => {
          const stateVal = activeTwinStateEngine.getLatestProperty(twinId, ent.id, prop);
          if (stateVal) {
            activeStates.push(stateVal);

            // Compute forecast
            const history = activeTwinStateEngine.getPropertyHistory(twinId, ent.id, prop);
            const nextVal = this.prediction.forecastFutureTrend(history);
            if (nextVal !== null) {
              projectedMetrics[prop] = nextVal;
            }
          }
        });
      });
    }

    const score = this.health.evaluateHealthScore(activeStates);
    const anomalies = this.detector.scanForAnomalies(activeStates);
    const recommendations = this.recommendation.compileRecommendations(anomalies);

    return {
      twinId,
      healthScore: score,
      anomaliesList: anomalies,
      recommendations,
      projectedMetrics
    };
  }
}

export const activeTwinIntelligence = new TwinIntelligence();
