# The Atlas UKOP Platform Constitution (EIOS v1.0)

## 🎯 Purpose
The Atlas EIOS Constitution defines the long-lived architectural invariants that govern the evolution of the Engineering Intelligence Operating System. Its purpose is to preserve modularity, explainability, extensibility, and organizational consistency as the platform evolves across technologies, engineering domains, and deployment environments.

---

This document freezes the five foundational architectural pillars of the **Engineering Intelligence Operating System (EIOS)**. Every future component, domain agent, and multi-agent system built on the Atlas platform must adhere strictly to these principles.

---


## ⚖️ Pillar 1: Runtime ≠ Governance (State vs. Permission)
* **Definition**: The execution engine manages *execution feasibility* (DAG correctness, resource allocation, and job execution). The governance engine manages *permission authorization* (roles, signatures, audit validation, and lifecycle promotion).
* **Rule**: The runtime engine must remain domain-agnostic and policy-agnostic. It must never make decisions regarding compliance, signature trust, or release approvals. Policy rules remain isolated in the Governance and Trust systems.

## 🧠 Pillar 2: Knowledge ≠ AI (Memory vs. Reason)
* **Definition**: The Knowledge Graph serves as the persistent, federated, and structured *organizational memory*. The AI Coordinator and its specialist agents serve as a *reasoning layer*.
* **Rule**: AI agents must query, read, and write to the Knowledge Graph using normalized semantic schemas. Grounding context and recommendations are grounded in graph adjacencies rather than embedded directly in LLM weights.

## 📡 Pillar 3: Federation ≠ Storage (Registry vs. Node)
* **Definition**: The Federated Graph Coordinator operates as an *aggregation, lookup, and routing registry*. The local organizations operate as *independent data nodes* holding the actual domain knowledge.
* **Rule**: The federation coordinator must never duplicate or permanently store remote engineering knowledge. It maps endpoint domains and plan queries, leaving ownership of the data with the origin organization.

## 🤖 Pillar 4: Agent OS ≠ Engineering Expertise (Orchestration vs. Specialization)
* **Definition**: The Agent OS acts as a *scheduling, safety, and planning substrate*. The Domain Agents act as *specialized plugins* holding target engineering rules.
* **Rule**: The core Agent OS runtime, planner, and safety guards must remain entirely domain-ignostic (never "knowing CFD" or "knowing power lines"). Specialized rules and solver parameters reside inside registration plugin descriptors.

## 📊 Pillar 5: Observability ≠ Behavior (Evidence vs. Execution)
* **Definition**: Every platform decision (by runtime, AI, federation, or Agent OS) must emit traceable evidence independent of execution logic.
* **Rule**: Core systems must never rely on telemetry or event log handlers for correctness. Conversely, logging/auditing layers must remain strictly read-only and never alter running program flow.

---

## 🏛️ Constitutional Interpretation

These pillars define architectural invariants rather than implementation details. Technologies, programming languages, databases, AI models, communication protocols, and deployment strategies may evolve over time, but implementations must continue to preserve the separations established by the five pillars. When new capabilities are proposed, they should be evaluated against these principles before implementation.

---

## 📋 Atlas EIOS Constitutional Review Checklist

When evaluating any major architectural proposal, verify compliance with the EIOS invariants:

* `[ ]` **Pillar 1**: Runtime remains independent of governance (execution status is never coupled to organizational policy).
* `[ ]` **Pillar 2**: AI reasons over knowledge rather than replacing it (recommender context is grounded in graph memory).
* `[ ]` **Pillar 3**: Federation routes requests without taking ownership of remote data (no centralized caching of remote assets).
* `[ ]` **Pillar 4**: Agent OS remains domain-agnostic (expertise, constraints, and solver rules live entirely in domain plugins).
* `[ ]` **Pillar 5**: Observability remains passive and does not affect execution semantics (loggers cannot alter running flow).

---

## 📜 Constitutional Amendment Process

The EIOS Constitution defines long-lived architectural invariants. Amendments should be rare and justified only when a pillar demonstrably limits platform evolution, a new invariant is required to preserve architectural consistency, or an existing invariant no longer reflects the intended system boundaries.

Every amendment proposal must include:
* **Rationale**: Explanation of the necessity of modification.
* **Subsystems Impact**: Detailed list of affected system layers.
* **Migration Strategy**: Step-by-step conversion path for existing modules.

### Semantic Versioning of Invariants
* **Major (X.0.0)**: Breaking changes to constitutional principles (e.g. merging runtime and governance).
* **Minor (1.Y.0)**: New pillars or clarifications preserving backward compatibility.
* **Patch (1.0.Z)**: Editorial improvements and wording clarifications only.

### Backward Compatibility
Unless a Major constitutional version is adopted, amendments should preserve compatibility with existing architectural contracts wherever practical. When compatibility cannot be maintained, the amendment should document affected interfaces, migration guidance, and expected transition timelines.

### Architecture Review Board (ARB) Process
Every proposal modifying EIOS core layers must undergo constitutional evaluation before coding starts, addressing these five questions:
1. Which constitutional pillars are affected?
2. Does the proposal preserve the existing invariants and separations of concerns?
3. Are any stable public API contracts changed?
4. Is an amendment required, or does the proposal fit within the current constitution?
5. What is the migration and compatibility impact?

---


## 🧭 Constitutional Compliance Matrix

Quick reference mapping the five pillars (P1-P5) to each platform layer subsystem:

| Platform Layer | Pillar 1 (Runtime vs Gov) | Pillar 2 (Memory vs AI) | Pillar 3 (Routing vs Store) | Pillar 4 (OS vs Plugin) | Pillar 5 (Evidence vs Exec) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Workflow Runtime** | **✓** | — | — | **✓** | **✓** |
| **Governance** | **✓** | — | — | — | **✓** |
| **Knowledge Graph** | — | **✓** | **✓** | — | **✓** |
| **Federation** | — | **✓** | **✓** | — | **✓** |
| **Agent OS** | **✓** | **✓** | — | **✓** | **✓** |
| **Domain Plugins** | — | **✓** | — | **✓** | **✓** |

---

## 📖 Constitutional Glossary

Standard vocabulary for future specifications and SDK documentation:

* **Workflow Runtime**: Executes DAG workflows and manages execution states (feasibility layer).
* **Governance**: Authorizes, validates signature trust, and audits lifecycle transitions.
* **Knowledge Graph**: Persistent semantic engineering memory holding nodes and edges.
* **AI Coordinator**: Specialized multi-agent reasoning layer routing prompts and compiling templates.
* **Federation**: Aggregates distributed engineering databases dynamically routing queries.
* **Agent OS**: Domain-agnostic scheduling, safety, planning, and execution substrate.
* **Domain Agent**: Plugin encapsulating domain-specific engineering expertise and constraints rules.






