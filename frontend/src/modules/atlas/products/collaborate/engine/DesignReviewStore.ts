export interface ThreadComment {
  id: string;
  author: string;
  text: string;
  timestamp: number;
}

export interface ReviewThread {
  id: string;
  targetNodeId: string;
  title: string;
  comments: ThreadComment[];
  status: "OPEN" | "RESOLVED" | "APPROVED";
  approvals: string[];
}

export const DEMO_REVIEW_THREADS: ReviewThread[] = [
  {
    id: "rev-001",
    targetNodeId: "srv-backend",
    title: "Review: Add Redis Caching Layer for TaskViewSet",
    comments: [
      {
        id: "c-1",
        author: "Sarah Architect",
        text: "Should we add a Redis caching tier before scaling out Django ViewSets?",
        timestamp: Date.now() - 3600000,
      },
    ],
    status: "OPEN",
    approvals: ["Alex Dev (Lead)"],
  },
];
