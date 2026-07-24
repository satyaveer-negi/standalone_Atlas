import type { CAMComponent, CanonicalArchitectureModel } from "./CanonicalArchitectureModel";

export class TypeScriptExtractor {
  extractReactComponents(): CAMComponent[] {
    return [
      {
        id: "cam-ts-tasks-ui",
        name: "Tasks.tsx (React Component)",
        type: "UI_VIEW",
        sourceLanguage: "TypeScript",
      },
    ];
  }
}
