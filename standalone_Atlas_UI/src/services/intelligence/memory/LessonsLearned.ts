export interface LessonRecord {
  id: string;
  situation: string;
  rootCause: string;
  resolution: string;
  impactScore: number; // 1-10
  recommendation: string;
  evidenceRef: string;
}

export class LessonsLearned {
  private lessons: LessonRecord[] = [
    {
      id: "lesson-01",
      situation: "Microgrid solar yield inverter bounds checked on peak loading.",
      rootCause: "Inverter voltage spikes exceeded standard 115V threshold constraints.",
      resolution: "Applied 3% safety tolerances margin limit scaling (midpoint negotiated average: 115V).",
      impactScore: 8,
      recommendation: "Ensure converter design workflows register safety verification rules checks.",
      evidenceRef: "substation-observed-sim-02"
    },
    {
      id: "lesson-02",
      situation: "CFD wind turbine drag mesh grid boundary limits checking.",
      rootCause: "Turbulence modeling parameters fell outside acceptable CFD meshes ranges.",
      resolution: "Re-mesh grid density resolution rules manually using high-res Fluent solvers.",
      impactScore: 7,
      recommendation: "Load CFD specialist rule constraints validations into intent validation pipeline.",
      evidenceRef: "blade-mesh-fluent-05"
    }
  ];

  public getLessons(): LessonRecord[] {
    return this.lessons;
  }

  public addLesson(lesson: LessonRecord): void {
    this.lessons.push(lesson);
  }
}

export const activeLessonsLearned = new LessonsLearned();
