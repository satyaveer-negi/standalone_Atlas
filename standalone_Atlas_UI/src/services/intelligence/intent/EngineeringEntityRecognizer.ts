export class EngineeringEntityRecognizer {
  private dictionary = ["solar-panel-01", "ess-pack-01", "utility-breaker", "propeller-blade"];

  public recognizeEntities(tokens: string[]): string[] {
    const recognized: string[] = [];
    tokens.forEach(tok => {
      // Direct string matching or sub-word overlaps
      const match = this.dictionary.find(ent => ent.includes(tok));
      if (match && !recognized.includes(match)) {
        recognized.push(match);
      }
    });
    return recognized;
  }
}

export const activeEngineeringEntityRecognizer = new EngineeringEntityRecognizer();
