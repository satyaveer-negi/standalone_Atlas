import { SAMPLE_ADRS } from "../products/learn/engine/DocumentationEntity";
import { PREDEFINED_CONCEPTS } from "../products/learn/engine/ConceptGraph";

export class DocumentationService {
  getAllADRs() {
    return SAMPLE_ADRS;
  }

  getAllConcepts() {
    return PREDEFINED_CONCEPTS;
  }

  getADRForEntity(entityId: string) {
    return SAMPLE_ADRS.filter((adr) => adr.linkedEntityIds.includes(entityId));
  }
}
