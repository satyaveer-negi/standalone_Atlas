import { create } from "zustand";
import { AtlasIntermediateRepresentation } from "../services/atlasIntermediateRepresentation";
import { activeKnowledgeRuntime } from "../services/ontologyEngine";

export type CameraMode =
  | "orbit"
  | "overview"
  | "follow"
  | "presentation"
  | "firstperson";

export type ExplorationMode =
  | "architecture"
  | "dependency"
  | "git"
  | "activity"
  | "ai"
  | "runtime"
  | "timeline";

export type InspectorTab =
  | "overview"
  | "metrics"
  | "dependencies"
  | "history"
  | "ai"
  | "git"
  | "code"
  | "commands";

export interface BreadcrumbItem {
  id: string;
  name: string;
  level: number;
  position: [number, number, number];
}

export interface AtlasState {
  // Engine
  initialized: boolean;
  loading: boolean;

  // Exploration Mode Lens
  explorationMode: ExplorationMode;
  setExplorationMode: (mode: ExplorationMode) => void;

  // Progressive Disclosure & Camera
  cameraMode: CameraMode;
  autoRotate: boolean;
  zoomLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  timelineOffset: number; // 0 (today) to 100 (historical)

  // Navigation Stack & History
  breadcrumbTrail: BreadcrumbItem[];
  navigationStack: BreadcrumbItem[];
  stackPointer: number;
  targetCameraPosition: [number, number, number] | null;
  targetLookAtPosition: [number, number, number] | null;
  clearCameraTargets: () => void;

  // Command Search Navigation
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Protocol Telemetry Filters
  activeProtocolFilters: Record<"HTTP" | "SQL" | "Redis" | "WebSocket" | "AI", boolean>;
  toggleProtocolFilter: (protocol: "HTTP" | "SQL" | "Redis" | "WebSocket" | "AI") => void;

  // Visual Settings
  animationSpeed: number;
  showParticles: boolean;
  showGrid: boolean;
  showLabels: boolean;
  showConnections: boolean;
  bloomEnabled: boolean;

  // Interaction & Inspector
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  focusedNodeId: string | null;
  activeInspectorTab: InspectorTab;
  activeAIR: AtlasIntermediateRepresentation | null;
  setActiveAIR: (air: AtlasIntermediateRepresentation) => void;

  // Actions
  initialize: () => void;
  setLoading: (loading: boolean) => void;

