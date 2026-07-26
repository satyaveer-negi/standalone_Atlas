import { EngineeringAction } from "./EngineeringAction";

export class ApprovalWorkflow {
  public requestApproval(action: EngineeringAction): void {
    if (action.approvalChain) {
      action.approvalChain.chainStatus = "Pending";
      console.log(`[Approval Workflow] Requested approval for chain ID ${action.approvalChain.chainId}`);
    }
  }

  public grantApproval(action: EngineeringAction, actor: string): void {
    if (action.approvalChain) {
      action.approvalChain.approvedBy.push(actor);
      action.approvalChain.chainStatus = "Approved";
      action.status = "Approved";
      console.log(`[Approval Workflow] Approval granted by ${actor} for action ID ${action.actionId}`);
    }
  }
}

export const activeApprovalWorkflow = new ApprovalWorkflow();
