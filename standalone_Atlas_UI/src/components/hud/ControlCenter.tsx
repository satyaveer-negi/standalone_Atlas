import { useState, useEffect } from "react";
import { activePackageRegistry } from "../../services/packageRegistry";
import type { RegistryPackage } from "../../services/packageRegistry";
import { activeRuntimeManager } from "../../implementations/runtimeManager";
import { activePlatformDebugger } from "../../services/platformDebugger";
import type { DebugEvent, DebugTransaction, BreakpointType } from "../../services/platformDebugger";
import { activeExecutionTraceStore } from "../../services/tracing/executionTraceStore";
import type { ExecutionTrace } from "../../services/tracing/executionTraceStore";
import { activeContractValidator } from "../../services/validation/contractValidator";
import { activeSecurityEngine } from "../../services/security/securityEngine";
import type { SecurityPolicy, SecurityAuditRecord } from "../../services/security/securityEngine";
import { activePerformanceProfiler } from "../../services/profiling/performanceProfiler";
import type { SubsystemMetrics } from "../../services/profiling/performanceProfiler";
import { activePackageCertification } from "../../services/certification/packageCertification";
import type { CertificationReport } from "../../services/certification/packageCertification";
import { activeKQLQueryEngine } from "../../services/kql/parser";
import type { KQLQueryResult, KQLExplainPlan } from "../../services/kql/parser";
import { activeToolAdapters } from "../../services/adapters/externalToolAdapters";
import type { ToolAdapter, AdapterState } from "../../services/adapters/externalToolAdapters";
import { adapterRegistry } from "../../services/adapters/adapterRegistry";
import { activeExecutionManager } from "../../services/runtime/executionManager";
import type { QueuedJob } from "../../services/runtime/executionManager";
import { activeNodeRegistry } from "../../services/runtime/nodeRegistry";
import type { NodeDescriptor } from "../../services/runtime/nodeRegistry";
import { activeFederationCoordinator } from "../../services/federation/federationCoordinator";
import type { FederationQueryLog } from "../../services/federation/federationCoordinator";
import { createPlatformContext } from "../../services/common/platformContext";
import { activeWorkflowEngine } from "../../services/workflow/workflowEngine";
import type { WorkflowDefinition, WorkflowInstance, WorkflowStep } from "../../services/workflow/workflowDefinition";
import { activeRuntimeScheduler, LeastLoadedPolicy, LowestLatencyPolicy } from "../../services/runtime/scheduler";
import type { SchedulingDecision } from "../../services/runtime/scheduler";
import { activeWorkflowEventBus } from "../../services/workflow/workflowEvents";
import type { WorkflowEvent } from "../../services/workflow/workflowEvents";
import { activeWorkflowEventStore } from "../../services/workflow/workflowEventStore";
import { activeReplayEngine } from "../../services/workflow/replayEngine";
import { activeWorkflowRepository } from "../../services/workflow/workflowRepository";
import type { WorkflowPackage, PackageStatus } from "../../services/workflow/workflowRepository";
import { activeWorkflowValidator } from "../../services/workflow/workflowValidator";
import type { PackageValidationReport, ValidationStageResult } from "../../services/workflow/workflowValidator";
import { activeWorkflowMarketplace } from "../../services/workflow/workflowMarketplace";
import type { RemoteMarketplacePackage } from "../../services/workflow/workflowMarketplace";
import { activeTrustManager } from "../../services/workflow/trustManager";
import { activePackageInstaller } from "../../services/workflow/packageInstaller";
import { activeCollaborationHub } from "../../services/workflow/workflowCollaboration";
import type { Comment } from "../../services/workflow/workflowCollaboration";
import { activeGovernanceEngine } from "../../services/workflow/workflowGovernance";
import type { UserRole, ApprovalState, AuditRecord } from "../../services/workflow/workflowGovernance";
import { activeAICoordinator } from "../../services/workflow/workflowAICopilot";
import type { RiskAssessment, ReviewerProfile, WorkflowSuggestion } from "../../services/workflow/workflowAICopilot";
import { activeKnowledgeGraph } from "../../services/workflow/workflowKnowledgeGraph";
import type { GraphNode, GraphEdge } from "../../services/workflow/workflowKnowledgeGraph";
import { activeFederatedGraphCoordinator } from "../../services/workflow/workflowFederatedGraph";
import type { FederationRegistryEntry } from "../../services/workflow/workflowFederatedGraph";
import { activeAutonomousAgentEngine } from "../../services/workflow/workflowAutonomousAgent";
import type { AgentState, AgentLog, LearningRecord } from "../../services/workflow/workflowAutonomousAgent";
import { activeDomainAgentRegistry } from "../../services/agents/registry/domainAgentRegistry";
import type { DomainAgentDescriptor } from "../../services/agents/registry/domainAgentRegistry";
import { activeCoordinatorAgent } from "../../services/agents/collaboration/coordinator/CoordinatorAgent";
import { activeSharedTaskGraph } from "../../services/agents/collaboration/graph/SharedTaskGraph";
import { activeVariableStore } from "../../services/agents/collaboration/graph/VariableStore";
import { activeCollabEventBus } from "../../services/agents/collaboration/events/EventBus";
import type { CollaborativeEvent } from "../../services/agents/collaboration/events/EventTypes";
import type { TaskNode } from "../../services/agents/collaboration/graph/TaskNode";
import type { Variable } from "../../services/agents/collaboration/graph/Variable";
import { activeCapabilityRegistry } from "../../services/agents/collaboration/registry/CapabilityRegistry";
import type { AgentDescriptor } from "../../services/agents/collaboration/registry/AgentDescriptor";
import { activeCollaborationTestSuite } from "../../services/agents/collaboration/tests/collaborationTestSuite";
import type { TestResult } from "../../services/agents/collaboration/tests/reports/VerificationReport";
import { activeTwinRepository } from "../../services/twin/core/TwinRepository";
import { activeTwinStateEngine } from "../../services/twin/state/TwinStateEngine";
import { activeSyncManager } from "../../services/twin/sync/SyncManager";
import { activeSimulationBridge } from "../../services/twin/simulation/SimulationBridge";
import { activeTwinIntelligence } from "../../services/twin/intelligence/TwinIntelligence";
import { activeTwinRegistry } from "../../services/twin/distributed/registry/TwinRegistry";
import { activeTwinNetwork } from "../../services/twin/distributed/federation/TwinNetwork";
import { activeTwinCommunicationBus } from "../../services/twin/distributed/communication/TwinCommunicationBus";
import type { TwinMessageEnvelope } from "../../services/twin/distributed/communication/MessageContracts";
import { activeTwinSynchronizationCoordinator } from "../../services/twin/distributed/sync/TwinSynchronizationCoordinator";
import { activeWorkflowRepository as activeVisualWorkflowRepository } from "../../services/workflow/repository/WorkflowRepository";
import { activeWorkflowExecutionBridge } from "../../services/workflow/execution/WorkflowExecutionBridge";
import { activeGoalPlanner } from "../../services/workflow/orchestration/GoalPlanner";
import { activeWorkflowGenerator } from "../../services/workflow/orchestration/WorkflowGenerator";
import { activeExplainabilityEngine } from "../../services/workflow/orchestration/ExplainabilityEngine";
import { activeScenarioRepository } from "../../services/workflow/scenarios/ScenarioRepository";
import { activeScenarioComparator } from "../../services/workflow/scenarios/ScenarioComparator";
import { WorkflowGraph } from "../../services/workflow/model/WorkflowGraph";
import type { WorkflowDefinition as VisualWorkflowDefinition } from "../../services/workflow/model/WorkflowDefinition";
import type { Scenario } from "../../services/workflow/scenarios/Scenario";
import { activeIntentAssembler } from "../../services/intelligence/intent/IntentAssembler";
import { activeIntentValidator } from "../../services/intelligence/intent/IntentValidator";
import { activeIntentRepository } from "../../services/intelligence/repository/IntentRepository";
import { activeIntentExplanationEngine } from "../../services/intelligence/explainability/IntentExplanationEngine";
import { activeGoalHierarchy } from "../../services/intelligence/intent/GoalHierarchy";
import type { EngineeringIntent } from "../../services/intelligence/intent/EngineeringIntent";
import { activeAutonomousPlanner } from "../../services/intelligence/planning/AutonomousPlanner";
import type { PlanningResult } from "../../services/intelligence/planning/PlanningResult";
import { activePlanningRepository } from "../../services/intelligence/repository/PlanningRepository";
import { activePlanningExplanationEngine } from "../../services/intelligence/explainability/PlanningExplanationEngine";
import { activeEngineeringCouncil } from "../../services/intelligence/cognition/EngineeringCouncil";
import { activeEngineeringReviewRepository } from "../../services/intelligence/repository/EngineeringReviewRepository";
import { activeDecisionCoordinator } from "../../services/intelligence/cognition/DecisionCoordinator";
import type { EngineeringDeliberation } from "../../services/intelligence/cognition/EngineeringDeliberation";
import type { EngineeringReview } from "../../services/intelligence/cognition/EngineeringReview";
import type { EngineeringDecision } from "../../services/intelligence/cognition/EngineeringDecision";
import { activeEngineeringMemory } from "../../services/intelligence/memory/EngineeringMemory";
import { activeKnowledgeSynthesizer } from "../../services/intelligence/memory/KnowledgeSynthesizer";
import { activeLessonsLearned } from "../../services/intelligence/memory/LessonsLearned";
import { activeRecommendationLearner } from "../../services/intelligence/memory/RecommendationLearner";
import { activeDecisionHistory } from "../../services/intelligence/memory/DecisionHistory";
import { activeEngineeringMemoryRepository } from "../../services/intelligence/repository/EngineeringMemoryRepository";
import { activeDecisionIntelligence } from "../../services/intelligence/decision/DecisionIntelligence";
import { activeDecisionRepository } from "../../services/intelligence/repository/DecisionRepository";
import { activeDecisionExplanationEngine } from "../../services/intelligence/decision/DecisionExplanationEngine";
import type { EngineeringRecommendation } from "../../services/intelligence/decision/EngineeringRecommendation";
import { activeContinuousTwinIntelligence } from "../../services/intelligence/runtime/ContinuousTwinIntelligence";
import { activeRuntimePolicyEngine } from "../../services/intelligence/runtime/RuntimePolicyEngine";
import { activeTelemetryManager } from "../../services/intelligence/runtime/TelemetryManager";
import { activeStateChangeDetector } from "../../services/intelligence/runtime/StateChangeDetector";
import { activeEventCorrelationEngine } from "../../services/intelligence/runtime/EventCorrelationEngine";
import { activeEngineeringSituationRepository } from "../../services/intelligence/repository/EngineeringSituationRepository";
import { activeEngineeringHeartbeat } from "../../services/intelligence/runtime/EngineeringHeartbeat";
import { activeNotificationCoordinator } from "../../services/intelligence/runtime/NotificationCoordinator";
import type { EngineeringSituation } from "../../services/intelligence/runtime/EngineeringSituation";
import type { CorrelatedSituation } from "../../services/intelligence/runtime/CorrelatedSituation";
import { activeOperationalGovernance } from "../../services/intelligence/governance/OperationalGovernance";
import { activeEngineeringActionRepository } from "../../services/intelligence/repository/EngineeringActionRepository";
import { activeApprovalWorkflow } from "../../services/intelligence/governance/ApprovalWorkflow";
import type { EngineeringAction } from "../../services/intelligence/governance/EngineeringAction";
import type { GovernanceDecision } from "../../services/intelligence/governance/GovernanceDecision";
import type { GovernanceEvent } from "../../services/intelligence/governance/GovernanceEvent";
import { activeEngineeringKnowledgeSynthesis } from "../../services/intelligence/synthesis/EngineeringKnowledgeSynthesis";
import { activeOperationalOutcomeRepository } from "../../services/intelligence/repository/OperationalOutcomeRepository";
import { activePlaybookGenerator } from "../../services/intelligence/synthesis/PlaybookGenerator";
import { activePatternRefiner } from "../../services/intelligence/synthesis/PatternRefiner";
import { activePolicyEffectivenessEvaluator } from "../../services/intelligence/synthesis/PolicyEffectivenessEvaluator";
import { activeCrossDomainSynthesizer } from "../../services/intelligence/synthesis/CrossDomainSynthesizer";
import type { OperationalOutcome } from "../../services/intelligence/synthesis/OperationalOutcome";
import type { KnowledgeArtifact } from "../../services/intelligence/synthesis/KnowledgeArtifact";
import type { SynthesisSession } from "../../services/intelligence/synthesis/SynthesisSession";
import { activeEvolutionProposalEngine } from "../../services/intelligence/evolution/EvolutionProposalEngine";
import { activeAutonomousEvolutionCoordinator } from "../../services/intelligence/evolution/AutonomousEvolutionCoordinator";
import { activeEvolutionRepository } from "../../services/intelligence/repository/EvolutionRepository";
import type { EvolutionProposal } from "../../services/intelligence/evolution/EvolutionProposal";
import type { EvolutionImpactAssessment } from "../../services/intelligence/evolution/EvolutionImpactAssessment";
import type { EvolutionExperiment } from "../../services/intelligence/evolution/EvolutionExperiment";
import { activeMetaCognitiveOrchestrator } from "../../services/intelligence/meta/MetaCognitiveOrchestrator";
import { activeMetaCognitiveEvaluator } from "../../services/intelligence/meta/MetaCognitiveEvaluator";
import { activeMetaCognitiveRepository } from "../../services/intelligence/repository/MetaCognitiveRepository";
import type { MetaCognitiveAssessment } from "../../services/intelligence/meta/MetaCognitiveAssessment";
import type { CognitiveBenchmark } from "../../services/intelligence/meta/CognitiveBenchmark";
import type { CognitiveEpisode } from "../../services/intelligence/meta/CognitiveEpisode";
import type { CognitiveHealth } from "../../services/intelligence/meta/MetaCognitiveEvaluator";
import { activeConstitutionGuard } from "../../services/intelligence/constitution/ConstitutionGuard";
import { activeConstitutionEvaluator } from "../../services/intelligence/constitution/ConstitutionEvaluator";
import { activeConstitutionRepository } from "../../services/intelligence/repository/ConstitutionRepository";
import type { EngineeringConstitution } from "../../services/intelligence/constitution/EngineeringConstitution";
import type { ConstitutionalDecision } from "../../services/intelligence/constitution/ConstitutionalDecision";
import type { ConstitutionalViolation } from "../../services/intelligence/constitution/ConstitutionalViolation";
import type { ConstitutionalException } from "../../services/intelligence/constitution/ConstitutionalException";
import type { ConstitutionalComplianceReport } from "../../services/intelligence/constitution/ConstitutionalComplianceReport";
import { activeTrustEvaluator } from "../../services/intelligence/trust/TrustEvaluator";
import { activeProvenanceTracker } from "../../services/intelligence/trust/ProvenanceTracker";
import { activeTrustRepository } from "../../services/intelligence/repository/TrustRepository";
import type { KnowledgeTrustRecord } from "../../services/intelligence/trust/KnowledgeTrustRecord";
import type { ProvenanceCustodyNode } from "../../services/intelligence/trust/ProvenanceTracker";
import type { TrustMetrics } from "../../services/intelligence/repository/TrustRepository";
import { activeAssuranceRepository } from "../../services/intelligence/repository/AssuranceRepository";
import type { AssuranceCase } from "../../services/intelligence/assurance/AssuranceCase";
import type { CertificationPackage } from "../../services/intelligence/assurance/CertificationPackage";
import type { CertificationDecision } from "../../services/intelligence/assurance/CertificationDecision";
import type { CertificationAuthority } from "../../services/intelligence/assurance/CertificationAuthority";
import { activeRiskRepository } from "../../services/intelligence/repository/RiskRepository";
import type { RiskCase } from "../../services/intelligence/risk/RiskCase";
import type { Hazard } from "../../services/intelligence/risk/Hazard";
import type { MitigationPlan } from "../../services/intelligence/risk/MitigationPlan";
import type { SafetyCase } from "../../services/intelligence/risk/SafetyCase";
import type { RiskAssessment } from "../../services/intelligence/risk/RiskAssessment";
import type { ResidualRiskAssessment } from "../../services/intelligence/risk/ResidualRiskAssessment";
import type { IncidentRecord } from "../../services/intelligence/risk/IncidentRecord";
import { activeResilienceRepository } from "../../services/intelligence/repository/ResilienceRepository";
import type { ResiliencePlan } from "../../services/intelligence/resilience/ResiliencePlan";
import type { FailureScenario } from "../../services/intelligence/resilience/FailureScenario";
import type { RecoveryStrategy } from "../../services/intelligence/resilience/RecoveryStrategy";
import type { ContinuityPlan } from "../../services/intelligence/resilience/ContinuityPlan";
import type { ResilienceAssessment } from "../../services/intelligence/resilience/ResilienceAssessment";
import type { FailureEvent } from "../../services/intelligence/resilience/FailureEvent";
import type { RecoveryExecution } from "../../services/intelligence/resilience/RecoveryExecution";
import type { DependencyModel } from "../../services/intelligence/resilience/DependencyModel";
import { activeMissionRepository } from "../../services/intelligence/repository/MissionRepository";
import type { MissionDefinition } from "../../services/intelligence/mission/MissionDefinition";
import type { MissionObjective } from "../../services/intelligence/mission/MissionObjective";
import type { MissionState } from "../../services/intelligence/mission/MissionState";
import type { AdaptiveExecutionPlan } from "../../services/intelligence/mission/AdaptiveExecutionPlan";
import type { MissionAssuranceAssessment } from "../../services/intelligence/mission/MissionAssuranceAssessment";
import { activePortfolioRepository } from "../../services/intelligence/repository/PortfolioRepository";
import type { MissionPortfolio } from "../../services/intelligence/portfolio/MissionPortfolio";
import type { CrossMissionDependency } from "../../services/intelligence/portfolio/CrossMissionDependency";
import type { ResourceAllocationPlan } from "../../services/intelligence/portfolio/ResourceAllocationPlan";
import type { SystemOrchestrator } from "../../services/intelligence/portfolio/SystemOrchestrator";
import type { PortfolioAssessment } from "../../services/intelligence/portfolio/PortfolioAssessment";
import "../../services/kql/federatedQueryProvider";
import "../../services/adapters/remoteExecutionProvider";

interface ControlCenterProps {
  onClose: () => void;
}

type ActiveWorkspace =
  | "health"
  | "docs"
  | "registry"
  | "packages"
  | "runtime"
  | "explorer"
  | "debugger"
  | "traces"
  | "observability"
  | "governance"
  | "adapters"
  | "kql"
  | "nodes"
  | "federation"
  | "workflows"
  | "replayDebugger"
  | "marketplace"
  | "copilot"
  | "twinStudio"
  | "intentStudio"
  | "planningStudio"
  | "councilChamber"
  | "memoryStudio"
  | "decisionStudio"
  | "twinContinuous"
  | "operationalGovernance"
  | "knowledgeSynthesis"
  | "engineeringEvolution"
  | "metaCognitive"
  | "engineeringConstitution"
  | "knowledgeTrust"
  | "engineeringAssurance"
  | "engineeringRisk"
  | "engineeringResilience"
  | "agents";

