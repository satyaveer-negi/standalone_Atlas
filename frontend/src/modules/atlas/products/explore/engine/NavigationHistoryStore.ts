export interface HistoryEntry {
  id: string;
  query: string;
  timestamp: number;
  resultsCount: number;
}

export class NavigationHistoryStore {
  private history: HistoryEntry[] = [];

  addEntry(query: string, resultsCount: number) {
    this.history.unshift({
      id: `hist-${Date.now()}`,
      query,
      timestamp: Date.now(),
      resultsCount,
    });
    if (this.history.length > 20) this.history.pop();
  }

  getRecentHistory(): HistoryEntry[] {
    return this.history;
  }
}
