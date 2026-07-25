import { WorkflowDefinition } from "../model/WorkflowDefinition";

export class WorkflowRepository {
  private templates = new Map<string, WorkflowDefinition>();
  private activeDrafts = new Map<string, WorkflowDefinition>();

  public registerTemplate(def: WorkflowDefinition): void {
    this.templates.set(def.id, def);
  }

  public getTemplatesList(): WorkflowDefinition[] {
    return Array.from(this.templates.values());
  }

  public saveDraft(def: WorkflowDefinition): void {
    this.activeDrafts.set(def.id, def);
  }

  public getDraftsList(): WorkflowDefinition[] {
    return Array.from(this.activeDrafts.values());
  }

  public clear(): void {
    this.templates.clear();
    this.activeDrafts.clear();
  }
}

export const activeWorkflowRepository = new WorkflowRepository();
