export interface MissionCheckpoint {
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface LearningMissionTemplate {
  id: string;
  title: string;
  description: string;
  conceptId: string;
  stops: string[];
  linkedAdrId: string;
  checkpoint: MissionCheckpoint;
}

export const PREDEFINED_LEARNING_MISSIONS: LearningMissionTemplate[] = [
  {
    id: "miss-task-flow",
    title: "Understand Task Creation Walkthrough",
    description: "Step-by-step 3D graph walkthrough from React Tasks UI to PostgreSQL table persistence.",
    conceptId: "concept-task-creation",
    stops: ["file-tasks-tsx", "sys-backend", "postgresql-db"],
    linkedAdrId: "adr-001-clean-arch",
    checkpoint: {
      question: "Which layer handles task dispatch before DB persistence?",
      options: ["React Component", "Django TaskViewSet", "PostgreSQL Trigger"],
      correctOptionIndex: 1,
    },
  },
];
