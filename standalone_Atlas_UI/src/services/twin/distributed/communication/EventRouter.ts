import { activeTwinCommunicationBus } from "./TwinCommunicationBus";
import { TwinMessageEnvelope } from "./MessageContracts";

export class EventRouter {
  public routeMessageDirectly(targetTwinId: string, msg: TwinMessageEnvelope): void {
    if (msg.targetTwinId === targetTwinId) {
      activeTwinCommunicationBus.publishMessage(msg);
    }
  }
}

export const activeEventRouter = new EventRouter();
