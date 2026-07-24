# Atlas Graphics Module (`graphics/`)

## Responsibility
The `graphics/` directory manages R3F render passes, custom Three.js materials, shader chunks, particle systems, post-processing FX (Bloom, Glow, FXAA), and 3D geometry meshes.

## Architectural Rules
- R3F components inside `graphics/` render visual meshes and handle frame updates via `useFrame`.
- **Allowed Dependencies**: `three`, `@react-three/fiber`, `@react-three/drei`, `store/`, `config/`.
- **Forbidden Dependencies**: Django API HTTP calls or business logic handlers (use `adapters/` instead).
