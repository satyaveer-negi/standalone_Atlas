export interface DockerContainerNode {
  id: string;
  name: string;
  image: string;
  status: "running" | "stopped" | "degraded";
  port: string;
  position: [number, number, number];
  cpuUsage: string;
  memUsage: string;
}

export const DEMO_DOCKER_CONTAINERS: DockerContainerNode[] = [
  {
    id: "cnt-web",
    name: "django-web-api",
    image: "python:3.11-slim",
    status: "running",
    port: "8000:8000",
    position: [10, -4, 5],
    cpuUsage: "12.4%",
    memUsage: "184 MB",
  },
  {
    id: "cnt-postgres",
    name: "postgresql-db",
    image: "postgres:15-alpine",
    status: "running",
    port: "5432:5432",
    position: [14, -4, 8],
    cpuUsage: "4.1%",
    memUsage: "312 MB",
  },
  {
    id: "cnt-redis",
    name: "redis-cache",
    image: "redis:7-alpine",
    status: "running",
    port: "6379:6379",
    position: [6, -4, 7],
    cpuUsage: "1.8%",
    memUsage: "42 MB",
  },
  {
    id: "cnt-celery",
    name: "celery-worker",
    image: "python:3.11-slim",
    status: "running",
    port: "N/A",
    position: [12, -4, 12],
    cpuUsage: "8.7%",
    memUsage: "128 MB",
  },
];