export function ControlCenter({ onClose }: ControlCenterProps) {
  const [activeTab, setActiveTab] = useState<ActiveWorkspace>("health");
  const [packages, setPackages] = useState<RegistryPackage[]>([]);
  const [traces, setTraces] = useState<ExecutionTrace[]>([]);
  const [policies, setPolicies] = useState<SecurityPolicy[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditRecord[]>([]);
  const [metrics, setMetrics] = useState<SubsystemMetrics>(activePerformanceProfiler.getLiveMetrics());

  // Debugger states
  const [debuggerState, setDebuggerState] = useState(activePlatformDebugger.state);
  const [timeline, setTimeline] = useState<DebugEvent[]>(activePlatformDebugger.timeline);
  const [transactions, setTransactions] = useState<DebugTransaction[]>(activePlatformDebugger.transactions);
  const [bpType, setBpType] = useState<BreakpointType>("Event");
  const [bpTarget, setBpTarget] = useState("simulation.completed");
  const [mockLogs, setMockLogs] = useState<string[]>([]);
  const [certificationReport, setCertificationReport] = useState<CertificationReport | null>(null);

  // II.0 States
  const [adapters, setAdapters] = useState<ToolAdapter[]>([]);
  const [kqlQuery, setKqlQuery] = useState("MATCH Package WHERE certification = Gold RETURN id, version");
  const [kqlResult, setKqlResult] = useState<KQLQueryResult | null>(null);
  const [kqlExplain, setKqlExplain] = useState<KQLExplainPlan[] | null>(null);
  const [executionResult, setExecutionResult] = useState<any | null>(null);
  const [jobsQueue, setJobsQueue] = useState<QueuedJob[]>([]);
  const [nodes, setNodes] = useState<NodeDescriptor[]>([]);
  const [federationLogs, setFederationLogs] = useState<FederationQueryLog[]>([]);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // III.0 & III.1 States
  const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>([]);
  const [schedulerPolicy, setSchedulerPolicy] = useState(activeRuntimeScheduler.getPolicyName());
  const [workflowEvents, setWorkflowEvents] = useState<WorkflowEvent[]>([]);
  const [latestDecision, setLatestDecision] = useState<SchedulingDecision | null>(null);

  // III.2 States
  const [selectedEvent, setSelectedEvent] = useState<WorkflowEvent | null>(null);
  const [replayedState, setReplayedState] = useState<WorkflowInstance | null>(null);
  const [filterCorrelationId, setFilterCorrelationId] = useState("");

  // III.3 States
  const [workflowPackages, setWorkflowPackages] = useState<WorkflowPackage[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchDomain, setSearchDomain] = useState("");
  const [validationReport, setValidationReport] = useState<PackageValidationReport | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<WorkflowPackage | null>(null);
  const [importJson, setImportJson] = useState("");

  // III.4 States
  const [marketplaceCatalog, setMarketplaceCatalog] = useState<RemoteMarketplacePackage[]>([]);
  const [selectedMarketplacePackage, setSelectedMarketplacePackage] = useState<RemoteMarketplacePackage | null>(null);
  const [trustBadges, setTrustBadges] = useState<string | null>(null);

  // III.5 States
  const [currentRole, setCurrentRole] = useState<UserRole>("Author");
  const [pkgApprovalState, setPkgApprovalState] = useState<ApprovalState>("Draft");
  const [packageComments, setPackageComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [packageAuditHistory, setPackageAuditHistory] = useState<AuditRecord[]>([]);

  // III.6 States
  const [copilotPrompt, setCopilotPrompt] = useState("CFD simulation pipeline");
  const [aiGeneratedPkg, setAiGeneratedPkg] = useState<WorkflowPackage | null>(null);
  const [aiRiskAssessment, setAiRiskAssessment] = useState<RiskAssessment | null>(null);
  const [aiSuggestedReviewers, setAiSuggestedReviewers] = useState<ReviewerProfile[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<WorkflowSuggestion[]>([]);
  const [retrievedContext, setRetrievedContext] = useState("");

  // III.6.5 States
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);

  // III.7 States
  const [federatedRegistries, setFederatedRegistries] = useState<FederationRegistryEntry[]>([]);

  // III.8 & IV-A States
  const [agentTaskPrompt, setAgentTaskPrompt] = useState("Optimize CFD Grid parameters");
  const [agentState, setAgentState] = useState<AgentState>("Idle");
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [agentLearnings, setAgentLearnings] = useState<LearningRecord[]>([]);
  const [domainAgents, setDomainAgents] = useState<DomainAgentDescriptor[]>([]);

  // IV-B Collaborative States
  const [collabGoalPrompt, setCollabGoalPrompt] = useState("Run CFD audit and compute math matrix");
  const [collabReport, setCollabReport] = useState("");
  const [collabEvents, setCollabEvents] = useState<CollaborativeEvent[]>([]);
  const [collabNodes, setCollabNodes] = useState<TaskNode[]>([]);
  const [collabVariables, setCollabVariables] = useState<Variable[]>([]);
  const [collabAgents, setCollabAgents] = useState<AgentDescriptor[]>([]);
  const [collabRunning, setCollabRunning] = useState(false);
  const [collabTestResults, setCollabTestResults] = useState<TestResult[]>([]);
  const [collabTestRunning, setCollabTestRunning] = useState(false);
  const [twinList, setTwinList] = useState<any[]>([]);
  const [selectedTwinId, setSelectedTwinId] = useState<string>("twin-propeller-01");
  const [twinDiagnosis, setTwinDiagnosis] = useState<any>(null);
  const [distTwinDescriptors, setDistTwinDescriptors] = useState<any[]>([]);
  const [distTwinMessages, setDistTwinMessages] = useState<TwinMessageEnvelope[]>([]);
  const [distTwinLinks, setDistTwinLinks] = useState<any[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<VisualWorkflowDefinition[]>([]);
  const [selectedWorkflowDef, setSelectedWorkflowDef] = useState<VisualWorkflowDefinition | null>(null);
  const [explainabilityEvidence, setExplainabilityEvidence] = useState<any[]>([]);
  const [activeScenarios, setActiveScenarios] = useState<Scenario[]>([]);
  const [comparedMetrics, setComparedMetrics] = useState<any[]>([]);
  const [activeIntent, setActiveIntent] = useState<EngineeringIntent | null>(null);
  const [intentInputText, setIntentInputText] = useState("Optimize solar yield by 15% under grid voltage > 115V constraint");
  const [intentExplanation, setIntentExplanation] = useState<any>(null);
  const [intentValidationLogs, setIntentValidationLogs] = useState<string>("");
  const [planningResult, setPlanningResult] = useState<PlanningResult | null>(null);
  const [activeDeliberation, setActiveDeliberation] = useState<EngineeringDeliberation | null>(null);
  const [activeReview, setActiveReview] = useState<EngineeringReview | null>(null);
  const [activeDecision, setActiveDecision] = useState<EngineeringDecision | null>(null);
  const [synthesizedRec, setSynthesizedRec] = useState<any>(null);
  const [experienceLogs, setExperienceLogs] = useState<any[]>([]);
  const [activeRecommendation, setActiveRecommendation] = useState<EngineeringRecommendation | null>(null);
  const [situations, setSituations] = useState<EngineeringSituation[]>([]);
  const [correlatedSituations, setCorrelatedSituations] = useState<CorrelatedSituation[]>([]);
  const [anomalyTriggered, setAnomalyTriggered] = useState(false);
  const [heartbeatTicks, setHeartbeatTicks] = useState(0);
  const [governedActions, setGovernedActions] = useState<EngineeringAction[]>([]);
  const [governedDecisions, setGovernedDecisions] = useState<GovernanceDecision[]>([]);
  const [governedEvents, setGovernedEvents] = useState<GovernanceEvent[]>([]);
  const [operationalOutcomes, setOperationalOutcomes] = useState<OperationalOutcome[]>([]);
  const [knowledgeArtifacts, setKnowledgeArtifacts] = useState<KnowledgeArtifact[]>([]);
  const [synthesisSessions, setSynthesisSessions] = useState<SynthesisSession[]>([]);
  const [evolutionProposals, setEvolutionProposals] = useState<EvolutionProposal[]>([]);
  const [evolutionAssessments, setEvolutionAssessments] = useState<EvolutionImpactAssessment[]>([]);
  const [evolutionExperiments, setEvolutionExperiments] = useState<EvolutionExperiment[]>([]);
  const [metaAssessments, setMetaAssessments] = useState<MetaCognitiveAssessment[]>([]);
  const [metaBenchmarks, setMetaBenchmarks] = useState<CognitiveBenchmark[]>(activeMetaCognitiveRepository.getBenchmarksList());
  const [metaEpisodes, setMetaEpisodes] = useState<CognitiveEpisode[]>([]);
  const [metaHealth, setMetaHealth] = useState<CognitiveHealth>(activeMetaCognitiveRepository.getHealth());
  const [constitutionalPrinciples, setConstitutionalPrinciples] = useState<EngineeringConstitution[]>(activeConstitutionRepository.getPrinciplesList());
  const [constitutionalDecisions, setConstitutionalDecisions] = useState<ConstitutionalDecision[]>([]);
  const [constitutionalViolations, setConstitutionalViolations] = useState<ConstitutionalViolation[]>([]);
  const [constitutionalExceptions, setConstitutionalExceptions] = useState<ConstitutionalException[]>([]);
  const [constitutionalReports, setConstitutionalReports] = useState<ConstitutionalComplianceReport[]>([]);
  const [trustRecords, setTrustRecords] = useState<KnowledgeTrustRecord[]>([]);
  const [trustHops, setTrustHops] = useState<ProvenanceCustodyNode[]>([]);
  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics>(activeTrustRepository.getMetrics());
  const [assuranceCases, setAssuranceCases] = useState<AssuranceCase[]>([]);
  const [certificationPackages, setCertificationPackages] = useState<CertificationPackage[]>([]);
  const [certificationDecisions, setCertificationDecisions] = useState<CertificationDecision[]>([]);
  const [certificationAuthorities, setCertificationAuthorities] = useState<CertificationAuthority[]>(activeAssuranceRepository.getAuthoritiesList());
  const [riskCases, setRiskCases] = useState<RiskCase[]>([]);
  const [riskHazards, setRiskHazards] = useState<Hazard[]>([]);
  const [riskMitigations, setRiskMitigations] = useState<MitigationPlan[]>([]);
  const [safetyCasesList, setSafetyCasesList] = useState<SafetyCase[]>([]);
  const [riskAssessments, setRiskAssessments] = useState<RiskAssessment[]>([]);
  const [residualRiskAssessments, setResidualRiskAssessments] = useState<ResidualRiskAssessment[]>([]);
  const [incidentRecords, setIncidentRecords] = useState<IncidentRecord[]>([]);
  const [resiliencePlans, setResiliencePlans] = useState<ResiliencePlan[]>([]);
  const [failureScenarios, setFailureScenarios] = useState<FailureScenario[]>([]);
  const [recoveryExecutions, setRecoveryExecutions] = useState<RecoveryExecution[]>([]);
  const [continuityPlans, setContinuityPlans] = useState<ContinuityPlan[]>([]);
  const [resilienceAssessments, setResilienceAssessments] = useState<ResilienceAssessment[]>([]);
  const [failureEvents, setFailureEvents] = useState<FailureEvent[]>([]);
  const [dependencyModels, setDependencyModels] = useState<DependencyModel[]>([]);
  const [missionDefinitions, setMissionDefinitions] = useState<MissionDefinition[]>([]);
  const [missionObjectives, setMissionObjectives] = useState<MissionObjective[]>([]);
  const [missionStatesList, setMissionStatesList] = useState<MissionState[]>([]);
  const [adaptivePlans, setAdaptivePlans] = useState<AdaptiveExecutionPlan[]>([]);
  const [missionAssuranceAssessments, setMissionAssuranceAssessments] = useState<MissionAssuranceAssessment[]>([]);
  const [missionPortfolios, setMissionPortfolios] = useState<MissionPortfolio[]>([]);
  const [crossMissionDependencies, setCrossMissionDependencies] = useState<CrossMissionDependency[]>([]);
  const [resourceAllocationPlans, setResourceAllocationPlans] = useState<ResourceAllocationPlan[]>([]);
  const [systemOrchestrators, setSystemOrchestrators] = useState<SystemOrchestrator[]>([]);
  const [portfolioAssessmentsList, setPortfolioAssessmentsList] = useState<PortfolioAssessment[]>([]);

  useEffect(() => {
    setPackages(activePackageRegistry.getPackagesList());
    setTraces(activeExecutionTraceStore.getTracesList());
    setPolicies(activeSecurityEngine.getPoliciesList());
    setAuditLogs(activeSecurityEngine.getAuditTrail());
    setAdapters(activeToolAdapters.getAdaptersList());
    setJobsQueue(activeExecutionManager.getQueueList());
    setNodes(activeNodeRegistry.getNodesList());
    setFederationLogs(activeFederationCoordinator.getQueryLogs());
    setWorkflowInstances(activeWorkflowEngine.getInstancesList());
    setWorkflowEvents(activeWorkflowEventStore.getEventsList());
    setWorkflowPackages(activeWorkflowRepository.getPackagesList());
    setMarketplaceCatalog(activeWorkflowMarketplace.getRemoteCatalog());
    setGraphNodes(activeKnowledgeGraph.getNodes());
    setGraphEdges(activeKnowledgeGraph.getEdges());
    setFederatedRegistries(activeFederatedGraphCoordinator.getRegistries());
    setAgentState(activeAutonomousAgentEngine.getState());
    setAgentLogs(activeAutonomousAgentEngine.getLogs());
    setAgentLearnings(activeAutonomousAgentEngine.getLearningRecords());
    setDomainAgents(activeDomainAgentRegistry.getAgentsList());
    setCollabAgents(activeCapabilityRegistry.getAgentsList());
    setCollabNodes(activeSharedTaskGraph.getNodes());
    setCollabVariables(activeVariableStore.getVariablesList());
    setCollabEvents(activeCollabEventBus.getEventHistory());

    // Initialize Mock Digital Twin
    let mockTwin = activeTwinRepository.getTwin("twin-propeller-01");
    if (!mockTwin) {
      mockTwin = activeTwinRepository.createTwin("twin-propeller-01", "C-130 Hercules Propeller Twin", "Aerodynamics");
      mockTwin.addEntity({
        id: "propeller-blade",
        name: "Propeller Blade #1",
        type: "MechanicalBlade",
        properties: { temperature: 310, meshOrthogonality: 85 }
      });
      mockTwin.addEntity({
        id: "blade-sensor",
        name: "Telemetry Heat Sensor",
        type: "ThermalSensor",
        properties: { status: "Active" }
      });
      mockTwin.addRelationship({
        id: "rel-sensor-blade",
        sourceEntityId: "blade-sensor",
        targetEntityId: "propeller-blade",
        type: "Control"
      });

      // Register mock sync adapter
      activeSyncManager.registerAdapter("twin-propeller-01", {
        id: "mock-propeller-sensor-telemetry",
        name: "Propeller Thermocouple Sensor Feed",
        fetchUpdates: async () => [
          {
            entityId: "propeller-blade",
            propertyName: "temperature",
            value: 320 + Math.floor(Math.random() * 20),
            unit: "Kelvin",
            provenance: "Observed",
            confidence: 0.98
          },
          {
            entityId: "propeller-blade",
            propertyName: "meshOrthogonality",
            value: 80 - Math.floor(Math.random() * 10),
            unit: "Percent",
            provenance: "Estimated",
            confidence: 0.9
          }
        ]
      });

      // Register mock simulation provider
      activeSimulationBridge.registerProvider({
        id: "openfoam-mesh-solver",
        name: "OpenFOAM Turbulence Solver Engine",
        runSolver: async () => [
          {
            propertyName: "meshOrthogonality",
            value: 92,
            unit: "Percent",
            confidence: 0.99
          }
        ]
      });
    }

    // Initialize Distributed Twin Network
    if (activeTwinRegistry.getDescriptorsList().length === 0) {
      activeTwinRegistry.register({
        id: "pv-twin-01",
        name: "PV Array Solar",
        displayName: "Solar Field PV Array #1",
        domain: "Energy",
        version: "1.0",
        endpoint: { protocol: "http", host: "10.0.0.10", port: 8081, path: "/twin/pv" },
        capabilities: [{ name: "SolarOutput", type: "Sensor", description: "Solar irradiance output yield" }],
        status: "Online",
        owner: "Engineering Operator",
        organization: "Microgrid-Co",
        region: "US-West",
        tags: ["solar", "generation"],
        supportedProtocols: ["http", "ws"],
        securityProfile: "StandardTLS"
      });

      activeTwinRegistry.register({
        id: "battery-twin-01",
        name: "Li-Ion ESS Battery",
        displayName: "Tesla Megapack Storage Array",
        domain: "Energy",
        version: "1.0",
        endpoint: { protocol: "http", host: "10.0.0.11", port: 8082, path: "/twin/battery" },
        capabilities: [{ name: "BatteryCapacity", type: "Sensor", description: "Capacity and SoC levels" }],
        status: "Online",
        owner: "Engineering Operator",
        organization: "Microgrid-Co",
        region: "US-West",
        tags: ["battery", "storage"],
        supportedProtocols: ["http", "ws"],
        securityProfile: "StandardTLS"
      });

      activeTwinRegistry.register({
        id: "grid-twin-01",
        name: "Substation Grid Interface",
        displayName: "Distribution Substation #4",
        domain: "Energy",
        version: "1.0",
        endpoint: { protocol: "http", host: "10.0.0.12", port: 8083, path: "/twin/grid" },
        capabilities: [{ name: "GridVoltage", type: "Sensor", description: "Grid stability and voltage parameters" }],
        status: "Online",
        owner: "Grid Operator",
        organization: "Public Utility",
        region: "US-West",
        tags: ["grid", "substation"],
        supportedProtocols: ["http", "ws"],
        securityProfile: "StandardTLS"
      });

      activeTwinNetwork.addLink("pv-twin-01", "battery-twin-01", 5, 100);
      activeTwinNetwork.addLink("battery-twin-01", "grid-twin-01", 8, 100);

      // Register also in twin repository so we can query entities/state
      const pvT = activeTwinRepository.createTwin("pv-twin-01", "Solar Field PV Array #1", "Energy");
      pvT.addEntity({ id: "solar-panel-01", name: "Panel #1 Array", type: "PVSurface", properties: { solarOutput: 75 } });

      const batT = activeTwinRepository.createTwin("battery-twin-01", "Tesla Megapack Storage Array", "Energy");
      batT.addEntity({ id: "ess-pack-01", name: "Megapack #1 Unit", type: "BatteryPack", properties: { chargeLevel: 62 } });

      const gridT = activeTwinRepository.createTwin("grid-twin-01", "Distribution Substation #4", "Energy");
      gridT.addEntity({ id: "utility-breaker", name: "Main Feeder Breaker", type: "PowerSwitch", properties: { gridVoltage: 120 } });
    }

    // Initialize Visual Workflow Presets
    if (activeVisualWorkflowRepository.getTemplatesList().length === 0) {
      const graph = new WorkflowGraph();
      graph.addNode({
        id: "w-node-1",
        name: "Solar Irradiance Feed",
        category: "Twin",
        type: "TwinNode",
        inputs: [],
        outputs: [{ name: "Irradiance", type: "PowerModel" }],
        properties: { twinId: "pv-twin-01" }
      });
      graph.addNode({
        id: "w-node-2",
        name: "Battery SoC Simulation",
        category: "Simulation",
        type: "SimulationNode",
        inputs: [{ name: "Irradiance", type: "PowerModel" }],
        outputs: [{ name: "SimulationResult", type: "SimulationResult" }],
        properties: { solverName: "MatlabESS" }
      });
      graph.addNode({
        id: "w-node-3",
        name: "Safety Audit Gate",
        category: "Verification",
        type: "VerificationNode",
        inputs: [{ name: "SimulationResult", type: "SimulationResult" }],
        outputs: [{ name: "PassedReport", type: "Report" }],
        properties: { safetyLimitPercent: 20 }
      });

      graph.addConnection({
        id: "w-conn-1",
        sourceNodeId: "w-node-1",
        sourcePortName: "Irradiance",
        targetNodeId: "w-node-2",
        targetPortName: "Irradiance"
      });
      graph.addConnection({
        id: "w-conn-2",
        sourceNodeId: "w-node-2",
        sourcePortName: "SimulationResult",
        targetNodeId: "w-node-3",
        targetPortName: "SimulationResult"
      });

      const templateDef: VisualWorkflowDefinition = {
        id: "wf-microgrid-opt",
        name: "Microgrid Aerodynamics & Solar Yield Optimization",
        version: "v1.2.0",
        graph,
        author: "HP (Chief Architect)",
        updatedAt: new Date().toISOString()
      };

      activeVisualWorkflowRepository.registerTemplate(templateDef);

      // Create Scenarios
      const scenA: Scenario = {
        id: "scen-a",
        name: "Scenario A: Optimal Solar Yield",
        workflowDef: templateDef,
        parameters: { irradianceVal: 85 },
        variables: { batteryStateOfCharge: 88, gridVoltageStability: 120 },
        executionTimeMs: 120,
        verificationReportStatus: "Passed"
      };
      const scenB: Scenario = {
        id: "scen-b",
        name: "Scenario B: Heavy Cloud Transient",
        workflowDef: templateDef,
        parameters: { irradianceVal: 35 },
        variables: { batteryStateOfCharge: 52, gridVoltageStability: 114 },
        executionTimeMs: 145,
        verificationReportStatus: "Failed"
      };

      activeScenarioRepository.saveScenario(scenA);
      activeScenarioRepository.saveScenario(scenB);
    }

    const templates = activeVisualWorkflowRepository.getTemplatesList();
    setWorkflowTemplates(templates);
    if (templates.length > 0) {
      setSelectedWorkflowDef(templates[0]);
    }
    setActiveScenarios(activeScenarioRepository.getScenariosList());

    const scenList = activeScenarioRepository.getScenariosList();
    if (scenList.length >= 2) {
      setComparedMetrics(activeScenarioComparator.compareScenarios(scenList[0], scenList[1]));
    }

    setTwinList(activeTwinRepository.getTwinsList());
    setTwinDiagnosis(activeTwinIntelligence.diagnoseTwin("twin-propeller-01"));

    setDistTwinDescriptors(activeTwinRegistry.getDescriptorsList());
    setDistTwinLinks(activeTwinNetwork.getConnections());
    setDistTwinMessages(activeTwinCommunicationBus.getHistoryLogs());

    // Subscribe to Twin Communication Bus
    const unsubscribeCommBus = activeTwinCommunicationBus.subscribe((msg) => {
      setDistTwinMessages(activeTwinCommunicationBus.getHistoryLogs());
    });

    // Subscribe to Event Bus lifecycle events
    const unsubscribe = activeWorkflowEventBus.subscribe((event) => {
      setWorkflowEvents(activeWorkflowEventStore.getEventsList());
      if (event.eventType === "SchedulingDecisionMade" && event.payload?.decision) {
        setLatestDecision(event.payload.decision);
      }
    });

    const unsubscribeCollab = activeCollabEventBus.subscribe((event) => {
      setCollabEvents(activeCollabEventBus.getEventHistory());
      setCollabNodes(activeSharedTaskGraph.getNodes());
      setCollabVariables(activeVariableStore.getVariablesList());
      setCollabAgents(activeCapabilityRegistry.getAgentsList());
    });

    const interval = setInterval(() => {
      const updatedMetrics: SubsystemMetrics = {
        compilerTimeMs: 1040,
        runtimeBootTimeMs: 400,
        eventBusQueueDepth: Math.floor(5 + Math.random() * 15),
        akgQueryLatencyMs: Math.floor(12 + Math.random() * 8),
        renderFps: Math.floor(58 + Math.random() * 4),
        memoryUsageMb: Math.floor(238 + Math.random() * 12),
      };
      activePerformanceProfiler.recordMetrics(updatedMetrics);
      setMetrics(updatedMetrics);
    }, 2000);

    return () => {
      unsubscribe();
      unsubscribeCollab();
      unsubscribeCommBus();
      clearInterval(interval);
    };
  }, []);

  const handleAction = (id: string, currentStatus: "Installed" | "Active" | "Available") => {
    let nextStatus: "Installed" | "Active" | "Available" = "Available";
    if (currentStatus === "Available") nextStatus = "Installed";
    else if (currentStatus === "Installed") nextStatus = "Active";
    else nextStatus = "Installed";

    activePackageRegistry.updatePackageStatus(id, nextStatus);
    setPackages(activePackageRegistry.getPackagesList());
    setMockLogs(prev => [
      ...prev,
      `[Registry] Package "${id}" transition: ${currentStatus} -> ${nextStatus} succeeded.`
    ]);
  };

  const handleCertify = (id: string) => {
    const report = activePackageCertification.certifyPackage(id, { systemId: id, version: "1.0", ontology: { entities: [{ name: "Test" }] } });
    setCertificationReport(report);
    setMockLogs(prev => [
      ...prev,
      `[Certification] Package "${id}" certified. Level: ${report.certificationLevel}. Quality: ${report.performanceScore}/100.`
    ]);
  };

  const handleDeleteTrace = (id: string) => {
    activeExecutionTraceStore.deleteTrace(id);
    setTraces(activeExecutionTraceStore.getTracesList());
    setMockLogs(prev => [...prev, `[Trace Store] Removed execution trace file: "${id}".`]);
  };

  // Debugger Handlers
  const handleTriggerBP = () => {
    activePlatformDebugger.setBreakpoint(bpType, bpTarget);
    activePlatformDebugger.triggerBreakpointHit();
    setDebuggerState(activePlatformDebugger.state);
    setTimeline([...activePlatformDebugger.timeline]);
    setMockLogs(prev => [
      ...prev,
      `[Debugger] Breakpoint HIT on [${bpType}] target: "${bpTarget}". Execution PAUSED.`,
      `[Debugger] Paused payload details: { id: "evt-402", causationId: "parent-33", provenance: "openfoam" }`
    ]);
  };

  const handleResume = () => {
    activePlatformDebugger.resumeExecution();
    setDebuggerState(activePlatformDebugger.state);
    setTimeline([...activePlatformDebugger.timeline]);
    setMockLogs(prev => [...prev, `[Debugger] Execution resumed. Step modes complete.`]);
  };

  const handleStep = (mode: string) => {
    if (mode === "Event") activePlatformDebugger.stepEvent();
    else if (mode === "Runtime") activePlatformDebugger.stepRuntime();
    else activePlatformDebugger.stepCommit();

    setDebuggerState("STEPPING");
    setMockLogs(prev => [...prev, `[Debugger] Stepped through Knowledge Flow: Step ${mode} execution.`]);
    setTimeout(() => {
      setDebuggerState("PAUSED");
    }, 600);
  };

  // II.0 Handlers
  const handleExecuteKQL = async () => {
    const cleanQuery = kqlQuery.trim().replace(/\s+/g, " ");
    if (cleanQuery.toUpperCase().startsWith("MATCH FEDERATEDNODE")) {
      const qContext = createPlatformContext("q-fed-101", "tr-fed-101");
      const rows = await activeFederationCoordinator.coordinateFederatedQuery(qContext.identity.queryId, cleanQuery);
      setKqlResult({
        headers: ["nodeName", "location", "status", "queryLatencyMs"],
        rows
      });
      setFederationLogs([...activeFederationCoordinator.getQueryLogs()]);
      setMockLogs(prev => [
        ...prev,
        `[Federation Coordinator] Federated query executed. correlationId: ${qContext.identity.correlationId}`
      ]);
    } else {
      const res = await activeKQLQueryEngine.executeQueryAsync(kqlQuery);
      setKqlResult(res);
    }
    setKqlExplain(null);
  };

  const handleExplainKQL = () => {
    const plans = activeKQLQueryEngine.explainQuery(kqlQuery);
    setKqlExplain(plans);
    setKqlResult(null);
    setValidationMsg(null);
    setMockLogs(prev => [...prev, `[KQL Query] Built AST compilation pipeline trace plan.`]);
  };

  const handleValidateKQL = () => {
    const cleanQuery = kqlQuery.trim().replace(/\s+/g, " ");
    const match = cleanQuery.match(/MATCH\s+(\w+)/i);
    if (!match) {
      setValidationMsg("Syntax Error: Query must start with MATCH <entity>");
    } else {
      setValidationMsg(`Ready to Execute: target entity "${match[1]}" is valid.`);
    }
  };

  const handleToggleAdapter = (name: string, state: AdapterState) => {
    const nextState: AdapterState = state === "Connected" ? "Available" : "Connected";
    activeToolAdapters.updateAdapterState(name, nextState);
    setAdapters(activeToolAdapters.getAdaptersList());
    setMockLogs(prev => [...prev, `[Adapter Manager] Transitioned "${name}": ${state} -> ${nextState}.`]);
  };

  const handleExecuteAdapter = async (name: string) => {
    const key = name.toLowerCase().split(" ")[0];
    try {
      const res = await activeExecutionManager.executeJob(key, "simulation.run");
      setExecutionResult(res);
      setJobsQueue([...activeExecutionManager.getQueueList()]);
      setMockLogs(prev => [
        ...prev,
        `[Adapter Exec] ${name} run successful via Execution Manager. Run ID: ${res.runId}, Duration: ${res.duration}ms.`,
        ...res.logs.map(log => `  -> ${log}`)
      ]);
    } catch (e: any) {
      setMockLogs(prev => [...prev, `[Adapter Exec Error] Failed to run ${name}: ${e.message}`]);
    }
  };

  const handleCancelJob = (jobId: string) => {
    activeExecutionManager.cancelJob(jobId);
    setJobsQueue([...activeExecutionManager.getQueueList()]);
    setMockLogs(prev => [...prev, `[Execution Manager] Cancelled job: "${jobId}".`]);
  };

  // III.0 Handlers
  const handleTogglePolicy = () => {
    if (schedulerPolicy.includes("Loaded")) {
      activeRuntimeScheduler.setPolicy(new LowestLatencyPolicy());
    } else {
      activeRuntimeScheduler.setPolicy(new LeastLoadedPolicy());
    }
    setSchedulerPolicy(activeRuntimeScheduler.getPolicyName());
    setNodes(activeNodeRegistry.getNodesList());
  };

  const handleInstantiateWorkflow = (defId: string) => {
    activeWorkflowEngine.createInstance(defId);
    setWorkflowInstances(activeWorkflowEngine.getInstancesList());
    setWorkflowEvents(activeWorkflowEventStore.getEventsList());
  };

  const handleRunWorkflowStep = async (instId: string, stepId: string) => {
    await activeWorkflowEngine.runInstanceStep(instId, stepId);
    setWorkflowInstances(activeWorkflowEngine.getInstancesList());
    setNodes(activeNodeRegistry.getNodesList());
    setJobsQueue([...activeExecutionManager.getQueueList()]);
    setWorkflowEvents(activeWorkflowEventStore.getEventsList());
  };

  // III.2 Replay Actions
  const handleStartReplaySession = (workflowId: string) => {
    const events = activeWorkflowEventStore.getByWorkflow(workflowId);
    if (events.length === 0) return;

    activeReplayEngine.loadHistory(events);
    setReplayedState(activeReplayEngine.stepForward());
    setMockLogs(prev => [...prev, `[Replay Engine] Loaded ${events.length} events. Sequence step 1 applied.`]);
  };

  const handleStepReplay = () => {
    const nextState = activeReplayEngine.stepForward();
    setReplayedState(nextState);
  };

  const handlePlayAllReplay = () => {
    const nextState = activeReplayEngine.playAll();
    setReplayedState(nextState);
  };

  // III.3 Handlers
  const handleImportWorkflowPackage = () => {
    try {
      const parsed = JSON.parse(importJson) as WorkflowPackage;
      const report = activeWorkflowValidator.validatePackage(parsed);
      setValidationReport(report);

      if (report.overallPassed) {
        activeWorkflowRepository.publishPackage(parsed);
        setWorkflowPackages(activeWorkflowRepository.getPackagesList());
        setMockLogs(prev => [...prev, `[Repository] Package "${parsed.packageId}" imported successfully.`]);
      } else {
        setMockLogs(prev => [...prev, `[Repository Validation Error] Package "${parsed.packageId}" rejected.`]);
      }
    } catch (err: any) {
      setMockLogs(prev => [...prev, `[Import JSON Error] Failed to parse JSON package schema: ${err.message}`]);
    }
  };

  const handleValidateSelected = (pkg: WorkflowPackage) => {
    const report = activeWorkflowValidator.validatePackage(pkg);
    setValidationReport(report);

    // Sync III.5 States
    setPkgApprovalState(activeGovernanceEngine.getPackageState(pkg.packageId));
    setPackageComments(activeCollaborationHub.getThread(pkg.packageId).comments);
    setPackageAuditHistory(activeGovernanceEngine.getAuditHistory(pkg.packageId));
  };

  // III.4 Handlers
  const handleInstallMarketplacePackage = (item: RemoteMarketplacePackage) => {
    const res = activePackageInstaller.installPackage(item.package, item.signature, item.publisherKey);
    setMockLogs(prev => [...prev, `[Installer] ${res.message}`]);
    setWorkflowPackages(activeWorkflowRepository.getPackagesList());
  };

  const handleEvaluateMarketplaceTrust = (item: RemoteMarketplacePackage) => {
    const report = activeTrustManager.evaluateTrust(item.package, item.signature, item.publisherKey);
    setTrustBadges(`Publisher: ${report.publisher} | Certification: ${report.level} | Details: ${report.details}`);
  };

  // III.5 Handlers
  const handleAddComment = () => {
    if (!selectedPackage || !newComment) return;
    activeCollaborationHub.addComment(selectedPackage.packageId, currentRole, newComment);
    setPackageComments([...activeCollaborationHub.getThread(selectedPackage.packageId).comments]);
    setNewComment("");
  };

  const handleGovernanceAction = (action: "Submit" | "Approve" | "Reject" | "Promote" | "Publish") => {
    if (!selectedPackage) return;
    const pkgId = selectedPackage.packageId;
    let res = false;

    if (action === "Submit") {
      res = activeGovernanceEngine.submitForReview(pkgId, "HP", currentRole);
    } else if (action === "Approve") {
      res = activeGovernanceEngine.reviewPackage(pkgId, "HP", currentRole, true);
    } else if (action === "Reject") {
      res = activeGovernanceEngine.reviewPackage(pkgId, "HP", currentRole, false);
    } else if (action === "Promote") {
      res = activeGovernanceEngine.promoteToReady(pkgId, "HP", currentRole);
    } else if (action === "Publish") {
      res = activeGovernanceEngine.publishPackage(pkgId, "HP", currentRole);
    }

    setMockLogs(prev => [
      ...prev,
      `[Governance Action] "${action}" requested. Status: ${res ? "SUCCESS" : "DENIED"}`
    ]);

    setPkgApprovalState(activeGovernanceEngine.getPackageState(pkgId));
    setPackageAuditHistory(activeGovernanceEngine.getAuditHistory(pkgId));
  };

  // III.6 Handlers
  const handleTriggerAICopilot = () => {
    const res = activeAICoordinator.generateWorkflowFromPrompt(copilotPrompt);
    setAiGeneratedPkg(res.generatedPackage);
    setAiRiskAssessment(res.riskAssessment);
    setAiSuggestedReviewers(res.suggestedReviewers);
    setAiSuggestions(res.suggestions);
    setRetrievedContext(res.retrievedContext);

    setMockLogs(prev => [
      ...prev,
      `[AI Copilot] Generated package "${res.generatedPackage.packageId}" grounding context: "${res.retrievedContext}"`
    ]);
  };

  const handleInstallAIPackage = () => {
    if (!aiGeneratedPkg) return;
    activeWorkflowRepository.publishPackage(aiGeneratedPkg);
    setWorkflowPackages(activeWorkflowRepository.getPackagesList());
    setMockLogs(prev => [...prev, `[Repository] AI-Generated Package "${aiGeneratedPkg.packageId}" installed.`]);
  };

  // III.8 Handlers
  const handleTriggerAutonomousAgent = async () => {
    setAgentState("Planning");
    await activeAutonomousAgentEngine.runAutonomousCycleAsync(agentTaskPrompt);
    setAgentState(activeAutonomousAgentEngine.getState());
    setAgentLogs(activeAutonomousAgentEngine.getLogs());
    setAgentLearnings(activeAutonomousAgentEngine.getLearningRecords());
    setGraphNodes(activeKnowledgeGraph.getNodes());

    setMockLogs(prev => [
      ...prev,
      `[Autonomous Agent] Completed planning and execution loop for prompt: "${agentTaskPrompt}"`
    ]);
  };

  const handleTriggerCollaborativeAgent = async () => {
    setCollabRunning(true);
    setCollabReport("");
    try {
      const report = await activeCoordinatorAgent.orchestrate(collabGoalPrompt);
      setCollabReport(report);
    } catch (err) {
      console.error("[Control Center] Collaborative Orchestration Crash:", err);
    } finally {
      setCollabRunning(false);
      setCollabNodes(activeSharedTaskGraph.getNodes());
      setCollabVariables(activeVariableStore.getVariablesList());
      setCollabEvents(activeCollabEventBus.getEventHistory());
    }
  };

  const handleRunCollabTestSuite = async () => {
    setCollabTestRunning(true);
    try {
      const results = await activeCollaborationTestSuite.runSuite(collabGoalPrompt);
      setCollabTestResults(results);
    } catch (err) {
      console.error("[Control Center] Collaboration test suite execution crashed:", err);
    } finally {
      setCollabTestRunning(false);
      setCollabNodes(activeSharedTaskGraph.getNodes());
      setCollabVariables(activeVariableStore.getVariablesList());
      setCollabEvents(activeCollabEventBus.getEventHistory());
    }
  };

  const handleTriggerSync = async () => {
    await activeSyncManager.triggerSync(selectedTwinId);
    setTwinList(activeTwinRepository.getTwinsList());
    setTwinDiagnosis(activeTwinIntelligence.diagnoseTwin(selectedTwinId));
  };

  const handleTriggerSimulation = async () => {
    await activeSimulationBridge.runSimulation(selectedTwinId, "propeller-blade", "openfoam-mesh-solver", {});
    setTwinList(activeTwinRepository.getTwinsList());
    setTwinDiagnosis(activeTwinIntelligence.diagnoseTwin(selectedTwinId));
  };

  const handleTriggerCrossTwinSync = () => {
    activeTwinSynchronizationCoordinator.synchronizeTwinProperty(
      "battery-twin-01",
      "ess-pack-01",
      "chargeLevel",
      95,
      10, // version
      0.99, // confidence
      "Observed",
      "HighestConfidence"
    );

    activeTwinCommunicationBus.publishMessage({
      messageId: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      sourceTwinId: "pv-twin-01",
      targetTwinId: "battery-twin-01",
      type: "TwinStateChanged",
      correlationId: `corr-${Date.now()}`,
      payload: { propertyName: "chargeLevel", value: 95, version: 10 }
    });

    setTwinList(activeTwinRepository.getTwinsList());
    setTwinDiagnosis(activeTwinIntelligence.diagnoseTwin(selectedTwinId));
    setDistTwinMessages(activeTwinCommunicationBus.getHistoryLogs());
  };

  const handleTriggerVisualWorkflowExecution = () => {
    if (!selectedWorkflowDef) return;
    
    const session = activeWorkflowExecutionBridge.executeGraph(
      selectedWorkflowDef.graph,
      selectedWorkflowDef.id
    );

    const evidence = activeExplainabilityEngine.traceRecommendation(
      "Microgrid Yield Optimal: Increase battery charge to 95%"
    );
    setExplainabilityEvidence(evidence);

    setMockLogs(prev => [
      ...prev,
      `[Workflow Execution] Visual Graph "${selectedWorkflowDef.name}" execution session ${session.id} transitions: Created -> Running -> Completed.`
    ]);

    setCollabNodes(activeSharedTaskGraph.getNodes());
  };

  const handleGenerateWorkflowFromGoal = () => {
    const goals = activeGoalPlanner.parseGoal(collabGoalPrompt);
    const graph = activeWorkflowGenerator.generateWorkflowFromGoals(goals);
    
    const newDef: VisualWorkflowDefinition = {
      id: `wf-dyn-${Date.now()}`,
      name: `AI: ${collabGoalPrompt}`,
      version: "v1.0.0",
      graph,
      author: "EIOS Planner",
      updatedAt: new Date().toISOString()
    };

    activeVisualWorkflowRepository.saveDraft(newDef);
    setSelectedWorkflowDef(newDef);

    setMockLogs(prev => [
      ...prev,
      `[Goal Planner] Parsed ${goals.length} subgoals from prompt. Assembled visual flow graph.`
    ]);
  };

  const handleParseEngineeringIntent = () => {
    const intent = activeIntentAssembler.assembleIntent(intentInputText);
    const validation = activeIntentValidator.validate(intent);
    
    if (validation.valid) {
      intent.validationStatus = "Validated";
      setIntentValidationLogs("Success: Intent parameters pass all physical boundary constraints checks.");
      activeIntentRepository.saveIntent(intent);
    } else {
      intent.validationStatus = "Conflicting";
      setIntentValidationLogs(`Conflict Error: ${validation.error}`);
    }

    const explanation = activeIntentExplanationEngine.generateExplanation(intent);
    
    setActiveIntent(intent);
    setIntentExplanation(explanation);

    setMockLogs(prev => [
      ...prev,
      `[Intent Engine] Parsed intent ID ${intent.id} status transition: Draft -> ${intent.validationStatus}`
    ]);
  };

  const handleGenerateWorkflowPlans = () => {
    if (!activeIntent) {
      setIntentValidationLogs("Error: You must parse and validate an intent goal before generating workflow plans.");
      return;
    }
    const result = activeAutonomousPlanner.plan(activeIntent);
    activePlanningRepository.savePlanningResult(result);
    setPlanningResult(result);

    setMockLogs(prev => [
      ...prev,
      `[Autonomous Planner] Generated and ranked ${result.candidates.length} visual workflow candidates.`
    ]);
  };

  const handleLoadPlanIntoWorkflowStudio = (cand: any) => {
    const newDef: VisualWorkflowDefinition = {
      id: `wf-${cand.id}-${Date.now()}`,
      name: cand.name,
      version: "v1.0.0",
      graph: cand.graph,
      author: "EIOS Autonomous Planner",
      updatedAt: new Date().toISOString()
    };

    activeVisualWorkflowRepository.saveDraft(newDef);
    setSelectedWorkflowDef(newDef);
    setActiveTab("workflows");

    setMockLogs(prev => [
      ...prev,
      `[Planner] Transferred plan "${cand.name}" directly into Visual Workflow Studio Canvas.`
    ]);
  };

  const handleDeliberateEngineeringIntent = () => {
    if (!activeIntent) {
      setIntentValidationLogs("Error: You must parse and validate an intent goal before deliberating.");
      return;
    }
    
    const { deliberation, review } = activeEngineeringCouncil.deliberate(activeIntent, { temperature: 300 });
    activeEngineeringReviewRepository.saveDeliberation(deliberation);
    activeEngineeringReviewRepository.saveReview(review);

    const selectedCandidate = planningResult?.candidates[0] || null;
    const decision = activeDecisionCoordinator.compileDecision(review, selectedCandidate, "HP (Chief Architect)");
    activeEngineeringReviewRepository.saveDecision(decision);

    setActiveDeliberation(deliberation);
    setActiveReview(review);
    setActiveDecision(decision);

    setMockLogs(prev => [
      ...prev,
      `[Council Chamber] Deliberation ID ${deliberation.id} logged. Consensus Stats: ${review.consensusStats.agreementScore}% Agreement.`
    ]);
  };

  const handleSynthesizeMemoryRecommendations = () => {
    if (!activeIntent) {
      setIntentValidationLogs("Error: You must parse and validate an intent goal before synthesizing memory.");
      return;
    }
    const rec = activeKnowledgeSynthesizer.synthesize(activeIntent.goal);
    setSynthesizedRec(rec);

    setMockLogs(prev => [
      ...prev,
      `[Memory Engine] Synthesized lessons learned and matches from organizational experiences indexes.`
    ]);
  };

  const handleCaptureProjectExperience = (projectName: string, status: "Success" | "Failure") => {
    if (!activeIntent) {
      setIntentValidationLogs("Error: No active intent available to index experience.");
      return;
    }

    const exp = {
      id: `exp-${Date.now()}`,
      projectName,
      intent: activeIntent,
      planningResult,
      decision: activeDecision,
      verificationReportSummary: status === "Success" ? "All assertions passed" : "Safety constraints violation",
      outcomeStatus: status,
      metrics: {
        executionDurationMs: status === "Success" ? 180000 : 25000,
        cpuPeakUsagePercent: 62,
        networkLatencyMs: 15
      },
      createdAt: new Date().toISOString()
    };

    activeEngineeringMemory.captureExperience(exp);
    activeEngineeringMemoryRepository.saveExperience(exp);
    setExperienceLogs(activeEngineeringMemory.getExperiences());

    setMockLogs(prev => [
      ...prev,
      `[Memory Indexer] Captured and archived project "${projectName}" as governed historical experience.`
    ]);
  };

  const handleFormulateDecisionAdvice = () => {
    if (!activeIntent) {
      setIntentValidationLogs("Error: You must parse and validate an intent goal before formulating advice.");
      return;
    }
    const rec = activeDecisionIntelligence.formulateAdvice(activeIntent, planningResult);
    activeDecisionRepository.saveRecommendation(rec);
    setActiveRecommendation(rec);

    setMockLogs(prev => [
      ...prev,
      `[Decision Intelligence] Compiled recommendation ID ${rec.id} (Confidence: ${rec.overallConfidenceScore}%).`
    ]);
  };

  const handleApproveDecisionRecommendation = () => {
    if (!activeRecommendation) return;
    
    const topCand = activeRecommendation.planningResult?.candidates[0] || null;
    if (topCand) {
      handleLoadPlanIntoWorkflowStudio(topCand);
    }

    setMockLogs(prev => [
      ...prev,
      `[Decision Board] Governed Engineering Recommendation ID ${activeRecommendation.id} approved by HP (Chief Architect).`
    ]);
  };

  const handleTriggerHeartbeatCycle = () => {
    activeEngineeringHeartbeat.heartbeat(() => {
      const { situation, correlated, reevaluatedRec } = activeContinuousTwinIntelligence.reassess(
        anomalyTriggered,
        activeRecommendation
      );

      activeEngineeringSituationRepository.saveSituation(situation);
      activeEngineeringSituationRepository.saveCorrelated(correlated);

      setSituations(activeEngineeringSituationRepository.getSituationsList());
      setCorrelatedSituations(activeEngineeringSituationRepository.getCorrelatedList());
      setHeartbeatTicks(activeEngineeringHeartbeat.getTickCount());

      if (reevaluatedRec) {
        setActiveRecommendation(reevaluatedRec);
        setMockLogs(prev => [
          ...prev,
          `[Decision Re-Evaluation] Anomaly triggers reevaluation: Compiled recommendation ID ${reevaluatedRec.id} (Temp: ${situation.twinSnapshot.temperature}°C).`
        ]);
      }

      setMockLogs(prev => [
        ...prev,
        `[Heartbeat Cycle #${activeEngineeringHeartbeat.getTickCount()}] Voltage: ${situation.twinSnapshot.voltage}V | Temp: ${situation.twinSnapshot.temperature}°C | Severity: ${correlated.severity}`
      ]);
    });
  };

  const handleToggleAnomalyState = () => {
    setAnomalyTriggered(prev => {
      const newVal = !prev;
      setMockLogs(log => [
        ...log,
        `[Twin Anomaly Simulation] Toggled simulated telemetry mode to: ${newVal ? "CRITICAL OVERLOAD" : "NOMINAL FLUX"}`
      ]);
      return newVal;
    });
  };

  const handleCompileOperationalGovernance = () => {
    if (situations.length === 0) {
      setMockLogs(prev => [
        ...prev,
        `[Operational Governance] Error: Cannot govern. Active situations list is empty. Run heartbeat telemetry first.`
      ]);
      return;
    }

    const latestSit = situations[situations.length - 1];
    const { action, decision } = activeOperationalGovernance.govern(latestSit, activeRecommendation);

    activeEngineeringActionRepository.saveAction(action);
    activeEngineeringActionRepository.saveDecision(decision);

    const evt: GovernanceEvent = {
      eventId: `gev-${Date.now()}`,
      eventType: "ComplianceAudited",
      relatedActionId: action.actionId,
      policyVersion: decision.policyEvaluated.version,
      actor: "System Authorizer",
      beforeState: "Draft",
      afterState: action.status,
      evidenceLink: decision.complianceReport.evidenceSnapshot,
      correlationId: latestSit.id,
      timestamp: new Date().toISOString()
    };

    activeEngineeringActionRepository.addEvent(evt);

    setGovernedActions(activeEngineeringActionRepository.getActionsList());
    setGovernedDecisions(activeEngineeringActionRepository.getDecisionsList());
    setGovernedEvents(activeEngineeringActionRepository.getEventsList());

    setMockLogs(prev => [
      ...prev,
      `[Operational Governance] Evaluated policy compliance for action ${action.actionId}. Status: ${action.status}`
    ]);
  };

  const handleApproveGovernedAction = (actionId: string) => {
    const list = activeEngineeringActionRepository.getActionsList();
    const action = list.find(a => a.actionId === actionId);

    if (action) {
      activeApprovalWorkflow.grantApproval(action, "HP (Chief Architect)");
      activeEngineeringActionRepository.saveAction(action);

      const evt: GovernanceEvent = {
        eventId: `gev-${Date.now()}`,
        eventType: "AuthorizationGranted",
        relatedActionId: action.actionId,
        policyVersion: action.governingPolicies[0]?.version || 1,
        actor: "HP (Chief Architect)",
        beforeState: "Pending",
        afterState: "Approved",
        evidenceLink: "Operator signoff workflow verification complete",
        correlationId: action.triggerSituation.id,
        timestamp: new Date().toISOString()
      };

      activeEngineeringActionRepository.addEvent(evt);

      setGovernedActions(activeEngineeringActionRepository.getActionsList());
      setGovernedEvents(activeEngineeringActionRepository.getEventsList());

      setMockLogs(prev => [
        ...prev,
        `[Governance Approval] Human approval chain signed by HP. Action ${action.actionId} state marked APPROVED.`
      ]);
    }
  };

  const handleCompileKnowledgeSynthesis = () => {
    if (governedActions.length === 0) {
      setMockLogs(prev => [
        ...prev,
        `[Knowledge Synthesis] Error: No governed actions recorded. Compile operational governance first.`
      ]);
      return;
    }

    const latestAct = governedActions[governedActions.length - 1];
    
    // Simulate execution outcome transition
    const out: OperationalOutcome = {
      outcomeId: `out-${Date.now()}`,
      action: latestAct,
      intent: latestAct.executionIntent || {
        intentId: `mock-intent-${Date.now()}`,
        actionId: latestAct.actionId,
        executionParameters: {},
        timeoutMs: 30000,
        retriesAllowed: 3,
        rollbackTriggerConditions: [],
        verificationCriteria: []
      },
      executionResultStatus: "Success",
      verificationResultSummary: "Nominal converter operating temperatures verified compliant",
      kpiChanges: {
        latencyReductionMs: 140,
        safetyComplianceScore: 99.4
      },
      safetyImpact: "Passed",
      resourceUsage: {
        cpuSeconds: 12,
        peakMemoryMb: 92
      },
      policyCompliancePassed: true,
      lessonsLearnedId: null,
      confidenceScore: 96,
      timestamp: new Date().toISOString()
    };

    activeOperationalOutcomeRepository.saveOutcome(out);

    const { artifact, session } = activeEngineeringKnowledgeSynthesis.runSynthesis([out], ["Solar"]);
    activeOperationalOutcomeRepository.saveArtifact(artifact);
    activeOperationalOutcomeRepository.saveSession(session);

    setOperationalOutcomes(activeOperationalOutcomeRepository.getOutcomesList());
    setKnowledgeArtifacts(activeOperationalOutcomeRepository.getArtifactsList());
    setSynthesisSessions(activeOperationalOutcomeRepository.getSessionsList());

    setMockLogs(prev => [
      ...prev,
      `[Knowledge Synthesis] Synthesized outcome successfully. Created Knowledge Artifact ID ${artifact.artifactId} (Confidence: ${artifact.confidenceScore}%).`
    ]);
  };

  const handleCompileEvolution = () => {
    if (knowledgeArtifacts.length === 0) {
      setMockLogs(prev => [
        ...prev,
        `[Self-Evolution] Error: No knowledge artifacts available. Run playbook synthesis first.`
      ]);
      return;
    }

    const latestArt = knowledgeArtifacts[knowledgeArtifacts.length - 1];
    const prop = activeEvolutionProposalEngine.formulateProposal(latestArt);
    const assessment = activeAutonomousEvolutionCoordinator.assessImpact(prop);
    const experiment = activeAutonomousEvolutionCoordinator.launchExperiment(prop);

    activeEvolutionRepository.saveProposal(prop);
    activeEvolutionRepository.saveAssessment(assessment);
    activeEvolutionRepository.saveExperiment(experiment);

    setEvolutionProposals(activeEvolutionRepository.getProposalsList());
    setEvolutionAssessments(activeEvolutionRepository.getAssessmentsList());
    setEvolutionExperiments(activeEvolutionRepository.getExperimentsList());

    setMockLogs(prev => [
      ...prev,
      `[Self-Evolution] Formulated proposal ${prop.proposalId} (Target: ${prop.implementationTarget}). Launched A/B experiment: Status ${experiment.experimentStatus}.`
    ]);
  };

  const handleApproveEvolutionProposal = (proposalId: string) => {
    const list = activeEvolutionRepository.getProposalsList();
    const prop = list.find(p => p.proposalId === proposalId);

    if (prop) {
      prop.status = "Approved";
      activeEvolutionRepository.saveProposal(prop);
      setEvolutionProposals(activeEvolutionRepository.getProposalsList());

      setMockLogs(prev => [
        ...prev,
        `[Self-Evolution Approval] Evolution proposal ${prop.proposalId} marked APPROVED. Deploying heuristic/policy changes into registry.`
      ]);
    }
  };

  const handleTriggerCognitiveAudit = () => {
    const audits = activeMetaCognitiveOrchestrator.runCognitiveAudit();
    const healthScore = activeMetaCognitiveEvaluator.evaluateOverallHealth(audits);

    audits.forEach(ass => activeMetaCognitiveRepository.saveAssessment(ass));
    activeMetaCognitiveRepository.updateHealth(healthScore);

    const ep: CognitiveEpisode = {
      episodeId: `ep-${Date.now()}`,
      questionText: "Audit cognitive components reasoning quality trends.",
      reasoningPath: [
        "Planner accuracy checked against EIOS verification suite",
        "Negotiation consensus metrics checked for CDF and safety domains reviews"
      ],
      decisionFormulated: `Formulated cognitive health profile (Overall Score: ${healthScore.overallHealthScore}%).`,
      outcomeResultText: healthScore.driftDetected ? "Drift warning active" : "Cognitive parameters stable",
      overallScore: healthScore.overallHealthScore
    };

    activeMetaCognitiveRepository.addEpisode(ep);

    setMetaAssessments(activeMetaCognitiveRepository.getAssessmentsList());
    setMetaHealth(activeMetaCognitiveRepository.getHealth());
    setMetaEpisodes(activeMetaCognitiveRepository.getEpisodesList());

    setMockLogs(prev => [
      ...prev,
      `[Meta-Cognitive Audit] Completed audit. Cognitive Health: ${healthScore.overallHealthScore}%. Drift status: ${healthScore.driftDetected ? "DRIFT DETECTED" : "NOMINAL"}`
    ]);
  };

  const handleTriggerConstitutionalAudit = () => {
    const activeViolations = activeConstitutionRepository.getViolationsList().filter(v => v.status === "Violated");
    const activeExceptions = activeConstitutionRepository.getExceptionsList();

    const report = activeConstitutionEvaluator.compileComplianceReport(activeViolations.length, activeExceptions.length);
    activeConstitutionRepository.addReport(report);

    // Simulate Intercept
    const dec = activeConstitutionGuard.interceptRequest("req-wind-sim-01", "Verifying turbine blade structural boundary limits compliance check.");
    activeConstitutionRepository.saveDecision(dec);

    setConstitutionalDecisions(activeConstitutionRepository.getDecisionsList());
    setConstitutionalReports(activeConstitutionRepository.getReportsList());

    setMockLogs(prev => [
      ...prev,
      `[Constitutional Audit] Compliance score compiled: ${report.overallScore}%. Intercept decision: ${dec.decisionStatus} for target ${dec.targetId}.`
    ]);
  };

  const handleDeclareConstitutionalViolation = () => {
    const v: ConstitutionalViolation = {
      violationId: `vio-${Date.now()}`,
      principleId: "cp-safe-01",
      component: "Planner Strategy Engine",
      severity: "Critical",
      description: "Heuristic voltage boundaries exceeded maximum limits bounds without supervisor consensus override.",
      rootCause: "Turbine load spikes triggered autonomous safety relaxation routine bypass.",
      suggestedRemedy: "Review planner safety limits checking parameters.",
      status: "Violated",
      timestamp: new Date().toISOString()
    };

    activeConstitutionRepository.saveViolation(v);
    setConstitutionalViolations(activeConstitutionRepository.getViolationsList());

    // Trigger report refresh
    const activeViolations = activeConstitutionRepository.getViolationsList().filter(v => v.status === "Violated");
    const activeExceptions = activeConstitutionRepository.getExceptionsList();
    const report = activeConstitutionEvaluator.compileComplianceReport(activeViolations.length, activeExceptions.length);
    activeConstitutionRepository.addReport(report);
    setConstitutionalReports(activeConstitutionRepository.getReportsList());

    setMockLogs(prev => [
      ...prev,
      `[Constitutional Violation] DECLARED CRITICAL VIOLATION in Planner Strategy. Compliance score degraded to ${report.overallScore}%.`
    ]);
  };

  const handleGrantConstitutionalException = () => {
    const e: ConstitutionalException = {
      exceptionId: `exc-${Date.now()}`,
      principleId: "cp-evid-01",
      justification: "Mesh optimization simulations transient calculations bypass for test cycles.",
      approverName: "Operational Council Board",
      expiryTimestamp: new Date(Date.now() + 3600 * 1000).toISOString(),
      scopePath: "windTurbineMeshOptimizationWorkflow",
      auditLink: "file:///C:/Users/HP/.gemini/antigravity-ide/brain/7e242918-7bc4-4b8b-a128-62d5f57154bd/ukop_constitution.md"
    };

    activeConstitutionRepository.saveException(e);
    setConstitutionalExceptions(activeConstitutionRepository.getExceptionsList());

    // Trigger report refresh
    const activeViolations = activeConstitutionRepository.getViolationsList().filter(v => v.status === "Violated");
    const activeExceptions = activeConstitutionRepository.getExceptionsList();
    const report = activeConstitutionEvaluator.compileComplianceReport(activeViolations.length, activeExceptions.length);
    activeConstitutionRepository.addReport(report);
    setConstitutionalReports(activeConstitutionRepository.getReportsList());

    setMockLogs(prev => [
      ...prev,
      `[Constitutional Exception] GRANTED temporary exception for cp-evid-01 by Council. Compliance adjusted: ${report.overallScore}%.`
    ]);
  };

  const handleTriggerTrustEvaluation = () => {
    // 1. Register a new provenance hop
    const hop = activeProvenanceTracker.registerHop(
      "mock-art-trust-01",
      "Knowledge Synthesis Compiler",
      "synthesis-consensus-report-v1"
    );
    activeTrustRepository.saveHop(hop);

    // 2. Evaluate trust
    const ktr = activeTrustEvaluator.evaluateTrust(
      "mock-art-trust-01",
      [hop.nodeId],
      95, // evidence quality score
      ["Tamper check passed", "Signature validated successfully", "Pillar 1 rules verified"],
      "Valid"
    );
    activeTrustRepository.saveRecord(ktr);

    // Refresh UI States
    setTrustHops(activeProvenanceTracker.getHops());
    setTrustRecords(activeTrustRepository.getRecordsList());

    // Update repository metrics
    const list = activeTrustRepository.getRecordsList();
    const sum = list.reduce((acc, curr) => acc + curr.trustScore, 0);
    const averageTrustScore = list.length > 0 ? Math.round(sum / list.length) : 94.2;
    activeTrustRepository.updateMetrics({ averageTrustScore });
    setTrustMetrics(activeTrustRepository.getMetrics());

    setMockLogs(prev => [
      ...prev,
      `[Knowledge Trust] Evaluated trust record ${ktr.recordId}. Trust Score: ${ktr.trustScore}%. Integrity Status: ${ktr.integrityStatus}.`
    ]);
  };

  const handleSimulateTamperAlert = () => {
    if (trustRecords.length === 0) {
      setMockLogs(prev => [...prev, `[Knowledge Trust Alert] Error: No trust records to tamper. Run evaluation first.`]);
      return;
    }

    // Tamper the latest record
    const latest = trustRecords[trustRecords.length - 1];
    latest.integrityStatus = "Invalid";
    latest.trustScore = 0; // Drop trust immediately on tamper alert
    activeTrustRepository.saveRecord(latest);

    // Update metrics
    const currentMetrics = activeTrustRepository.getMetrics();
    activeTrustRepository.updateMetrics({
      tamperedAssetsDetected: currentMetrics.tamperedAssetsDetected + 1
    });

    setTrustRecords(activeTrustRepository.getRecordsList());
    setTrustMetrics(activeTrustRepository.getMetrics());

    setMockLogs(prev => [
      ...prev,
      `[CRITICAL TRUST ALERT] Integrity check FAILED for artifact ${latest.artifactId}! Trust score revoked to 0%. Security interlocks engaged.`
    ]);
  };

  const handleCompileAssuranceCase = () => {
    // 1. Compile Assurance Case
    const caseId = `case-${Date.now()}`;
    const ac: AssuranceCase = {
      caseId,
      targetArtifactId: "mock-art-trust-01",
      claimText: "Turbine blade design mesh calculation margins verified safe for simulation and testing.",
      evidenceIds: ["ktr-mock-art-trust-01", "compliance-p1"],
      assuranceScore: 98,
      reviewStatus: "Certified",
      scope: "Simulation",
      validityPeriod: {
        startDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString() // 1 year
      },
      timestamp: new Date().toISOString()
    };
    activeAssuranceRepository.saveCase(ac);

    // 2. Compile Certification Package
    const packageId = `pkg-${Date.now()}`;
    const cp: CertificationPackage = {
      packageId,
      caseId,
      verificationSummary: "Passed all automated Pillar 1 compliance simulation suite assertions.",
      trustRecordVersionId: "ktr-v1-ref",
      complianceVerificationVersionId: "ccr-v1-ref",
      validUntilDate: ac.validityPeriod.expiryDate
    };
    activeAssuranceRepository.savePackage(cp);

    // 3. Compile Certification Decision signed by Compliance Officer
    const decisionId = `dec-cert-${Date.now()}`;
    const cd: CertificationDecision = {
      decisionId,
      packageId,
      status: "Approved",
      rationale: "Safety margins validated. Cryptographic provenance verified successfully.",
      approverSignature: "sig-key-compliance-officer-rsa",
      decisionVersion: 1,
      supersedesDecisionId: null,
      timestamp: new Date().toISOString()
    };
    activeAssuranceRepository.saveDecision(cd);

    // Refresh UI States
    setAssuranceCases(activeAssuranceRepository.getCasesList());
    setCertificationPackages(activeAssuranceRepository.getPackagesList());
    setCertificationDecisions(activeAssuranceRepository.getDecisionsList());

    setMockLogs(prev => [
      ...prev,
      `[Assurance Case] Compiled case ${ac.caseId} (Scope: ${ac.scope}). Package ${cp.packageId} certified by Compliance Officer. Decision: ${cd.status}.`
    ]);
  };

  const handleSuspendCertification = () => {
    if (certificationDecisions.length === 0) {
      setMockLogs(prev => [...prev, `[Assurance Alert] Error: No active certification decisions to suspend.`]);
      return;
    }

    const latest = certificationDecisions[certificationDecisions.length - 1];
    const supersedesId = latest.decisionId;

    // Create a new version of the decision marking it Suspended
    const cd: CertificationDecision = {
      decisionId: `dec-cert-susp-${Date.now()}`,
      packageId: latest.packageId,
      status: "Suspended",
      rationale: "Safety override interlock triggered by operator or telemetry threshold drift warnings.",
      approverSignature: "sig-key-automated-sha256",
      decisionVersion: latest.decisionVersion + 1,
      supersedesDecisionId: supersedesId,
      timestamp: new Date().toISOString()
    };
    activeAssuranceRepository.saveDecision(cd);

    // Also update reviewStatus of the associated AssuranceCase
    const pkgs = activeAssuranceRepository.getPackagesList();
    const pkg = pkgs.find(p => p.packageId === latest.packageId);
    if (pkg) {
      const casesList = activeAssuranceRepository.getCasesList();
      const acCase = casesList.find(c => c.caseId === pkg.caseId);
      if (acCase) {
        acCase.reviewStatus = "Revoked";
        activeAssuranceRepository.saveCase(acCase);
      }
    }

    // Refresh UI States
    setAssuranceCases(activeAssuranceRepository.getCasesList());
    setCertificationDecisions(activeAssuranceRepository.getDecisionsList());

    setMockLogs(prev => [
      ...prev,
      `[Assurance Revocation] SUSPENDED certification package ${latest.packageId}. New decision version ${cd.decisionVersion} logged. Status: Revoked.`
    ]);
  };

  const handleTriggerRiskAssessment = () => {
    // 1. Register Hazard
    const hazardId = `haz-${Date.now()}`;
    const h: Hazard = {
      hazardId,
      description: "Turbine load transient spikes",
      cause: "High wind simulation transient conditions",
      trigger: "Transient loads exceeds limits threshold",
      consequence: "Blade structural deformation failure",
      severity: 4,
      likelihood: 3,
      detectability: 4,
      exposure: 3,
      controls: ["Automated pitch controller trigger"],
      state: "Controlled"
    };
    activeRiskRepository.saveHazard(h);

    // 2. Register MitigationPlan
    const mitigationPlanId = `mp-${Date.now()}`;
    const mp: MitigationPlan = {
      mitigationPlanId,
      preventiveControls: ["Pitch controller limit logic"],
      detectiveControls: ["Vibration sensors monitoring rules"],
      correctiveControls: ["Load governor bypass activation"],
      verificationActivities: ["Assert governor response latency < 50ms"],
      monitoringRules: ["Check high load triggers"],
      residualRiskTarget: 12,
      implementationStatus: "InEffect",
      responsibleOwner: "Safety Engineering Board",
      verificationCompletionDate: new Date().toISOString()
    };
    activeRiskRepository.saveMitigation(mp);

    // 3. Register RiskAssessment & ResidualRiskAssessment
    const ra: RiskAssessment = {
      assessmentId: `ra-${Date.now()}`,
      likelihood: 3,
      consequence: 4,
      exposure: 3,
      detectability: 4,
      overallRiskRating: 48,
      assessmentMethod: "FMEA Standards",
      assessmentDate: new Date().toISOString()
    };
    activeRiskRepository.saveAssessment(ra);

    const rra: ResidualRiskAssessment = {
      residualAssessmentId: `rra-${Date.now()}`,
      linkedRiskCaseId: `rc-${Date.now()}`,
      mitigationPlanRef: mitigationPlanId,
      initialRisk: 48,
      residualRisk: 12,
      acceptanceRationale: "Residual risk within safe operating margin limits.",
      reviewerName: "Compliance Officer Board",
      approvalDate: new Date().toISOString()
    };
    activeRiskRepository.saveResidualAssessment(rra);

    // 4. Register RiskCase
    const rc: RiskCase = {
      caseId: rra.linkedRiskCaseId,
      targetAssetId: "mock-art-trust-01",
      riskDescription: "Blade structural load deformation under peak high winds conditions",
      hazardsLinked: [hazardId],
      mitigationPlanId,
      initialRiskScore: 48,
      residualRiskScore: 12,
      riskStatus: "Mitigated",
      riskOwner: "Safety Engineering Board",
      reviewDate: new Date(Date.now() + 180 * 24 * 3600 * 1000).toISOString(),
      classification: "Mechanical",
      domain: "PowerSystems"
    };
    activeRiskRepository.saveCase(rc);

    // 5. Compile Safety Case
    const sc: SafetyCase = {
      safetyCaseId: `sc-${Date.now()}`,
      safetyClaim: "Load margins validated compliant. Structural failure risk mitigated.",
      supportingEvidence: ["Verification suite assertions completed successfully"],
      assuranceReferences: ["case-mock-case-01"],
      riskAssessments: [ra.assessmentId],
      mitigationEvidence: ["Governor activation response time < 50ms verified"],
      residualRisk: 12,
      acceptanceCriteria: "Residual risk < 15",
      approvalStatus: "Approved"
    };
    activeRiskRepository.saveSafetyCase(sc);

    // Refresh UI States
    setRiskHazards(activeRiskRepository.getHazardsList());
    setRiskMitigations(activeRiskRepository.getMitigationsList());
    setRiskAssessments(activeRiskRepository.getAssessmentsList());
    setResidualRiskAssessments(activeRiskRepository.getResidualAssessmentsList());
    setRiskCases(activeRiskRepository.getCasesList());
    setSafetyCasesList(activeRiskRepository.getSafetyCasesList());

    setMockLogs(prev => [
      ...prev,
      `[Risk Assessment] Compiled RiskCase ${rc.caseId} (Residual Score: ${rc.residualRiskScore}). SafetyCase ${sc.safetyCaseId} Approved.`
    ]);
  };

  const handleTriggerOperationalIncident = () => {
    if (riskCases.length === 0) {
      setMockLogs(prev => [...prev, `[Risk Alert] Error: No risk cases active. Run risk assessment first.`]);
      return;
    }

    const latestCase = riskCases[riskCases.length - 1];
    
    // Register Incident
    const ir: IncidentRecord = {
      incidentId: `inc-${Date.now()}`,
      linkedRiskCaseId: latestCase.caseId,
      rootCause: "Turbine wind speed transient gust exceeded maximum pitch rate.",
      operationalImpact: "High vibration alert warnings triggered. Transient governor activated.",
      correctiveAction: "Adjust pitch controller response curves dynamically via self-evolution proposals.",
      lessonsLearned: "Improve safety margins checks under rapid wind changes conditions.",
      timestamp: new Date().toISOString()
    };
    activeRiskRepository.saveIncident(ir);

    // Degrade safety case approval status
    const list = activeRiskRepository.getSafetyCasesList();
    if (list.length > 0) {
      const sc = list[list.length - 1];
      sc.approvalStatus = "Rejected"; // Revoke safety status immediately on incident
      activeRiskRepository.saveSafetyCase(sc);
    }

    setIncidentRecords(activeRiskRepository.getIncidentsList());
    setSafetyCasesList(activeRiskRepository.getSafetyCasesList());

    setMockLogs(prev => [
      ...prev,
      `[CRITICAL INCIDENT ALERT] Operational incident logged: ${ir.incidentId}. Safety Case revoked. Security interlocks engaged.`
    ]);
  };

  const handleTriggerFailureSimulation = () => {
    // 1. Register ResiliencePlan
    const planId = `res-plan-${Date.now()}`;
    const rp: ResiliencePlan = {
      planId,
      targetAssetId: "mock-art-trust-01",
      rtoMs: 500,
      rpoMs: 1000,
      degradationLevels: 15,
      redundancyStrategy: "Active Sensor Replication",
      status: "Active",
      criticality: "MissionCritical",
      availabilityTarget: 99.99,
      owner: "Resilience Engineering Board",
      lastValidated: new Date().toISOString(),
      nextValidation: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString()
    };
    activeResilienceRepository.savePlan(rp);

    // 2. Register RecoveryStrategy
    const strategyId = `strat-${Date.now()}`;
    const rs: RecoveryStrategy = {
      strategyId,
      detectionSteps: ["Heartbeat monitor checksum checks"],
      isolationSteps: ["Bypass primary sensor feed line"],
      containmentSteps: ["Engage backup regulator limiter limits"],
      recoverySteps: ["Hot-swap actuator lines"],
      validationSteps: ["Verify recovery stability indices"],
      returnToNormalSteps: ["Reset alert threshold levels"]
    };
    activeResilienceRepository.saveStrategy(rs);

    // 3. Register FailureScenario
    const scenarioId = `scen-${Date.now()}`;
    const fs: FailureScenario = {
      scenarioId,
      trigger: "Primary pitch sensor telemetry dropout",
      failureType: "Communication",
      detectionMethod: "Heartbeat checksum mismatch",
      expectedImpact: "Actuator lockup warnings",
      recoveryStrategyId: strategyId,
      simulationStatus: "Completed",
      validationResult: "Pass",
      affectedAssets: ["mock-art-trust-01"],
      estimatedRecoveryTimeMs: 450,
      linkedResiliencePlanId: planId
    };
    activeResilienceRepository.saveScenario(fs);

    // 4. Register FailureEvent & RecoveryExecution
    const eventId = `evt-${Date.now()}`;
    const fe: FailureEvent = {
      eventId,
      linkedFailureScenarioId: scenarioId,
      detectionTimestamp: new Date().toISOString(),
      impactedAssets: ["mock-art-trust-01"],
      severity: 4,
      recoveryOutcome: "Success"
    };
    activeResilienceRepository.saveEvent(fe);

    const executionId = `exec-${Date.now()}`;
    const re: RecoveryExecution = {
      executionId,
      strategyReferenceId: strategyId,
      startTime: new Date().toISOString(),
      completionTime: new Date(Date.now() + 450).toISOString(),
      successStatus: "Success",
      operatorId: "Automated Safety Gate",
      validationResults: ["Stabilization confirmed in 450ms"]
    };
    activeResilienceRepository.saveExecution(re);

    // 5. Register DependencyModel
    const modelId = `dep-${Date.now()}`;
    const dm: DependencyModel = {
      modelId,
      upstreamDependencies: ["Sensor Feed Controller Service", "Grid Supply Line"],
      downstreamDependencies: ["Bypass Load Regulator Unit", "Hydraulic Pitch Actuator"],
      redundancyRelationships: ["Sensor line A &harr; Sensor line B (Hot-standby)"],
      singlePointsOfFailure: ["Primary Microcontroller Board"]
    };
    activeResilienceRepository.saveDependencyModel(dm);

    // 6. Calculate ResilienceAssessment
    const ra: ResilienceAssessment = {
      assessmentId: `ra-res-${Date.now()}`,
      achievedAvailability: 99.99,
      recoverySuccessRate: 100,
      resilienceMaturity: 5,
      continuityCompliance: 100,
      degradationEfficiency: 95,
      assessmentDate: new Date().toISOString()
    };
    activeResilienceRepository.saveAssessment(ra);

    // Refresh UI States
    setResiliencePlans(activeResilienceRepository.getPlansList());
    setFailureScenarios(activeResilienceRepository.getScenariosList());
    setRecoveryExecutions(activeResilienceRepository.getExecutionsList());
    setResilienceAssessments(activeResilienceRepository.getAssessmentsList());
    setFailureEvents(activeResilienceRepository.getEventsList());
    setDependencyModels(activeResilienceRepository.getDependenciesList());

    setMockLogs(prev => [
      ...prev,
      `[Resilience Simulation] Simulated failure scenario ${fs.scenarioId}. Recovery execution ${re.executionId} completed in 450ms. Status: ${re.successStatus}.`
    ]);
  };

  const handleTriggerGracefulDegradation = () => {
    // Register degraded continuity plan
    const continuityPlanId = `cp-deg-${Date.now()}`;
    const cp: ContinuityPlan = {
      continuityPlanId,
      criticalServices: ["Emergency Pitch Governor Service", "Load Shedding Controller"],
      dependencyPriorities: ["Actuator feedback loops", "Thermal safety monitors"],
      minimumServiceLevels: 75, // Degraded acceptable level
      escalationPaths: ["Notify Lead Safety Engineer", "Trigger automated controlled shutdown"]
    };
    activeResilienceRepository.saveContinuityPlan(cp);

    // Add assessment showing degraded operation
    const ra: ResilienceAssessment = {
      assessmentId: `ra-res-deg-${Date.now()}`,
      achievedAvailability: 99.5,
      recoverySuccessRate: 98,
      resilienceMaturity: 4,
      continuityCompliance: 100,
      degradationEfficiency: 88, // Reduced efficiency under degraded fallback mode
      assessmentDate: new Date().toISOString()
    };
    activeResilienceRepository.saveAssessment(ra);

    setContinuityPlans(activeResilienceRepository.getContinuityPlansList());
    setResilienceAssessments(activeResilienceRepository.getAssessmentsList());

    setMockLogs(prev => [
      ...prev,
      `[Graceful Degradation] Engaged fallback ContinuityPlan ${cp.continuityPlanId}. Minimum service level target is ${cp.minimumServiceLevels}%. System operates in degraded safe state.`
    ]);
  };

  const handleTriggerMissionLaunch = () => {
    // 1. Register MissionDefinition
    const missionId = `mission-${Date.now()}`;
    const md: MissionDefinition = {
      missionId,
      name: "Stabilization under Transient Winds",
      targetSystemId: "twin-mock-system-01",
      priority: "High",
      status: "Executing",
      owner: "Mission Assurance Board",
      launchTimestamp: new Date().toISOString(),
      estimatedDurationMs: 3600000,
      missionType: "Operational",
      successCriteria: ["Stabilize turbine blade dynamic load profiles", "Maintain continuous pitch operations"],
      constraints: ["Load spikes must never trigger mechanical fatigue constitutional bounds"],
      terminationConditions: ["Wind speeds exceed structural cutoff threshold of 45m/s"]
    };
    activeMissionRepository.saveDefinition(md);

    // 2. Register MissionObjective
    const objId = `obj-${Date.now()}`;
    const mo: MissionObjective = {
      objectiveId: objId,
      description: "Turbine pitch cycle response time stabilizer",
      metricTarget: 50,
      metricUnit: "ms",
      weight: 0.6,
      currentFulfillment: 45,
      status: "Met",
      prerequisiteObjectiveIds: []
    };
    activeMissionRepository.saveObjective(mo);

    // 3. Register MissionState
    const stateId = `state-${Date.now()}`;
    const ms: MissionState = {
      stateId,
      missionId,
      activePhase: "Stabilization Loop Activation",
      progressPercentage: 10,
      currentSuccessConfidence: 95.8,
      timestamp: new Date().toISOString(),
      linkedTwinId: "twin-mock-system-01",
      governanceDecisionRef: "dec-mock-gov-01",
      operationalOutcomeRef: "out-mock-outcome-01"
    };
    activeMissionRepository.saveState(ms);

    // 4. Register MissionAssuranceAssessment
    const ra: MissionAssuranceAssessment = {
      assessmentId: `ra-miss-${Date.now()}`,
      successProbability: 95.8,
      objectiveFulfillmentScore: 92,
      assuranceConfidence: 94.5,
      maturityLevel: 5,
      assessmentDate: new Date().toISOString(),
      trendScore: 0.85,
      confidenceInterval: "92%-98%",
      assessmentSource: "Autonomous Verification Engine",
      contributingEvidenceRefs: ["resilience-assert-rto-achievement", "governance-p1"]
    };
    activeMissionRepository.saveAssessment(ra);

    // Refresh UI States
    setMissionDefinitions(activeMissionRepository.getDefinitionsList());
    setMissionObjectives(activeMissionRepository.getObjectivesList());
    setMissionStatesList(activeMissionRepository.getStatesList());
    setMissionAssuranceAssessments(activeMissionRepository.getAssessmentsList());

    setMockLogs(prev => [
      ...prev,
      `[Mission Control] Launched Mission: ${md.name}. Objectives linked. Success confidence registered: ${ms.currentSuccessConfidence}%.`
    ]);
  };

  const handleTriggerAdaptiveReconfiguration = () => {
    if (missionDefinitions.length === 0) {
      setMockLogs(prev => [...prev, `[Mission Alert] Error: No missions currently executing. Launch mission first.`]);
      return;
    }

    const latestMission = missionDefinitions[missionDefinitions.length - 1];

    // 1. Trigger AdaptiveExecutionPlan
    const planId = `ap-exec-${Date.now()}`;
    const ap: AdaptiveExecutionPlan = {
      planId,
      triggerEventId: "evt-mock-event-01",
      adaptationType: "RedundancyActivation",
      actionsList: [
        "Isolate degraded pitch sensor telemetry feed",
        "Enable auxiliary pitch rate bypass loop",
        "Apply governor fatigue limit parameters clamp overrides"
      ],
      executionStatus: "Closed"
    };
    activeMissionRepository.savePlan(ap);

    // 2. Add objective progress updates
    const list = activeMissionRepository.getObjectivesList();
    if (list.length > 0) {
      const o = list[list.length - 1];
      o.currentFulfillment = 38; // ms achieved (better performance after hot redundancy active)
      o.status = "Met";
      activeMissionRepository.saveObjective(o);
    }

    // 3. Register state progression
    const stateId = `state-ap-${Date.now()}`;
    const ms: MissionState = {
      stateId,
      missionId: latestMission.missionId,
      activePhase: "Auxiliary Active Standby Reconfiguration",
      progressPercentage: 65,
      currentSuccessConfidence: 99.2,
      timestamp: new Date().toISOString(),
      linkedTwinId: "twin-mock-system-01",
      governanceDecisionRef: "dec-mock-gov-02",
      operationalOutcomeRef: "out-mock-outcome-02"
    };
    activeMissionRepository.saveState(ms);

    // 4. Generate new assurance assessment reflecting reconfigured safety margins
    const ra: MissionAssuranceAssessment = {
      assessmentId: `ra-miss-ap-${Date.now()}`,
      successProbability: 99.2,
      objectiveFulfillmentScore: 97.5,
      assuranceConfidence: 98.4,
      maturityLevel: 5,
      assessmentDate: new Date().toISOString(),
      trendScore: 0.95,
      confidenceInterval: "98%-100%",
      assessmentSource: "Autonomous Adaptive Orchestrator",
      contributingEvidenceRefs: ["resilience-assert-rto-achievement", "governance-p1", "mock-rec-strat-01"]
    };
    activeMissionRepository.saveAssessment(ra);

    // Refresh UI States
    setMissionObjectives(activeMissionRepository.getObjectivesList());
    setMissionStatesList(activeMissionRepository.getStatesList());
    setAdaptivePlans(activeMissionRepository.getPlansList());
    setMissionAssuranceAssessments(activeMissionRepository.getAssessmentsList());

    setMockLogs(prev => [
      ...prev,
      `[Adaptive Control] Executed Adaptive Plan ${ap.planId} (Redundancy Activation). Mission progress advanced to 65%. Confidence level: ${ms.currentSuccessConfidence}%.`
    ]);
  };

  const handleTriggerPortfolioOrchestration = () => {
    const portfolioId = `portfolio-${Date.now()}`;
    
    // 1. Create portfolio
    const mp: MissionPortfolio = {
      portfolioId,
      name: "Wind Energy System-of-Systems Evolution",
      description: "Coordinating turbines, grid arrays, and safety controllers",
      owner: "System Orchestrator Board",
      organizationId: "org-wind-corp-01",
      priority: "High",
      status: "Active",
      missionIds: ["mission-01", "mission-02"],
      portfolioObjectives: [
        "Maintain total active load dispatch threshold above 300MW",
        "Minimize thermal cycle load fatigue indices"
      ],
      strategicGoals: [
        "ISO 26262 functional safety bounds compliance",
        "EIOS pillar runtime invariants checks satisfaction"
      ],
      portfolioConstraints: ["Budget maximum capacity ceiling at $2M USD"],
      portfolioKPIs: ["Resource utilization rate >= 90%"],
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    activePortfolioRepository.savePortfolio(mp);

    // 2. Save resource allocation plans
    const rapCpu: ResourceAllocationPlan = {
      allocationId: `rap-cpu-${Date.now()}`,
      resourceType: "CPU",
      availableCapacity: 100,
      requestedCapacity: 85,
      allocatedCapacity: 75,
      reservedCapacity: 10,
      utilization: 85,
      priorityRules: ["Reserve remaining CPU bandwidth for wind turbine microgrid telemetry overrides"]
    };
    const rapGpu: ResourceAllocationPlan = {
      allocationId: `rap-gpu-${Date.now()}`,
      resourceType: "GPU",
      availableCapacity: 100,
      requestedCapacity: 90,
      allocatedCapacity: 80,
      reservedCapacity: 10,
      utilization: 90,
      priorityRules: ["Preempt neural network load predictor iterations under heavy thermal load events"]
    };
    const rapStorage: ResourceAllocationPlan = {
      allocationId: `rap-store-${Date.now()}`,
      resourceType: "Storage",
      availableCapacity: 100,
      requestedCapacity: 60,
      allocatedCapacity: 50,
      reservedCapacity: 10,
      utilization: 60,
      priorityRules: ["Store black-box turbine fatigue telemetry records continuously"]
    };
    const rapNet: ResourceAllocationPlan = {
      allocationId: `rap-net-${Date.now()}`,
      resourceType: "Network",
      availableCapacity: 100,
      requestedCapacity: 75,
      allocatedCapacity: 70,
      reservedCapacity: 5,
      utilization: 75,
      priorityRules: ["Isolate inter-grid traffic from operational telemetry query latency bands"]
    };
    activePortfolioRepository.saveResourcePlan(rapCpu);
    activePortfolioRepository.saveResourcePlan(rapGpu);
    activePortfolioRepository.saveResourcePlan(rapStorage);
    activePortfolioRepository.saveResourcePlan(rapNet);

    // 3. System Orchestrator config
    const orchestratorId = `orch-${Date.now()}`;
    const so: SystemOrchestrator = {
      orchestratorId,
      managedMissionIds: ["mission-01", "mission-02"],
      managedTwinIds: ["twin-01", "twin-02"],
      activePolicies: ["Pol-Safety-First", "Pol-Budget-Clamp"],
      executionMode: "Hybrid",
      healthStatus: "Normal",
      orchestrationStrategy: "Balanced"
    };
    activePortfolioRepository.saveOrchestrator(so);

    // 4. Initial Portfolio Assessment
    const pa: PortfolioAssessment = {
      assessmentId: `pa-assess-${Date.now()}`,
      portfolioId,
      overallHealth: 94.2,
      completionProbability: 95.5,
      resourceEfficiency: 92,
      riskIndex: 12.5,
      strategicAlignment: 96.4,
      portfolioResilience: 93.8,
      portfolioThroughput: 310.0,
      assessmentDate: new Date().toISOString()
    };
    activePortfolioRepository.saveAssessment(pa);

    // Refresh UI States
    setMissionPortfolios(activePortfolioRepository.getPortfoliosList());
    setResourceAllocationPlans(activePortfolioRepository.getResourcePlansList());
    setSystemOrchestrators(activePortfolioRepository.getOrchestratorsList());
    setPortfolioAssessmentsList(activePortfolioRepository.getAssessmentsList());

    setMockLogs(prev => [
      ...prev,
      `[Portfolio Control] Initialized Mission Portfolio: ${mp.name}. Execution mode: ${so.executionMode} (Strategy: ${so.orchestrationStrategy}). Assessment overall health: ${pa.overallHealth}%.`
    ]);
  };

  const handleTriggerOptimizationPass = () => {
    if (missionPortfolios.length === 0) {
      setMockLogs(prev => [...prev, `[Portfolio Alert] Error: No portfolios active. Click Launch Portfolio first.`]);
      return;
    }

    const latestPortfolio = missionPortfolios[missionPortfolios.length - 1];
    
    // Update portfolio status
    latestPortfolio.status = "Optimizing";
    latestPortfolio.lastUpdated = new Date().toISOString();
    activePortfolioRepository.savePortfolio(latestPortfolio);

    // Register cross mission dependency
    const dep: CrossMissionDependency = {
      dependencyId: `dep-${Date.now()}`,
      sourceMissionId: "mission-01",
      targetMissionId: "mission-02",
      dependencyType: "Temporal",
      criticality: "High",
      blocking: true,
      relationshipStrength: 0.95,
      impactRule: "Delay in mission-01 propagates a delay of up to 4 hours in mission-02."
    };
    activePortfolioRepository.saveDependency(dep);

    // Rebalance allocated capacities (reducing CPU slightly to balance GPU loads)
    const list = activePortfolioRepository.getResourcePlansList();
    for (const res of list) {
      if (res.resourceType === "CPU") {
        res.allocatedCapacity = 68; // Optimized from 75
        res.utilization = 78;
        activePortfolioRepository.saveResourcePlan(res);
      }
    }

    // Register a new Portfolio Assessment showing optimization results
    const pa: PortfolioAssessment = {
      assessmentId: `pa-assess-opt-${Date.now()}`,
      portfolioId: latestPortfolio.portfolioId,
      overallHealth: 98.4, // Improved health score
      completionProbability: 98.9,
      resourceEfficiency: 97.2, // Improved resource efficiency
      riskIndex: 8.5, // Reduced risk
      strategicAlignment: 99.0,
      portfolioResilience: 96.5,
      portfolioThroughput: 325.0,
      assessmentDate: new Date().toISOString()
    };
    activePortfolioRepository.saveAssessment(pa);

    // Refresh UI States
    setMissionPortfolios(activePortfolioRepository.getPortfoliosList());
    setCrossMissionDependencies(activePortfolioRepository.getDependenciesList());
    setResourceAllocationPlans(activePortfolioRepository.getResourcePlansList());
    setPortfolioAssessmentsList(activePortfolioRepository.getAssessmentsList());

    setMockLogs(prev => [
      ...prev,
      `[Portfolio Optimization] Execution strategy re-allocated CPU demand. Dependencies registered: mission-01 ➔ mission-02. Portfolio Health improved to ${pa.overallHealth}%.`
    ]);
  };

  const filteredEvents = filterCorrelationId
    ? activeWorkflowEventStore.getByCorrelation(filterCorrelationId)
    : workflowEvents;

  const catalogPackages = activeWorkflowRepository.getByFilters(searchText, searchDomain);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[400px] border-t border-cyan-500/40 bg-slate-950/95 backdrop-blur-2xl z-50 text-slate-100 flex flex-col font-sans shadow-2xl">
      {/* 🧭 Header Console Spine */}
      <div className="bg-slate-900 px-6 py-2.5 border-b border-cyan-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-black text-cyan-300 tracking-wider">⚙️ ATLAS PLATFORM STUDIO</span>
          <span className="text-[10px] text-slate-505">v1.2.0-STABLE</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-cyan-300 font-mono transition-colors focus:outline-none"
        >
          [CLOSE]
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 🗂️ Left Workspace Navigation Sidebar */}
        <div className="w-48 bg-slate-900/60 border-r border-slate-800 flex flex-col p-2 gap-1 overflow-y-auto">
          {/* Group 1: Runtime Operations */}
          <span className="text-[9px] text-slate-550 font-bold px-2 py-1 uppercase tracking-wider">Runtime Operations</span>
          <button
            onClick={() => setActiveTab("health")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "health"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            🏠 Health
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "registry"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            📦 Package Registry
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "packages"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            📂 Package Explorer
          </button>
          <button
            onClick={() => setActiveTab("runtime")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "runtime"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-855 text-slate-450"
            }`}
          >
            🔄 Runtime Manager
          </button>
          <button
            onClick={() => setActiveTab("adapters")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "adapters"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            🔌 Tool Hub
          </button>
          <button
            onClick={() => setActiveTab("nodes")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "nodes"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            🖥️ Node Registry
          </button>

          {/* Group 2: Federation & KQL */}
          <span className="text-[9px] text-slate-500 font-bold px-2 py-1 uppercase tracking-wider mt-2">Federation & KQL</span>
          <button
            onClick={() => setActiveTab("kql")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "kql"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🕸️ KQL Console
          </button>
          <button
            onClick={() => setActiveTab("federation")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "federation"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            📡 Federation
          </button>

          {/* Group 3: Workflow Orchestration */}
          <span className="text-[9px] text-slate-550 font-bold px-2 py-1 uppercase tracking-wider mt-2">Workflows</span>
          <button
            onClick={() => setActiveTab("workflows")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "workflows"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-105"
            }`}
          >
            ⚙️ Workflow Dashboard
          </button>
          <button
            onClick={() => setActiveTab("replayDebugger")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "replayDebugger"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            ⏳ Replay Debugger
          </button>
          <button
            onClick={() => setActiveTab("marketplace")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "marketplace"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🛒 Marketplace
          </button>
          <button
            onClick={() => setActiveTab("copilot")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "copilot"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🧠 AI Copilot
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "agents"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🤖 Autonomous Agents
          </button>
          <button
            onClick={() => setActiveTab("twinStudio")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "twinStudio"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            ♊ Digital Twin Studio
          </button>
          <button
            onClick={() => setActiveTab("intentStudio")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "intentStudio"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🧠 Cognitive Intent Studio
          </button>
          <button
            onClick={() => setActiveTab("planningStudio")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "planningStudio"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🗺️ Cognitive Planning Studio
          </button>
          <button
            onClick={() => setActiveTab("councilChamber")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "councilChamber"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🏛️ Cognitive Council Chamber
          </button>
          <button
            onClick={() => setActiveTab("memoryStudio")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "memoryStudio"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            💾 Engineering Memory Studio
          </button>
          <button
            onClick={() => setActiveTab("decisionStudio")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "decisionStudio"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🧠 Decision Intelligence Studio
          </button>
          <button
            onClick={() => setActiveTab("twinContinuous")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "twinContinuous"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🌍 Continuous Twin Studio
          </button>
          <button
            onClick={() => setActiveTab("operationalGovernance")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "operationalGovernance"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🛡️ Operational Governance
          </button>
          <button
            onClick={() => setActiveTab("knowledgeSynthesis")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "knowledgeSynthesis"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            📚 Knowledge Synthesis
          </button>
          <button
            onClick={() => setActiveTab("engineeringEvolution")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "engineeringEvolution"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🧬 Engineering Evolution
          </button>
          <button
            onClick={() => setActiveTab("metaCognitive")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "metaCognitive"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🧠 Meta-Cognitive Studio
          </button>
          <button
            onClick={() => setActiveTab("engineeringConstitution")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "engineeringConstitution"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            📜 Constitution Studio
          </button>
          <button
            onClick={() => setActiveTab("knowledgeTrust")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "knowledgeTrust"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🤝 Trust Studio
          </button>
          <button
            onClick={() => setActiveTab("engineeringAssurance")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "engineeringAssurance"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🎖️ Assurance Studio
          </button>
          <button
            onClick={() => setActiveTab("engineeringRisk")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "engineeringRisk"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            ⚠️ Risk & Safety Studio
          </button>
          <button
            onClick={() => setActiveTab("engineeringResilience")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "engineeringResilience"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🔋 Resilience Studio
          </button>
          <button
            onClick={() => setActiveTab("portfolioIntelligence")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "portfolioIntelligence"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455 text-cyan-100"
            }`}
          >
            🌐 Portfolio Studio
          </button>

          {/* Group 4: Diagnostics */}
          <span className="text-[9px] text-slate-500 font-bold px-2 py-1 uppercase tracking-wider mt-2">Diagnostics</span>
          <button
            onClick={() => setActiveTab("debugger")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "debugger"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            🎛️ Debugger
          </button>
          <button
            onClick={() => setActiveTab("traces")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "traces"
                ? "bg-cyan-500/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-455"
            }`}
          >
            ⏳ Trace History
          </button>
          <button
            onClick={() => setActiveTab("observability")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "observability"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            📊 Observability
          </button>
          <button
            onClick={() => setActiveTab("governance")}
            className={`w-full text-left px-3 py-1.5 rounded text-xs transition-all ${
              activeTab === "governance"
                ? "bg-cyan-505/20 text-cyan-300 border-l-2 border-cyan-400 font-bold"
                : "hover:bg-slate-800 text-slate-450"
            }`}
          >
            🛡️ Governance
          </button>
        </div>

        {/* 💻 Center Workspace Content Viewer */}
        <div className="flex-1 p-5 overflow-y-auto bg-slate-955 text-xs font-sans">
          {activeTab === "health" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">PLATFORM HEALTH SUMMARY</h3>
                <p className="text-[10px] text-slate-505">Live operational compliance diagnostics for UKOP v1.2</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-300 block">Deterministic Kernel</span>
                    <span className="text-[10px] text-slate-400">Layer 1 Message Buses</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-300 block">Compiler Spec</span>
                    <span className="text-[10px] text-slate-400">AIR schema validations</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-300 block">Security Policies</span>
                    <span className="text-[10px] text-slate-400">Permission scopes enforcer</span>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "docs" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-805 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">BOOKS & SPECIFICATION VOLUMES INDEX</h3>
                <p className="text-[10px] text-slate-555">Official reference documentation for UKOP 2.0</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume I: Core Architecture</span>
                  <p className="text-[10px] text-slate-400 mt-1">Explains Layer 1 deterministic kernel and runtime lifecycles.</p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300">Volume II: Contract Specification</span>
                  <p className="text-[10px] text-slate-400 mt-1">Freezes AIR Graph nodes, events schemas, and DI service definitions.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "registry" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">PACKAGE REGISTRY CATALOG</h3>
                  <p className="text-[10px] text-slate-500">Search and manage installed Knowledge System Packs</p>
                </div>
                <button
                  onClick={() => handleAction("astronomy", "Available")}
                  className="bg-cyan-505 text-slate-950 font-bold px-2.5 py-1 rounded hover:bg-cyan-400 transition-colors cursor-pointer"
                >
                  Scaffold Astronomy
                </button>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Package Name</th>
                    <th className="py-2">Quality Grade</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                      <td className="py-2.5 font-bold text-slate-200">{pkg.title}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pkg.qualityLevel === "Platinum"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        }`}>
                          {pkg.qualityLevel}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className={`h-1.5 w-1.5 rounded-full inline-block mr-2 ${
                          pkg.status === "Active" ? "bg-emerald-400" : "bg-yellow-405"
                        }`}></span>
                        {pkg.status}
                      </td>
                      <td className="py-2.5 text-right flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleCertify(pkg.id)}
                          className="bg-purple-600 hover:bg-purple-550 text-white px-2 py-1 rounded text-[10px] cursor-pointer"
                        >
                          Certify
                        </button>
                        <button
                          onClick={() => handleAction(pkg.id, pkg.status)}
                          className="bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-cyan-400 text-[10px] font-mono border border-slate-700 cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {certificationReport && (
                <div className="p-3 bg-slate-900 border border-purple-500/30 rounded mt-3 text-[10px]">
                  <span className="font-bold text-purple-300 block">Certification Report: {certificationReport.packageName}</span>
                  <div className="flex gap-4 mt-2">
                    <span>Level: <strong>{certificationReport.certificationLevel}</strong></span>
                    <span>Performance Score: <strong>{certificationReport.performanceScore}/100</strong></span>
                    <span>Verified: <strong>{certificationReport.verifiedAt}</strong></span>
                  </div>
                  <ul className="list-disc pl-4 text-slate-400 mt-2">
                    {certificationReport.findings.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === "packages" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">📂 PACKAGE EXPLORER</h3>
                <p className="text-[10px] text-slate-500">Inspect schemas, ontology entities, and fields specifications</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {packages.map(p => (
                  <div key={p.id} className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1.5">
                    <span className="font-bold text-slate-200">{p.title}</span>
                    <p className="text-[10px] text-slate-400">{p.description}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-505 mt-2 border-t border-slate-800/60 pt-2">
                      <span>License: <strong>{p.license}</strong></span>
                      <span>Author: <strong>{p.author}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "runtime" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">RUNTIME LIFECYCLE CONTROLLER</h3>
                <p className="text-[10px] text-slate-550">Component loads orders and dependencies verification</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Loaded Component</span>
                    <p className="font-bold text-slate-200 mt-1">knowledgeRuntime</p>
                  </div>
                  <span className="text-emerald-455 font-bold text-[10px]">ACTIVE</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "explorer" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">AIR & AKG SCHEMA GRAPHS EXPLORER</h3>
                <p className="text-[10px] text-slate-505">Real-time counts of knowledge graph and transient representation nodes</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded flex flex-col gap-2">
                  <span className="font-bold text-slate-300">Transient AIR Node Distribution</span>
                  <div className="flex justify-between text-[11px] mt-2">
                    <span className="text-slate-405">Semantic Nodes:</span>
                    <span className="text-cyan-400 font-mono">14</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded flex flex-col gap-2">
                  <span className="font-bold text-slate-300">Persistent AKG Graph Stats</span>
                  <div className="flex justify-between text-[11px] mt-2">
                    <span className="text-slate-405">Knowledge Nodes (AtlasObjects):</span>
                    <span className="text-emerald-400 font-mono">8440</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "debugger" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-purple-300">🎛️ KNOWLEDGE FLOW DEBUGGER</h3>
                  <p className="text-[10px] text-slate-500">Audit, inspect, and step through transaction lifetimes and events</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={bpType}
                    onChange={(e) => setBpType(e.target.value as BreakpointType)}
                    className="bg-slate-900 border border-purple-500/30 rounded px-2 py-0.5 text-purple-300 text-[10px]"
                  >
                    <option value="Event">Event Breakpoint</option>
                    <option value="Runtime">Runtime Breakpoint</option>
                    <option value="AKG">AKG Commit Breakpoint</option>
                  </select>
                  <button
                    onClick={handleTriggerBP}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-2 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    Trigger Breakpoint
                  </button>
                </div>
              </div>

              {/* Step Mode Controllers & Status */}
              <div className="bg-slate-900/60 p-3 rounded border border-purple-500/20 flex justify-between items-center text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">State:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    debuggerState === "PAUSED" ? "bg-red-500/20 text-red-300" : "bg-emerald-500/20 text-emerald-300"
                  }`}>
                    {debuggerState}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStep("Event")}
                    disabled={debuggerState !== "PAUSED"}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-2 py-1 rounded text-purple-300 font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    Step Event
                  </button>
                  <button
                    onClick={() => handleStep("Runtime")}
                    disabled={debuggerState !== "PAUSED"}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-2 py-1 rounded text-purple-300 font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    Step Runtime
                  </button>
                  <button
                    onClick={() => handleStep("Commit")}
                    disabled={debuggerState !== "PAUSED"}
                    className="bg-slate-800 hover:bg-slate-700 disabled:opacity-40 px-2 py-1 rounded text-purple-300 font-mono text-[10px] border border-slate-700 cursor-pointer"
                  >
                    Step Commit
                  </button>
                  <button
                    onClick={handleResume}
                    disabled={debuggerState !== "PAUSED"}
                    className="bg-emerald-600 hover:bg-emerald-555 disabled:opacity-40 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                  >
                    Continue ▶️
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "traces" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">⏳ PERSISTENT TRACE HISTORY</h3>
                <p className="text-[10px] text-slate-550">Audit session logs, export records, and replay execution paths</p>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Trace ID</th>
                    <th className="py-2">Package</th>
                    <th className="py-2">Duration</th>
                    <th className="py-2">Events Count</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {traces.map((trace) => (
                    <tr key={trace.id} className="border-b border-slate-900 hover:bg-slate-900/40">
                      <td className="py-2.5 font-bold text-slate-200">{trace.id}</td>
                      <td className="py-2.5 text-slate-400">{trace.packageName}</td>
                      <td className="py-2.5 text-slate-400 font-mono">{trace.durationMs} ms</td>
                      <td className="py-2.5 text-slate-400 font-mono">{trace.eventsCount}</td>
                      <td className="py-2.5 text-right flex gap-1.5 justify-end">
                        <button
                          onClick={() => {
                            setActiveTab("debugger");
                            handleTriggerBP();
                          }}
                          className="bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 px-2.5 py-0.5 rounded text-[10px] cursor-pointer"
                        >
                          Replay
                        </button>
                        <button
                          onClick={() => handleDeleteTrace(trace.id)}
                          className="bg-slate-805 hover:bg-slate-700 px-2.5 py-0.5 rounded text-red-400 text-[10px] font-mono border border-slate-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 🔌 Tool Hub Workspace */}
          {activeTab === "adapters" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-805 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">🔌 EXTERNAL TOOL ADAPTERS HUB</h3>
                <p className="text-[10px] text-slate-500">Monitor and toggle external simulation, text, and docker integrations</p>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2">Tool Adapter</th>
                    <th className="py-2">State</th>
                    <th className="py-2">Last Handshake</th>
                    <th className="py-2">Capabilities</th>
                    <th className="py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adapters.map((a) => (
                    <tr key={a.name} className="border-b border-slate-900 hover:bg-slate-900/40">
                      <td className="py-2.5 font-bold text-slate-200">
                        {a.name} <span className="text-[9px] text-slate-505 font-mono">v{a.version}</span>
                      </td>
                      <td className="py-2.5 font-mono text-[10px]">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          a.state === "Connected"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : a.state === "Connecting"
                            ? "bg-amber-500/20 text-amber-400 animate-pulse"
                            : "bg-slate-805 text-slate-550"
                        }`}>
                          {a.state}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-400">{a.lastSync}</td>
                      <td className="py-2.5 text-slate-500 font-mono text-[10px]">
                        {a.capabilities.join(", ")}
                      </td>
                      <td className="py-2.5 text-right flex gap-1.5 justify-end">
                        {a.state === "Connected" && (
                          <button
                            onClick={() => handleExecuteAdapter(a.name)}
                            className="bg-emerald-600 hover:bg-emerald-555 text-white px-2 py-1 rounded text-[10px] font-bold cursor-pointer"
                          >
                            Execute
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleAdapter(a.name, a.state)}
                          className="bg-slate-805 hover:bg-slate-700 px-2 py-1 rounded text-cyan-400 text-[10px] font-mono border border-slate-700 cursor-pointer"
                        >
                          {a.state === "Connected" ? "[Disconnect]" : "[Connect]"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {executionResult && (
                <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded mt-3 text-[10px]">
                  <span className="font-bold text-emerald-350 block mb-1">Execution Result: {executionResult.provider}</span>
                  <div className="flex gap-4 text-slate-400 font-mono mb-2">
                    <span>Run ID: <strong>{executionResult.runId}</strong></span>
                    <span>Duration: <strong>{executionResult.duration}ms</strong></span>
                    <span>Trace ID: <strong>{executionResult.traceId}</strong></span>
                  </div>
                  <div className="border-t border-slate-805/60 pt-2 text-[9px] text-slate-400 font-mono">
                    <span className="text-slate-350 block mb-1">Execution Logs:</span>
                    {executionResult.logs.map((log: string, idx: number) => <div key={idx}>&rarr; {log}</div>)}
                  </div>
                  {executionResult.artifacts.length > 0 && (
                    <div className="mt-2 text-slate-505">
                      <span>Artifacts: </span>
                      {executionResult.artifacts.map((art: string, idx: number) => (
                        <span key={idx} className="bg-slate-800 text-cyan-300 px-1 rounded mr-1.5">{art}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {jobsQueue.length > 0 && (
                <div className="p-3 bg-slate-900 border border-slate-805 rounded mt-3 text-[10px] flex flex-col gap-1.5">
                  <span className="font-bold text-slate-400 block border-b border-slate-850 pb-1">Orchestrated Execution Jobs Queue</span>
                  {jobsQueue.map(job => (
                    <div key={job.jobId} className="flex justify-between items-center py-1 border-b border-slate-900/60 last:border-0">
                      <div>
                        <span className="font-mono font-bold text-slate-300">{job.jobId}</span>
                        <span className="text-slate-500 font-mono ml-2">[{job.providerKey}] command: "{job.command}" (Retries: {job.retries})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                          job.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : job.status === "FAILED"
                            ? "bg-red-500/20 text-red-405"
                            : job.status === "CANCELLED"
                            ? "bg-slate-800 text-slate-500"
                            : "bg-amber-500/20 text-amber-400 animate-pulse"
                        }`}>
                          {job.status}
                        </span>
                        {(job.status === "RUNNING" || job.status === "QUEUED") && (
                          <button
                            onClick={() => handleCancelJob(job.jobId)}
                            className="bg-slate-800 hover:bg-slate-700 text-red-405 border border-slate-700 px-1.5 py-0.5 rounded text-[8px] cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 🕸️ KQL Console Workspace */}
          {activeTab === "kql" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">🕸️ KQL QUERY LANGUAGE CONSOLE</h3>
                <p className="text-[10px] text-slate-500">Run graph query matches and inspect tokenization pipeline compilation plans</p>
              </div>

              <div className="flex flex-col gap-2">
                <textarea
                  value={kqlQuery}
                  onChange={(e) => setKqlQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded p-2.5 font-mono text-cyan-300 text-[11px] focus:outline-none focus:ring-1 focus:ring-cyan-500/50 w-full h-[50px] resize-none"
                />
                 <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleValidateKQL}
                    className="bg-slate-805 hover:bg-slate-700 text-purple-300 border border-slate-700 px-3 py-1 rounded text-[10px] font-mono cursor-pointer"
                  >
                    VALIDATE
                  </button>
                  <button
                    onClick={handleExplainKQL}
                    className="bg-slate-805 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-1 rounded text-[10px] font-mono cursor-pointer"
                  >
                    EXPLAIN
                  </button>
                  <button
                    onClick={handleExecuteKQL}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                  >
                    EXECUTE QUERY
                  </button>
                </div>
              </div>

              {validationMsg && (
                <div className="p-3.5 bg-slate-905 border border-purple-500/30 rounded text-[10.5px] font-mono">
                  <span className="font-bold text-purple-300 block mb-1">Query Lint Validator:</span>
                  <span className={validationMsg.startsWith("Syntax") ? "text-red-400" : "text-emerald-405"}>
                    {validationMsg}
                  </span>
                </div>
              )}

              {kqlResult && (
                <div className="border border-slate-800 rounded bg-slate-900/60 p-3 mt-2">
                  <span className="font-bold text-slate-300 block mb-2">QueryResult Set</span>
                  {kqlResult.diagnostics ? (
                    <span className="text-red-400 font-mono text-[10px]">{kqlResult.diagnostics}</span>
                  ) : (
                    <table className="w-full text-left border-collapse text-[10px] font-mono">
                      <thead>
                        <tr className="border-b border-slate-805 text-slate-500">
                          {kqlResult.headers.map(h => <th key={h} className="pb-1">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {kqlResult.rows.map((row, index) => (
                          <tr key={index} className="border-b border-slate-900/40">
                            {kqlResult.headers.map(h => <td key={h} className="py-1">{row[h]}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {kqlExplain && (
                <div className="border border-purple-500/30 rounded bg-slate-900/60 p-3 mt-2">
                  <span className="font-bold text-purple-300 block mb-2">KQL Compiler Explain Pipeline Map</span>
                  <div className="flex flex-col gap-2 font-mono text-[9px]">
                    {kqlExplain.map((e, index) => (
                      <div key={index} className="flex justify-between border-b border-slate-850 pb-1">
                        <span className="text-slate-400">{e.stage}:</span>
                        <span className="text-purple-300">{e.description} <strong className="text-slate-500">({e.durationMs}ms)</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "nodes" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">🖥️ DISTRIBUTED NODE REGISTRY</h3>
                <p className="text-[10px] text-slate-550">Live heartbeat monitoring and node load metrics</p>
              </div>
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-505 font-bold">
                    <th className="py-1">Node ID</th>
                    <th className="py-1">Endpoint</th>
                    <th className="py-1">Latency</th>
                    <th className="py-1">State</th>
                    <th className="py-1">Capacity/Load</th>
                    <th className="py-1">Health Score</th>
                    <th className="py-1 text-right">Heartbeat</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(n => (
                    <tr key={n.nodeId} className="border-b border-slate-900/60 hover:bg-slate-900/20">
                      <td className="py-2.5 font-bold text-slate-200">
                        {n.name} <div className="text-[9px] text-slate-500 font-mono mt-0.5">{n.capabilities.join(", ")}</div>
                      </td>
                      <td className="py-2.5 font-mono text-slate-400">{n.endpoint}</td>
                      <td className="py-2.5 font-mono text-cyan-400">{n.latency} ms</td>
                      <td className="py-2.5 font-mono">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          n.state === "ONLINE" ? "bg-emerald-500/20 text-emerald-450" : "bg-slate-800 text-slate-505"
                        }`}>{n.state}</span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-350">{n.currentLoad}/{n.maxCapacity} MB</td>
                      <td className="py-2.5 font-bold text-cyan-300">{n.healthScore}%</td>
                      <td className="py-2.5 text-right text-slate-500 font-mono">{n.lastHeartbeat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "federation" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">📡 FEDERATED KNOWLEDGE REGISTRIES</h3>
                <p className="text-[10px] text-slate-500">Multi-organization registry configuration profiles and latency metrics</p>
              </div>
              <table className="w-full text-left border-collapse text-[10px] font-mono">
                <thead>
                  <tr className="border-b border-slate-805 text-slate-500">
                    <th className="pb-1.5">Organization ID</th>
                    <th className="pb-1.5">Endpoint URL</th>
                    <th className="pb-1.5 text-center">Latency</th>
                    <th className="pb-1.5 text-center">Availability</th>
                    <th className="pb-1.5 text-center">Trust Level</th>
                    <th className="pb-1.5 text-right">Domains</th>
                  </tr>
                </thead>
                <tbody>
                  {federatedRegistries.map(org => (
                    <tr key={org.organizationId} className="border-b border-slate-900/60 hover:bg-slate-900/20">
                      <td className="py-2 font-bold text-slate-200">{org.organizationId}</td>
                      <td className="py-2 text-slate-400">{org.endpoint}</td>
                      <td className="py-2 text-center text-cyan-400">{org.latency} ms</td>
                      <td className="py-2 text-center text-emerald-450">{org.availability}%</td>
                      <td className="py-2 text-center font-bold text-purple-300">{org.trustLevel * 100}%</td>
                      <td className="py-2 text-right text-slate-400">{org.supportedDomains.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ⚙️ Workflow Dashboard Workspace */}
          {activeTab === "workflows" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-805 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">⚙️ WORKFLOW ORCHESTRATION CONSOLE</h3>
                  <p className="text-[10px] text-slate-500">Search packages, track DAG schedules, and monitor event stream timelines</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] text-slate-400 font-mono">Policy: <strong>{schedulerPolicy}</strong></span>
                  <button
                    onClick={handleTogglePolicy}
                    className="bg-slate-805 hover:bg-slate-700 text-cyan-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] cursor-pointer"
                  >
                    Toggle Policy
                  </button>
                </div>
              </div>

              {/* Search catalog bars */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="bg-slate-900 border border-slate-805 rounded px-2.5 py-1 text-[10.5px] font-mono text-cyan-300 focus:outline-none w-1/3"
                />
                <select
                  value={searchDomain}
                  onChange={(e) => setSearchDomain(e.target.value)}
                  className="bg-slate-900 border border-slate-805 rounded px-2.5 py-1 text-[10.5px] text-slate-350 focus:outline-none"
                >
                  <option value="">All Domains</option>
                  <option value="Fluid Dynamics">Fluid Dynamics</option>
                  <option value="Data Analytics">Data Analytics</option>
                </select>
              </div>

              {/* Four Synchronized Panels Workspace */}
              <div className="grid grid-cols-3 gap-4">
                {/* Panel A: Templates Catalog */}
                <div className="flex flex-col gap-2.5 border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">A. Reusable Template Catalog</span>
                  {catalogPackages.map(pkg => (
                    <div
                      key={pkg.packageId}
                      onClick={() => {
                        setSelectedPackage(pkg);
                        handleValidateSelected(pkg);
                      }}
                      className={`p-2.5 border rounded flex flex-col gap-1 cursor-pointer hover:border-cyan-500/50 ${
                        selectedPackage?.packageId === pkg.packageId ? "bg-slate-900 border-cyan-500" : "bg-slate-900/60 border-slate-850"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{pkg.metadata.packageName}</span>
                        <span className="text-[8px] bg-slate-800 px-1 py-0.5 rounded text-slate-500 font-mono">v{pkg.metadata.version}</span>
                      </div>
                      <span className="text-[8.5px] text-slate-500 font-mono">Domain: {pkg.metadata.domain} | Author: {pkg.metadata.author}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantiateWorkflow(pkg.definition.workflowId);
                        }}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[9px] mt-1.5 cursor-pointer w-full"
                      >
                        Instantiate
                      </button>
                    </div>
                  ))}

                  {/* Schema Package Importer Console */}
                  <div className="mt-2 border-t border-slate-850 pt-2 flex flex-col gap-1.5">
                    <span className="font-bold text-slate-400 text-[9.5px]">Import Workflow Package (JSON)</span>
                    <textarea
                      placeholder='{"packageId": "custom-pkg", ...}'
                      value={importJson}
                      onChange={(e) => setImportJson(e.target.value)}
                      className="bg-slate-900 border border-slate-850 rounded p-1.5 font-mono text-[9px] text-cyan-300 focus:outline-none w-full h-[50px] resize-none"
                    />
                    <button
                      onClick={handleImportWorkflowPackage}
                      className="bg-purple-650 hover:bg-purple-550 text-white font-bold py-1 rounded text-[9.5px] cursor-pointer"
                    >
                      Validate & Import Package
                    </button>
                  </div>
                </div>

                {/* Panel B: Governance & Collaboration */}
                <div className="flex flex-col gap-2.5 border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">B. Governance & Review Portal</span>
                  {selectedPackage ? (
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded flex flex-col gap-2 text-[9.5px]">
                      <div className="flex justify-between items-center">
                        <span>Status: <strong>{pkgApprovalState}</strong></span>
                        <select
                          value={currentRole}
                          onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                          className="bg-slate-955 border border-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-[9px]"
                        >
                          <option value="Author">Author</option>
                          <option value="Reviewer">Reviewer</option>
                          <option value="Publisher">Publisher</option>
                        </select>
                      </div>

                      {/* State transitions buttons */}
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-850">
                        <button
                          onClick={() => handleGovernanceAction("Submit")}
                          disabled={pkgApprovalState !== "Draft"}
                          className="bg-slate-805 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 px-2 py-0.5 rounded text-[8.5px] border border-slate-700 cursor-pointer"
                        >
                          Submit For Review
                        </button>
                        <button
                          onClick={() => handleGovernanceAction("Approve")}
                          disabled={pkgApprovalState !== "InReview"}
                          className="bg-emerald-600 hover:bg-emerald-555 disabled:opacity-40 text-white px-2 py-0.5 rounded text-[8.5px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleGovernanceAction("Reject")}
                          disabled={pkgApprovalState !== "InReview"}
                          className="bg-red-650 hover:bg-red-555 disabled:opacity-40 text-white px-2 py-0.5 rounded text-[8.5px] cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleGovernanceAction("Promote")}
                          disabled={pkgApprovalState !== "Approved"}
                          className="bg-purple-650 hover:bg-purple-550 disabled:opacity-40 text-white px-2 py-0.5 rounded text-[8.5px] cursor-pointer"
                        >
                          Mark Ready
                        </button>
                        <button
                          onClick={() => handleGovernanceAction("Publish")}
                          disabled={pkgApprovalState !== "ReadyToPublish"}
                          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold px-2.5 py-0.5 rounded text-[8.5px] cursor-pointer"
                        >
                          Publish Release
                        </button>
                      </div>

                      {/* Discussions thread */}
                      <div className="mt-3 pt-3 border-t border-slate-850">
                        <span className="font-bold text-slate-455 block mb-1">Collaboration Discussions feed:</span>
                        <div className="max-h-[100px] overflow-y-auto flex flex-col gap-1.5 mb-2 font-mono text-[8.5px]">
                          {packageComments.length === 0 ? (
                            <span className="text-slate-500 italic">No comments yet.</span>
                          ) : (
                            packageComments.map(c => (
                              <div key={c.commentId} className="border-b border-slate-855 pb-1">
                                <div className="flex justify-between text-[8px] text-slate-500">
                                  <span>{c.author}</span>
                                  <span>{c.timestamp}</span>
                                </div>
                                <p className="text-slate-300 mt-0.5">{c.text}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Add comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-slate-955 border border-slate-805 rounded px-2 py-0.5 text-[9px] text-slate-350 focus:outline-none flex-1"
                          />
                          <button
                            onClick={handleAddComment}
                            className="bg-slate-805 hover:bg-slate-700 text-cyan-300 px-2 py-0.5 rounded text-[9px] border border-slate-700 cursor-pointer"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-605 font-mono italic">Select package to view governance review status.</span>
                  )}
                </div>

                {/* Panel C: Event Stream & Validation Report */}
                <div className="flex flex-col gap-3">
                  {/* Validation Report */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-400 text-[10.5px]">C. Package Validation Report</span>
                    {validationReport ? (
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1 text-[9px]">
                        <div className="flex justify-between border-b border-slate-850 pb-1 font-bold">
                          <span>Report: {validationReport.packageId}</span>
                          <span className={validationReport.overallPassed ? "text-emerald-400" : "text-red-405"}>
                            {validationReport.overallPassed ? "PASSED" : "FAILED"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1 font-mono text-[8px]">
                          {validationReport.stages.map(st => (
                            <div key={st.stage} className="flex justify-between">
                              <span className="text-slate-400">{st.stage}:</span>
                              <span className={st.status === "PASSED" ? "text-emerald-400" : "text-red-405"}>{st.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-655 font-mono italic">Select package to audit compliance validations.</span>
                    )}
                  </div>

                  {/* Governance Audit timeline */}
                  <div className="flex flex-col gap-2">
                    <span className="font-bold text-slate-400 text-[10.5px]">D. Governance Audit Trail</span>
                    <div className="bg-slate-900 border border-slate-850 p-2 rounded max-h-[110px] overflow-y-auto flex flex-col gap-1.5 font-mono text-[8.5px]">
                      {packageAuditHistory.length === 0 ? (
                        <span className="text-slate-605 italic text-[8.5px]">No audit logs.</span>
                      ) : (
                        packageAuditHistory.map(log => (
                          <div key={log.recordId} className="border-b border-slate-850 pb-1 last:border-0">
                            <div className="flex justify-between text-[8px]">
                              <span className={log.status === "SUCCESS" ? "text-emerald-450 font-bold" : "text-red-405 font-bold"}>
                                {log.action} ({log.status})
                              </span>
                              <span className="text-slate-505">{log.timestamp}</span>
                            </div>
                            <p className="text-slate-405 leading-snug mt-0.5">{log.details}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🎨 VISUAL WORKFLOW BLUEPRINT CANVAS (STUDIO) */}
              <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-4">
                <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded border border-slate-850">
                  <div className="flex items-center gap-2 w-2/3">
                    <span className="text-[10px] text-cyan-400 font-bold font-mono">Cognitive Goal:</span>
                    <input
                      type="text"
                      value={collabGoalPrompt}
                      onChange={(e) => setCollabGoalPrompt(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-[9.5px] font-mono text-cyan-300 focus:outline-none w-full"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGenerateWorkflowFromGoal}
                      className="bg-purple-650 hover:bg-purple-550 text-white font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                    >
                      AI Compose Graph
                    </button>
                    <button
                      onClick={handleTriggerVisualWorkflowExecution}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                    >
                      Execute Scheduler Bridge
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-[9px] font-mono">
                  {/* Canvas Nodes Graph */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 col-span-1">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-1">
                      <span className="font-bold text-slate-350 text-[10px]">Visual Graph: {selectedWorkflowDef?.name}</span>
                      <span className="text-[7.5px] text-slate-500 font-bold">{selectedWorkflowDef?.version}</span>
                    </div>
                    <div className="max-h-[150px] overflow-y-auto flex flex-col gap-2 mt-1">
                      {selectedWorkflowDef?.graph.nodes.map(node => (
                        <div key={node.id} className="p-2 bg-slate-950/60 border border-slate-850 rounded flex flex-col gap-1">
                          <div className="flex justify-between font-bold text-cyan-350 text-[9.5px]">
                            <span>{node.name}</span>
                            <span className="text-slate-550 text-[8px]">({node.category})</span>
                          </div>
                          {node.inputs.length > 0 && (
                            <div className="text-[7.5px] text-slate-450 leading-tight">
                              Inputs: {node.inputs.map(p => `${p.name} (${p.type})`).join(", ")}
                            </div>
                          )}
                          {node.outputs.length > 0 && (
                            <div className="text-[7.5px] text-emerald-450 leading-tight">
                              Outputs: {node.outputs.map(p => `${p.name} (${p.type})`).join(", ")}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scenario Comparator */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Scenario Experiment Comparator</span>
                    <div className="max-h-[150px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                      <table className="w-full text-[8.5px] text-left">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-900">
                            <th className="pb-1">Variable</th>
                            <th className="pb-1 text-center">Scenario A</th>
                            <th className="pb-1 text-center">Scenario B</th>
                            <th className="pb-1 text-right">Dev</th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparedMetrics.map((row, idx) => (
                            <tr key={idx} className="border-b border-slate-900/60 last:border-0">
                              <td className="py-1 text-slate-300 font-bold">{row.parameterName}</td>
                              <td className="py-1 text-center text-slate-400">{row.scenario1Value}</td>
                              <td className="py-1 text-center text-slate-400">{row.scenario2Value}</td>
                              <td className={`py-1 text-right font-bold ${
                                row.deviation.startsWith("-") ? "text-red-400" : "text-emerald-400"
                              }`}>{row.deviation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Explainability Engine evidence logs */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">AI Explainability Evidence Traces</span>
                    <div className="max-h-[150px] overflow-y-auto flex flex-col gap-2 mt-1">
                      {explainabilityEvidence.length === 0 ? (
                        <span className="text-slate-655 font-mono italic text-[8.5px]">Run scheduler execution to query explainability evidence traces.</span>
                      ) : (
                        explainabilityEvidence.map((ev, idx) => (
                          <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0">
                            <div className="flex justify-between font-bold text-slate-200">
                              <span className="text-purple-300">{ev.propertyName}</span>
                              <span className="text-slate-500">Conf: {(ev.sourceConfidence * 100).toFixed(0)}%</span>
                            </div>
                            <p className="text-[8px] text-slate-400 leading-tight mt-0.5">{ev.ruleExplanation}</p>
                            <div className="text-[7.5px] text-slate-500 flex justify-between mt-1">
                              <span>Val: {ev.currentValue}</span>
                              <span>Limit: {ev.thresholdLimit}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ⏳ Replay Debugger Workspace */}
          {activeTab === "replayDebugger" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">⏳ REPLAY DEBUGGER CONSOLE</h3>
                  <p className="text-[10px] text-slate-550">Durable Event Sourcing: Reconstruct history state reducers from append-only Store logs</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Filter Correlation ID"
                    value={filterCorrelationId}
                    onChange={(e) => setFilterCorrelationId(e.target.value)}
                    className="bg-slate-900 border border-slate-805 rounded px-2.5 py-0.5 font-mono text-cyan-300 text-[10px] focus:outline-none"
                  />
                </div>
              </div>

              {/* Synchronized Replay Panels */}
              <div className="grid grid-cols-3 gap-4">
                {/* Panel 1: Timeline */}
                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">1. Durable Events Timeline</span>
                  {filteredEvents.length === 0 ? (
                    <span className="text-slate-605 font-mono italic">No events found.</span>
                  ) : (
                    filteredEvents.map(evt => (
                      <div
                        key={evt.eventId}
                        onClick={() => {
                          setSelectedEvent(evt);
                          handleStartReplaySession(evt.workflowId);
                        }}
                        className={`p-2 bg-slate-900 border rounded flex flex-col gap-0.5 cursor-pointer hover:border-cyan-500/50 ${
                          selectedEvent?.eventId === evt.eventId ? "border-cyan-500 text-cyan-300" : "border-slate-850"
                        }`}
                      >
                        <div className="flex justify-between text-[9px]">
                          <span className="font-bold">Seq {evt.sequenceNumber} | {evt.eventType}</span>
                          <span className="text-slate-505">{evt.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Panel 2: Details Inspector */}
                <div className="flex flex-col gap-2 border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">2. Payload Details Inspector</span>
                  {selectedEvent ? (
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded font-mono text-[9px] text-slate-300 overflow-x-auto max-h-[200px]">
                      <div>Event ID: <strong>{selectedEvent.eventId}</strong></div>
                      <div>Workflow: <strong>{selectedEvent.workflowId}</strong></div>
                      <div>Timestamp: <strong>{selectedEvent.timestamp}</strong></div>
                      <div className="mt-2 text-cyan-400">Payload Schema:</div>
                      <pre className="text-[8.5px] leading-snug">{JSON.stringify(selectedEvent.payload, null, 2)}</pre>
                    </div>
                  ) : (
                    <span className="text-slate-655 font-mono italic">Select an event from the timeline to inspect payloads.</span>
                  )}
                </div>

                {/* Panel 3: Replay Console */}
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-slate-400 text-[10.5px]">3. Reducer Replay Player</span>
                  {replayedState ? (
                    <div className="p-3 bg-slate-900 border border-purple-500/30 rounded flex flex-col gap-2">
                      <div className="flex justify-between items-center font-mono text-[9px]">
                        <span className="text-purple-300 font-bold">{replayedState.instanceId}</span>
                        <span>State: {replayedState.state}</span>
                      </div>

                      {/* Replay Step controls */}
                      <div className="flex gap-2 justify-center py-2 border-t border-b border-slate-850/60">
                        <button
                          onClick={handleStepReplay}
                          className="bg-slate-850 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-2 py-0.5 rounded text-[9px] cursor-pointer"
                        >
                          ⏭ Step Forward
                        </button>
                        <button
                          onClick={handlePlayAllReplay}
                          className="bg-cyan-500 hover:bg-cyan-400 text-slate-955 font-bold px-2 py-0.5 rounded text-[9px] cursor-pointer"
                        >
                          ▶ Play All
                        </button>
                      </div>

                      {/* Reconstructed State visualizer */}
                      <div className="flex flex-col gap-1.5 mt-1.5 text-[9.5px]">
                        <span className="text-slate-400 font-bold">Reconstructed Step States:</span>
                        {replayedState.steps.map(s => (
                          <div key={s.stepId} className="flex justify-between">
                            <span className="text-slate-300">{s.name}:</span>
                            <span className="font-mono font-bold text-cyan-300">{s.state} {s.assignedNode ? `(${s.assignedNode})` : ""}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-655 font-mono italic">Click any event to initiate replay state reduction cycles.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🛒 Marketplace Workspace */}
          {activeTab === "marketplace" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-805 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">🛒 DISTRIBUTED WORKFLOW MARKETPLACE</h3>
                <p className="text-[10px] text-slate-500">Discover, trust-verify, and install certified engineering workflow packages</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Panel 1: Available Packages */}
                <div className="flex flex-col gap-2 border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">1. Available Marketplace Packages</span>
                  {marketplaceCatalog.map(item => (
                    <div
                      key={item.package.packageId}
                      onClick={() => {
                        setSelectedMarketplacePackage(item);
                        handleEvaluateMarketplaceTrust(item);
                      }}
                      className={`p-2.5 border rounded flex flex-col gap-1 cursor-pointer hover:border-cyan-500/50 ${
                        selectedMarketplacePackage?.package.packageId === item.package.packageId ? "bg-slate-900 border-cyan-500" : "bg-slate-900/60 border-slate-850"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-200">{item.package.metadata.packageName}</span>
                        <span className="text-[8px] bg-slate-800 px-1 py-0.5 text-slate-500 rounded font-mono">v{item.package.metadata.version}</span>
                      </div>
                      <span className="text-[8.5px] text-slate-500 font-mono">Downloads: {item.downloadsCount}</span>
                    </div>
                  ))}
                </div>

                {/* Panel 2: Details & Trust report */}
                <div className="flex flex-col gap-2 border-r border-slate-800/60 pr-4">
                  <span className="font-bold text-slate-400 text-[10.5px]">2. Package Details & Trust Report</span>
                  {selectedMarketplacePackage ? (
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded flex flex-col gap-2 text-[9.5px]">
                      <div>Publisher Key: <span className="font-mono text-cyan-400">{selectedMarketplacePackage.publisherKey}</span></div>
                      <div>Signature Checksum: <span className="font-mono text-slate-505 text-[8.5px] break-all">{selectedMarketplacePackage.signature}</span></div>
                      
                      {trustBadges && (
                        <div className="mt-2 p-2 bg-slate-950 border border-purple-500/30 rounded text-[8.5px] font-mono leading-relaxed">
                          <span className="font-bold text-purple-300 block mb-1">Trust Verification Analysis:</span>
                          {trustBadges}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-655 font-mono italic">Select package to load metadata validation summaries.</span>
                  )}
                </div>

                {/* Panel 3: Installation Queue */}
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-slate-400 text-[10.5px]">3. Installer Pipeline Actions</span>
                  {selectedMarketplacePackage ? (
                    <div className="p-3 bg-slate-900 border border-slate-850 rounded flex flex-col gap-2">
                      <p className="text-[9px] text-slate-505 leading-snug">
                        The package installer runs signature checksum matches and capability validations before publishing to your local repository.
                      </p>
                      <button
                        onClick={() => handleInstallMarketplacePackage(selectedMarketplacePackage)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-slate-955 font-bold py-1.5 rounded text-[10px] cursor-pointer"
                      >
                        Run Package Installation
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-655 font-mono italic">Select package to trigger installation.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🧠 AI Copilot Workspace */}
          {activeTab === "copilot" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🧠 AI WORKFLOW INTELLIGENCE</h3>
                  <p className="text-[10px] text-slate-550">Formulate engineering workflows, calculate change risk scoring, and map peer reviewers</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={copilotPrompt}
                  onChange={(e) => setCopilotPrompt(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-300 focus:outline-none flex-1"
                />
                <button
                  onClick={handleTriggerAICopilot}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                >
                  Ask AI Agent
                </button>
              </div>

              {/* Retrieved Context banner */}
              {retrievedContext && (
                <div className="p-2.5 bg-slate-900/60 border border-slate-850 rounded text-[9.5px] text-slate-400 font-mono">
                  <span className="font-bold text-slate-300 block mb-1">Knowledge Grounding Retrieval context:</span>
                  {retrievedContext}
                </div>
              )}

              {/* Engineering Knowledge Graph visualizer */}
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded">
                <span className="font-bold text-slate-350 block mb-2 text-[10.5px]">🕸️ Semantic Knowledge Graph Schema Nodes:</span>
                <div className="flex flex-wrap gap-2 text-[8px] font-mono">
                  {graphNodes.map(node => (
                    <span key={node.id} className="bg-slate-800 border border-slate-850 px-2 py-0.5 rounded text-cyan-400">
                      <strong>{node.type}</strong>: {node.label}
                    </span>
                  ))}
                </div>
              </div>

              {aiGeneratedPkg && (
                <div className="grid grid-cols-3 gap-4">
                  {/* Generated Package Detail */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1">
                    <span className="font-bold text-slate-350 block mb-1 text-[10.5px]">AI Generated Definition</span>
                    <div>Package ID: <strong>{aiGeneratedPkg.packageId}</strong></div>
                    <div>Domain: <strong>{aiGeneratedPkg.metadata.domain}</strong></div>
                    <div className="mt-2 text-[9px] text-slate-400 font-mono">
                      <span>Steps:</span>
                      {aiGeneratedPkg.definition.steps.map(s => <div key={s.stepId}>&rarr; {s.name} ({s.capability})</div>)}
                    </div>
                    <button
                      onClick={handleInstallAIPackage}
                      className="bg-purple-600 hover:bg-purple-550 text-white font-bold py-1 rounded text-[9.5px] mt-2 cursor-pointer w-full"
                    >
                      Install Package
                    </button>
                  </div>

                  {/* Risk Assessment details */}
                  {aiRiskAssessment && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1.5 font-mono text-[9px]">
                      <span className="font-bold text-slate-350 block text-[10.5px]">Risk Assessment Report</span>
                      <div className="flex justify-between border-b border-slate-855 pb-1 font-bold">
                        <span>Overall Risk Score:</span>
                        <span className={aiRiskAssessment.overallScore > 30 ? "text-amber-400" : "text-emerald-405"}>
                          {aiRiskAssessment.overallScore}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complexity Risk:</span>
                        <span>{aiRiskAssessment.complexityRisk}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dependency Risk:</span>
                        <span>{aiRiskAssessment.dependencyRisk}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Execution Risk:</span>
                        <span>{aiRiskAssessment.executionRisk}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence Score:</span>
                        <span className="text-cyan-400">{aiRiskAssessment.confidence}%</span>
                      </div>
                      <p className="text-slate-500 leading-snug mt-1">{aiRiskAssessment.explanation}</p>
                    </div>
                  )}

                  {/* Reviewers Suggestions & Quality advice */}
                  <div className="flex flex-col gap-3">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1 text-[9px]">
                      <span className="font-bold text-slate-350 block text-[10.5px]">Suggested Reviewers</span>
                      {aiSuggestedReviewers.map(r => (
                        <div key={r.name} className="border-b border-slate-850 pb-1.5 last:border-0">
                          <span className="font-bold text-slate-300">{r.name}</span>
                          <div className="text-[8px] text-slate-500">{r.expertise} ({r.trustLevel})</div>
                        </div>
                      ))}
                    </div>

                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1 text-[9px]">
                      <span className="font-bold text-slate-350 block text-[10.5px]">Quality Suggestions</span>
                      {aiSuggestions.map((s, idx) => (
                        <div key={idx} className="border-b border-slate-855 pb-1 last:border-0 text-[8.5px]">
                          <span className="font-bold text-purple-300">[{s.type}]</span> {s.text}
                          <div className="text-[8px] text-slate-500 italic mt-0.5">Benefit: {s.benefit}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 🤖 Autonomous Agents Workspace */}
          {activeTab === "agents" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🤖 AUTONOMOUS ENGINEERING AGENTS</h3>
                  <p className="text-[10px] text-slate-500">Launch background planning agent execution loops and monitor outcomes enrichment</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-405">Agent State:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    agentState === "Idle" ? "bg-slate-800 text-slate-505" : "bg-cyan-505/20 text-cyan-400 animate-pulse"
                  }`}>
                    {agentState}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={agentTaskPrompt}
                  onChange={(e) => setAgentTaskPrompt(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-cyan-300 focus:outline-none flex-1"
                />
                <button
                  onClick={handleTriggerAutonomousAgent}
                  disabled={agentState !== "Idle"}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                >
                  Trigger Run Loop
                </button>
              </div>

              {/* IV-A Domain Registry Visualization Section */}
              <div className="p-3 bg-slate-900/60 border border-slate-805 rounded flex flex-col gap-1.5">
                <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1.5 text-[10.5px]">Domain Intelligence Registry plugins</span>
                <table className="w-full text-left border-collapse text-[9px] font-mono">
                  <thead>
                    <tr className="border-b border-slate-850 text-slate-500">
                      <th>Agent Plugin ID</th>
                      <th>Expert Domains</th>
                      <th>Capabilities</th>
                      <th className="text-center">Success Rate</th>
                      <th className="text-right">Version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {domainAgents.map(agent => (
                      <tr key={agent.id} className="border-b border-slate-900/60 hover:bg-slate-900/10">
                        <td className="py-1 font-bold text-cyan-400">{agent.name}</td>
                        <td className="py-1 text-slate-300">{agent.domains.join(", ")}</td>
                        <td className="py-1 text-slate-450">{agent.capabilities.join(", ")}</td>
                        <td className="py-1 text-center font-bold text-purple-305">{agent.successRate}%</td>
                        <td className="py-1 text-right text-slate-505">{agent.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Panel 1: Trace Logs */}
                <div className="p-3 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1.5 text-[10.5px]">Loop Progression Trace</span>
                  <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1.5 font-mono text-[9px]">
                    {agentLogs.length === 0 ? (
                      <span className="text-slate-605 italic">No active loops recorded.</span>
                    ) : (
                      agentLogs.map((log, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1 last:border-0">
                          <span className="text-cyan-400 font-bold">[{log.stage}]</span> <span className="text-slate-505">{log.timestamp}</span>
                          <p className="text-slate-300 mt-0.5 leading-snug">{log.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Panel 2: Learning Outcomes */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1.5 text-[10.5px]">Execution Outcomes & Learning Logs</span>
                  <div className="max-h-[160px] overflow-y-auto flex flex-col gap-1.5 font-mono text-[9px]">
                    {agentLearnings.length === 0 ? (
                      <span className="text-slate-600 italic">No feedback loops written yet.</span>
                    ) : (
                      agentLearnings.map((learn, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0">
                          <div className="flex justify-between font-bold text-purple-305">
                            <span>Node ID: {learn.nodeId}</span>
                            <span className="text-emerald-400">Score: {learn.metricScore}%</span>
                          </div>
                          <p className="text-slate-400 leading-snug mt-0.5">{learn.outcome}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 🤖 EIOS COLLABORATIVE MULTI-AGENT WORKSPACE */}
              <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-purple-300">👥 EIOS COLLABORATIVE WORKSPACE</h4>
                    <p className="text-[9px] text-slate-500">Decompose goal prompts, route tasks through Event Bus, and synchronize Blackboard variables</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-405">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      collabRunning ? "bg-purple-900/40 text-purple-300 animate-pulse" : "bg-slate-800 text-slate-505"
                    }`}>
                      {collabRunning ? "Coordinating" : "Idle"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={collabGoalPrompt}
                    onChange={(e) => setCollabGoalPrompt(e.target.value)}
                    placeholder="Enter collaborative multi-agent prompt..."
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[11px] font-mono text-purple-300 focus:outline-none flex-1"
                  />
                  <button
                    onClick={handleTriggerCollaborativeAgent}
                    disabled={collabRunning}
                    className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-slate-100 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                  >
                    Trigger Collab Execution
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {/* Panel 1: DAG Execution Graph */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Task DAG Nodes</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                      {collabNodes.length === 0 ? (
                        <span className="text-slate-600 italic">No nodes scheduled.</span>
                      ) : (
                        collabNodes.map(node => (
                          <div key={node.id} className="border-b border-slate-900 pb-1 last:border-0">
                            <div className="flex justify-between font-bold">
                              <span className="text-purple-300">{node.id}</span>
                              <span className={`text-[8.5px] ${
                                node.status === "Completed" ? "text-emerald-400" :
                                node.status === "Running" ? "text-cyan-400 animate-pulse" : "text-slate-400"
                              }`}>{node.status}</span>
                            </div>
                            <p className="text-slate-300 mt-0.5 text-[8.5px] leading-snug">{node.objective}</p>
                            {node.assignedAgentId && (
                              <div className="text-[8px] text-slate-500 mt-0.5">Owner: {node.assignedAgentId}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Panel 2: Blackboard Variables */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono col-span-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Variable Blackboard</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1 mt-1">
                      {collabVariables.length === 0 ? (
                        <span className="text-slate-600 italic">No variables published.</span>
                      ) : (
                        collabVariables.map(v => (
                          <div key={v.id} className="border-b border-slate-900 pb-1 last:border-0">
                            <div className="flex justify-between text-slate-300">
                              <span className="font-bold text-cyan-400">{v.name}</span>
                              <span className="text-slate-500">{v.type}</span>
                            </div>
                            <div className="text-slate-100 font-bold mt-0.5 text-[9.5px]">
                              Value: {v.value} <span className="text-slate-400 text-[8.5px]">{v.unit}</span>
                            </div>
                            {v.producerAgent && (
                              <div className="text-[7.5px] text-slate-500">Source: {v.producerAgent}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Panel 3: Event Bus Timeline */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Collab Event Bus</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[8.5px]">
                      {collabEvents.length === 0 ? (
                        <span className="text-slate-600 italic">Event Bus log clean.</span>
                      ) : (
                        [...collabEvents].reverse().map(evt => (
                          <div key={evt.eventId} className="border-b border-slate-900 pb-1 last:border-0 leading-tight">
                            <span className="text-purple-400 font-bold">[{evt.eventType}]</span> <span className="text-slate-550">{evt.timestamp}</span>
                            {evt.payload?.objective && (
                              <div className="text-slate-300">{evt.payload.objective}</div>
                            )}
                            {evt.payload?.name && (
                              <div className="text-slate-300">Published: {evt.payload.name} = {evt.payload.value}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Panel 4: Compiled Audit Report */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Consolidated Synthesis Report</span>
                    <div className="max-h-[140px] overflow-y-auto mt-1">
                      {collabReport ? (
                        <pre className="text-[8px] text-slate-300 leading-tight whitespace-pre-wrap">{collabReport}</pre>
                      ) : (
                        <span className="text-slate-605 italic">Report compile pending run loop completion.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🛡️ EIOS INTEGRATED VERIFICATION & VALIDATION (VV&QA) DASHBOARD */}
              <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-emerald-400">🛡️ EIOS INTEGRATION VERIFICATION CONSOLE</h4>
                    <p className="text-[9px] text-slate-500">Run suite scenarios, check cycle detection validation, and audit EIOS Constitutional compliance invariants</p>
                  </div>
                  <button
                    onClick={handleRunCollabTestSuite}
                    disabled={collabTestRunning}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-900 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                  >
                    {collabTestRunning ? "Verifying..." : "Run Integration Test Suite"}
                  </button>
                </div>

                {collabTestResults.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-[9px] font-mono">
                    {/* Panel 1: Functional Assertions Summary */}
                    <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                      <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Assertions Validation Checklist</span>
                      <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                        {collabTestResults.filter(r => !r.id.startsWith("compliance")).map(res => (
                          <div key={res.id} className="flex justify-between items-center border-b border-slate-900 pb-1 last:border-0">
                            <span className="text-slate-300">{res.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-500 text-[8px]">({res.durationMs}ms)</span>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                res.status === "Pass" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
                              }`}>{res.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Panel 2: EIOS Constitutional Compliance Check */}
                    <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                      <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">EIOS Constitutional Quality Gates</span>
                      <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                        {collabTestResults.filter(r => r.id.startsWith("compliance")).map(res => (
                          <div key={res.id} className="flex justify-between items-center border-b border-slate-900 pb-1 last:border-0">
                            <span className="text-slate-300">{res.name}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              res.status === "Pass" ? "bg-emerald-900/30 text-emerald-400" : "bg-red-900/30 text-red-400"
                            }`}>{res.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "twinStudio" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">♊ EIOS DIGITAL TWIN STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Live operational synchronization, external solvers bridges, and predictive intelligence loops</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400">Selected Twin:</span>
                  <select
                    value={selectedTwinId}
                    onChange={(e) => {
                      setSelectedTwinId(e.target.value);
                      setTwinDiagnosis(activeTwinIntelligence.diagnoseTwin(e.target.value));
                    }}
                    className="bg-slate-900 border border-slate-800 rounded text-xs px-2 py-1 text-cyan-300"
                  >
                    {twinList.map(t => (
                      <option key={t.metadata.id} value={t.metadata.id}>{t.metadata.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeTwinRepository.getTwin(selectedTwinId) && (
                <div className="grid grid-cols-4 gap-4">
                  {/* Panel 1: Topology Asset Explorer */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Topology & Entities</span>
                    <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 mt-1">
                      <div>
                        <span className="text-cyan-400 font-bold text-[8.5px]">Entities:</span>
                        {activeTwinRepository.getTwin(selectedTwinId)?.entities.map(ent => (
                          <div key={ent.id} className="border-b border-slate-900 pb-1 mt-1">
                            <div className="text-slate-300 font-bold">{ent.name}</div>
                            <div className="text-slate-500 text-[8px]">Type: {ent.type}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <span className="text-cyan-400 font-bold text-[8.5px]">Relationships:</span>
                        {activeTwinRepository.getTwin(selectedTwinId)?.relationships.map(rel => (
                          <div key={rel.id} className="text-[8px] text-slate-400 mt-1">
                            {rel.sourceEntityId} &rarr; [{rel.type}] &rarr; {rel.targetEntityId}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Panel 2: Live State & Provenance */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono col-span-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. State & Provenance</span>
                    <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 mt-1">
                      {activeTwinRepository.getTwin(selectedTwinId)?.entities.map(ent => (
                        <div key={ent.id}>
                          <span className="text-slate-500 text-[8px] font-bold">{ent.name}:</span>
                          {Object.keys(ent.properties).map(prop => {
                            const latestState = activeTwinStateEngine.getLatestProperty(selectedTwinId, ent.id, prop);
                            return (
                              <div key={prop} className="border-b border-slate-900 pb-1.5 last:border-0 mt-1">
                                <div className="flex justify-between">
                                  <span className="text-cyan-400 font-bold">{prop}</span>
                                  <span className="text-slate-100 font-bold">{ent.properties[prop]} {latestState?.unit}</span>
                                </div>
                                {latestState && (
                                  <div className="flex justify-between text-[7.5px] text-slate-500 mt-0.5">
                                    <span>Src: {latestState.versionInfo.provenance} (v{latestState.versionInfo.version})</span>
                                    <span>Conf: {Math.round(latestState.versionInfo.confidence * 100)}%</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Panel 3: Synchronization Controls */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Sync & Solver Controls</span>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Sync Status:</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold bg-slate-800 text-cyan-300`}>
                          {activeTwinRepository.getTwin(selectedTwinId)?.syncState}
                        </span>
                      </div>
                      <button
                        onClick={handleTriggerSync}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold py-1 rounded text-[9px] cursor-pointer"
                      >
                        Fetch Sensor Telemetry (Sync)
                      </button>
                      <button
                        onClick={handleTriggerSimulation}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-slate-100 font-bold py-1 rounded text-[9px] cursor-pointer mt-1"
                      >
                        Trigger Mesh Solver (OpenFOAM)
                      </button>
                    </div>
                  </div>

                  {/* Panel 4: Twin Diagnostics & Alerts */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 text-[9px] font-mono">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Twin Diagnosis & Alerts</span>
                    <div className="max-h-[160px] overflow-y-auto flex flex-col gap-2 mt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Health Index:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          twinDiagnosis?.healthScore > 80 ? "bg-emerald-900/30 text-emerald-400" : "bg-yellow-900/30 text-yellow-400"
                        }`}>{twinDiagnosis?.healthScore}%</span>
                      </div>
                      <div>
                        <span className="text-red-400 font-bold text-[8.5px]">Anomalies:</span>
                        {twinDiagnosis?.anomaliesList.length === 0 ? (
                          <div className="text-slate-600 italic text-[8px]">No anomalies flagged.</div>
                        ) : (
                          twinDiagnosis?.anomaliesList.map((an: any, idx: number) => (
                            <div key={idx} className="text-[8px] text-red-350 leading-tight border-b border-slate-900 pb-1 mt-1">
                              [{an.severity}] {an.propertyName} limit exceeded: {an.value} (Limit {an.thresholdLimit})
                            </div>
                          ))
                        )}
                      </div>
                      <div className="mt-1">
                        <span className="text-emerald-400 font-bold text-[8.5px]">Recommendations:</span>
                        {twinDiagnosis?.recommendations.map((rec: string, idx: number) => (
                          <p key={idx} className="text-slate-300 text-[8px] leading-tight mt-1">{rec}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🌐 DISTRIBUTED SYSTEM OF SYSTEMS ECOSYSTEM */}
              <div className="border-t border-slate-800 pt-4 mt-2 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-xs text-cyan-400">🌐 DISTRIBUTED SYSTEM OF SYSTEMS NETWORK</h4>
                    <p className="text-[9px] text-slate-500">Track federated active registries, inter-twin communication logs, and coordinate synchronization policies</p>
                  </div>
                  <button
                    onClick={handleTriggerCrossTwinSync}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1 rounded text-[10px] cursor-pointer"
                  >
                    Trigger Cross-Twin Sync (AITP)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-[9px] font-mono">
                  {/* Register List */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Registered Descriptors</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                      {distTwinDescriptors.map(desc => (
                        <div key={desc.id} className="border-b border-slate-900 pb-1.5 last:border-0 mt-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">{desc.displayName}</span>
                            <span className={`px-1 rounded text-[7.5px] ${
                              desc.status === "Online" ? "bg-emerald-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                            }`}>{desc.status}</span>
                          </div>
                          <div className="text-slate-500 text-[8px] mt-0.5">Endpoint: {desc.endpoint.protocol}://{desc.endpoint.host}:{desc.endpoint.port}</div>
                          <div className="text-slate-400 text-[8px]">Capabilities: {desc.capabilities.map((c: any) => c.name).join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Topography Links */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Ecosystem Network Links</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1 mt-1">
                      {distTwinLinks.map((link, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1 last:border-0 mt-1">
                          <div className="flex justify-between text-slate-300">
                            <span className="font-bold">{link.fromTwinId} &rarr; {link.toTwinId}</span>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                            <span>Latency: {link.latencyMs}ms</span>
                            <span>Bandwidth: {link.bandwidthMbps} Mbps</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inter-Twin Message Bus Logs */}
                  <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1 col-span-1">
                    <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">AITP Message Bus Logs</span>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[8px] leading-tight">
                      {distTwinMessages.length === 0 ? (
                        <span className="text-slate-600 italic">No AITP message exchanges recorded.</span>
                      ) : (
                        [...distTwinMessages].reverse().map(msg => (
                          <div key={msg.messageId} className="border-b border-slate-900 pb-1.5 last:border-0">
                            <div className="flex justify-between text-purple-400">
                              <span>[{msg.type}]</span>
                              <span className="text-slate-600">{msg.timestamp.split("T")[1].slice(0, 8)}</span>
                            </div>
                            <div className="text-slate-300 mt-0.5">
                              {msg.sourceTwinId} &rarr; {msg.targetTwinId} ({msg.payload.propertyName}: {msg.payload.value})
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "intentStudio" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🧠 COGNITIVE INTENT PARSER & ONTOLOGY STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Decompose user intent prompts, validate mathematical constraints parameters, and trace explainability ontologies</p>
                </div>
                <div className="flex items-center gap-2 w-1/2">
                  <input
                    type="text"
                    value={intentInputText}
                    onChange={(e) => setIntentInputText(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10.5px] font-mono text-cyan-300 focus:outline-none w-full"
                  />
                  <button
                    onClick={handleParseEngineeringIntent}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Parse Intent Goal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* Panel 1: Intent Info & Validator Logs */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Validation Status</span>
                  {activeIntent ? (
                    <div className="flex flex-col gap-1.5 mt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Intent ID:</span>
                        <span className="text-slate-300 truncate max-w-[80px] font-bold">{activeIntent.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Status:</span>
                        <span className={`px-1 rounded text-[7.5px] font-bold ${
                          activeIntent.validationStatus === "Validated" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                        }`}>{activeIntent.validationStatus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Confidence:</span>
                        <span className="text-purple-300 font-bold">{(activeIntent.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="mt-1 border-t border-slate-900 pt-1 text-slate-400 leading-tight">
                        {intentValidationLogs}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">No parsed intent goals loaded.</span>
                  )}
                </div>

                {/* Panel 2: Extracted Objectives */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Optimization Objectives</span>
                  <div className="max-h-[130px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeIntent && activeIntent.objectives.length > 0 ? (
                      activeIntent.objectives.map((obj, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1 last:border-0">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">{obj.propertyName}</span>
                            <span className="text-slate-400">{obj.mode}</span>
                          </div>
                          <div className="text-slate-500 text-[8px] mt-0.5">Optimization weight: {obj.weight}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No optimization targets detected.</span>
                    )}
                  </div>
                </div>

                {/* Panel 3: Extracted Constraints */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Boundary Constraints</span>
                  <div className="max-h-[130px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeIntent && activeIntent.constraints.length > 0 ? (
                      activeIntent.constraints.map(c => (
                        <div key={c.id} className="border-b border-slate-900 pb-1 last:border-0">
                          <div className="flex justify-between font-bold text-slate-300">
                            <span>{c.name}</span>
                            <span className="text-[7.5px] bg-slate-800 px-1 py-0.5 rounded text-slate-500">{c.category}</span>
                          </div>
                          <div className="text-slate-500 text-[8px] mt-0.5">Limit Value: {c.limitValue} ({c.expression})</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No constraints extracted.</span>
                    )}
                  </div>
                </div>

                {/* Panel 4: Explainability & Assumptions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. AI Parser Evidence Traces</span>
                  <div className="max-h-[130px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {intentExplanation ? (
                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-cyan-400 font-bold text-[8.5px]">Ontology Entity Resolution:</span>
                          <div className="text-slate-400 text-[8px] mt-0.5">{intentExplanation.entitiesRecognized.join(", ") || "None resolved"}</div>
                        </div>
                        <div>
                          <span className="text-emerald-400 font-bold text-[8.5px]">Assumptions Made:</span>
                          {intentExplanation.assumptionsMade.map((asm: string, idx: number) => (
                            <p key={idx} className="text-slate-300 text-[8px] leading-tight mt-1">&rarr; {asm}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">No evidence traces calculated.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "planningStudio" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🗺️ COGNITIVE PLANNING & FEASIBILITY ENGINE</h3>
                  <p className="text-[10px] text-slate-500">Decompose validated intent into alternative workflow candidates, evaluate multi-objective tradeoff matrix, and rank plans</p>
                </div>
                <div className="flex items-center gap-4">
                  {activeIntent ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Validated Intent Goal:</span>
                      <span className="bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-[10.5px] font-mono text-cyan-300 max-w-[200px] truncate">{activeIntent.goal}</span>
                      <button
                        onClick={handleGenerateWorkflowPlans}
                        className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                      >
                        Generate Workflow Plans
                      </button>
                    </div>
                  ) : (
                    <span className="text-red-400 text-[10px] font-bold">Please parse and validate an intent first.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* Panel 1-3: Candidate Matrix (takes 3 cols) */}
                <div className="col-span-3 p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Candidate Planning Alternatives Matrix</span>
                  <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 mt-1">
                    {planningResult ? (
                      planningResult.candidates.map((cand, idx) => {
                        const rank = planningResult.rankings.find(r => r.candidateId === cand.id);
                        const tradeoff = planningResult.tradeoffs.find(t => t.candidateId === cand.id);
                        const expChain = activePlanningExplanationEngine.explainPlanningDecision(planningResult);

                        return (
                          <div key={idx} className="bg-slate-900 p-2.5 border border-slate-800 rounded flex justify-between items-center gap-4">
                            <div className="flex flex-col gap-1 w-2/3">
                              <span className="font-bold text-slate-200 text-[10px]">{cand.name}</span>
                              <p className="text-slate-500 text-[8px] italic leading-tight">{cand.explanation}</p>
                              <div className="flex flex-wrap gap-2 text-slate-400 text-[8px] mt-1 leading-normal">
                                <span>Cost: <strong className="text-cyan-300">${cand.estimatedCostUSD}</strong></span>
                                <span>Complexity: <strong className="text-yellow-400">{cand.estimatedRiskScore}/10</strong></span>
                                <span>Accuracy: <strong className="text-purple-300">{cand.verificationScore}%</strong></span>
                                <span>Energy: <strong className="text-orange-400">{tradeoff?.stats.energyKWh} kWh</strong></span>
                                <span>Reliability: <strong className="text-emerald-400">{tradeoff?.stats.reliability}%</strong></span>
                                <span>Maintainability: <strong className="text-blue-300">{tradeoff?.stats.maintainability}%</strong></span>
                                <span>Resources: <strong className="text-slate-300">{cand.estimatedResources.join(", ")}</strong></span>
                              </div>
                              <div className="text-[7.5px] text-slate-500 leading-tight mt-1">
                                <strong>Decision Evidence Factors:</strong> {expChain.factors.join(" | ")}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 w-1/3">
                              <div className="flex flex-col items-end gap-0.5 text-right">
                                <span className="text-slate-400 text-[8.5px]">Overall Score: <strong className="text-cyan-300 font-bold text-xs">{rank?.scoreVector.overall || 0}</strong></span>
                                <span className="text-slate-500 text-[7.5px]">Perf: {rank?.scoreVector.performance} | Cost: {rank?.scoreVector.cost} | Risk: {rank?.scoreVector.risk} | V&V: {rank?.scoreVector.verification}</span>
                              </div>
                              <div className="flex gap-2">
                                <span className="px-1 py-0.5 rounded text-[8px] font-bold bg-emerald-950 text-emerald-450">Feasible</span>
                                <button
                                  onClick={() => handleLoadPlanIntoWorkflowStudio(cand)}
                                  className="bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-800/40 rounded px-2 py-0.5 text-[8.5px] font-bold cursor-pointer"
                                >
                                  Load into Studio
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-600 italic">No alternative workflow plans generated. Click "Generate Workflow Plans".</span>
                    )}
                  </div>
                </div>

                {/* Panel 4: Execution Advisor Advice */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Planner Advisor Recommendations</span>
                  <div className="mt-2 text-slate-300 leading-relaxed max-h-[200px] overflow-y-auto">
                    {planningResult ? (
                      <div className="flex flex-col gap-2.5">
                        <p>{planningResult.recommendationAdvice}</p>
                        <div className="border-t border-slate-850 pt-2 text-slate-500 text-[8px]">
                          <strong>Tradeoff Ratio:</strong> Maximize Accuracy (Weight 0.7) vs Minimize Compute Complexity (Weight 0.3).
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">Advisor metrics will calculate after planner runs.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "councilChamber" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🏛️ COGNITIVE COUNCIL CHAMBER & GOVERNED DELIBERATION</h3>
                  <p className="text-[10px] text-slate-500">Multidisciplinary design review boards coordination, task decompositions, consensus building, and governed decision aggregates</p>
                </div>
                <div>
                  {activeIntent ? (
                    <button
                      onClick={handleDeliberateEngineeringIntent}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                    >
                      Trigger Council Deliberation
                    </button>
                  ) : (
                    <span className="text-red-400 text-[10px] font-bold">Please parse and validate an intent first.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* Panel 1: Task Decomposition Breakdown */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Task Decomposition</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeDeliberation ? (
                      activeDeliberation.tasks.map(t => (
                        <div key={t.id} className="border-b border-slate-900 pb-1 last:border-0">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">Discipline: {t.discipline}</span>
                            <span className="text-[7.5px] text-slate-500">{t.status}</span>
                          </div>
                          <p className="text-slate-400 text-[8.5px] leading-tight mt-0.5">{t.subgoalText}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No task breakdown generated.</span>
                    )}
                  </div>
                </div>

                {/* Panel 2: Specialist Opinions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Deliberating Specialist Opinions</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeDeliberation ? (
                      activeDeliberation.opinions.map(o => (
                        <div key={o.agentId} className="border-b border-slate-900 pb-1 last:border-0">
                          <div className="flex justify-between font-bold text-slate-200">
                            <span>{o.discipline} Specialist</span>
                            <span className={`px-1 rounded text-[7.5px] ${
                              o.verdict === "Accept" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{o.verdict}</span>
                          </div>
                          <div className="flex justify-between text-[8px] text-slate-500 mt-0.5">
                            <span>Score: {o.score}%</span>
                            <span>Evidence: {o.evidenceRefs.join(", ")}</span>
                          </div>
                          <div className="text-[8px] text-slate-400 mt-1 italic leading-tight">
                            Findings: {o.findings.join(" | ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">Opinions gathered upon deliberation trigger.</span>
                    )}
                  </div>
                </div>

                {/* Panel 3: Consensus Timeline & Conflict Resolver */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Consensus & Conflict Negotiation Timeline</span>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    <div>
                      <span className="text-purple-300 font-bold block text-[8.5px] border-b border-slate-900 pb-0.5">Deliberation Timeline</span>
                      <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[7.5px]">
                        {activeDeliberation ? (
                          activeDeliberation.timeline.map((evt, idx) => (
                            <div key={idx} className="border-b border-slate-900 pb-1">
                              <span className="text-slate-400 font-bold block">{evt.agentName} &rarr; {evt.actionTaken}</span>
                              <span className="text-slate-600">Agreement snapshot: {evt.consensusSnapshotPercent}%</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-600 italic">Timeline is empty.</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold block text-[8.5px] border-b border-slate-900 pb-0.5">Disagreements Resolution</span>
                      <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[7.5px] leading-tight">
                        {activeReview && activeReview.conflictsLogs.length > 0 ? (
                          activeReview.conflictsLogs.map((conf, idx) => (
                            <div key={idx} className="border-b border-slate-900 pb-1">
                              <span className="text-slate-300 font-bold block">Discrepancy: {conf.assumption}</span>
                              <span className="text-slate-500">Supporting Evidence: {conf.supportingEvidence}</span>
                              <span className="text-slate-400 block mt-0.5">Resolution average limit: {conf.resolvedValue}V</span>
                              <span className="text-emerald-450 mt-0.5 block">Residual risk: {conf.residualRisk}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-600 italic">No parameter conflicts recorded.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Consensus Review & Canonical Gov Decision */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Deliberation Review Findings (Design Board Report Summary)</span>
                  {activeReview ? (
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500">Review ID: <strong className="text-slate-300">{activeReview.id}</strong></span>
                        <span className="text-slate-500">Agreement Score: <strong className="text-cyan-300">{activeReview.consensusStats.agreementScore}%</strong></span>
                        <span className="text-slate-500">Quorum Coverage: <strong className="text-purple-300">{activeReview.consensusStats.participationCoverage}</strong></span>
                        <span className="text-slate-500">Open Issues:</span>
                        <div className="text-slate-400 text-[8px] italic leading-tight">
                          {activeReview.consensusStats.openIssues.join(", ") || "None flagged."}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 leading-tight border-l border-slate-850 pl-3">
                        <span className="text-slate-300 font-bold text-[8.5px]">Recommendations Notes:</span>
                        <p className="text-slate-400">{activeReview.recommendationNote}</p>
                        <span className="text-slate-300 font-bold text-[8.5px] mt-1">Residual Risks:</span>
                        <p className="text-slate-500">{activeReview.residualRisks.join(" | ")}</p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">Deliberation summary report not compiled.</span>
                  )}
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Canonical Governing Execution Decision Contract</span>
                  {activeDecision ? (
                    <div className="flex flex-col gap-1 mt-1 leading-tight">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Decision ID:</span>
                        <strong className="text-slate-300">{activeDecision.id}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Approval State:</span>
                        <span className={`px-1.5 rounded text-[8px] font-bold ${
                          activeDecision.approvalStatus === "Approved" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                        }`}>{activeDecision.approvalStatus}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Decision Maker:</span>
                        <span className="text-cyan-300">{activeDecision.approvedBy}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Timestamp:</span>
                        <span className="text-slate-600">{activeDecision.timestamp.split("T")[1].slice(0, 8)}</span>
                      </div>
                      {activeDecision.selectedWorkflowCandidate && (
                        <div className="mt-2 border-t border-slate-900 pt-2 flex justify-between items-center">
                          <span className="text-slate-400 block max-w-[120px] truncate">{activeDecision.selectedWorkflowCandidate.name}</span>
                          <button
                            onClick={() => handleLoadPlanIntoWorkflowStudio(activeDecision.selectedWorkflowCandidate)}
                            className="bg-purple-900 hover:bg-purple-800 text-purple-250 font-bold px-2 py-0.5 rounded text-[8px] cursor-pointer"
                          >
                            Load Approved Plan
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">Governed decision contracts compile on deliberation success.</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "memoryStudio" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">💾 ENGINEERING MEMORY & ORGANIZATIONAL LEARNING</h3>
                  <p className="text-[10px] text-slate-500">Capture, extract, index, and synthesize historical lessons learned and design patterns back into active engineering workflows</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSynthesizeMemoryRecommendations}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Synthesize Recommendations
                  </button>
                  <button
                    onClick={() => handleCaptureProjectExperience("Solar Microgrid Stabilization Project", "Success")}
                    className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Index Success Experience
                  </button>
                  <button
                    onClick={() => handleCaptureProjectExperience("Substation Switch Overload Failure", "Failure")}
                    className="bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/40 font-bold px-2 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Index Failure Experience
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono">
                {/* Panel 1: Synthesized Recommendation Explorer */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Memory-Synthesized Recommendations</span>
                  {synthesizedRec ? (
                    <div className="flex flex-col gap-2 mt-1">
                      <p className="text-slate-200 leading-relaxed italic">&ldquo;{synthesizedRec.guidanceText}&rdquo;</p>
                      <div className="flex justify-between border-t border-slate-900 pt-2 text-[8px] text-slate-500">
                        <span>Similar Projects: <strong>{synthesizedRec.similarProjectsFound}</strong></span>
                        <span>Confidence: <strong>{synthesizedRec.confidenceScore}%</strong></span>
                      </div>
                      {synthesizedRec.applicableLessons.length > 0 && (
                        <div className="mt-1">
                          <span className="text-cyan-400 block font-bold text-[8px]">Linked Lesson Recommendation:</span>
                          <span className="text-slate-400 block text-[8px] mt-0.5 leading-tight">{synthesizedRec.applicableLessons[0].recommendation}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">Synthesize recommendations to extract lessons learned.</span>
                  )}
                </div>

                {/* Panel 2: Lessons Learned Ledger */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Lessons Learned Database</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeLessonsLearned.getLessons().map(l => (
                      <div key={l.id} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                        <div className="flex justify-between font-bold text-slate-200 text-[8.5px]">
                          <span>ID: {l.id}</span>
                          <span className="text-red-400">Impact: {l.impactScore}/10</span>
                        </div>
                        <p className="text-slate-400 text-[8px] mt-0.5 leading-tight"><strong>Situation:</strong> {l.situation}</p>
                        <p className="text-slate-500 text-[8px] mt-0.5 leading-tight"><strong>Root Cause:</strong> {l.rootCause}</p>
                        <p className="text-emerald-450 text-[8px] mt-0.5 leading-tight"><strong>Resolution:</strong> {l.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Panel 3: Extracted Reusable Design Patterns */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">Extracted Patterns & Rules</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {experienceLogs.length > 0 ? (
                      activeEngineeringMemory.getPatterns().map(pat => (
                        <div key={pat.id} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0 leading-tight">
                          <div className="flex justify-between font-bold text-slate-300">
                            <span className="truncate max-w-[140px]">{pat.name}</span>
                            <span className="text-[7.5px] text-cyan-405">{pat.type}</span>
                          </div>
                          <p className="text-slate-550 text-[8px] mt-0.5">{pat.description}</p>
                          <code className="text-orange-400 text-[7.5px] mt-1 block bg-slate-950 px-1 rounded truncate">{pat.reusableRuleExpression}</code>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No patterns extracted. Index successful experience.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Experience Ledger and Weights */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Governing Engineering Experience Ledger</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {experienceLogs.length > 0 ? (
                      experienceLogs.map(exp => (
                        <div key={exp.id} className="bg-slate-900 p-2 border border-slate-800 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">{exp.projectName}</span>
                            <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                              <span>Duration: {exp.metrics.executionDurationMs / 1000}s</span>
                              <span>CPU: {exp.metrics.cpuPeakUsagePercent}%</span>
                              <span>Latency: {exp.metrics.networkLatencyMs}ms</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                              exp.outcomeStatus === "Success" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{exp.outcomeStatus}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No experiences recorded in this session. Index an experience to populate ledger.</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Recommendation Adaptive Learning Weights</span>
                  <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Solver Accuracy Weight:</span>
                      <strong className="text-cyan-300">{activeRecommendationLearner.getWeights().solverAccuracyWeight.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Compute Cost Weight:</span>
                      <strong className="text-cyan-300">{activeRecommendationLearner.getWeights().computeCostWeight.toFixed(2)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Safety Margin Weight:</span>
                      <strong className="text-cyan-300">{activeRecommendationLearner.getWeights().safetyMarginWeight.toFixed(2)}</strong>
                    </div>
                    <div className="text-[7.5px] text-slate-500 border-t border-slate-900 pt-2 leading-normal">
                      <strong>Adaptive feedback mechanism:</strong> Verification failures adaptively increase Safety Margin priorities, while success runs optimize accuracy weights.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "decisionStudio" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🧠 DECISION INTELLIGENCE STUDIO & GOVERNED RECOMMENDATIONS</h3>
                  <p className="text-[10px] text-slate-500">Transform historical experiences patterns and multi-criteria evaluations outcomes into confidence-scored, auditable engineering advice</p>
                </div>
                <div className="flex gap-2">
                  {activeIntent ? (
                    <button
                      onClick={handleFormulateDecisionAdvice}
                      className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                    >
                      Formulate Recommendation
                    </button>
                  ) : (
                    <span className="text-red-400 text-[10px] font-bold">Please validate an intent first.</span>
                  )}
                  {activeRecommendation && (
                    <button
                      onClick={handleApproveDecisionRecommendation}
                      className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                    >
                      Approve & Load Design
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono">
                {/* Panel 1: Advice Summary & Predicted Outcomes */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Recommended Plan & Forecasted Outcome</span>
                  {activeRecommendation ? (
                    <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-300">
                      <p className="text-slate-200 italic leading-relaxed">{activeRecommendation.recommendationSummary}</p>
                      <div className="border-t border-slate-900 pt-2 flex flex-col gap-1.5 mt-1">
                        <span className="text-cyan-350 block font-bold text-[8.5px]">Outcome Forecasts:</span>
                        <div className="flex justify-between text-slate-400">
                          <span>Predicted Speed:</span>
                          <strong className="text-cyan-300">{(activeRecommendation.predictedOutcome.predictedDurationMs / 1000).toFixed(0)}s</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Predicted Cost:</span>
                          <strong className="text-cyan-300">${activeRecommendation.predictedOutcome.predictedCostUSD}</strong>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Peak GPU/CPU:</span>
                          <strong className="text-cyan-300">{activeRecommendation.predictedOutcome.predictedCpuUsagePercent}%</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">No recommendations formulated. Trigger recommendation engine.</span>
                  )}
                </div>

                {/* Panel 2: Tradeoffs & Confidence Analysis */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Tradeoff Explorer & Confidence analysis</span>
                  {activeRecommendation ? (
                    <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                      <div className="flex justify-between items-center bg-slate-900 p-2 border border-slate-850 rounded">
                        <span>Confidence Score:</span>
                        <strong className="text-emerald-450 text-xs font-bold">{activeRecommendation.overallConfidenceScore}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-500 mt-2">
                        <span>Pareto Efficiency Index:</span>
                        <strong className="text-purple-300">{activeRecommendation.tradeoffs.efficiencyIndex}%</strong>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Cost-to-Accuracy Ratio:</span>
                        <strong className="text-purple-300">{activeRecommendation.tradeoffs.costAccuracyRatio.toFixed(1)}</strong>
                      </div>
                      <div className="text-[7.5px] text-slate-500 border-t border-slate-900 pt-2 leading-normal mt-2">
                        <strong>Confidence criteria weights:</strong> Derived dynamically from historical project successes and specialists agreement coverage.
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">Tradeoff details populate upon advice execution.</span>
                  )}
                </div>

                {/* Panel 3: Risk Forecast Indicator */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Execution Risk Forecasts</span>
                  <div className="max-h-[140px] overflow-y-auto flex flex-col gap-2 mt-1 leading-tight">
                    {activeRecommendation ? (
                      activeRecommendation.riskForecasts.map((rk, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex justify-between text-[8.5px] font-bold text-slate-200">
                            <span>Risk Category: {rk.category}</span>
                            <span className="text-yellow-450">Prob: {rk.probabilityPercent}%</span>
                          </div>
                          <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                            <span>Severity Score: {rk.severityScore}/10</span>
                          </div>
                          <p className="text-slate-400 text-[8px] mt-1 leading-normal">
                            <strong>Mitigation Plan:</strong> {rk.mitigationAdvice}
                          </p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No risks forecasted.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Rationale Trace Explorer */}
              {activeRecommendation && (
                <div className="grid grid-cols-1 gap-4 text-[9px] font-mono mt-2 bg-slate-905 border border-slate-800 rounded p-2.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Governed Decision Rationale & Trace Evidence Chain</span>
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    <div>
                      <span className="text-cyan-400 block font-bold text-[8.5px] border-b border-slate-900 pb-0.5">Explanation Evidence Chain</span>
                      <div className="flex flex-col gap-1 mt-1 text-[8px] text-slate-400 leading-tight">
                        {activeDecisionExplanationEngine.traceDecision(activeRecommendation).evidenceChain.map((ev, idx) => (
                          <div key={idx} className="border-b border-slate-900 pb-0.5 last:border-0">
                            &bull; {ev}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-l border-slate-850 pl-3 leading-tight text-slate-400">
                      <span className="text-purple-300 block font-bold text-[8.5px] border-b border-slate-900 pb-0.5">Core Decision Justification</span>
                      <p className="mt-1 leading-relaxed italic text-slate-200">
                        &ldquo;{activeDecisionExplanationEngine.traceDecision(activeRecommendation).justification}&rdquo;
                      </p>
                      <div className="text-[7.5px] text-slate-500 mt-2">
                        Trace ID: {activeRecommendation.explanationTraceId} | Status: Governed & Auditable
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

            </div>
          )}

          {activeTab === "twinContinuous" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🌍 CONTINUOUS TWIN OPERATIONS & RUNTIME INTELLIGENCE</h3>
                  <p className="text-[10px] text-slate-500">Observe real-time telemetry, evaluate runtime constraints against policies, and auto-flag correlated situation anomalies</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleToggleAnomalyState}
                    className={`font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap ${
                      anomalyTriggered
                        ? "bg-red-900 text-red-100 hover:bg-red-800"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {anomalyTriggered ? "⚠️ Trigger Nominal Mode" : "⚡ Simulate Overload Anomaly"}
                  </button>
                  <button
                    onClick={handleTriggerHeartbeatCycle}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap animate-pulse"
                  >
                    🔄 Cycle Heartbeat (Ticks: {heartbeatTicks})
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono">
                {/* Panel 1: Live Telemetry & Normalizations */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Normalized Telemetry Stream</span>
                  {situations.length > 0 ? (
                    (() => {
                      const latest = situations[situations.length - 1];
                      return (
                        <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-300">
                          <div className="grid grid-cols-3 gap-2 text-center text-[8.5px] border-b border-slate-900 pb-2">
                            <div className="p-1 bg-slate-900 rounded">
                              <span className="text-slate-500 block">Voltage</span>
                              <strong className="text-cyan-300 text-xs">{latest.twinSnapshot.voltage}V</strong>
                            </div>
                            <div className="p-1 bg-slate-900 rounded">
                              <span className="text-slate-500 block">Temperature</span>
                              <strong className="text-cyan-300 text-xs">{latest.twinSnapshot.temperature}°C</strong>
                            </div>
                            <div className="p-1 bg-slate-900 rounded">
                              <span className="text-slate-500 block">Load</span>
                              <strong className="text-cyan-300 text-xs">{latest.twinSnapshot.loadKW} kW</strong>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 text-slate-400 mt-1">
                            <div className="flex justify-between">
                              <span>Safety Boundary Check:</span>
                              <strong className={latest.safetyStatus === "Passed" ? "text-emerald-400" : "text-red-400"}>
                                {latest.safetyStatus}
                              </strong>
                            </div>
                            <div className="flex justify-between">
                              <span>Active Workflow:</span>
                              <span className="text-purple-300 font-bold truncate max-w-[120px]">{latest.activeWorkflowId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Operating CPU / Mem:</span>
                              <span className="text-slate-500">{latest.runtimeMetrics.cpuPercent}% / {latest.runtimeMetrics.memoryMb}MB</span>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-600 italic">No telemetry cycles processed. Run heartbeat cycle to poll.</span>
                  )}
                </div>

                {/* Panel 2: Runtime Policy Engine Configurations */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Active Runtime Policy Rules</span>
                  <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Max Voltage Threshold:</span>
                      <strong className="text-orange-400">{activeRuntimePolicyEngine.getPolicy().voltageLimitMax}V</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Thermal Ceiling:</span>
                      <strong className="text-orange-400">{activeRuntimePolicyEngine.getPolicy().temperatureLimitMax}°C</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Polling Frequency:</span>
                      <strong className="text-cyan-300">Every {activeRuntimePolicyEngine.getPolicy().reassessmentFrequencySeconds}s</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Auto Re-evaluate Decisions:</span>
                      <strong className="text-emerald-450">{activeRuntimePolicyEngine.getPolicy().autoReevaluateDecision ? "Enabled" : "Disabled"}</strong>
                    </div>
                    <div className="text-[7.5px] text-slate-500 border-t border-slate-900 pt-2 leading-normal">
                      <strong>Policy Rules Scope:</strong> Triggers notifications, limits checks, and safety violations warnings dynamically without code updates.
                    </div>
                  </div>
                </div>

                {/* Panel 3: Correlated Situations Ledger */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Event Correlation Log</span>
                  <div className="max-h-[145px] overflow-y-auto flex flex-col gap-2 mt-1 leading-tight">
                    {correlatedSituations.length > 0 ? (
                      [...correlatedSituations].reverse().map((corr, idx) => (
                        <div key={idx} className="border-b border-slate-900 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex justify-between text-[8.5px] font-bold text-slate-200">
                            <span className="text-slate-400">ID: {corr.id}</span>
                            <span className={`px-1 rounded text-[7.5px] ${
                              corr.severity === "Emergency" || corr.severity === "Critical"
                                ? "bg-red-950 text-red-400"
                                : corr.severity === "Warning"
                                ? "bg-yellow-950 text-yellow-400"
                                : "bg-emerald-950 text-emerald-400"
                            }`}>{corr.severity}</span>
                          </div>
                          <p className="text-slate-300 text-[8.5px] mt-1 leading-normal italic">
                            &ldquo;{corr.rootCauseHypothesis}&rdquo;
                          </p>
                          {corr.correlationRulesApplied.length > 0 && (
                            <div className="text-[7.5px] text-purple-400 mt-0.5">
                              Rule: {corr.correlationRulesApplied.join(", ")}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No correlated anomalies recorded.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Situation Timeline Stream & Active Alerts notifications */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Situation Timeline History</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {situations.length > 0 ? (
                      [...situations].reverse().map(sit => (
                        <div key={sit.id} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Situation ID: {sit.id}</span>
                            <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                              <span>Volt: {sit.twinSnapshot.voltage}V</span>
                              <span>Temp: {sit.twinSnapshot.temperature}°C</span>
                              <span>Load: {sit.twinSnapshot.loadKW}kW</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className="px-1 py-0.5 rounded text-[8px] bg-slate-950 text-cyan-400 border border-cyan-900/50">
                              {sit.lifecycle}
                            </span>
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                              sit.severity === "Emergency" || sit.severity === "Critical"
                                ? "bg-red-950 text-red-400"
                                : "bg-emerald-950 text-emerald-400"
                            }`}>{sit.severity}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No operation timelines captured.</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Operator Dispatch Alerts</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {activeNotificationCoordinator.getAlerts().length > 0 ? (
                      [...activeNotificationCoordinator.getAlerts()].reverse().map(al => (
                        <div key={al.id} className="bg-red-950/20 border border-red-900/40 p-2 rounded text-red-300 leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span>ALERT ({al.severity})</span>
                            <span className="text-slate-500">{new Date(al.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[8px]">{al.message}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No operator alerts dispatched.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "operationalGovernance" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🛡️ OPERATIONAL GOVERNANCE & COMPLIANCE ENGINE</h3>
                  <p className="text-[10px] text-slate-500">Govern proposed operational adjustments, enforce safety interlock controls, audit compliances, and manage operator sign-offs</p>
                </div>
                <div>
                  <button
                    onClick={handleCompileOperationalGovernance}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Govern Telemetry Situation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Policy Management */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Policy Management</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <span className="text-[8.5px] font-bold text-slate-200">Active Policy ID:</span>
                    <span className="text-cyan-300 block truncate">gov-policy-v4.5-nominal</span>
                    <div className="flex justify-between mt-1">
                      <span>Approver Level:</span>
                      <strong className="text-purple-300">Lead</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Type:</span>
                      <strong className="text-purple-300">Hybrid</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <strong className="text-cyan-300">1 (Nominal)</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Compliance Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Compliance Dashboard</span>
                  {governedActions.length > 0 ? (
                    (() => {
                      const latest = governedActions[governedActions.length - 1];
                      return (
                        <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                          <div className="flex justify-between">
                            <span>Constitutional:</span>
                            <span className="text-emerald-400 font-bold">Passed</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Safety Audits:</span>
                            <span className={latest.complianceReport?.safetyStatus === "Passed" ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                              {latest.complianceReport?.safetyStatus}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regulatory:</span>
                            <span className="text-emerald-400 font-bold">Passed</span>
                          </div>
                          <div className="text-[7.5px] text-slate-500 mt-2 truncate">
                            Evidence: {latest.complianceReport?.evidenceSnapshot}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-600 italic">Run governance compiler.</span>
                  )}
                </div>

                {/* 3. Safety Interlocks */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Safety Interlocks</span>
                  {governedDecisions.length > 0 ? (
                    (() => {
                      const latestDec = governedDecisions[governedDecisions.length - 1];
                      const isEngaged = latestDec.safetyConstraintsChecked.some(c => c.includes("Safety Interlock Engaged"));
                      return (
                        <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                          <div className="flex justify-between items-center bg-slate-900 p-2 border border-slate-850 rounded">
                            <span>Interlock Engaged:</span>
                            <strong className={isEngaged ? "text-red-400 font-bold text-xs" : "text-emerald-400 font-bold"}>
                              {isEngaged ? "TRUE" : "FALSE"}
                            </strong>
                          </div>
                          <div className="text-[7.5px] text-slate-500 leading-normal mt-1">
                            {latestDec.safetyConstraintsChecked[0] || "Safety checks normal."}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-600 italic">No interlocks recorded.</span>
                  )}
                </div>

                {/* 4. Governance Metrics */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Governance Quality Metrics</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Approval Latency:</span>
                      <strong className="text-cyan-300">{(activeEngineeringActionRepository.getMetrics().approvalLatencyMs / 1000).toFixed(0)}s</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Compliance Rate:</span>
                      <strong className="text-cyan-300">{activeEngineeringActionRepository.getMetrics().complianceRatePercent}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Interlock Incidents:</span>
                      <strong className="text-cyan-300">{activeEngineeringActionRepository.getMetrics().safetyInterlockCount}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Rollback Frequency:</span>
                      <strong className="text-cyan-300">{activeEngineeringActionRepository.getMetrics().rollbackRatePercent}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Approval workflow queue and audit events timeline */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Operational Action Approval Queue</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {governedActions.length > 0 ? (
                      [...governedActions].reverse().map(act => (
                        <div key={act.actionId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Action ID: {act.actionId}</span>
                            <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                              <span>Chain Status: {act.approvalChain?.chainStatus}</span>
                              <span>Target Load: {act.executionIntent?.executionParameters.targetLoadKW}kW</span>
                              <span>Rollback: {act.rollbackPlanText}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {act.status === "Pending" && (
                              <button
                                onClick={() => handleApproveGovernedAction(act.actionId)}
                                className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-2 py-0.5 rounded text-[8px] cursor-pointer"
                              >
                                Sign-off HP
                              </button>
                            )}
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                              act.status === "Approved" ? "bg-emerald-950 text-emerald-450" : "bg-slate-950 text-slate-400"
                            }`}>{act.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No actions registered in the approval queue.</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">6. Governed Audit Events Ledger</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {governedEvents.length > 0 ? (
                      [...governedEvents].reverse().map((evt, idx) => (
                        <div key={idx} className="bg-slate-900 p-2 border border-slate-850 rounded text-slate-400 leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-purple-400">{evt.eventType}</span>
                            <span className="text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-[8px]">Actor: {evt.actor} | Action: {evt.relatedActionId} | State: {evt.beforeState} &rarr; {evt.afterState}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No governance events logged in this session.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "knowledgeSynthesis" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">📚 ENGINEERING KNOWLEDGE SYNTHESIS STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Synthesize operational outcomes, extract cross-domain engineering patterns, evaluate policy effectiveness, and compile reusable playbooks</p>
                </div>
                <div>
                  <button
                    onClick={handleCompileKnowledgeSynthesis}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Synthesize Playbooks & Recommendations
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Policy Recommendations */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Policy Recommendations</span>
                  <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                    {knowledgeArtifacts.length > 0 ? (
                      knowledgeArtifacts.map(art => (
                        <div key={art.artifactId} className="bg-slate-900 p-2 border border-slate-850 rounded">
                          <span className="font-bold text-slate-200">Recommendation:</span>
                          <p className="text-orange-400 text-[8px] mt-1 leading-normal">
                            {art.derivedPatterns[0]}
                          </p>
                          <div className="flex justify-between text-[7px] text-slate-500 mt-2">
                            <span>Artifact: {art.artifactId}</span>
                            <span>Confidence: {art.confidenceScore}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-900 p-2 border border-slate-850 rounded">
                        <span className="font-bold text-slate-250">Proposed Policy Refinement:</span>
                        <p className="text-slate-500 text-[8px] mt-1 leading-normal italic">
                          "Lower nominal solar voltage check triggers from 120V to 118V to prevent switcher degradation."
                        </p>
                        <div className="flex justify-between text-[7px] text-slate-500 mt-2">
                          <span>Confidence: 92%</span>
                          <span>Source: Simulation Failures</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Operational Outcomes */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Operational Outcomes</span>
                  {operationalOutcomes.length > 0 ? (
                    (() => {
                      const latest = operationalOutcomes[operationalOutcomes.length - 1];
                      return (
                        <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className="text-emerald-400 font-bold">{latest.executionResultStatus}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Latency Reduction:</span>
                            <span className="text-cyan-300 font-bold">{latest.kpiChanges.latencyReductionMs}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Compliance Score:</span>
                            <span className="text-cyan-300 font-bold">{latest.kpiChanges.safetyComplianceScore}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peak Memory:</span>
                            <span className="text-slate-500">{latest.resourceUsage.peakMemoryMb}MB</span>
                          </div>
                          <div className="text-[7.5px] text-slate-500 mt-1 truncate">
                            Evidence: {latest.verificationResultSummary}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-600 italic">Run synthesis compiler.</span>
                  )}
                </div>

                {/* 3. Cross-Domain Patterns */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Cross-Domain Patterns</span>
                  <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                    <div className="bg-slate-900 p-2 border border-slate-850 rounded">
                      <span className="font-bold text-slate-200 block truncate">Standardized Transient Limits</span>
                      <div className="flex gap-1.5 text-slate-500 text-[7.5px] mt-1">
                        <span>Domains: Solar, Wind, CFD</span>
                      </div>
                      <p className="text-slate-400 text-[8px] mt-1 leading-normal italic">
                        "Enforce preventive safety bounds audits during startup sequences."
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Synthesis Analytics */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Synthesis Analytics</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Total Outcomes:</span>
                      <strong className="text-cyan-300">{operationalOutcomes.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Synthesized Session:</span>
                      <strong className="text-cyan-300 truncate max-w-[80px]">{synthesisSessions[0]?.sessionId || "None"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Synthesis Duration:</span>
                      <strong className="text-cyan-300">42ms</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Policy Effectiveness:</span>
                      <strong className="text-emerald-400">Stable ({activePolicyEffectivenessEvaluator.evaluate(operationalOutcomes).overallComplianceRate}%)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Generated Engineering Playbooks list and Knowledge Artifacts */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Generated Reusable Engineering Playbooks</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {(() => {
                      const playbooks = activePlaybookGenerator.generate(operationalOutcomes);
                      return playbooks.map(pb => (
                        <div key={pb.playbookId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">{pb.name}</span>
                            <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                              <span>Domain: {pb.targetDomain}</span>
                              <span>Steps: {pb.steps.length} steps</span>
                            </div>
                            <div className="text-[7.5px] text-purple-400 mt-1 leading-normal font-sans">
                              {pb.steps.join(" → ")}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-slate-950 text-cyan-400 border border-cyan-900/50">
                              Successes: {pb.successCount}
                            </span>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">6. Canonical Knowledge Artifacts</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {knowledgeArtifacts.length > 0 ? (
                      [...knowledgeArtifacts].reverse().map(art => (
                        <div key={art.artifactId} className="bg-slate-900 p-2 border border-slate-850 rounded text-slate-400 leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Artifact: {art.artifactId}</span>
                            <span className="text-slate-500">v{art.version}</span>
                          </div>
                          <p className="text-[8px] truncate">Domains: {art.applicableDomains.join(", ")}</p>
                          <p className="text-[8px] mt-1 text-slate-500">Author: {art.author} | Evidence: {art.supportingEvidenceCount} outcomes</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No canonical artifacts synthesized yet.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "engineeringEvolution" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🧬 ENGINEERING EVOLUTION & SELF-IMPROVEMENT ENGINE</h3>
                  <p className="text-[10px] text-slate-500">Propose controlled self-improvements to heuristics, policies, and workflows under evidence-based governance constraints</p>
                </div>
                <div>
                  <button
                    onClick={handleCompileEvolution}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Formulate Evolution Proposal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Capability Improvements */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Capability Improvements</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <span className="text-[8.5px] font-bold text-slate-200">Planning Strategy target:</span>
                    <span className="text-cyan-300 block truncate">Grid Transient Load Heuristic</span>
                    <div className="flex justify-between mt-1">
                      <span>Weight Delta:</span>
                      <strong className="text-purple-300">+0.15</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Routing Rules:</span>
                      <strong className="text-purple-300">Dynamic Optimizer</strong>
                    </div>
                    <div className="text-[7.5px] text-slate-500 mt-2 leading-normal">
                      Updates planner heuristic parameters to prioritize high accuracy options.
                    </div>
                  </div>
                </div>

                {/* 2. Policy & Workflow Evolutions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Policy & Workflow Evolutions</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="border-b border-slate-900 pb-1.5 mb-1.5">
                      <span className="text-[8.5px] font-bold text-slate-200">Policy Refinement:</span>
                      <div className="flex justify-between text-slate-400 mt-0.5">
                        <span>Variable: voltageLimitMax</span>
                        <strong className="text-orange-400">118V &rarr; 120V</strong>
                      </div>
                    </div>
                    <div>
                      <span className="text-[8.5px] font-bold text-slate-200">Workflow Variation:</span>
                      <div className="flex justify-between text-slate-400 mt-0.5">
                        <span>Template target:</span>
                        <strong className="text-cyan-300">InsertVerification</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Impact Assessment */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Impact Assessments</span>
                  {evolutionAssessments.length > 0 ? (
                    (() => {
                      const latestAss = evolutionAssessments[evolutionAssessments.length - 1];
                      return (
                        <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                          <div className="flex justify-between">
                            <span>Accuracy Gain:</span>
                            <strong className="text-emerald-400">+{latestAss.expectedAccuracyGain}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Runtime Variance:</span>
                            <strong className="text-cyan-300">{latestAss.expectedRuntimeImpactMs}ms</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Compatibility Risk:</span>
                            <strong className="text-cyan-300">{latestAss.compatibilityRisk}</strong>
                          </div>
                          <div className="text-[7.5px] text-slate-500 leading-normal mt-1">
                            Migration: {latestAss.migrationComplexityText}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className="text-slate-600 italic">No impact assessments loaded.</span>
                  )}
                </div>

                {/* 4. Evolution Repository Metrics */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Evolution Quality Ledger</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Proposals Compiled:</span>
                      <strong className="text-cyan-300">{activeEvolutionRepository.getMetrics().totalProposalsGenerated}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Ratio:</span>
                      <strong className="text-cyan-300">{activeEvolutionRepository.getMetrics().proposalsApprovedRatio}%</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Experiment Success Score:</span>
                      <strong className="text-cyan-300">{activeEvolutionRepository.getMetrics().meanExperimentSuccessScore}%</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Proposals queue and experiments ledger */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Self-Evolution Proposals Queue</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {evolutionProposals.length > 0 ? (
                      [...evolutionProposals].reverse().map(prop => (
                        <div key={prop.proposalId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Proposal ID: {prop.proposalId} (Target: {prop.implementationTarget})</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              Suggested: "{prop.suggestedChange}"
                            </div>
                            <div className="flex gap-2 text-slate-600 text-[7px] mt-0.5">
                              <span>Confidence: {prop.confidenceScore}%</span>
                              <span>Risk Score: {prop.quantifiedRisksScore}/100</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {prop.status === "Proposed" && (
                              <button
                                onClick={() => handleApproveEvolutionProposal(prop.proposalId)}
                                className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-2 py-0.5 rounded text-[8px] cursor-pointer"
                              >
                                Review
                              </button>
                            )}
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold ${
                              prop.status === "Approved" ? "bg-emerald-950 text-emerald-450" : "bg-slate-950 text-slate-400"
                            }`}>{prop.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No proposals registered in the evolution queue.</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">6. Active A/B Experiments Trials</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {evolutionExperiments.length > 0 ? (
                      [...evolutionExperiments].reverse().map(exp => (
                        <div key={exp.experimentId} className="bg-slate-900 p-2 border border-slate-850 rounded text-slate-400 leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Exp ID: {exp.experimentId}</span>
                            <span className="px-1 rounded text-[7px] bg-emerald-950 text-emerald-400">{exp.experimentStatus}</span>
                          </div>
                          <p className="text-[7.5px] text-slate-500 leading-normal mb-1">Baseline: {exp.baselinePerformance}</p>
                          <p className="text-[7.5px] text-purple-300 leading-normal">Candidate: {exp.candidatePerformance}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No experiments registered.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "metaCognitive" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🧠 META-COGNITIVE STUDIO & HEALTH MONITOR</h3>
                  <p className="text-[10px] text-slate-500">Audit overall reasoning quality, evaluate longitudinal cognitive benchmarks, track drift indicators, and identify opportunities for platform evolution</p>
                </div>
                <div>
                  <button
                    onClick={handleTriggerCognitiveAudit}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Run Cognitive Audit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Cognitive Health Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Cognitive Health Profile</span>
                  <div className="flex flex-col gap-2 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between items-center bg-slate-900 p-2 border border-slate-850 rounded">
                      <span>Overall Health Index:</span>
                      <strong className="text-cyan-300 text-xs">{metaHealth.overallHealthScore}%</strong>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Cognitive Drift Alert:</span>
                      <strong className={metaHealth.driftDetected ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
                        {metaHealth.driftDetected ? "DRIFT DETECTED" : "NOMINAL"}
                      </strong>
                    </div>
                    <div className="text-[7.5px] text-slate-500 border-t border-slate-900 pt-2 leading-normal">
                      Monitors performance levels across Planning, Reasoning, retrieval, governance, and learning capabilities.
                    </div>
                  </div>
                </div>

                {/* 2. Longitudinal Benchmarks */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Cognitive Performance Benchmarks</span>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {metaBenchmarks.map(b => (
                      <div key={b.benchmarkId} className="bg-slate-900 p-1.5 border border-slate-850 rounded leading-normal">
                        <span className="font-bold text-slate-200 block truncate">{b.name}</span>
                        <div className="flex justify-between text-slate-500 text-[8px] mt-1">
                          <span>Current: <strong className="text-cyan-300">{b.currentScore}%</strong></span>
                          <span>Trend: <strong className="text-emerald-450">{b.trend}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Priority Action Items */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Priority Cognitive Actions</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="bg-slate-900 p-2 border border-slate-850 rounded">
                      <span className="text-orange-400 block font-bold text-[8px] uppercase">Heuristics Drift</span>
                      <p className="text-slate-400 text-[8.5px] leading-normal mt-0.5">
                        Upgrade Evolution pre-reviews rules.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Assessments ledger and episodic diagnostics */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Meta-Cognitive Assessments Registry</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {metaAssessments.length > 0 ? (
                      [...metaAssessments].reverse().map(ass => (
                        <div key={ass.assessmentId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">{ass.component} Assessment</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              Opportunities: "{ass.improvementOpportunities.join(", ")}"
                            </div>
                            <div className="text-[7.5px] text-slate-500 truncate mt-0.5">
                              Evidence: {ass.evidenceSnapshot}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-1 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              ass.reasoningQuality === "Nominal" ? "bg-emerald-950 text-emerald-450" : "bg-yellow-950 text-yellow-450"
                            }`}>{ass.reasoningQuality}</span>
                            <span className="text-cyan-300 font-bold block text-[10px]">{ass.performanceScore}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No assessments registered. Run cognitive audit cycle.</span>
                    )}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Reasoning Episodes Log</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {metaEpisodes.length > 0 ? (
                      [...metaEpisodes].reverse().map(ep => (
                        <div key={ep.episodeId} className="bg-slate-900 p-2 border border-slate-850 rounded text-slate-400 leading-normal">
                          <span className="font-bold text-cyan-300 text-[8px]">Session ID: {ep.episodeId}</span>
                          <p className="text-[8px] text-slate-500 mt-1">{ep.questionText}</p>
                          <div className="text-[7.5px] text-purple-400 mt-1 leading-normal">
                            Path: {ep.reasoningPath.join(" → ")}
                          </div>
                          <p className="text-[8px] font-bold text-slate-300 mt-1">{ep.decisionFormulated}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No reasoning episodes recorded in this session.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "engineeringConstitution" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">📜 ENGINEERING CONSTITUTION STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Enforce non-negotiable architectural invariants, audit planner outcomes compatibility, waiver exception rules, and track violations records</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerConstitutionalAudit}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Run Constitutional Audit
                  </button>
                  <button
                    onClick={handleDeclareConstitutionalViolation}
                    className="bg-red-900 hover:bg-red-800 text-red-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Declare Violation
                  </button>
                  <button
                    onClick={handleGrantConstitutionalException}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Grant Exception
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Compliance Score Index */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Compliance Pillar Metrics</span>
                  {constitutionalReports.length > 0 ? (
                    (() => {
                      const latest = constitutionalReports[constitutionalReports.length - 1];
                      return (
                        <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                          <div className="flex justify-between bg-slate-900 p-2 border border-slate-850 rounded">
                            <span>Overall Compliance Score:</span>
                            <strong className="text-cyan-300 text-xs">{latest.overallScore}%</strong>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span>Evidence Pillar:</span>
                            <strong className="text-emerald-450">{latest.pillarScores.Evidence}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Safety Pillar:</span>
                            <strong className="text-emerald-450">{latest.pillarScores.Safety}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Explainability Pillar:</span>
                            <strong className="text-emerald-450">{latest.pillarScores.Explainability}%</strong>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                      <div className="flex justify-between bg-slate-900 p-2 border border-slate-850 rounded">
                        <span>Overall Compliance Score:</span>
                        <strong className="text-cyan-300 text-xs">100%</strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Constitutional Principles */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Engineering Constitutional Invariants Ledger</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {constitutionalPrinciples.map(p => (
                      <div key={p.principleId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                        <div className="flex justify-between font-bold text-[8px] mb-1">
                          <span className="text-cyan-300">{p.name} ({p.pillar})</span>
                          <span className="text-slate-500">v{p.version} | {p.severity}</span>
                        </div>
                        <p className="text-[8px] text-slate-400">{p.rationale}</p>
                        <p className="text-[7.5px] text-purple-400 mt-1">Enforcement: {p.enforcementRule}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Exception Rules summary */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Waiver Rules Limits</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between">
                      <span>Total Exceptions Active:</span>
                      <strong className="text-cyan-300">{constitutionalExceptions.length}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Critical Safety Waiver:</span>
                      <strong className="text-orange-400">Restricted</strong>
                    </div>
                    <div className="text-[7.5px] text-slate-500 border-t border-slate-900 pt-1.5 mt-1.5 leading-normal">
                      Waivers bypass evidence validation routines under strict multi-agent council review consensus approvals.
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Decisions, Violations, Exceptions lists */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Enforcement Decisions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Intercept Enforcement Decisions</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {constitutionalDecisions.length > 0 ? (
                      [...constitutionalDecisions].reverse().map(dec => (
                        <div key={dec.decisionId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Dec: {dec.decisionId}</span>
                            <span className={`px-1.5 rounded text-[7px] ${
                              dec.decisionStatus === "Authorized" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{dec.decisionStatus}</span>
                          </div>
                          <p className="text-[7.5px] text-slate-500 truncate">Target: {dec.targetId}</p>
                          <p className="text-[7.5px] text-slate-400 mt-1">{dec.evidenceSnippet}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No enforcement records yet. Run constitutional audit cycle.</span>
                    )}
                  </div>
                </div>

                {/* Violations */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Constitutional Violations Registry</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {constitutionalViolations.length > 0 ? (
                      [...constitutionalViolations].reverse().map(vio => (
                        <div key={vio.violationId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal border-l-2 border-red-500">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-red-400">Violation: {vio.violationId}</span>
                            <span className="px-1 rounded text-[7.5px] bg-red-950 text-red-400">{vio.status}</span>
                          </div>
                          <p className="text-[8px] text-slate-200">Component: {vio.component}</p>
                          <p className="text-[7.5px] text-slate-550 leading-normal mt-1 italic">"{vio.description}"</p>
                          <p className="text-[7.5px] text-purple-400 mt-1 font-bold">Suggested Remedy: {vio.suggestedRemedy}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No violations active. Systems running within constitutional limits.</span>
                    )}
                  </div>
                </div>

                {/* Exceptions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">6. Active Exception Waivers list</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {constitutionalExceptions.length > 0 ? (
                      [...constitutionalExceptions].reverse().map(exc => (
                        <div key={exc.exceptionId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal border-l-2 border-purple-500">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-purple-400">Waiver: {exc.exceptionId}</span>
                            <span className="text-slate-500">Approved by Council</span>
                          </div>
                          <p className="text-[7.5px] text-slate-400">Justification: "{exc.justification}"</p>
                          <p className="text-[7px] text-slate-500 mt-1">Expires: {exc.expiryTimestamp}</p>
                          <a href={exc.auditLink} className="text-purple-450 hover:underline text-[7px] block mt-1">Audit Constitution Link</a>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No active exceptions waiving compliance checks.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "knowledgeTrust" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🤝 ENGINEERING KNOWLEDGE TRUST & PROVENANCE STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Cryptographically track ownership provenance chains, audit asset integrity, score confidence factors, and alert on expiration scheduling reviews</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerTrustEvaluation}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Evaluate Trust
                  </button>
                  <button
                    onClick={handleSimulateTamperAlert}
                    className="bg-red-900 hover:bg-red-800 text-red-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Simulate Tamper
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Trust Dashboard summary */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Trust Assessment Metrics</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <div className="flex justify-between bg-slate-900 p-2 border border-slate-850 rounded">
                      <span>Average Trust Score:</span>
                      <strong className="text-cyan-300 text-xs">{trustMetrics.averageTrustScore}%</strong>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Tampered Assets:</span>
                      <strong className={trustMetrics.tamperedAssetsDetected > 0 ? "text-red-400 font-bold" : "text-emerald-450"}>
                        {trustMetrics.tamperedAssetsDetected} Alert(s)
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Expiring Trust Records:</span>
                      <strong className="text-cyan-300">{trustMetrics.expiringTrustRecords}</strong>
                    </div>
                  </div>
                </div>

                {/* 2. Expiration alerts schedule */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Trusted Knowledge Assets Registry</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {trustRecords.length > 0 ? (
                      [...trustRecords].reverse().map(ktr => (
                        <div key={ktr.recordId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">KTR: {ktr.recordId} (Art: {ktr.artifactId})</span>
                            <span className={`px-1 rounded text-[7px] ${
                              ktr.integrityStatus === "Valid" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                            }`}>{ktr.integrityStatus}</span>
                          </div>
                          <div className="flex justify-between text-slate-500 text-[7.5px] mt-0.5">
                            <span>Evidence Quality: {ktr.evidenceQuality}%</span>
                            <span>Trust Score Score: <strong className="text-cyan-300">{ktr.trustScore}%</strong></span>
                          </div>
                          <div className="text-[7px] text-purple-400 mt-1">
                            Custody Hops: {ktr.provenanceChain.join(" &rarr; ")}
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No trusted records compiled. Trigger trust evaluation.</span>
                    )}
                  </div>
                </div>

                {/* 3. Review limits scheduler */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Expiration Review Limits</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    <span className="text-[8px] font-bold text-slate-200">Revalidation Thresholds:</span>
                    <div className="flex justify-between text-slate-500 text-[8px] mt-0.5">
                      <span>Standard Lifespan:</span>
                      <strong className="text-cyan-300">30 Days</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[8px]">
                      <span>Check Autonomy Type:</span>
                      <strong className="text-cyan-300">Signature Verify</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Provenance nodes list and integrity logs */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Provenance Hops */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Provenance Custody Trackers</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {trustHops.length > 0 ? (
                      [...trustHops].reverse().map(hop => (
                        <div key={hop.nodeId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Hop Node: {hop.nodeId}</span>
                            <div className="flex gap-2 text-slate-500 text-[8px] mt-0.5">
                              <span>Source: {hop.sourceArtifactId}</span>
                              <span>Component: {hop.producingComponent}</span>
                            </div>
                            <div className="text-[7.5px] text-purple-400 mt-1 leading-normal font-sans">
                              Verification Reference: {hop.verificationReference}
                            </div>
                          </div>
                          <div>
                            <span className="px-1.5 py-0.5 rounded text-[8px] bg-emerald-950 text-emerald-450 border border-emerald-900/50">
                              {hop.signatureStatus}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No custody hops registered. Trigger trust evaluation to trace hops.</span>
                    )}
                  </div>
                </div>

                {/* Integrity logs queue */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Integrity Verification Audit logs</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[8.5px] leading-normal text-slate-400">
                    <div className="bg-slate-900 p-2 border border-slate-850 rounded">
                      <span className="font-bold text-emerald-400 block mb-0.5">INTEGRITY CHECK PASSED</span>
                      <span>Artifact hashes matched the signed genesis block configuration.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "engineeringAssurance" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🎖️ ENGINEERING ASSURANCE & CERTIFICATION STUDIO</h3>
                  <p className="text-[10px] text-slate-500">Compile operational suitability arguments, link immutable verification reports, delegate authority approvals, and track active certificates lifecycles</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCompileAssuranceCase}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Compile Assurance Case
                  </button>
                  <button
                    onClick={handleSuspendCertification}
                    className="bg-red-900 hover:bg-red-800 text-red-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Suspend Certification
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Assurance Cases list */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Structured Suitability Claims (Assurance Cases)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {assuranceCases.length > 0 ? (
                      [...assuranceCases].reverse().map(ac => (
                        <div key={ac.caseId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Case: {ac.caseId} (Target: {ac.targetArtifactId})</span>
                            <span className={`px-1.5 rounded text-[7px] font-bold ${
                              ac.reviewStatus === "Certified" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{ac.reviewStatus}</span>
                          </div>
                          <p className="text-[8px] text-slate-200">Claim: "{ac.claimText}"</p>
                          <div className="flex justify-between text-slate-550 text-[7.5px] mt-1">
                            <span>Evidence linked: {ac.evidenceIds.length} records</span>
                            <span>Scope: <strong className="text-purple-300">{ac.scope}</strong></span>
                            <span>Assurance Index: <strong className="text-cyan-300">{ac.assuranceScore}%</strong></span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No suitability cases registered. Trigger Compile Assurance Case.</span>
                    )}
                  </div>
                </div>

                {/* 2. Certification Packages */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Reusable Certification Packages</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {certificationPackages.length > 0 ? (
                      [...certificationPackages].reverse().map(pkg => (
                        <div key={pkg.packageId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <span className="font-bold text-slate-300 block text-[8px]">Pkg: {pkg.packageId}</span>
                          <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                            <div>Trust Ref: {pkg.trustRecordVersionId}</div>
                            <div>Compliance Ref: {pkg.complianceVerificationVersionId}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No packages compiled.</span>
                    )}
                  </div>
                </div>

                {/* 3. Authorities Registry */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Authorized Review Boards</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {certificationAuthorities.map(auth => (
                      <div key={auth.authorityId} className="bg-slate-900 p-1.5 border border-slate-850 rounded leading-normal">
                        <span className="font-bold text-slate-200 block truncate">{auth.name}</span>
                        <div className="flex justify-between text-slate-550 text-[7px] mt-0.5">
                          <span>Role: {auth.role}</span>
                          <span>Key: {auth.signatureKey.substring(8, 16)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 2: Decisions and audit timelines */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Decisions Ledger */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Certification Decisions Ledger (History)</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {certificationDecisions.length > 0 ? (
                      [...certificationDecisions].reverse().map(dec => (
                        <div key={dec.decisionId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Dec: {dec.decisionId} (Pkg: {dec.packageId})</span>
                            <p className="text-[7.5px] text-slate-500 mt-1 leading-normal">Rationale: "{dec.rationale}"</p>
                            {dec.supersedesDecisionId && (
                              <div className="text-[7px] text-purple-400 mt-0.5 font-bold">
                                Supersedes: {dec.supersedesDecisionId} (Version: {dec.decisionVersion})
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              dec.status === "Approved" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{dec.status}</span>
                            <span className="text-slate-550 text-[7px] block">{dec.timestamp.substring(11, 19)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-600 italic">No decision logs recorded. Submit a case.</span>
                    )}
                  </div>
                </div>

                {/* Expiration warning alerts scheduler */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Expiration Renewal Schedulers</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1 text-[8.5px] leading-normal text-slate-400">
                    <div className="bg-slate-900 p-2 border border-slate-850 rounded">
                      <span className="font-bold text-purple-400 block mb-0.5">RENEWAL REMINDER SCHEDULED</span>
                      <span>Certification validity audited continuously. Automated renewals triggered 30 days prior to expiry.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "engineeringRisk" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">⚠️ ENGINEERING RISK & SAFETY CASE STUDIO</h3>
                  <p className="text-[10px] text-slate-505">Continuous hazard verification matrices, safety barrier control mitigations, real-world incident feedback loops, and dynamic safety claims validation</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerRiskAssessment}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Trigger Risk Assessment
                  </button>
                  <button
                    onClick={handleTriggerOperationalIncident}
                    className="bg-red-900 hover:bg-red-800 text-red-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Simulate Incident
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Risk Matrix Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Active Risks Heatmap Ledger</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    {riskCases.length > 0 ? (
                      [...riskCases].reverse().map(rc => (
                        <div key={rc.caseId} className="bg-slate-900 p-2 border border-slate-855 rounded flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span className="text-cyan-300 font-bold">Case: {rc.caseId}</span>
                            <span className={`px-1 rounded text-[7.5px] ${
                              rc.riskStatus === "Mitigated" ? "bg-emerald-950 text-emerald-450" : "bg-red-955 text-red-400"
                            }`}>{rc.riskStatus}</span>
                          </div>
                          <div>Asset: {rc.targetAssetId}</div>
                          <div className="flex justify-between text-[7px] text-slate-500 mt-1 border-t border-slate-850 pt-1">
                            <span>Initial: <strong className="text-red-400">{rc.initialRiskScore}</strong></span>
                            <span>Residual: <strong className="text-emerald-400">{rc.residualRiskScore}</strong></span>
                            <span>Domain: {rc.domain}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No risk cases recorded. Trigger assessment.</span>
                    )}
                  </div>
                </div>

                {/* 2. Hazards Registry */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Potential Failure Modes (Hazards Registry)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {riskHazards.length > 0 ? (
                      [...riskHazards].reverse().map(haz => (
                        <div key={haz.hazardId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Hazard: {haz.hazardId} ({haz.state})</span>
                            <span className="text-slate-500">Sev: {haz.severity} | Lik: {haz.likelihood} | Det: {haz.detectability}</span>
                          </div>
                          <p className="text-[8px] text-slate-300">Cause: "{haz.cause}" &rarr; Consequence: "{haz.consequence}"</p>
                          <p className="text-[7.5px] text-purple-400 mt-1">Barrier: {haz.controls.join(", ")}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No hazards analyzed.</span>
                    )}
                  </div>
                </div>

                {/* 3. Safety Claim & Acceptance Criteria */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Safety Arguments (Safety Cases)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {safetyCasesList.length > 0 ? (
                      [...safetyCasesList].reverse().map(sc => (
                        <div key={sc.safetyCaseId} className="bg-slate-900 p-2 border border-slate-855 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Safety Case: {sc.safetyCaseId}</span>
                            <span className={`px-1 rounded text-[7.5px] font-bold ${
                              sc.approvalStatus === "Approved" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"
                            }`}>{sc.approvalStatus}</span>
                          </div>
                          <p className="text-[7.5px] text-slate-300">Claim: "{sc.safetyClaim}"</p>
                          <p className="text-[7px] text-purple-400 mt-1">Residual Risk: {sc.residualRisk} (Criteria: {sc.acceptanceCriteria})</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No safety cases compiled.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Mitigations ledger and incidents feedback logs */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Mitigation Plans */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Safety Mitigation Barriers & Active Controls</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {riskMitigations.length > 0 ? (
                      [...riskMitigations].reverse().map(mit => (
                        <div key={mit.mitigationPlanId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Mitigation ID: {mit.mitigationPlanId}</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              <div>Preventive: {mit.preventiveControls.join(", ")}</div>
                              <div>Detective: {mit.detectiveControls.join(", ")}</div>
                              <div>Corrective: {mit.correctiveControls.join(", ")}</div>
                              <div className="text-purple-400 font-bold mt-1">Verification: "{mit.verificationActivities.join(", ")}"</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              mit.implementationStatus === "InEffect" ? "bg-emerald-950 text-emerald-450" : "bg-yellow-950 text-yellow-450"
                            }`}>{mit.implementationStatus}</span>
                            <span className="text-slate-550 text-[7px] block">Target Score: {mit.residualRiskTarget}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No mitigations applied yet.</span>
                    )}
                  </div>
                </div>

                {/* Incident record logs */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Incident Feedbacks & Root Cause Records</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {incidentRecords.length > 0 ? (
                      [...incidentRecords].reverse().map(inc => (
                        <div key={inc.incidentId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal border-l-2 border-red-500">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-red-400">Incident: {inc.incidentId}</span>
                            <span className="text-slate-500">{inc.timestamp.substring(11, 19)}</span>
                          </div>
                          <p className="text-[7.5px] text-slate-300 font-bold">Root Cause: {inc.rootCause}</p>
                          <p className="text-[7.5px] text-slate-500 leading-normal mt-1 italic">"Impact: {inc.operationalImpact}"</p>
                          <p className="text-[7px] text-purple-400 mt-1 font-bold">Corrective Action: {inc.correctiveAction}</p>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No incident feedback recorded. Run Incident Simulation to trigger safety interlocks feedback loop.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

            </div>
          )}

          {activeTab === "engineeringResilience" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🔋 ENGINEERING RESILIENCE & OPERATIONAL CONTINUITY STUDIO</h3>
                  <p className="text-[10px] text-slate-505">Staged incident recovery strategy logs, active service continuity fallback paths, and critical upstream/downstream dependency tracking</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerFailureSimulation}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Simulate Failure
                  </button>
                  <button
                    onClick={handleTriggerGracefulDegradation}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Engage Fallback
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Resilience Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Resilience Assessment Metrics</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    {resilienceAssessments.length > 0 ? (
                      [...resilienceAssessments].reverse().map((ra, idx) => (
                        <div key={ra.assessmentId} className="bg-slate-900 p-2 border border-slate-855 rounded flex flex-col gap-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">Eval: {ra.assessmentId.substring(7, 15)}...</span>
                            <span className="text-purple-400">Maturity: {ra.resilienceMaturity}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Availability:</span>
                            <strong className="text-emerald-400">{ra.achievedAvailability}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Recovery Rate:</span>
                            <strong className="text-cyan-300">{ra.recoverySuccessRate}%</strong>
                          </div>
                          <div className="flex justify-between text-[7px] text-slate-500">
                            <span>Compliance: {ra.continuityCompliance}%</span>
                            <span>Degradation Eff: {ra.degradationEfficiency}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No assessments compiled. Trigger simulation.</span>
                    )}
                  </div>
                </div>

                {/* 2. Failure Scenarios */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Failures Catalogue (Failure Scenarios)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {failureScenarios.length > 0 ? (
                      [...failureScenarios].reverse().map(scen => (
                        <div key={scen.scenarioId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Scenario: {scen.scenarioId}</span>
                            <span className="text-purple-400">Type: {scen.failureType}</span>
                          </div>
                          <p className="text-[8px] text-slate-300">Trigger: "{scen.trigger}" &rarr; Impact: "{scen.expectedImpact}"</p>
                          <p className="text-[7.5px] text-slate-500 mt-1">Detection Method: {scen.detectionMethod}</p>
                          <div className="flex justify-between text-[7px] text-slate-600 mt-1 border-t border-slate-850 pt-1">
                            <span>Est Recovery: {scen.estimatedRecoveryTimeMs}ms</span>
                            <span>Status: {scen.simulationStatus}</span>
                            <span className={`px-1.5 rounded ${scen.validationResult === "Pass" ? "bg-emerald-950 text-emerald-450" : "bg-red-950 text-red-400"}`}>
                              Validation: {scen.validationResult}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No failure scenarios simulated.</span>
                    )}
                  </div>
                </div>

                {/* 3. Active Continuity Plans */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Safe Degraded Operating Mode (Continuity)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {continuityPlans.length > 0 ? (
                      [...continuityPlans].reverse().map(cp => (
                        <div key={cp.continuityPlanId} className="bg-slate-900 p-2 border border-slate-855 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block text-[8px]">Plan: {cp.continuityPlanId}</span>
                          <p className="text-[7.5px] text-slate-300 mt-1">Min Service Level: <strong className="text-purple-400">{cp.minimumServiceLevels}%</strong></p>
                          <div className="text-[7px] text-slate-500 mt-1">
                            <div>Critical Services: {cp.criticalServices.join(", ")}</div>
                            <div>Priorities: {cp.dependencyPriorities.join(", ")}</div>
                            <div className="text-purple-400 font-bold mt-1">Escalation: {cp.escalationPaths[0]}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No degraded continuity states active. Run Graceful Degradation fallback.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Recovery execution runs and dependencies mapper */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Recovery Executions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Automated Recovery Strategies Executions Ledger</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {recoveryExecutions.length > 0 ? (
                      [...recoveryExecutions].reverse().map(exec => (
                        <div key={exec.executionId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Execution: {exec.executionId}</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              <div>Strategy Ref: {exec.strategyReferenceId}</div>
                              <div>Operator: {exec.operatorId}</div>
                              <div className="text-purple-400 font-bold mt-1">Validation Assertions: "{exec.validationResults.join(", ")}"</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              exec.successStatus === "Success" ? "bg-emerald-950 text-emerald-450" : "bg-red-955 text-red-400"
                            }`}>{exec.successStatus}</span>
                            <span className="text-slate-550 text-[7px] block">Start: {exec.startTime.substring(11, 19)}</span>
                            <span className="text-slate-550 text-[7px] block">End: {exec.completionTime.substring(11, 19)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No recovery runs registered.</span>
                    )}
                  </div>
                </div>

                {/* Dependency Mapping */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Assets Upstream/Downstream Dependency Models</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {dependencyModels.length > 0 ? (
                      [...dependencyModels].reverse().map(dm => (
                        <div key={dm.modelId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block mb-1">Model ID: {dm.modelId}</span>
                          <div className="text-[7.5px] text-slate-400 space-y-1">
                            <div>Upstream: <span className="text-slate-200">{dm.upstreamDependencies.join(", ")}</span></div>
                            <div>Downstream: <span className="text-slate-200">{dm.downstreamDependencies.join(", ")}</span></div>
                            <div className="text-emerald-400 font-bold">Redundancy: {dm.redundancyRelationships.join(", ")}</div>
                            <div className="text-red-400 font-bold">Single Points of Failure: {dm.singlePointsOfFailure.join(", ")}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No dependency models mapped. Run simulation.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

              </div>
            </div>
          )}

          {activeTab === "engineeringResilience" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🔋 ENGINEERING RESILIENCE & OPERATIONAL CONTINUITY STUDIO</h3>
                  <p className="text-[10px] text-slate-505">Staged incident recovery strategy logs, active service continuity fallback paths, and critical upstream/downstream dependency tracking</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerFailureSimulation}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Simulate Failure
                  </button>
                  <button
                    onClick={handleTriggerGracefulDegradation}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Engage Fallback
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Resilience Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Resilience Assessment Metrics</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    {resilienceAssessments.length > 0 ? (
                      [...resilienceAssessments].reverse().map((ra, idx) => (
                        <div key={ra.assessmentId} className="bg-slate-900 p-2 border border-slate-855 rounded flex flex-col gap-1">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">Eval: {ra.assessmentId.substring(7, 15)}...</span>
                            <span className="text-purple-400">Maturity: {ra.resilienceMaturity}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Availability:</span>
                            <strong className="text-emerald-400">{ra.achievedAvailability}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span>Recovery Rate:</span>
                            <strong className="text-cyan-300">{ra.recoverySuccessRate}%</strong>
                          </div>
                          <div className="flex justify-between text-[7px] text-slate-500">
                            <span>Compliance: {ra.continuityCompliance}%</span>
                            <span>Degradation Eff: {ra.degradationEfficiency}%</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No assessments compiled. Trigger simulation.</span>
                    )}
                  </div>
                </div>

                {/* 2. Failure Scenarios */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Failures Catalogue (Failure Scenarios)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {failureScenarios.length > 0 ? (
                      [...failureScenarios].reverse().map(scen => (
                        <div key={scen.scenarioId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Scenario: {scen.scenarioId}</span>
                            <span className="text-purple-400">Type: {scen.failureType}</span>
                          </div>
                          <p className="text-[8px] text-slate-300">Trigger: "{scen.trigger}" &rarr; Impact: "{scen.expectedImpact}"</p>
                          <p className="text-[7.5px] text-slate-500 mt-1">Detection Method: {scen.detectionMethod}</p>
                          <div className="flex justify-between text-[7px] text-slate-600 mt-1 border-t border-slate-850 pt-1">
                            <span>Est Recovery: {scen.estimatedRecoveryTimeMs}ms</span>
                            <span>Status: {scen.simulationStatus}</span>
                            <span className={`px-1.5 rounded ${scen.validationResult === "Pass" ? "bg-emerald-950 text-emerald-450" : "bg-red-955 text-red-400"}`}>
                              Validation: {scen.validationResult}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No failure scenarios simulated.</span>
                    )}
                  </div>
                </div>

                {/* 3. Active Continuity Plans */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Safe Degraded Operating Mode (Continuity)</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {continuityPlans.length > 0 ? (
                      [...continuityPlans].reverse().map(cp => (
                        <div key={cp.continuityPlanId} className="bg-slate-900 p-2 border border-slate-855 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block text-[8px]">Plan: {cp.continuityPlanId}</span>
                          <p className="text-[7.5px] text-slate-300 mt-1">Min Service Level: <strong className="text-purple-400">{cp.minimumServiceLevels}%</strong></p>
                          <div className="text-[7px] text-slate-500 mt-1">
                            <div>Critical Services: {cp.criticalServices.join(", ")}</div>
                            <div>Priorities: {cp.dependencyPriorities.join(", ")}</div>
                            <div className="text-purple-400 font-bold mt-1">Escalation: {cp.escalationPaths[0]}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No degraded continuity states active. Run Graceful Degradation fallback.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Recovery execution runs and dependencies mapper */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Recovery Executions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Automated Recovery Strategies Executions Ledger</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {recoveryExecutions.length > 0 ? (
                      [...recoveryExecutions].reverse().map(exec => (
                        <div key={exec.executionId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Execution: {exec.executionId}</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              <div>Strategy Ref: {exec.strategyReferenceId}</div>
                              <div>Operator: {exec.operatorId}</div>
                              <div className="text-purple-400 font-bold mt-1">Validation Assertions: "{exec.validationResults.join(", ")}"</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              exec.successStatus === "Success" ? "bg-emerald-950 text-emerald-450" : "bg-red-955 text-red-400"
                            }`}>{exec.successStatus}</span>
                            <span className="text-slate-550 text-[7px] block">Start: {exec.startTime.substring(11, 19)}</span>
                            <span className="text-slate-550 text-[7px] block">End: {exec.completionTime.substring(11, 19)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No recovery runs registered.</span>
                    )}
                  </div>
                </div>

                {/* Dependency Mapping */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Assets Upstream/Downstream Dependency Models</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {dependencyModels.length > 0 ? (
                      [...dependencyModels].reverse().map(dm => (
                        <div key={dm.modelId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block mb-1">Model ID: {dm.modelId}</span>
                          <div className="text-[7.5px] text-slate-400 space-y-1">
                            <div>Upstream: <span className="text-slate-200">{dm.upstreamDependencies.join(", ")}</span></div>
                            <div>Downstream: <span className="text-slate-200">{dm.downstreamDependencies.join(", ")}</span></div>
                            <div className="text-emerald-400 font-bold">Redundancy: {dm.redundancyRelationships.join(", ")}</div>
                            <div className="text-red-400 font-bold">Single Points of Failure: {dm.singlePointsOfFailure.join(", ")}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No dependency models mapped. Run simulation.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "engineeringResilience" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🎯 ENGINEERING MISSION ASSURANCE & ADAPTIVE OPERATIONS</h3>
                  <p className="text-[10px] text-slate-505">Dynamic reconfiguration actions, objective metric targets, success assurance trends, and twin coordination telemetry maps</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerMissionLaunch}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Launch Mission
                  </button>
                  <button
                    onClick={handleTriggerAdaptiveReconfiguration}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Trigger Adaptation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Mission Dashboard with Visual Timeline */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Active Mission & Phase Timeline</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    {missionStatesList.length > 0 ? (
                      [...missionStatesList].reverse().map(ms => {
                        // Determine active timeline checkpoint node
                        const isReconfigured = ms.progressPercentage >= 65;
                        const isCompleted = ms.progressPercentage === 100;

                        return (
                          <div key={ms.stateId} className="bg-slate-900 p-2 border border-slate-855 rounded flex flex-col gap-1.5">
                            <div className="flex justify-between font-bold">
                              <span className="text-cyan-300">State: {ms.stateId.substring(6, 14)}...</span>
                              <span className="text-purple-400">{ms.progressPercentage}% Progress</span>
                            </div>
                            
                            {/* Visual Progress Checkpoint Timeline */}
                            <div className="flex justify-between items-center text-[7px] text-slate-500 py-1 border-y border-slate-850/40 my-1 bg-slate-950/40 px-1 rounded">
                              <span className="text-emerald-400 font-bold">Planned</span>
                              <span className="text-slate-600">&rarr;</span>
                              <span className="text-emerald-400 font-bold">Executing</span>
                              <span className="text-slate-600">&rarr;</span>
                              <span className={isReconfigured ? "text-purple-400 font-bold" : "text-slate-650"}>Adapted</span>
                              <span className="text-slate-600">&rarr;</span>
                              <span className={isCompleted ? "text-cyan-300 font-bold animate-pulse" : "text-slate-650"}>Completed</span>
                            </div>

                            <div>Phase: {ms.activePhase}</div>
                            <div>Twin ID: {ms.linkedTwinId}</div>
                            <div className="flex justify-between text-[7px] text-slate-500 mt-1 border-t border-slate-850 pt-1">
                              <span>Confidence: <strong className="text-emerald-400">{ms.currentSuccessConfidence}%</strong></span>
                              <span>Gov: {ms.governanceDecisionRef.substring(4, 10)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-650 italic">No missions active. Launch mission.</span>
                    )}
                  </div>
                </div>

                {/* 2. Mission Objectives with Dependency Graph */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Prioritized Goals & Prerequisite Dependency Graph</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {missionObjectives.length > 0 ? (
                      [...missionObjectives].reverse().map(mo => {
                        // Check if prerequisites are satisfied
                        const arePrereqsSatisfied = mo.prerequisiteObjectiveIds.every(preId => {
                          const prereq = missionObjectives.find(x => x.objectiveId === preId);
                          return prereq && prereq.status === "Met";
                        });
                        const isBlocked = mo.status !== "Met" && !arePrereqsSatisfied;

                        return (
                          <div key={mo.objectiveId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                            <div className="flex justify-between font-bold text-[8px] mb-1">
                              <span className="text-cyan-300">Obj: {mo.objectiveId}</span>
                              <span className={`px-1.5 rounded text-[7px] font-bold ${
                                mo.status === "Met" 
                                  ? "bg-emerald-950 text-emerald-450" 
                                  : isBlocked 
                                    ? "bg-red-950/60 text-red-400 border border-red-900/30" 
                                    : "bg-yellow-950 text-yellow-450"
                              }`}>
                                {mo.status === "Met" ? "Met" : isBlocked ? "Blocked by Prerequisites" : "Ready / Pending"}
                              </span>
                            </div>
                            <p className="text-[8px] text-slate-300">Goal: "{mo.description}"</p>
                            
                            {mo.prerequisiteObjectiveIds.length > 0 && (
                              <div className="text-[7.5px] text-purple-400 mt-1 leading-normal font-sans">
                                &bull; Prerequisite Path: {mo.prerequisiteObjectiveIds.join(", ")} &rarr; <span className="text-cyan-300 font-bold">{mo.objectiveId}</span>
                              </div>
                            )}

                            <div className="flex justify-between text-[7px] text-slate-500 mt-1 border-t border-slate-850 pt-1">
                              <span>Target: {mo.metricTarget}{mo.metricUnit}</span>
                              <span>Current: <strong className="text-emerald-400">{mo.currentFulfillment}{mo.metricUnit}</strong></span>
                              <span>Weight: {mo.weight}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-655 italic">No mission objectives registered.</span>
                    )}
                  </div>
                </div>

                {/* 3. Assurance Metrics */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Mission Assurance Metrics</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {missionAssuranceAssessments.length > 0 ? (
                      [...missionAssuranceAssessments].reverse().map(ma => (
                        <div key={ma.assessmentId} className="bg-slate-900 p-2 border border-slate-855 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Assur ID: {ma.assessmentId.substring(8, 16)}</span>
                            <span className="text-purple-400">CI: {ma.confidenceInterval}</span>
                          </div>
                          <div className="text-[7.5px] text-slate-300 space-y-1">
                            <div>Success Probability: <strong className="text-emerald-400">{ma.successProbability}%</strong></div>
                            <div>Fulfillment Score: {ma.objectiveFulfillmentScore}%</div>
                            <div>Assurance Confidence: {ma.assuranceConfidence}%</div>
                            <div className="text-purple-400">Trend: {ma.trendScore} (Source: {ma.assessmentSource})</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No assurance assessments compiled.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Adaptive plans list and definitions catalogue */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Adaptive Reconfigurations */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Staged Adaptive Execution Plan & Actions Ledger</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {adaptivePlans.length > 0 ? (
                      [...adaptivePlans].reverse().map(ap => (
                        <div key={ap.planId} className="bg-slate-900 p-2 border border-slate-850 rounded flex justify-between items-center gap-3">
                          <div>
                            <span className="font-bold text-slate-200">Plan: {ap.planId}</span>
                            <div className="text-[7.5px] text-slate-500 mt-1 leading-normal">
                              <div>Adaptation Type: {ap.adaptationType}</div>
                              <div className="text-purple-400 font-bold">Actions: {ap.actionsList.join(" &rarr; ")}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold block mb-1 ${
                              ap.executionStatus === "Closed" ? "bg-emerald-950 text-emerald-450" : "bg-purple-950 text-purple-450"
                            }`}>{ap.executionStatus}</span>
                            <span className="text-slate-550 text-[7px] block">Trigger: {ap.triggerEventId}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No adaptation plans triggered.</span>
                    )}
                  </div>
                </div>

                {/* Mission Definitions */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. Active Mission Profiles & Specifications</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {missionDefinitions.length > 0 ? (
                      [...missionDefinitions].reverse().map(md => (
                        <div key={md.missionId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block mb-1">{md.name} ({md.missionType})</span>
                          <div className="text-[7.5px] text-slate-400 space-y-1">
                            <div>Target: {md.targetSystemId}</div>
                            <div>Constraints: {md.constraints.join(", ")}</div>
                            <div className="text-red-400 font-bold">Cutoff Conditions: {md.terminationConditions.join(", ")}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No missions planned. Launch mission.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolioIntelligence" && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <div>
                  <h3 className="font-bold text-sm text-cyan-300">🌐 SYSTEM-OF-SYSTEMS ORCHESTRATION & PORTFOLIO INTELLIGENCE</h3>
                  <p className="text-[10px] text-slate-505">Enterprise multi-mission strategic portfolios scheduler, shared resource allocation optimization plans, and cross-mission dependency graph trees</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTriggerPortfolioOrchestration}
                    className="bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Launch Portfolio
                  </button>
                  <button
                    onClick={handleTriggerOptimizationPass}
                    className="bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold px-3 py-1.5 rounded text-[10px] cursor-pointer whitespace-nowrap"
                  >
                    Optimize Resources
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-[9px] font-mono">
                {/* 1. Portfolio Dashboard */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">1. Active Portfolio Mappings</span>
                  <div className="flex flex-col gap-1.5 mt-1 leading-tight text-slate-400">
                    {missionPortfolios.length > 0 ? (
                      [...missionPortfolios].reverse().map(mp => (
                        <div key={mp.portfolioId} className="bg-slate-900 p-2 border border-slate-855 rounded flex flex-col gap-1.5">
                          <div className="flex justify-between font-bold">
                            <span className="text-cyan-300">{mp.name}</span>
                            <span className="text-purple-400">{mp.status}</span>
                          </div>
                          <p className="text-[7.5px] text-slate-450 italic">"{mp.description}"</p>
                          <div className="text-[7px] text-slate-500 space-y-0.5">
                            <div>Org: {mp.organizationId}</div>
                            <div>KPIs: {mp.portfolioKPIs.join(", ")}</div>
                            <div className="text-red-400">Constraints: {mp.portfolioConstraints.join(", ")}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No portfolios initialized. Launch portfolio to configure.</span>
                    )}
                  </div>
                </div>

                {/* 2. Portfolio Dependency Matrix & Cascade Path */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">2. Cross-Mission Mappings Matrix & Cascading Delays</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {crossMissionDependencies.length > 0 ? (
                      [...crossMissionDependencies].reverse().map(dep => (
                        <div key={dep.dependencyId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-purple-400">{dep.dependencyType} Dependency</span>
                            <span className="text-cyan-300">{dep.criticality} Priority</span>
                          </div>
                          
                          {/* Matrix representation of flow */}
                          <div className="bg-slate-950 p-1 rounded font-sans text-[7.5px] flex items-center gap-2 border border-slate-850 my-1">
                            <span className="bg-cyan-950 text-cyan-400 px-1 rounded font-mono">{dep.sourceMissionId}</span>
                            <span className="text-slate-500 font-bold">&rarr;</span>
                            <span className="bg-purple-950 text-purple-400 px-1 rounded font-mono">{dep.targetMissionId}</span>
                            <span className={`ml-auto px-1 rounded text-[7px] font-bold ${dep.blocking ? "bg-red-950 text-red-450" : "bg-emerald-950 text-emerald-450"}`}>
                              {dep.blocking ? "BLOCKING" : "NON-BLOCKING"}
                            </span>
                          </div>

                          <p className="text-[7.5px] text-slate-400 italic">Impact Rule: "{dep.impactRule}"</p>
                          <div className="text-[7px] text-slate-600 mt-1">Strength Index: {dep.relationshipStrength}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No inter-mission dependency matrices registered. Run Optimization to populate dependencies.</span>
                    )}
                  </div>
                </div>

                {/* 3. Portfolio Assessment Metrics */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">3. Portfolio Health Assessments</span>
                  <div className="max-h-[110px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {portfolioAssessmentsList.length > 0 ? (
                      [...portfolioAssessmentsList].reverse().map(pa => (
                        <div key={pa.assessmentId} className="bg-slate-900 p-2 border border-slate-855 rounded leading-normal">
                          <div className="flex justify-between font-bold text-[8px] mb-1">
                            <span className="text-cyan-300">Eval: {pa.assessmentId.substring(10, 18)}</span>
                            <span className="text-purple-400">Health: {pa.overallHealth}%</span>
                          </div>
                          <div className="text-[7.5px] text-slate-350 space-y-0.5">
                            <div>Completion Probability: <strong className="text-emerald-400">{pa.completionProbability}%</strong></div>
                            <div>Resource Efficiency: {pa.resourceEfficiency}%</div>
                            <div>Strategic Alignment: {pa.strategicAlignment}%</div>
                            <div>Portfolio Resilience: {pa.portfolioResilience}%</div>
                            <div className="text-cyan-300">Throughput Target: {pa.portfolioThroughput}MW</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-650 italic">No health assessments compiled.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Resource utilization forecasts and dynamic allocation strategies */}
              <div className="grid grid-cols-3 gap-4 text-[9px] font-mono mt-2">
                {/* Resource Allocations with Forecast Projections */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5 col-span-2">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">4. Shared Infrastructure Allocation & Capacity Demands Forecast</span>
                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {resourceAllocationPlans.length > 0 ? (
                      resourceAllocationPlans.map(res => {
                        const usagePercentage = Math.round((res.allocatedCapacity / res.availableCapacity) * 100);
                        const demandPercentage = Math.round((res.requestedCapacity / res.availableCapacity) * 100);

                        return (
                          <div key={res.allocationId} className="bg-slate-900 p-2 border border-slate-850 rounded flex flex-col gap-1.5">
                            <div className="flex justify-between font-bold text-[8.5px]">
                              <span className="text-cyan-300">{res.resourceType} Resource</span>
                              <span className="text-slate-500">Utilization: {res.utilization}%</span>
                            </div>
                            
                            {/* Forecast metrics displays */}
                            <div className="space-y-1">
                              <div>
                                <div className="flex justify-between text-[7px] text-slate-500">
                                  <span>Allocated vs Available Capacity:</span>
                                  <span className="text-slate-300">{res.allocatedCapacity} / {res.availableCapacity}</span>
                                </div>
                                <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden mt-0.5 flex">
                                  <div className="bg-cyan-500 h-full" style={{ width: `${usagePercentage}%` }}></div>
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-[7px] text-slate-500">
                                  <span>Requested Resource Demand:</span>
                                  <span className="text-slate-300">{res.requestedCapacity} / {res.availableCapacity}</span>
                                </div>
                                <div className="w-full bg-slate-950 h-1.5 rounded overflow-hidden mt-0.5 flex">
                                  <div className="bg-purple-500 h-full" style={{ width: `${demandPercentage}%` }}></div>
                                </div>
                              </div>
                            </div>

                            <p className="text-[7px] text-slate-500 leading-tight italic mt-1">Priority Rule: {res.priorityRules[0]}</p>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-slate-655 italic col-span-2">No resource allocation profiles stored.</span>
                    )}
                  </div>
                </div>

                {/* System Orchestration Strategies */}
                <div className="p-2.5 bg-slate-905 border border-slate-800 rounded flex flex-col gap-1.5">
                  <span className="font-bold text-slate-350 block border-b border-slate-850 pb-1 text-[10px]">5. System-of-Systems Execution Strategy</span>
                  <div className="max-h-[120px] overflow-y-auto flex flex-col gap-1.5 mt-1">
                    {systemOrchestrators.length > 0 ? (
                      [...systemOrchestrators].reverse().map(orch => (
                        <div key={orch.orchestratorId} className="bg-slate-900 p-2 border border-slate-850 rounded leading-normal">
                          <span className="font-bold text-cyan-300 block mb-1">Orchestrator ID: {orch.orchestratorId}</span>
                          <div className="text-[7.5px] text-slate-400 space-y-1">
                            <div>Execution Mode: <span className="text-slate-200">{orch.executionMode}</span></div>
                            <div className="text-purple-400 font-bold">Optimization Strategy: {orch.orchestrationStrategy}</div>
                            <div>Active Policies: <span className="text-slate-200">{orch.activePolicies.join(", ")}</span></div>
                            <div className="text-emerald-400 font-bold">Orchestrator Health: {orch.healthStatus}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-655 italic">No operational orchestration strategy configured.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "observability" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">PLATFORM QUALITY TELEMETRY MONITOR</h3>
                <p className="text-[10px] text-slate-550">Live operational benchmarks and latency stats</p>
              </div>
              <div className="grid grid-cols-4 gap-4 text-center font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">Event Depth</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{metrics.eventBusQueueDepth} items</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">AKG Query Latency</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{metrics.akgQueryLatencyMs} ms</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">Core Memory Space</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{metrics.memoryUsageMb} MB</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="text-[9px] text-slate-500 block font-bold">Render Latency</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{Math.floor(1000 / metrics.renderFps)} ms</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "governance" && (
            <div className="flex flex-col gap-4">
              <div className="border-b border-slate-800 pb-2 mb-2">
                <h3 className="font-bold text-sm text-cyan-300">PLATFORM GOVERNANCE & COMPLIANCE</h3>
                <p className="text-[10px] text-slate-550">Policy enforcement registry audit violations checklist</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Policies & Compliance */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300 block mb-2">Active Compliance Registry</span>
                  <div className="flex flex-col gap-2">
                    {policies.map(p => (
                      <div key={p.packageName} className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-slate-300">{p.packageName}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          p.signatureVerified ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                        }`}>
                          {p.signatureVerified ? "COMPLIANT" : "NON-COMPLIANT"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Audit Logs */}
                <div className="p-3 bg-slate-900 border border-slate-800 rounded">
                  <span className="font-bold text-slate-300 block mb-2">Audit Logs Trail</span>
                  <div className="flex flex-col gap-2 font-mono text-[9px] max-h-[140px] overflow-y-auto">
                    {auditLogs.map(log => (
                      <div key={log.id} className="border-b border-slate-800 pb-1.5">
                        <div className="flex justify-between font-bold text-cyan-300">
                          <span>{log.action}</span>
                          <span className={log.status === "DENIED" ? "text-red-400" : "text-emerald-400"}>
                            {log.status}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1 leading-tight">{log.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 📜 Right Command Inspector Logs Console */}
        <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col p-4 overflow-hidden">
          <span className="font-bold text-[10px] text-slate-405 uppercase border-b border-slate-800 pb-1.5 mb-2">
            📟 OPERATIONAL LOGS STREAM
          </span>
          <div className="flex-1 overflow-y-auto font-mono text-[9px] text-cyan-405 flex flex-col gap-1.5 pr-2">
            <div className="opacity-60">[09:30:11] Kernel event fabric initialized.</div>
            <div className="opacity-60">[09:30:12] Service container dependencies injected.</div>
            <div className="opacity-60">[09:30:14] Runtime Manager booted topology.</div>
            {mockLogs.map((log, index) => (
              <div key={index} className="leading-tight">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
