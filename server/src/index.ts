import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMcpClient, registerMcpLifecycleHooks, isMcpConnected } from "./mcp/client.js";
import { checkCapabilities } from "./mcp/capabilities.js";

// Load backend environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";

// Register clean process shutdown hooks for the stdio MCP child process
registerMcpLifecycleHooks();

// Middleware
app.use(
  cors({
    origin: [FRONTEND_ORIGIN, "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

/**
 * Health check & Qloo MCP readiness endpoint.
 * Performs a zero-quota check using qloo_capabilities.
 */
app.get("/health", async (_req, res) => {
  try {
    const client = await connectMcpClient();
    const capabilities = await checkCapabilities(client);

    res.json({
      status: "online",
      service: "localmuse-ops-backend",
      mcpConnected: isMcpConnected(),
      capabilities
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(503).json({
      status: "degraded",
      service: "localmuse-ops-backend",
      mcpConnected: false,
      error: message,
      hint: "Ensure @qloo/qloo-harness is installed or check server logs."
    });
  }
});

// Root information endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "LocalMuse Ops Backend",
    version: "0.1.0",
    description: "Persistent Node.js Backend for Qloo MCP Integration",
    endpoints: {
      health: "/health"
    }
  });
});

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`[LocalMuse Ops Backend] Server listening on port ${PORT}`);
  console.log(`[LocalMuse Ops Backend] CORS configured for: ${FRONTEND_ORIGIN}`);
});

// Graceful HTTP server shutdown
function shutdown() {
  console.log("[LocalMuse Ops Backend] Shutting down HTTP server...");
  server.close(() => {
    console.log("[LocalMuse Ops Backend] HTTP server closed.");
    process.exit(0);
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

export default app;
