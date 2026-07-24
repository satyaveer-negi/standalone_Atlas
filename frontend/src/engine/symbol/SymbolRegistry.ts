export interface CodeSymbol {
  id: string;
  name: string;
  kind: "component" | "function" | "class" | "route" | "model" | "table";
  language: "typescript" | "python" | "sql" | "docker";
  filePath: string;
  signature?: string;
}

export class SymbolRegistry {
  private symbols: Map<string, CodeSymbol> = new Map();

  registerSymbol(symbol: CodeSymbol) {
    this.symbols.set(symbol.id, symbol);
  }

  getSymbol(id: string): CodeSymbol | undefined {
    return this.symbols.get(id);
  }

  findSymbolsByName(name: string): CodeSymbol[] {
    return Array.from(this.symbols.values()).filter((s) =>
      s.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  getAllSymbols(): CodeSymbol[] {
    return Array.from(this.symbols.values());
  }
}
