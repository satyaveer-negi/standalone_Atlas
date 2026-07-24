import type { AISkill } from "./AISkill";
import { ExplainSkill } from "../skills/ExplainSkill";
import { RefactorSkill } from "../skills/RefactorSkill";

export class SkillRegistry {
  private skills: Map<string, AISkill> = new Map();

  constructor() {
    this.register(new ExplainSkill());
    this.register(new RefactorSkill());
  }

  register(skill: AISkill) {
    this.skills.set(skill.id, skill);
  }

  getSkill(id: string): AISkill | undefined {
    return this.skills.get(id);
  }

  getAllSkills(): AISkill[] {
    return Array.from(this.skills.values());
  }
}
