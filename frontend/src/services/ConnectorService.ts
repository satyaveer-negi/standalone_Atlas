import { ConnectorPipeline } from "../products/connectors/engine/ConnectorPipeline";
import { CommandTranslator } from "../products/connectors/engine/CommandTranslator";

export class ConnectorService {
  private pipeline: ConnectorPipeline;
  private translator: CommandTranslator;

  constructor() {
    this.pipeline = new ConnectorPipeline();
    this.translator = new CommandTranslator();
  }

  getPipeline(): ConnectorPipeline {
    return this.pipeline;
  }

  getTranslator(): CommandTranslator {
    return this.translator;
  }
}
