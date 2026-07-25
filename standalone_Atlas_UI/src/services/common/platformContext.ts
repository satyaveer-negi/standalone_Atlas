export interface PlatformContextIdentity {
  sessionId: string;
  traceId: string;
  queryId: string;
  correlationId: string;
}

export interface PlatformContextExecution {
  requestTimestamp: number;
  workspaceId?: string;
  userId?: string;
  executionMode?: string;
}

export interface PlatformContext {
  identity: PlatformContextIdentity;
  execution: PlatformContextExecution;
}

export function createPlatformContext(queryId = "", traceId = ""): PlatformContext {
  return {
    identity: {
      sessionId: `sess-${Date.now()}`,
      traceId: traceId || `tr-${Date.now()}`,
      queryId: queryId || `q-${Date.now()}`,
      correlationId: `corr-${Math.random().toString(36).substring(2, 9)}`,
    },
    execution: {
      requestTimestamp: Date.now(),
      executionMode: "DIRECTED",
    }
  };
}
