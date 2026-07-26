import { EngineeringConstitution, initialConstitutionalPrinciples } from "../constitution/EngineeringConstitution";
import { ConstitutionalDecision } from "../constitution/ConstitutionalDecision";
import { ConstitutionalViolation } from "../constitution/ConstitutionalViolation";
import { ConstitutionalException } from "../constitution/ConstitutionalException";
import { ConstitutionalComplianceReport } from "../constitution/ConstitutionalComplianceReport";

export class ConstitutionRepository {
  private principles = new Map<string, EngineeringConstitution>();
  private decisions = new Map<string, ConstitutionalDecision>();
  private violations = new Map<string, ConstitutionalViolation>();
  private exceptions = new Map<string, ConstitutionalException>();
  private complianceReports: ConstitutionalComplianceReport[] = [];

  constructor() {
    initialConstitutionalPrinciples.forEach(p => this.principles.set(p.principleId, p));
  }

  public savePrinciple(p: EngineeringConstitution): void {
    this.principles.set(p.principleId, p);
  }

  public saveDecision(d: ConstitutionalDecision): void {
    this.decisions.set(d.decisionId, d);
  }

  public saveViolation(v: ConstitutionalViolation): void {
    this.violations.set(v.violationId, v);
  }

  public saveException(e: ConstitutionalException): void {
    this.exceptions.set(e.exceptionId, e);
  }

  public addReport(r: ConstitutionalComplianceReport): void {
    this.complianceReports.push(r);
  }

  public getPrinciplesList(): EngineeringConstitution[] {
    return Array.from(this.principles.values());
  }

  public getDecisionsList(): ConstitutionalDecision[] {
    return Array.from(this.decisions.values());
  }

  public getViolationsList(): ConstitutionalViolation[] {
    return Array.from(this.violations.values());
  }

  public getExceptionsList(): ConstitutionalException[] {
    return Array.from(this.exceptions.values());
  }

  public getReportsList(): ConstitutionalComplianceReport[] {
    return this.complianceReports;
  }

  public clear(): void {
    this.decisions.clear();
    this.violations.clear();
    this.exceptions.clear();
    this.complianceReports = [];
  }
}

export const activeConstitutionRepository = new ConstitutionRepository();
