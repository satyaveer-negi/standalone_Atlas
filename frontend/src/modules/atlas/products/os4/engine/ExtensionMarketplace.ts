import type { PluginManifest } from "./PluginSDK";

export class ExtensionMarketplace {
  private availablePacks: PluginManifest[] = [
    {
      id: "pack-abb-robotics",
      name: "ABB Robotics & Kinematics Extension Pack",
      version: "1.2.0",
      author: "ABB Automation Ltd.",
      isolationLevel: "SANDBOXED",
      capabilities: ["robotics.kinematics", "robotics.path_planning"],
      providedEntities: ["IRB 6700 Industrial Robot Arm", "IRC5 Controller Unit"],
      providedSimulations: ["Inverse Kinematics Solver", "Collision Avoidance Sim"],
      providedAgents: ["ABB Motion Control Agent"],
    },
    {
      id: "pack-ansys-cfd",
      name: "ANSYS Fluent CFD Thermal Solver Pack",
      version: "2.4.1",
      author: "ANSYS Inc.",
      isolationLevel: "REMOTE",
      capabilities: ["simulation.cfd", "thermal.dispersion"],
      providedEntities: ["CFD Mesh Node", "Fluid Boundary Layer"],
      providedSimulations: ["High-Reynolds Turbulence Sim"],
      providedAgents: ["Fluent CFD Optimization Agent"],
    },
  ];

  getAvailablePacks(): PluginManifest[] {
    return [...this.availablePacks];
  }
}
