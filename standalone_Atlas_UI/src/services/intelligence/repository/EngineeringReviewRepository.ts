import { EngineeringDeliberation } from "../cognition/EngineeringDeliberation";
import { EngineeringReview } from "../cognition/EngineeringReview";
import { EngineeringDecision } from "../cognition/EngineeringDecision";

export class EngineeringReviewRepository {
  private deliberations = new Map<string, EngineeringDeliberation>();
  private reviews = new Map<string, EngineeringReview>();
  private decisions = new Map<string, EngineeringDecision>();

  public saveDeliberation(delib: EngineeringDeliberation): void {
    this.deliberations.set(delib.id, delib);
  }

  public saveReview(rev: EngineeringReview): void {
    this.reviews.set(rev.id, rev);
  }

  public saveDecision(dec: EngineeringDecision): void {
    this.decisions.set(dec.id, dec);
  }

  public getDeliberation(id: string): EngineeringDeliberation | undefined {
    return this.deliberations.get(id);
  }

  public getReviewsList(): EngineeringReview[] {
    return Array.from(this.reviews.values());
  }

  public getDecisionsList(): EngineeringDecision[] {
    return Array.from(this.decisions.values());
  }

  public clear(): void {
    this.deliberations.clear();
    this.reviews.clear();
    this.decisions.clear();
  }
}

export const activeEngineeringReviewRepository = new EngineeringReviewRepository();
