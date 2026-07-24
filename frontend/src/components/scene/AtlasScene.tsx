import { useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useQuery } from "@tanstack/react-query";
import { Line } from "@react-three/drei";
import Lighting from "./Lighting";
import Environment from "./Environment";

import StarField from "../effects/StarField";
import GridFloor from "../effects/GridFloor";
import FloatingParticles from "../effects/FloatingParticles";

import { useAtlasStore } from "../../store/atlasStore";
import { ProjectAdapter } from "../../adapters/ProjectAdapter";
import { DEMO_DOCKER_CONTAINERS } from "../../adapters/DockerAdapter";
import { CameraController } from "./CameraController";
import { ProjectReactorGeometry } from "../../graphics/geometry/ProjectReactorGeometry";
import { ModuleCrystalGeometry } from "../../graphics/geometry/ModuleCrystalGeometry";
import { HexStationGeometry } from "../../graphics/geometry/HexStationGeometry";
import { HoloPlateGeometry } from "../../graphics/geometry/HoloPlateGeometry";
import { CodeOrbGeometry } from "../../graphics/geometry/CodeOrbGeometry";
import { InfrastructureGeometry } from "../../graphics/geometry/InfrastructureGeometry";
import { UserPresenceOrbiter, DEMO_USER_PRESENCES } from "../../graphics/effects/UserPresenceOrbiter";
import { DependencyFlowEngine } from "../../graphics/effects/DependencyFlowEngine";
import { SimulationEngine, DEMO_SIMULATION_FLOWS } from "../../graphics/effects/SimulationEngine";
import { ConnectionBeam } from "../../graphics/effects/ConnectionBeam";
import AtlasPostFX from "../../graphics/postprocessing/AtlasPostFX";
import { getProjects, getWorkspaces } from "../../services/pmApi";

function CameraZoomTracker() {
  const setZoomLevel = useAtlasStore((state) => state.setZoomLevel);
  const zoomLevel = useAtlasStore((state) => state.zoomLevel);
  const targetCameraPosition = useAtlasStore((state) => state.targetCameraPosition);

  useFrame(({ camera }) => {
    if (targetCameraPosition) return; // Don't override during camera portal flight

    const dist = camera.position.length();
    let newLevel: 0 | 1 | 2 | 3 | 4 | 5 = 1;
    if (dist > 26) newLevel = 0;
    else if (dist > 18) newLevel = 1;
    else if (dist > 12) newLevel = 2;
    else if (dist > 7) newLevel = 3;
    else if (dist > 3.5) newLevel = 4;
    else newLevel = 5;

    if (newLevel !== zoomLevel) {
      setZoomLevel(newLevel);
    }
  });

  return null;
}

