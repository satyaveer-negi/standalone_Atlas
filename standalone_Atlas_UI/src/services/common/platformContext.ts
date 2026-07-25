export interface PlatformContext {
  sessionId: string;
  traceId: string;
  queryId: string;
  correlationId: string;
  userId?: string;
  workspaceId?: string;
  requestTimestamp: number;
}

export function createPlatformContext(queryId = "", traceId = ""): PlatformContext {
  return {
    sessionId: `sess-${Date.now()}`,
    traceId: traceId || `tr-${Date.now()}`,
    queryId: queryId || `q-${Date.now()}`,
    correlationId: `corr-${Math.random().toString(36).substring(2, 9)}`,
    requestTimestamp: Date.now(),
  };
}
