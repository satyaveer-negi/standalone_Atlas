import API from "../api/axios";

export interface Project {
  id: string;
  name: string;
  description?: string;
  github_repo?: string;
  version?: string;
}

export interface Workspace {
  id: string;
  name: string;
}

export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await API.get("projects/");
    return res.data;
  } catch {
    return [
      { id: "proj-1", name: "Propulsion System Design", description: "Liquid rocket engine nozzle structural FEA.", version: "1.0.4" },
      { id: "proj-2", name: "Aerodynamics Simulation", description: "External flow CFD analysis of fuselage.", version: "2.1.0" }
    ];
  }
};

export const getWorkspaces = async (): Promise<Workspace[]> => {
  try {
    const res = await API.get("workspaces/");
    return res.data;
  } catch {
    return [
      { id: "ws-1", name: "Rocket Systems" },
      { id: "ws-2", name: "Avionics Team" }
    ];
  }
};
