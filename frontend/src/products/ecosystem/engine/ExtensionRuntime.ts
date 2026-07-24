import { DEMO_EXTENSIONS, type ExtensionManifest } from "./ExtensionContracts";

export class ExtensionRuntime {
  private registeredExtensions: ExtensionManifest[] = [...DEMO_EXTENSIONS];

  getExtensions(): ExtensionManifest[] {
    return this.registeredExtensions;
  }

  toggleExtension(id: string): ExtensionManifest[] {
    this.registeredExtensions = this.registeredExtensions.map((ext) => {
      if (ext.id === id) {
        const nextStatus = ext.status === "ACTIVATED" ? "DEACTIVATED" : "ACTIVATED";
        return { ...ext, status: nextStatus };
      }
      return ext;
    });
    return [...this.registeredExtensions];
  }

  registerNewExtension(ext: ExtensionManifest): ExtensionManifest[] {
    this.registeredExtensions.push(ext);
    return [...this.registeredExtensions];
  }
}
