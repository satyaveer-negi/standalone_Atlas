export const CameraConfig = {
  defaultMode: "orbit" as const,
  autoRotateSpeed: 0.5,
  dampingFactor: 0.08,
  minDistance: 5,
  maxDistance: 50,
  maxPolarAngle: Math.PI / 2,
};

export const ParticleConfig = {
  starCount: 1500,
  floatingParticleCount: 200,
  particleSpeed: 0.005,
  baseParticleSize: 0.08,
};

export const RuntimeConfig = {
  tickRateMs: 16,
  eventBusBuffer: 100,
  autoSyncWebSocket: true,
};

export const AnimationConfig = {
  pulseFrequency: 2,
  hoverScale: 1.15,
  selectionScale: 1.25,
  floatAmplitude: 0.2,
};

export const DebugConfig = {
  showStats: process.env.NODE_ENV !== "production",
  logEvents: false,
  renderBoundingBoxes: false,
};
