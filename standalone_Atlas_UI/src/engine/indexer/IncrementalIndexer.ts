import { RepositoryScanner, ScannedFileDescriptor } from "./RepositoryScanner";

export class IncrementalIndexer {
  private scanner: RepositoryScanner;
  private indexedFiles: Map<string, ScannedFileDescriptor> = new Map();

  constructor(scanner?: RepositoryScanner) {
    this.scanner = scanner || new RepositoryScanner();
  }

  indexAll(): ScannedFileDescriptor[] {
    const files = this.scanner.scanWorkspaceRepositories();
    files.forEach((f) => this.indexedFiles.set(f.id, f));
    console.log(`[IncrementalIndexer] 🔍 Indexed ${files.length} repository source files.`);
    return files;
  }

  indexSingleFile(fileId: string): ScannedFileDescriptor | undefined {
    const file = this.indexedFiles.get(fileId);
    if (file) {
      console.log(`[IncrementalIndexer] ⚡ Hot-reindexed modified file: ${file.relativePath}`);
    }
    return file;
  }
}
