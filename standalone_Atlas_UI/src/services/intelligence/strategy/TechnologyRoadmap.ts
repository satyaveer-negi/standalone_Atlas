export type RoadmapMilestoneStatus = "Planned" | "InProgress" | "Completed" | "Delayed";

export interface RoadmapMilestone {
  id: string;
  name: string;
  plannedDate: string;
  status: RoadmapMilestoneStatus;
  dependencies: string[];
  completionPercentage: number;
}

export interface TechnologyRoadmap {
  roadmapId: string;
  technologyArea: string;
  currentState: string;
  futureState: string;
  milestones: RoadmapMilestone[];
  targetDate: string;
  owner: string;
  riskAssessment: string;
}
