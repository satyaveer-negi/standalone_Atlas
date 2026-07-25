// 📡 PROGRAM II.3: TRANSPORT ABSTRACTION (PROTOCOL-AGNOSTIC CONNECTIVITY)
export interface Transport {
  connect(endpoint: string): Promise<void>;
  send(message: any): Promise<void>;
  receive(): Promise<any>;
  close(): Promise<void>;
  health(): Promise<string>;
}

export class MockHttpTransport implements Transport {
  private endpoint = "";
  private connected = false;

  public async connect(endpoint: string): Promise<void> {
    this.endpoint = endpoint;
    this.connected = true;
    console.log(`[Transport HTTP] Connected to endpoint: "${endpoint}"`);
  }

  public async send(message: any): Promise<void> {
    if (!this.connected) throw new Error("Transport not connected.");
    console.log(`[Transport HTTP] Sent frame message:`, message);
  }

  public async receive(): Promise<any> {
    return { status: "ACK", time: Date.now() };
  }

  public async close(): Promise<void> {
    this.connected = false;
    console.log(`[Transport HTTP] Connection closed to endpoint: "${this.endpoint}"`);
  }

  public async health(): Promise<string> {
    return this.connected ? "CONNECTED (RTT: 42ms)" : "DISCONNECTED";
  }
}

export const activeTransport = new MockHttpTransport();
