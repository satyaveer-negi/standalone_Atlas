import { WorkflowPackage, activeWorkflowRepository } from "./workflowRepository";
import { activeTrustManager } from "./trustManager";
import { activeWorkflowValidator } from "./workflowValidator";

export interface InstallationResult {
  success: boolean;
  message: string;
  trustLevel?: string;
}

// 📦 PROGRAM III.4: PACKAGE INSTALLER SERVICE
export class PackageInstaller {
  public installPackage(pkg: WorkflowPackage, signature: string, publisherKey: string): InstallationResult {
    // 1. Evaluate Trust via TrustManager
    const trustReport = activeTrustManager.evaluateTrust(pkg, signature, publisherKey);
    if (trustReport.level === "Untrusted" || trustReport.level === "Revoked") {
      return {
        success: false,
        message: `Security Block: ${trustReport.details}`,
        trustLevel: trustReport.level
      };
    }

    // 2. Validate structural constraints & dependencies via Validator
    const validationReport = activeWorkflowValidator.validatePackage(pkg);
    if (!validationReport.overallPassed) {
      return {
        success: false,
        message: "Validation Block: Package failed design-time schema or dependency verification checks.",
        trustLevel: trustReport.level
      };
    }

    // 3. Register package within local registry
    activeWorkflowRepository.publishPackage(pkg);

    return {
      success: true,
      message: `Successfully installed package "${pkg.packageId}". Trust certification verified.`,
      trustLevel: trustReport.level
    };
  }
}

export const activePackageInstaller = new PackageInstaller();
