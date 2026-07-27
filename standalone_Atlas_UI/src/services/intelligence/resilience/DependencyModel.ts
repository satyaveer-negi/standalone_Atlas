export interface DependencyModel {
  modelId: string;
  upstreamDependencies: string[];
  downstreamDependencies: string[];
  redundancyRelationships: string[];
  singlePointsOfFailure: string[];
}
