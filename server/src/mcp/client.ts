import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const INSTALL_HINT =
  "Cannot start `qloo`. Ensure `@qloo/qloo-harness` is installed (npm install --global @qloo/qloo-harness) or set QLOO_BIN_PATH.";

interface McpClientState {
  client: Client | null;
  transport: StdioClientTransport | null;
  connectingPromise: Promise<Client> | null;
}

const state: McpClientState = {
  client: null,
  transport: null,
  connectingPromise: null
};

/**
 * Creates and initializes the stdio transport using the official Qloo Hackathon Kit specifications:
 * - command: "qloo" (or process.env.QLOO_BIN_PATH)
 * - args: ["mcp"]
 * - env: process.env (forwards QLOO_API_KEY and QLOO_HOME)
 */
function createTransport(): StdioClientTransport {
  const command = process.env.QLOO_BIN_PATH || "qloo";
  const args = ["mcp"];

  // Filter out undefined values to satisfy Record<string, string>
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (typeof value === "string") {
      env[key] = value;
    }
  }

  return new StdioClientTransport({
    command,
    args,
    env
  });
}

/**
 * Connects to the local Qloo MCP server subprocess via stdio.
 * Reuses the existing client instance if already connected.
 */
export async function connectMcpClient(): Promise<Client> {
  if (state.client) {
    return state.client;
  }

  if (state.connectingPromise) {
    return state.connectingPromise;
  }

  state.connectingPromise = (async () => {
    try {
      const transport = createTransport();
      const client = new Client(
        { name: "localmuse-ops-backend", version: "0.1.0" },
        { capabilities: {} }
      );

      await client.connect(transport).catch((err: NodeJS.ErrnoException) => {
        if (err.code === "ENOENT") {
          throw new Error(`${INSTALL_HINT} (ENOENT: command not found: ${process.env.QLOO_BIN_PATH || "qloo"})`);
        }
        throw err;
      });

      state.client = client;
      state.transport = transport;

      return client;
    } finally {
      state.connectingPromise = null;
    }
  })();

  return state.connectingPromise;
}

/**
 * Returns the active MCP Client instance, connecting if not already active.
 */
export async function getMcpClient(): Promise<Client> {
  if (state.client) {
    return state.client;
  }
  return connectMcpClient();
}

/**
 * Checks whether an active MCP client is connected.
 */
export function isMcpConnected(): boolean {
  return state.client !== null;
}

/**
 * Gracefully terminates the connection and closes the child stdio transport.
 */
export async function disconnectMcpClient(): Promise<void> {
  if (state.client) {
    try {
      await state.client.close();
    } catch {
      // Ignore errors during shutdown
    }
  }

  if (state.transport) {
    try {
      await state.transport.close();
    } catch {
      // Ignore errors during shutdown
    }
  }

  state.client = null;
  state.transport = null;
  state.connectingPromise = null;
}

// Register process exit listeners for safe process cleanup
let exitHandlersRegistered = false;
export function registerMcpLifecycleHooks(): void {
  if (exitHandlersRegistered) return;
  exitHandlersRegistered = true;

  const handleTermination = async () => {
    await disconnectMcpClient();
    process.exit(0);
  };

  process.once("SIGINT", () => {
    void handleTermination();
  });
  process.once("SIGTERM", () => {
    void handleTermination();
  });
  process.once("beforeExit", () => {
    void disconnectMcpClient();
  });
}
