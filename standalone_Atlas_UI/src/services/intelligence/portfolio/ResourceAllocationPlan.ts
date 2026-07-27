export type AllocationResourceType = 
  | "CPU" 
  | "GPU" 
  | "Storage" 
  | "Network" 
  | "Energy" 
  | "Budget";

export interface ResourceAllocationPlan {
  allocationId: string;
  resourceType: AllocationResourceType;
  availableCapacity: number;
  requestedCapacity: number;
  allocatedCapacity: number;
  reservedCapacity: number;
  utilization: number;
  priorityRules: string[];
}
