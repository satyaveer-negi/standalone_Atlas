import { Line } from "@react-three/drei";
import type { GraphArtifactEdge, GraphArtifactNode } from "../../engine/scene/SceneGraph";

interface Props {
  edge: GraphArtifactEdge;
  nodesMap: Map<string, GraphArtifactNode>;
}

export function ConnectionBeam({ edge, nodesMap }: Props) {
  const sourceNode = nodesMap.get(edge.sourceId);
  const targetNode = nodesMap.get(edge.targetId);

  if (!sourceNode || !targetNode) return null;

  const getBeamStyle = () => {
    switch (edge.type) {
      case "imports":
        return { color: "#38bdf8", width: 1.5, dash: false };
      case "calls":
        return { color: "#a855f7", width: 2.0, dash: false };
      case "dependency":
        return { color: "#10b981", width: 1.2, dash: true };
      default:
        return { color: "#64748b", width: 1.0, dash: false };
    }
  };

  const style = getBeamStyle();

  return (
    <Line
      points={[sourceNode.position, targetNode.position]}
      color={style.color}
      lineWidth={style.width}
      transparent
      opacity={0.6}
      dashed={style.dash}
      dashScale={5}
    />
  );
}
