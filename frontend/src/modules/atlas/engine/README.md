# Atlas Engine Core (`engine/`)

## Responsibility
The `engine/` directory manages SceneGraph node calculations, layout algorithms (radial, grid, force), runtime tick scheduling, and interaction events.

## Architectural Rules
- `engine/` contains pure TypeScript logic and node positioning algorithms.
- **Allowed Dependencies**: `sdk/`, `config/`, `types/`.
- **Forbidden Dependencies**: Direct UI React components or browser DOM elements outside canvas pointer hooks.
