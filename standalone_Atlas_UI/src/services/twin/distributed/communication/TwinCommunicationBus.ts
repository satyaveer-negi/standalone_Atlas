import { TwinMessageEnvelope } from "./MessageContracts";

export type BusSubscriber = (msg: TwinMessageEnvelope) => void;

export class TwinCommunicationBus {
  private subscribers: BusSubscriber[] = [];
  private historyLogs: TwinMessageEnvelope[] = [];

  public subscribe(sub: BusSubscriber): () => void {
    this.subscribers.push(sub);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== sub);
    };
  }

  public publishMessage(msg: TwinMessageEnvelope): void {
    this.historyLogs.push(msg);
    this.subscribers.forEach(sub => {
      try {
        sub(msg);
      } catch (err) {
        console.error("[Twin Comm Bus] Dispath failure:", err);
      }
    });
  }

  public getHistoryLogs(): TwinMessageEnvelope[] {
    return [...this.historyLogs];
  }

  public clear(): void {
    this.historyLogs = [];
  }
}

export const activeTwinCommunicationBus = new TwinCommunicationBus();
