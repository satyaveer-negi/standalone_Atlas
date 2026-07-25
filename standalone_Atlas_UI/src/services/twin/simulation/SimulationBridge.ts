import { SimulationProvider } from "./SimulationProvider";
import { SimulationSession } from "./SimulationSession";
import { activeTwinStateEngine } from "../state/TwinStateEngine";

export class SimulationBridge {
  private providers = new Map<string, SimulationProvider>();
  private sessions: SimulationSession[] = [];

  public registerProvider(provider: SimulationProvider): void {
    this.providers.set(provider.id, provider);
  }

  public async runSimulation(twinId: string, entityId: string, providerId: string, inputs: Record<string, any>): Promise<void> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      console.warn(`[Simulation Bridge] No registered provider for solver ID: "${providerId}"`);
      return;
    }

    const session: SimulationSession = {
      sessionId: `sim-sess-${Date.now()}`,
      twinId,
      providerId,
      status: "Running",
      startedAt: new Date().toISOString()
    };

    this.sessions.push(session);

    try {
      const outputs = await provider.runSolver(inputs);
      
      outputs.forEach(out => {
        activeTwinStateEngine.updateStateProperty(
          twinId,
          entityId,
          out.propertyName,
          out.value,
          out.unit,
          "Simulated",
          out.confidence
        );
      });

      session.status = "Completed";
      session.completedAt = new Date().toISOString();
      session.outputs = outputs;
      console.log(`[Simulation Bridge] Session "${session.sessionId}" completed. solver: ${provider.name}. Outputs: ${outputs.length}`);
    } catch (err) {
      session.status = "Failed";
      session.completedAt = new Date().toISOString();
      console.error(`[Simulation Bridge] Session failed:`, err);
    }
  }

  public getSessionsForTwin(twinId: string): SimulationSession[] {
    return this.sessions.filter(s => s.twinId === twinId);
  }
}

export const activeSimulationBridge = new SimulationBridge();
