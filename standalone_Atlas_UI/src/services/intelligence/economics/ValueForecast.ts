export interface ForecastPoint {
  year: number;
  projectedSavings: number;
  projectedRevenue: number;
  projectedCostAvoidance: number;
  confidence: number;
}

export interface ValueForecast {
  forecastId: string;
  roadmapId: string;
  horizonYears: number;
  forecastPoints: ForecastPoint[];
  assumptions: string[];
  lastUpdated: string;
}
