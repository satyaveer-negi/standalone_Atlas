import { TwinKernel } from "./TwinKernel";

export class TwinStateManager {
  private kernel: TwinKernel;

  constructor() {
    this.kernel = new TwinKernel();
  }

  getKernel(): TwinKernel {
    return this.kernel;
  }
}
