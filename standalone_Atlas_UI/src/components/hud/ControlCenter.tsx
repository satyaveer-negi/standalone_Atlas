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
