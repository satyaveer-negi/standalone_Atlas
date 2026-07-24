import type { CAMComponent } from "./CanonicalArchitectureModel";

export class PythonExtractor {
  extractDjangoViewSets(): CAMComponent[] {
    return [
      {
        id: "cam-py-taskviewset",
        name: "TaskViewSet (Django APIView)",
        type: "REST_API",
        sourceLanguage: "Python",
      },
      {
        id: "cam-py-taskmodel",
        name: "Task (Django Model)",
        type: "DOMAIN_ENTITY",
        sourceLanguage: "Python",
      },
    ];
  }
}
