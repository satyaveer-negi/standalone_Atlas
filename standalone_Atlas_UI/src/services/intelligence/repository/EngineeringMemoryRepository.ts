import { EngineeringExperience } from "../memory/EngineeringExperience";
import { LessonRecord } from "../memory/LessonsLearned";
import { ExtractedPattern } from "../memory/PatternExtractor";

export class EngineeringMemoryRepository {
  private experiences = new Map<string, EngineeringExperience>();
  private lessons = new Map<string, LessonRecord>();
  private patterns = new Map<string, ExtractedPattern>();

  public saveExperience(exp: EngineeringExperience): void {
    this.experiences.set(exp.id, exp);
  }

  public saveLesson(lesson: LessonRecord): void {
    this.lessons.set(lesson.id, lesson);
  }

  public savePattern(pat: ExtractedPattern): void {
    this.patterns.set(pat.id, pat);
  }

  public getExperiencesList(): EngineeringExperience[] {
    return Array.from(this.experiences.values());
  }

  public clear(): void {
    this.experiences.clear();
    this.lessons.clear();
    this.patterns.clear();
  }
}

export const activeEngineeringMemoryRepository = new EngineeringMemoryRepository();
