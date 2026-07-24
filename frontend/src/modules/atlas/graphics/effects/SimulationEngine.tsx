import { useState, useEffect } from "react";
import { Line } from "@react-three/drei";
import { ProtocolPacket } from "./ProtocolPackets";
import type { ProtocolType } from "../../engine/animation/AnimationDirector";
import { useAtlasStore } from "../../store/atlasStore";

export interface SimulationStep {
  name: string;
  position: [number, number, number];
  packetLabel: string;
  protocol: ProtocolType;
}

export interface SimulationFlow {
  id: string;
  name: string;
  steps: SimulationStep[];
  packetColor: string;
}

export const DEMO_SIMULATION_FLOWS: Record<string, SimulationFlow> = {
  task_create: {
    id: "task_create",
    name: "Create Task Execution Flow",
    packetColor: "#00f0ff",
    steps: [
      { name: "React Frontend UI", position: [-10.5, 0.5, 6], packetLabel: "POST /api/tasks/", protocol: "HTTP" },
      { name: "Django REST API", position: [14, 0.5, 0], packetLabel: "TaskViewSet.create()", protocol: "HTTP" },
      { name: "PostgreSQL Database", position: [14, -4, 8], packetLabel: "SQL INSERT INTO task", protocol: "SQL" },
      { name: "Redis Cache Evict", position: [6, -4, 7], packetLabel: "CACHE EVICT tasks_all", protocol: "Redis" },
      { name: "React Response", position: [-10.5, 0.5, 6], packetLabel: "201 CREATED (JSON)", protocol: "HTTP" },
    ],
  },
  auth_flow: {
    id: "auth_flow",
    name: "JWT Authentication Flow",
    packetColor: "#ec4899",
    steps: [
      { name: "Login Modal", position: [-10.5, 0.5, 6], packetLabel: "POST /api/token/", protocol: "HTTP" },
      { name: "Auth Middleware", position: [14, 0.5, 0], packetLabel: "Verify Credentials", protocol: "AI" },
      { name: "PostgreSQL DB", position: [14, -4, 8], packetLabel: "SELECT user_hash", protocol: "SQL" },
      { name: "JWT Token Sign", position: [14, 0.5, 0], packetLabel: "Issue Access JWT", protocol: "HTTP" },
      { name: "Client Store", position: [-10.5, 0.5, 6], packetLabel: "200 OK Token Set", protocol: "HTTP" },
    ],
  },
};

interface Props {
  flow: SimulationFlow;
}

export function SimulationEngine({ flow }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const activeProtocolFilters = useAtlasStore((state) => state.activeProtocolFilters);

  const currentStep = flow.steps[stepIndex];
  const nextStep = flow.steps[(stepIndex + 1) % flow.steps.length];

  // Check if protocol filter is enabled for this step
  const isEnabled = activeProtocolFilters[currentStep.protocol] ?? true;

  const trajectoryPoints = flow.steps.map((s) => s.position);

  const handleStepComplete = () => {
    setStepIndex((prev) => (prev + 1) % (flow.steps.length - 1));
  };

  return (
    <>
      {/* 3D Dashed Trajectory Waypoint Path Line */}
      {trajectoryPoints.length >= 2 && (
        <Line
          points={trajectoryPoints}
          color={flow.packetColor}
          lineWidth={2}
          transparent
          opacity={0.5}
          dashed
          dashScale={6}
        />
      )}

      {/* Protocol-Specific Single Event Packet */}
      {isEnabled && (
        <ProtocolPacket
          key={`${flow.id}-${stepIndex}`}
          protocol={currentStep.protocol}
          from={currentStep.position}
          to={nextStep.position}
          label={currentStep.packetLabel}
          onComplete={handleStepComplete}
        />
      )}
    </>
  );
}
