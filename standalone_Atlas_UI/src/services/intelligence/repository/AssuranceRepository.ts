import { AssuranceCase } from "../assurance/AssuranceCase";
import { CertificationPackage } from "../assurance/CertificationPackage";
import { CertificationDecision } from "../assurance/CertificationDecision";
import { CertificationAuthority, initialCertificationAuthorities } from "../assurance/CertificationAuthority";

export class AssuranceRepository {
  private cases = new Map<string, AssuranceCase>();
  private packages = new Map<string, CertificationPackage>();
  private decisions = new Map<string, CertificationDecision>();
  private authorities = new Map<string, CertificationAuthority>();

  constructor() {
    initialCertificationAuthorities.forEach(a => this.authorities.set(a.authorityId, a));
  }

  public saveCase(ac: AssuranceCase): void {
    this.cases.set(ac.caseId, ac);
  }

  public savePackage(cp: CertificationPackage): void {
    this.packages.set(cp.packageId, cp);
  }

  public saveDecision(cd: CertificationDecision): void {
    this.decisions.set(cd.decisionId, cd);
  }

  public saveAuthority(ca: CertificationAuthority): void {
    this.authorities.set(ca.authorityId, ca);
  }

  public getCasesList(): AssuranceCase[] {
    return Array.from(this.cases.values());
  }

  public getPackagesList(): CertificationPackage[] {
    return Array.from(this.packages.values());
  }

  public getDecisionsList(): CertificationDecision[] {
    return Array.from(this.decisions.values());
  }

  public getAuthoritiesList(): CertificationAuthority[] {
    return Array.from(this.authorities.values());
  }

  public clear(): void {
    this.cases.clear();
    this.packages.clear();
    this.decisions.clear();
  }
}

export const activeAssuranceRepository = new AssuranceRepository();
