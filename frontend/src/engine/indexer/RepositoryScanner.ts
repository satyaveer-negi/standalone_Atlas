export interface ScannedFileDescriptor {
  id: string;
  relativePath: string;
  language: "typescript" | "python" | "sql" | "docker";
  sizeBytes: number;
}

export class RepositoryScanner {
  scanWorkspaceRepositories(): ScannedFileDescriptor[] {
    return [
      { id: "file-tasks-tsx", relativePath: "frontend/src/features/tasks/Tasks.tsx", language: "typescript", sizeBytes: 3420 },
      { id: "file-backend-views-py", relativePath: "backend/task_manager/views.py", language: "python", sizeBytes: 2890 },
      { id: "file-backend-serializers-py", relativePath: "backend/task_manager/serializers.py", language: "python", sizeBytes: 1950 },
      { id: "file-dockerfile", relativePath: "docker-compose.yml", language: "docker", sizeBytes: 1200 },
    ];
  }
}
