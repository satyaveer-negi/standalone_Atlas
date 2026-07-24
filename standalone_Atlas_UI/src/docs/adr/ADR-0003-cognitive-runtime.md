# ADR-0003: Cognitive Cycle Runtime Decoupling

## Status
Accepted

## Context
AI reasoning models were previously invoked directly inside visual dashboards or command handlers, which hardcoded model configurations and led to inconsistent decision routing.

## Decision
We establish **Program M (Cognitive Runtime)** as an AI-model-agnostic coordinator. It executes a structured execution cycle (`Observe -> Plan -> Execute -> Reflect -> Learn`), scheduling and routing prompts via general interfaces without coupling to specific LLM endpoints.

## Consequences
- **Pros**: Easily hot-swap and upgrade underlying models (GPT, Claude, Gemini, local models); structures agentic decisions into auditable sequences.
- **Cons**: Adds planning abstraction layers.
