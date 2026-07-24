export interface HealthTrendForecast {
  metricName: string;
  historicalValue: number;
  currentValue: number;
  projected30DayValue: number;
  healthDirection: "IMPROVING" | "STABLE" | "DEGRADED";
}

export class TrendEngine {
  computeForecasts(): HealthTrendForecast[] {
    return [
      { metricName: "Architecture Complexity Score", historicalValue: 42, currentValue: 48, projected30DayValue: 54, healthDirection: "STABLE" },
      { metricName: "Tech Debt Index", historicalValue: 38, currentValue: 24, projected30DayValue: 18, healthDirection: "IMPROVING" },
      { metricName: "Deployment Stability Index", historicalValue: 84, currentValue: 92, projected30DayValue: 96, healthDirection: "IMPROVING" },
    ];
  }
}
