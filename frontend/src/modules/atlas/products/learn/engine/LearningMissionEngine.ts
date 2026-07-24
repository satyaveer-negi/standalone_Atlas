import type { LearningMissionTemplate } from "./MissionTemplate";

export interface ActiveMissionStep {
  currentStopIndex: number;
  totalStops: number;
  currentEntityId: string;
  isCompleted: boolean;
}

export class LearningMissionEngine {
  startMission(template: LearningMissionTemplate): ActiveMissionStep {
    return {
      currentStopIndex: 0,
      totalStops: template.stops.length,
      currentEntityId: template.stops[0],
      isCompleted: false,
    };
  }

  evaluateCheckpoint(template: LearningMissionTemplate, selectedIndex: number): boolean {
    return selectedIndex === template.checkpoint.correctOptionIndex;
  }
}