  setCameraMode: (mode: CameraMode) => void;
  toggleAutoRotate: () => void;
  setZoomLevel: (level: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;
  setTimelineOffset: (offset: number) => void;

  // Navigation Stack Actions
  enterPortal: (item: BreadcrumbItem) => void;
  stepBackPortal: () => void;
  forwardPortal: () => void;
  navigateToBreadcrumb: (index: number) => void;

  setAnimationSpeed: (speed: number) => void;

  toggleParticles: () => void;
  toggleGrid: () => void;
  toggleLabels: () => void;
  toggleConnections: () => void;
  toggleBloom: () => void;

  setHoveredNode: (id: string | null) => void;
  setSelectedNode: (id: string | null) => void;
  setFocusedNode: (id: string | null) => void;
  setActiveInspectorTab: (tab: InspectorTab) => void;
}

const ROOT_BREADCRUMB: BreadcrumbItem = {
  id: "repo-root",
  name: "Repository Core",
  level: 0,
  position: [0, 0, 0],
};

export const useAtlasStore = create<AtlasState>((set, get) => ({
  initialized: false,
  loading: true,

  explorationMode: "architecture",
  setExplorationMode: (explorationMode) => set({ explorationMode }),

  cameraMode: "orbit",
  autoRotate: true,
  zoomLevel: 0,
  timelineOffset: 0,

  breadcrumbTrail: [ROOT_BREADCRUMB],
  navigationStack: [ROOT_BREADCRUMB],
  stackPointer: 0,
  targetCameraPosition: null,
  targetLookAtPosition: null,

  isSearchOpen: false,
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),

  activeProtocolFilters: {
    HTTP: true,
    SQL: true,
    Redis: true,
    WebSocket: true,
    AI: true,
  },
  toggleProtocolFilter: (protocol) =>
    set((state) => ({
      activeProtocolFilters: {
        ...state.activeProtocolFilters,
        [protocol]: !state.activeProtocolFilters[protocol],
      },
    })),

  animationSpeed: 1,

  showParticles: true,
  showGrid: true,
  showLabels: true,
  showConnections: true,
  bloomEnabled: true,

  hoveredNodeId: null,
  selectedNodeId: "repo-root",
  focusedNodeId: "repo-root",
  activeInspectorTab: "overview",
  activeAIR: activeKnowledgeRuntime.getActiveAIR() || null,
  setActiveAIR: (activeAIR) => set({ activeAIR }),

  initialize: () =>
    set({
      initialized: true,
      loading: false,
    }),

  setLoading: (loading) => set({ loading }),

  setCameraMode: (cameraMode) => set({ cameraMode }),

  toggleAutoRotate: () =>
    set((state) => ({
      autoRotate: !state.autoRotate,
    })),

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setTimelineOffset: (timelineOffset) => set({ timelineOffset }),
  clearCameraTargets: () => set({ targetCameraPosition: null, targetLookAtPosition: null }),

  enterPortal: (item: BreadcrumbItem) => {
    const currentTrail = get().breadcrumbTrail;
    const exists = currentTrail.some((b) => b.id === item.id);
    const newTrail = exists ? currentTrail : [...currentTrail, item];

    const currentStack = get().navigationStack.slice(0, get().stackPointer + 1);
    const newStack = [...currentStack, item];

    const [x, y, z] = item.position;
    const cameraDist = Math.max(3, 14 - item.level * 2.2);
    const targetCam: [number, number, number] = [x, y + cameraDist * 0.4, z + cameraDist];

    set({
      breadcrumbTrail: newTrail,
      navigationStack: newStack,
      stackPointer: newStack.length - 1,
      selectedNodeId: item.id,
      focusedNodeId: item.id,
      zoomLevel: Math.min(5, Math.max(0, item.level + 1)) as any,
      targetCameraPosition: targetCam,
      targetLookAtPosition: item.position,
      autoRotate: false,
    });
  },

  stepBackPortal: () => {
    const stack = get().navigationStack;
    const pointer = get().stackPointer;
    if (pointer <= 0) {
      set({
        zoomLevel: 0,
        selectedNodeId: "repo-root",
        focusedNodeId: "repo-root",
        targetCameraPosition: [0, 6, 14],
        targetLookAtPosition: [0, 0, 0],
        autoRotate: true,
      });
      return;
    }

    const newPointer = pointer - 1;
    const targetItem = stack[newPointer];
    const [x, y, z] = targetItem.position;
    const cameraDist = Math.max(3, 14 - targetItem.level * 2.2);
    const targetCam: [number, number, number] = [x, y + cameraDist * 0.4, z + cameraDist];

    set({
      stackPointer: newPointer,
      selectedNodeId: targetItem.id,
      focusedNodeId: targetItem.id,
      zoomLevel: Math.min(5, Math.max(0, targetItem.level)) as any,
      targetCameraPosition: targetCam,
      targetLookAtPosition: targetItem.position,
    });
  },

  forwardPortal: () => {
    const stack = get().navigationStack;
    const pointer = get().stackPointer;
    if (pointer >= stack.length - 1) return;

    const newPointer = pointer + 1;
    const targetItem = stack[newPointer];
    const [x, y, z] = targetItem.position;
    const cameraDist = Math.max(3, 14 - targetItem.level * 2.2);
    const targetCam: [number, number, number] = [x, y + cameraDist * 0.4, z + cameraDist];

    set({
      stackPointer: newPointer,
      selectedNodeId: targetItem.id,
      focusedNodeId: targetItem.id,
      zoomLevel: Math.min(5, Math.max(0, targetItem.level)) as any,
      targetCameraPosition: targetCam,
      targetLookAtPosition: targetItem.position,
    });
  },

  navigateToBreadcrumb: (index: number) => {
    const currentTrail = get().breadcrumbTrail;
    if (index < 0 || index >= currentTrail.length) return;

    const newTrail = currentTrail.slice(0, index + 1);
    const targetItem = newTrail[newTrail.length - 1];
    const [x, y, z] = targetItem.position;
    const cameraDist = Math.max(3, 14 - targetItem.level * 2.2);
    const targetCam: [number, number, number] = [x, y + cameraDist * 0.4, z + cameraDist];

    set({
      breadcrumbTrail: newTrail,
      selectedNodeId: targetItem.id,
      focusedNodeId: targetItem.id,
      zoomLevel: Math.min(5, Math.max(0, targetItem.level)) as any,
      targetCameraPosition: targetCam,
      targetLookAtPosition: targetItem.position,
    });
  },

  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  toggleParticles: () =>
    set((state) => ({
      showParticles: !state.showParticles,
    })),

  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),

  toggleLabels: () =>
    set((state) => ({
      showLabels: !state.showLabels,
    })),

  toggleConnections: () =>
    set((state) => ({
      showConnections: !state.showConnections,
    })),

  toggleBloom: () =>
    set((state) => ({
      bloomEnabled: !state.bloomEnabled,
    })),

  setHoveredNode: (hoveredNodeId) => set({ hoveredNodeId }),
  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),
  setFocusedNode: (focusedNodeId) => set({ focusedNodeId }),
  setActiveInspectorTab: (activeInspectorTab) => set({ activeInspectorTab }),
}));