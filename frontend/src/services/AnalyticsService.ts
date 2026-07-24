import { MetricsEngine } from "../products/analytics/engine/MetricsEngine";

export class AnalyticsService {
  private metricsEngine: MetricsEngine;

  constructor() {
    this.metricsEngine = new MetricsEngine();
  }

  getMetricsEngine(): MetricsEngine {
    return this.metricsEngine;
  }
}
