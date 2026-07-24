import React, { createContext, useContext, useEffect } from "react";
import { useAtlasStore } from "./store/atlasStore";

interface AtlasContextValue {
  initialized: boolean;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
}

const AtlasContext = createContext<AtlasContextValue | null>(null);

export const AtlasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialized = useAtlasStore((state) => state.initialized);
  const selectedNodeId = useAtlasStore((state) => state.selectedNodeId);
  const hoveredNodeId = useAtlasStore((state) => state.hoveredNodeId);
  const setSelectedNode = useAtlasStore((state) => state.setSelectedNode);
  const setHoveredNode = useAtlasStore((state) => state.setHoveredNode);
  const initialize = useAtlasStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <AtlasContext.Provider
      value={{
        initialized,
        selectedNodeId,
        hoveredNodeId,
        selectNode: setSelectedNode,
        hoverNode: setHoveredNode,
      }}
    >
      {children}
    </AtlasContext.Provider>
  );
};

export const useAtlas = () => {
  const context = useContext(AtlasContext);
  if (!context) {
    throw new Error("useAtlas must be used within an AtlasProvider");
  }
  return context;
};
