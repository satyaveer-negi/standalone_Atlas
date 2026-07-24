export interface FactTriple {
  subject: string;
  predicate: string; // e.g., "FEEDS", "POWERS", "CONTROLLED_BY"
  object: string;
}

export class KnowledgeGraph2Engine {
  private triples: FactTriple[] = [
    { subject: "Lithium-Ion Battery Pack", predicate: "FEEDS", object: "12V Power Inverter" },
    { subject: "12V Power Inverter", predicate: "POWERS", object: "Brushless DC Motor" },
    { subject: "Brushless DC Motor", predicate: "DRIVES", object: "Cooling Fluid Pump" },
    { subject: "Cooling Fluid Pump", predicate: "CONTROLLED_BY", object: "PLC Controller" },
  ];

  getTriples(): FactTriple[] {
    return [...this.triples];
  }
}
