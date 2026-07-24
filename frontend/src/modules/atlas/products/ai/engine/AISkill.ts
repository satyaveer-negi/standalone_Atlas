import type { AIContext } from "./AIContext";
import type { SkillOutput } from "./SkillOutput";

export interface AISkill {
  id: string;
  name: string;
  description: string;
  execute(context: AIContext): SkillOutput;
}
