import { AIRSpecification } from "../contracts/air";
import { AtlasObject } from "../contracts/akg";
import { RuntimeLifecycle } from "../contracts/lifecycle";
import { container } from "../implementations/serviceContainer";

// 📦 ATLAS PLATFORM SDK CORE MODULE
export class AtlasSDK {
  public static getKernelService<T>(name: string): T {
    return container.resolve<T>(name);
  }

  public static registerRuntimeExtension(name: string, extension: RuntimeLifecycle): void {
    console.log(`[SDK] Extension registered successfully: "${name}"`);
    container.register(name, extension);
  }

  public static queryResourceGraph(query: string): AtlasObject[] {
    console.log(`[SDK] Querying resource graph with criteria: "${query}"`);
    return [];
  }
}

export class KnowledgeCompilerSDK {
  public static validateAIR(air: AIRSpecification): boolean {
    console.log(`[SDK Compiler] Running validation on AIR system "${air.systemId}"...`);
    return air.semantic.nodes.length > 0;
  }
}
