import { TwinState } from "../state/TwinState";

export class PredictionEngine {
  public forecastFutureTrend(history: TwinState[]): any {
    if (history.length === 0) return null;
    
    // Heuristic projection: extrapolate next value from slope of last two elements
    if (history.length >= 2) {
      const v1 = history[history.length - 2].value;
      const v2 = history[history.length - 1].value;
      if (typeof v1 === "number" && typeof v2 === "number") {
        const slope = v2 - v1;
        return v2 + slope;
      }
    }
    return history[history.length - 1].value;
  }
}
