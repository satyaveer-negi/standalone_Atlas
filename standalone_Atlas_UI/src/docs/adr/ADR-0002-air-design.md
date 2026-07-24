# ADR-0002: Multi-Layer Atlas Intermediate Representation (AIR) Design

## Status
Accepted

## Context
Earlier designs parsed connection definitions (YAML) on the fly inside various runtimes. This tightly coupled definition syntax with execution logic, making schema evolutions difficult and degrading load-time performance.

## Decision
We decouple the compiler toolchain from runtimes by compiling definitions into a unified, multi-layer intermediate format: **Atlas Intermediate Representation (AIR)**. AIR is composed of dedicated sub-graphs (Semantic, Capability, Workflow, Policy, Visualization).

## Consequences
- **Pros**: Independent evolution of manifest schemas and runtime engines; enables intermediate compilation optimizations.
- **Cons**: Requires compiler phase compilation step before running packages.
