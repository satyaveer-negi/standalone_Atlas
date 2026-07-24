export interface SubsystemMetrics {
  compilerTimeMs: number;
  runtimeBootTimeMs: number;
  eventBusQueueDepth: number;
  akgQueryLatencyMs: number;
  renderFps: number;
  memoryUsageMb: number;
}

// 📊 PROGRAM H6: PERFORMANCE PROFILER
export class PerformanceProfiler {
  private history: SubsystemMetrics[] = [];

  constructor() {
    this.recordMetrics({
      compilerTimeMs: 1040,
      runtimeBootTimeMs: 400,
      eventBusQueueDepth: 12,
      akgQueryLatencyMs: 18,
      renderFps: 60,
      memoryUsageMb: 242,
    });
  }

  public recordMetrics(metrics: SubsystemMetrics): void {
    this.history.unshift(metrics);
    if (this.history.length > 50) {
      this.history.pop();
    }
  }

  public getLiveMetrics(): SubsystemMetrics {
    return this.history[0] || {
      compilerTimeMs: 0,
      runtimeBootTimeMs: 0,
      eventBusQueueDepth: 0,
      akgQueryLatencyMs: 0,
      renderFps: 0,
      memoryUsageMb: 0,
    };
  }

  public getHistoryTrends(): SubsystemMetrics[] {
    return this.history;
  }
}

export const activePerformanceProfiler = new PerformanceProfiler();
