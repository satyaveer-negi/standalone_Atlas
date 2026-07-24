export type AtlasTheme = "default" | "minimal" | "blueprint";

export interface ArtifactDefinition {
  type: string;
  geometry: "reactor" | "crystal" | "hex" | "holo" | "orb" | "box";
  material: "emissive" | "hologram" | "standard";
  animations: string[];
  interactions: string[];
  metadata?: Record<string, unknown>;
}

export class ArtifactRegistry {
  private theme: AtlasTheme = "default";

  setTheme(theme: AtlasTheme) {
    this.theme = theme;
  }

  getTheme(): AtlasTheme {
    return this.theme;
  }

  getArtifactDefinition(entityType: string): ArtifactDefinition {
    if (this.theme === "blueprint") {
      return {
        type: entityType,
        geometry: "box",
        material: "hologram",
        animations: ["wireframePulse"],
        interactions: ["clickSelect", "hoverLabel"],
      };
    }

    switch (entityType) {
      case "repository":
        return {
          type: entityType,
          geometry: "reactor",
          material: "emissive",
          animations: ["reactorBreathing"],
          interactions: ["clickSelect", "hoverLabel"],
        };
      case "system":
      case "module":
        return {
          type: entityType,
          geometry: "crystal",
          material: "emissive",
          animations: ["floatOscillation"],
          interactions: ["clickSelect", "hoverLabel"],
        };
      case "function":
      case "service":
        return {
          type: entityType,
          geometry: "hex",
          material: "standard",
          animations: ["spinRotate"],
          interactions: ["clickSelect", "hoverLabel"],
        };
      case "api":
        return {
          type: entityType,
          geometry: "holo",
          material: "hologram",
          animations: ["scanLine"],
          interactions: ["clickSelect", "hoverLabel"],
        };
      case "container":
      case "database":
        return {
          type: entityType,
          geometry: "box",
          material: "hologram",
          animations: ["wireframePulse"],
          interactions: ["clickSelect", "hoverLabel"],
        };
      default:
        return {
          type: entityType,
          geometry: "orb",
          material: "emissive",
          animations: ["pulseGlow"],
          interactions: ["clickSelect", "hoverLabel"],
        };
    }
  }
}