export default function AtlasScene() {
  const zoomLevel = useAtlasStore((state) => state.zoomLevel);
  const timelineOffset = useAtlasStore((state) => state.timelineOffset);
  const explorationMode = useAtlasStore((state) => state.explorationMode);
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const focusedNodeId = useAtlasStore((state) => state.focusedNodeId);
  const hoveredNodeId = useAtlasStore((state) => state.hoveredNodeId);
  const setSelectedNode = useAtlasStore((state) => state.setSelectedNode);
  const setHoveredNode = useAtlasStore((state) => state.setHoveredNode);
  const enterPortal = useAtlasStore((state) => state.enterPortal);

  const showGrid = useAtlasStore((state) => state.showGrid);
  const showParticles = useAtlasStore((state) => state.showParticles);
  const bloomEnabled = useAtlasStore((state) => state.bloomEnabled);

  const [activeFlowId, setActiveFlowId] = useState<string | null>("task_create");

  useEffect(() => {
    const handleStartSim = (e: any) => {
      if (e.detail) setActiveFlowId(e.detail);
    };
    window.addEventListener("atlas-start-simulation", handleStartSim);
    return () => window.removeEventListener("atlas-start-simulation", handleStartSim);
  }, []);

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });

  // Construct multi-tier SceneGraph from live backend data
  const sceneGraph = useMemo(() => {
    return ProjectAdapter.buildSceneGraphFromERP(projects, workspaces, []);
  }, [projects, workspaces]);

  const nodes = sceneGraph.getAllNodes();
  const edges = sceneGraph.getAllEdges();
  const allNodesMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  // Handle portal entry on node click
  const handleSelectPortalNode = (nodeId: string) => {
    const targetNode = allNodesMap.get(nodeId);
    if (targetNode) {
      enterPortal({
        id: targetNode.id,
        name: targetNode.name,
        level: targetNode.level,
        position: targetNode.position,
      });
    } else {
      setSelectedNode(nodeId);
    }
  };

  // Apply Timeline Historical Filtering & Lens Customization
  const filteredNodes = useMemo(() => {
    return nodes
      .filter((node) => {
        // Progressive disclosure level filter
        if (node.level > Math.max(1, zoomLevel)) return false;

        // Timeline Historical Filter: if slider > 40, hide high-level level 5 function nodes created recently
        if (timelineOffset > 40 && node.level >= 5) return false;
        if (timelineOffset > 75 && node.level >= 4) return false;

        return true;
      })
      .map((node) => {
        // Activity Mode Heatmap Color Mapping Override
        if (explorationMode === "activity") {
          let heatColor = "#00f0ff";
          if (node.health === "modified") heatColor = "#ffffff"; // White scan
          else if (node.health === "frequent") heatColor = "#f97316"; // Orange pulse
          else if (node.health === "complex") heatColor = "#a855f7"; // Purple glow
          else if (node.health === "error") heatColor = "#ef4444"; // Red warning
          return { ...node, color: heatColor };
        }
        // AI Lens Mode Color Mapping Override
        if (explorationMode === "ai") {
          let aiColor = "#38bdf8";
          if (node.aiMetadata.couplingRisk === "HIGH" || node.aiMetadata.couplingRisk === "CRITICAL") {
            aiColor = "#f43f5e";
          } else if (node.aiMetadata.complexityScore > 70) {
            aiColor = "#c084fc";
          }
          return { ...node, color: aiColor };
        }

        return node;
      });
  }, [nodes, zoomLevel, timelineOffset, explorationMode]);

  const nodesMap = useMemo(() => new Map(filteredNodes.map((n) => [n.id, n])), [filteredNodes]);
  const focusedNode = focusedNodeId ? allNodesMap.get(focusedNodeId) : null;

  return (
    <>
      <Lighting />
      <Environment />

      {showParticles && <StarField />}
      {showParticles && <FloatingParticles />}
      {showGrid && <GridFloor />}

      <CameraZoomTracker />
      <CameraController />

      {/* Dependency Mode 3D Particle Streams */}
      {explorationMode === "dependency" && <DependencyFlowEngine />}

      {/* Execution Flow Simulation Engine */}
      {activeFlowId && DEMO_SIMULATION_FLOWS[activeFlowId] && (
        <SimulationEngine flow={DEMO_SIMULATION_FLOWS[activeFlowId]} />
      )}

      {/* Live Collaboration Presence Orbiters */}
      {DEMO_USER_PRESENCES.map((user) => (
        <UserPresenceOrbiter key={user.id} user={user} nodesMap={allNodesMap} />
      ))}

      {/* Runtime Mode Docker & Microservices Layer */}
      {explorationMode === "runtime" &&
        DEMO_DOCKER_CONTAINERS.map((cnt) => (
          <InfrastructureGeometry
            key={cnt.id}
            container={cnt}
            isSelected={selectedNodeId === cnt.id}
            isHovered={hoveredNodeId === cnt.id}
            onSelect={handleSelectPortalNode}
            onHover={setHoveredNode}
          />
        ))}

      {/* Repository Core Tether Line to Active Portal */}
      {focusedNode && focusedNode.level > 0 && (
        <Line
          points={[[0, 0, 0], focusedNode.position]}
          color="#00f0ff"
          lineWidth={2}
          transparent
          opacity={0.8}
          dashed
          dashScale={8}
        />
      )}

      {/* Progressive Disclosure Portal Geometry Layer */}
      {filteredNodes.map((node) => {
        const isSelected = selectedNodeId === node.id || selectedNodeId === node.name;
        const isHovered = hoveredNodeId === node.id;

        switch (node.level) {
          case 0:
            return (
              <ProjectReactorGeometry
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleSelectPortalNode}
                onHover={setHoveredNode}
              />
            );
          case 1:
          case 2:
            return (
              <ModuleCrystalGeometry
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleSelectPortalNode}
                onHover={setHoveredNode}
              />
            );
          case 3:
            return (
              <HexStationGeometry
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleSelectPortalNode}
                onHover={setHoveredNode}
              />
            );
          case 4:
            return (
              <HoloPlateGeometry
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleSelectPortalNode}
                onHover={setHoveredNode}
              />
            );
          case 5:
          case 6:
            return (
              <CodeOrbGeometry
                key={node.id}
                node={node}
                isSelected={isSelected}
                isHovered={isHovered}
                onSelect={handleSelectPortalNode}
                onHover={setHoveredNode}
              />
            );
          default:
            return null;
        }
      })}

      {/* Relationship Connections */}
      {edges.map((edge) => (
        <ConnectionBeam key={edge.id} edge={edge} nodesMap={nodesMap} />
      ))}

      {/* Post-Processing FX Layer */}
      {bloomEnabled && <AtlasPostFX />}
    </>
  );
}