export interface StrategicObjective {
  objectiveId: string;
  title: string;
  description: string;
  targetKPIs: string[];
  targetDate: string;
  currentProgress: number;
  owner: string;
}
