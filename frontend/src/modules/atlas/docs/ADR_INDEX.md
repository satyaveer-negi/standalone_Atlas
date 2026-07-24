# Atlas Architecture Decision Records (ADRs)

This directory serves as the authoritative Architecture Decision Record repository for the **Atlas Enterprise Platform**. Each ADR documents why key architectural decisions were made, their trade-offs, and their governance contracts.

---

## 📑 ADR Index

| ADR ID | Title | Status | Scope |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Atlas Core Engine & Canvas Subsystem | Accepted | Core Canvas & 3D Render Loop |
| **ADR-002** | Enterprise Knowledge Graph & Property Graph Storage | Accepted | Knowledge Layer |
| **ADR-003** | Workflow Engine & Declarative DAG Execution | Accepted | Execution Subsystem |
| **ADR-004** | Canonical Architecture Model (CAM) | Accepted | Language Parsing & AST |
| **ADR-005** | Extension Runtime & SDK v2 Contracts | Accepted | Extensibility Layer |
| **ADR-006** | Enterprise Foundation & Hybrid ABAC/RBAC | Accepted | Tenancy & Identity |
| **ADR-007** | Living Engineering Digital Twin Architecture | Accepted | Twin Runtime |
| **ADR-008** | Canonical Twin Schema (CTS) Specification | Accepted | 13 Enterprise Twin Domains |
| **ADR-009** | Twin Query Language (TQL) Specification | Accepted | Declarative Twin Query Parser |
| **ADR-010** | Platform Governance & Configurable Quality Gates | Accepted | Operational Quality Gates |
| **ADR-011** | Platform Lifecycle Coordinator Model | Accepted | State Machine (Planning $\to$ Retire) |
| **ADR-012** | Active Engineering Memory Platform | Accepted | Incident & Optimization Recall |

---

## 📝 Standardized ADR Template

```markdown
# ADR-00X: <Title>

## Status
Accepted / Superseded / Deprecated

## Context
Why this architectural decision was needed and what problem it solves.

## Decision
What architectural pattern, contract, or technology was chosen.

## Consequences
Benefits, trade-offs, technical debt, and security/performance risks.

## Alternatives Considered
Other architectural approaches evaluated and reasons why they were rejected.
```

---

## 🎯 Architecture Governance Invariants

1. **Contract Stability**: All frozen contracts (`CAM`, `CTS`, `TQL`, `DecisionPackage`, `SDK v2.5`, `GovernanceConfig`, `LifecycleModel`) are immutable baseline interfaces.
2. **Layering Independence**: Higher layers consume lower layers via explicit contracts; lower layers never import upper abstractions.
3. **Semantic Versioning**:
   - `6.5.x`: Implementation improvements, performance optimizations, bug fixes, connector updates.
   - `6.6`: Feature releases extending existing SDK v2.5 and CTS contracts without breaking changes.
   - `7.0`: Next major baseline release for new architectural paradigms (e.g., Engineering Intent Platform).
