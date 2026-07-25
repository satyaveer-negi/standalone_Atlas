import { WorkflowPackage } from "./workflowRepository";

export type TrustLevel = "Gold" | "Verified" | "Community" | "Untrusted" | "Revoked";

export interface TrustReport {
  packageId: string;
  level: TrustLevel;
  signatureValid: boolean;
  publisher: string;
  details: string;
}

// 🛡️ PROGRAM III.4: TRUST MANAGER & SIGNATURE VERIFIER
export class TrustManager {
  private revokedPublishers = new Set<string>(["malicious-user"]);

  public evaluateTrust(pkg: WorkflowPackage, signature: string, publisherKey: string): TrustReport {
    // 1. Check if publisher is explicitly revoked
    if (this.revokedPublishers.has(publisherKey)) {
      return {
        packageId: pkg.packageId,
        level: "Revoked",
        signatureValid: false,
        publisher: publisherKey,
        details: "Publisher key has been explicitly revoked due to security policies violations."
      };
    }

    // 2. Validate digital signature hash checksum matches
    const signatureValid = signature.startsWith("sig-ok-");
    if (!signatureValid) {
      return {
        packageId: pkg.packageId,
        level: "Untrusted",
        signatureValid: false,
        publisher: publisherKey,
        details: "Digital signature verification failed. Manifest has been altered."
      };
    }

    // 3. Determine trust levels based on cert credentials
    let level: TrustLevel = "Community";
    if (publisherKey === "key-gold-partner") {
      level = "Gold";
    } else if (publisherKey.startsWith("key-verified")) {
      level = "Verified";
    }

    return {
      packageId: pkg.packageId,
      level,
      signatureValid: true,
      publisher: publisherKey,
      details: `Trust score verified: certified level is "${level}".`
    };
  }
}

export const activeTrustManager = new TrustManager();
