import type { SceneDescriptor } from "./SceneBuilder";
import type { ScenePatch } from "./ScenePatch";

export class SceneDiffEngine {
  computePatches(
    prevScene: SceneDescriptor | null,
    nextScene: SceneDescriptor
  ): ScenePatch[] {
    const patches: ScenePatch[] = [];

    const prevMap = new Map((prevScene?.nodes || []).map((n) => [n.id, n]));
    const nextMap = new Map(nextScene.nodes.map((n) => [n.id, n]));

    // Added or Updated Nodes
    nextScene.nodes.forEach((n) => {
      if (!prevMap.has(n.id)) {
        patches.push({
          command: "CreateArtifact",
          artifactId: n.id,
          artifactType: n.type,
          name: n.name,
          position: n.position,
          metadata: n.metadata,
        });
      } else {
        const prevNode = prevMap.get(n.id)!;
        if (
          prevNode.position[0] !== n.position[0] ||
          prevNode.position[1] !== n.position[1] ||
          prevNode.position[2] !== n.position[2]
        ) {
          patches.push({
            command: "UpdateArtifact",
            artifactId: n.id,
            changes: { position: n.position },
          });
        }
      }
    });

    // Removed Nodes
    prevMap.forEach((_, id) => {
      if (!nextMap.has(id)) {
        patches.push({
          command: "RemoveArtifact",
          artifactId: id,
        });
      }
    });

    // Connections
    nextScene.edges.forEach((e) => {
      patches.push({
        command: "ConnectArtifacts",
        connectionId: e.id,
        sourceId: e.sourceId,
        targetId: e.targetId,
        relation: e.relation,
      });
    });

    return patches;
  }
}
