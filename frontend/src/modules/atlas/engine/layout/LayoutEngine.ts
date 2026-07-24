import type { GraphArtifactNode, GraphArtifactEdge } from "../scene/SceneGraph";

export class LayoutEngine {
  /**
   * Calculates 3D spatial layout positions for multi-level progressive disclosure nodes.
   */
  public static calculateLayout(
    nodes: GraphArtifactNode[],
    edges: GraphArtifactEdge[]
  ): GraphArtifactNode[] {
    const nodeMap = new Map<string, GraphArtifactNode>(nodes.map((n) => [n.id, n]));

    // Level 0: Repo Core at origin
    const repoNodes = nodes.filter((n) => n.level === 0);
    repoNodes.forEach((n) => {
      n.position = [0, 0, 0];
    });

    // Level 1: Major Systems orbiting Repo Core
    const systemNodes = nodes.filter((n) => n.level === 1);
    const systemCount = Math.max(1, systemNodes.length);
    const systemRadius = 14;

    systemNodes.forEach((sysNode, idx) => {
      const angle = (idx / systemCount) * Math.PI * 2;
      sysNode.position = [
        Math.cos(angle) * systemRadius,
        0.5,
        Math.sin(angle) * systemRadius,
      ];
    });

    // Level 2: Modules orbiting their parent Systems
    const moduleNodes = nodes.filter((n) => n.level === 2);
    const modulesByParent = this.groupByParent(moduleNodes);

    modulesByParent.forEach((children, parentId) => {
      const parent = nodeMap.get(parentId);
      const parentPos = parent ? parent.position : ([0, 0, 0] as [number, number, number]);
      const modRadius = 6;

      children.forEach((modNode, idx) => {
        const angle = (idx / Math.max(1, children.length)) * Math.PI * 2;
        modNode.position = [
          parentPos[0] + Math.cos(angle) * modRadius,
          parentPos[1] + (idx % 2 === 0 ? 1 : -1) * 0.8,
          parentPos[2] + Math.sin(angle) * modRadius,
        ];
      });
    });

    // Level 3: Hexagonal Clusters orbiting Modules
    const clusterNodes = nodes.filter((n) => n.level === 3);
    const clustersByParent = this.groupByParent(clusterNodes);

    clustersByParent.forEach((children, parentId) => {
      const parent = nodeMap.get(parentId);
      const parentPos = parent ? parent.position : ([0, 0, 0] as [number, number, number]);
      const clusterRadius = 3.5;

      children.forEach((cNode, idx) => {
        const angle = (idx / Math.max(1, children.length)) * Math.PI * 2 + 0.3;
        cNode.position = [
          parentPos[0] + Math.cos(angle) * clusterRadius,
          parentPos[1] - 0.5 + (idx * 0.4),
          parentPos[2] + Math.sin(angle) * clusterRadius,
        ];
      });
    });

    // Level 4: Floating Holographic File Plates offset from Clusters
    const fileNodes = nodes.filter((n) => n.level === 4);
    const filesByParent = this.groupByParent(fileNodes);

    filesByParent.forEach((children, parentId) => {
      const parent = nodeMap.get(parentId);
      const parentPos = parent ? parent.position : ([0, 0, 0] as [number, number, number]);
      const fileRadius = 2.2;

      children.forEach((fNode, idx) => {
        const angle = (idx / Math.max(1, children.length)) * Math.PI * 2 + 0.5;
        fNode.position = [
          parentPos[0] + Math.cos(angle) * fileRadius,
          parentPos[1] - 1 + (idx * 0.5),
          parentPos[2] + Math.sin(angle) * fileRadius,
        ];
      });
    });

    // Level 5: Code Function Orbs orbiting File Plates
    const functionNodes = nodes.filter((n) => n.level === 5);
    const functionsByParent = this.groupByParent(functionNodes);

    functionsByParent.forEach((children, parentId) => {
      const parent = nodeMap.get(parentId);
      const parentPos = parent ? parent.position : ([0, 0, 0] as [number, number, number]);
      const funcRadius = 1.2;

      children.forEach((funcNode, idx) => {
        const angle = (idx / Math.max(1, children.length)) * Math.PI * 2;
        funcNode.position = [
          parentPos[0] + Math.cos(angle) * funcRadius,
          parentPos[1] + (idx * 0.3),
          parentPos[2] + Math.sin(angle) * funcRadius,
        ];
      });
    });

    return nodes;
  }

  private static groupByParent(
    nodes: GraphArtifactNode[]
  ): Map<string, GraphArtifactNode[]> {
    const map = new Map<string, GraphArtifactNode[]>();
    nodes.forEach((n) => {
      const pId = n.parentId || "root";
      if (!map.has(pId)) {
        map.set(pId, []);
      }
      map.get(pId)!.push(n);
    });
    return map;
  }
}
