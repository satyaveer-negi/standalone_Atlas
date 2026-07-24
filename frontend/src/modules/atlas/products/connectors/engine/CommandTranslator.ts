import type { ExternalNormalizedEvent } from "./BaseConnector";
import type { EngineeringCommandType } from "../../collaborate/engine/CollaborationEngine";

export interface TranslatedCommandPayload {
  commandType: EngineeringCommandType;
  actorId: string;
  payload: Record<string, any>;
}

export class CommandTranslator {
  translateEvent(evt: ExternalNormalizedEvent): TranslatedCommandPayload {
    if (evt.source === "GitHub" && evt.eventType === "pull_request.opened") {
      return {
        commandType: "CREATE_SERVICE",
        actorId: `github:${evt.payload.author}`,
        payload: { serviceName: `PR-${evt.payload.prId}: ${evt.payload.title}` },
      };
    }

    if (evt.source === "Jira") {
      return {
        commandType: "CREATE_SERVICE",
        actorId: "jira:workflow",
        payload: { serviceName: `Jira Task: ${evt.payload.issueKey}` },
      };
    }

    return {
      commandType: "MOVE_NODE",
      actorId: `${evt.source.toLowerCase()}:alert`,
      payload: { targetId: evt.payload.targetService || "sys-backend" },
    };
  }
}
