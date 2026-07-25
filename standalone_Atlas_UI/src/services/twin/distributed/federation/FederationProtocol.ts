import { TwinMessageEnvelope } from "../communication/MessageContracts";

export interface FederationProtocol {
  queryTwinState(twinId: string): Promise<Record<string, any>>;
  propagateUpdate(twinId: string, updateMsg: TwinMessageEnvelope): Promise<boolean>;
}
