# ADR-0001: Deterministic Core Kernel Design

## Status
Accepted

## Context
In previous iterations, AI orchestration loops and LLM planning agents had direct execution control over system variables, scheduler runs, and database mutations. This led to non-deterministic behaviour, race conditions, and lack of auditability.

## Decision
We freeze the Layer 1 Core Kernel (Event Bus, Command Bus, Security, and Resource Graph) as entirely deterministic. All asynchronous AI runtimes, visualizers, and learning modules communicate with the kernel strictly by sending structured event messages.

## Consequences
- **Pros**: Guarantees predictability, execution safety, and robust audit tracing.
- **Cons**: Requires additional message packaging overhead for simple runtime actions.
