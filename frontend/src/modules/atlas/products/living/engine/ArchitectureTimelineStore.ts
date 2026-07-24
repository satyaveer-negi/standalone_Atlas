export interface ArchitectureRevisionSnapshot {
  commitHash: string;
  author: string;
  message: string;
  timestamp: number;
  componentsCount: number;
}

export const ARCHITECTURE_REVISIONS: ArchitectureRevisionSnapshot[] = [
  {
    commitHash: "c4f801a",
    author: "Alex Dev",
    message: "feat: Add Redis caching tier to Django REST backend",
    timestamp: Date.now() - 86400000 * 2,
    componentsCount: 4,
  },
  {
    commitHash: "b3a901f",
    author: "Sarah Architect",
    message: "initial: Monolith setup with React SPA and Django TaskViewSet",
    timestamp: Date.now() - 86400000 * 14,
    componentsCount: 3,
  },
];
