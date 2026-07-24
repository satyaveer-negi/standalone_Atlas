export interface ICommand {
  id: string;
  name: string;
  execute(): any;
  undo(): void;
}

export class AtlasCommandSystem {
  private history: ICommand[] = [];
  private undone: ICommand[] = [];

  executeCommand(cmd: ICommand): any {
    const result = cmd.execute();
    this.history.push(cmd);
    this.undone = [];
    return result;
  }

  undo(): boolean {
    const cmd = this.history.pop();
    if (cmd) {
      cmd.undo();
      this.undone.push(cmd);
      return true;
    }
    return false;
  }

  getHistory(): ICommand[] {
    return [...this.history];
  }
}
