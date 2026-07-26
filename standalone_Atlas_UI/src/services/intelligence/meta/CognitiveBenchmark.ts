export interface CognitiveBenchmark {
  benchmarkId: string;
  name: string;
  baselineScore: number;
  currentScore: number;
  delta: number;
  confidence: number;
  trend: "Improving" | "Stable" | "Declining";
  targetScore: number;
}

export const initialCognitiveBenchmarks: CognitiveBenchmark[] = [
  {
    benchmarkId: "cb-plan-succ",
    name: "Planner Success Rate",
    baselineScore: 92.4,
    currentScore: 96.8,
    delta: 4.4,
    confidence: 95,
    trend: "Improving",
    targetScore: 99.0
  },
  {
    benchmarkId: "cb-coun-agree",
    name: "Council Agreement Quality",
    baselineScore: 88.0,
    currentScore: 92.2,
    delta: 4.2,
    confidence: 90,
    trend: "Improving",
    targetScore: 95.0
  },
  {
    benchmarkId: "cb-retr-prec",
    name: "Memory Retrieval Precision",
    baselineScore: 84.5,
    currentScore: 91.0,
    delta: 6.5,
    confidence: 94,
    trend: "Improving",
    targetScore: 95.0
  },
  {
    benchmarkId: "cb-gov-adopt",
    name: "Evolution Proposal Adoption Rate",
    baselineScore: 70.0,
    currentScore: 75.0,
    delta: 5.0,
    confidence: 92,
    trend: "Stable",
    targetScore: 85.0
  }
];
