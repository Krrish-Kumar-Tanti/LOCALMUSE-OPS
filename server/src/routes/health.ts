import { Router, type Request, type Response } from "express";
import { connectMcpClient, isMcpConnected } from "../mcp/client.js";
import { checkCapabilities } from "../mcp/capabilities.js";

export const healthRouter = Router();

/**
 * Handler for health and MCP capability checks.
 * Zero-quota check that verifies local MCP harness and credentials.
 */
async function handleHealthCheck(_req: Request, res: Response) {
  try {
    const client = await connectMcpClient();
    const capabilities = await checkCapabilities(client);

    const isLiveReady = capabilities.isReady && capabilities.credentialState === "ready";

    return res.status(200).json({
      status: "online",
      service: "localmuse-ops-backend",
      mcpConnected: isMcpConnected(),
      capabilities,
      modesAvailable: {
        demo: true,
        live: isLiveReady
      },
      recommendedMode: isLiveReady ? "live" : "demo"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(503).json({
      status: "degraded",
      service: "localmuse-ops-backend",
      mcpConnected: false,
      error: message,
      modesAvailable: {
        demo: true,
        live: false
      },
      recommendedMode: "demo",
      hint: "Ensure @qloo/qloo-harness is installed. Demo mode remains fully operational."
    });
  }
}

// Mount handler on GET /
healthRouter.get("/", handleHealthCheck);
