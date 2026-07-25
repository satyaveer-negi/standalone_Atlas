export interface TwinEndpoint {
  protocol: "http" | "https" | "ws" | "wss" | "grpc";
  host: string;
  port: number;
  path: string;
}
