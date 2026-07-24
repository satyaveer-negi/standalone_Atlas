export type EngineeringCommandType =
  | "CREATE_SERVICE"
  | "CREATE_API"
  | "DELETE_NODE"
  | "MOVE_NODE"
  | "CONNECT_NODES";

export interface EngineeringCommand {
  id: string;
  type: EngineeringCommandType;
  actorId: string;
  timestamp: number;
  payload: Record<string, any>;
}

export class CollaborationEngine {
  private commandLog: EngineeringCommand[] = [];

  appendCommand(type: EngineeringCommandType, actorId: string, payload: Record<string, any>): EngineeringCommand {
    const cmd: EngineeringCommand = {
      id: `cmd-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      actorId,
      timestamp: Date.now(),
      payload,
    };
    this.commandLog.push(cmd);
    return cmd;
  }

  getCommandHistory(): EngineeringCommand[] {
    return [...this.commandLog];
  }
}
