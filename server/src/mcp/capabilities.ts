import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

/**
 * Standardized structure of the adapter capabilities returned by Qloo MCP.
 */
export interface QlooCapabilitiesPayload {
  manifest_schema_version?: string;
  contract_version?: string;
  contract_checksum?: string;
  result_schema_version?: string;
  adapter?: {
    id: string;
    compatibility: string;
    canonical_workflow_execution: boolean;
    ready: boolean;
    supported_operation_ids: string[];
    capabilities_tool: string;
    contract_resource: string;
    tool_name_mapping: Record<string, string>;
    fallback: string;
  };
  operations?: Array<{
    id: string;
    shared_tool_name: string;
    summary: string;
    description: string;
  }>;
}

/**
 * Normalized result of checking capabilities and readiness.
 */
export interface CapabilitiesCheckResult {
  isAvailable: boolean;
  isReady: boolean;
  adapterId?: string;
  credentialState: "ready" | "missing" | "error";
  supportedOperations: string[];
  totalTools: number;
  tools: Array<{ name: string; description?: string }>;
  summary: string;
  error?: string;
}

/**
 * Inspects Qloo MCP capabilities and reports adapter readiness without contacting
 * the remote Qloo API or consuming API quota.
 */
export async function checkCapabilities(client: Client): Promise<CapabilitiesCheckResult> {
  try {
    const [toolsResponse, capabilitiesResponse] = await Promise.all([
      client.listTools().catch(() => ({ tools: [] })),
      client.callTool({ name: "qloo_capabilities", arguments: {} })
    ]);

    const tools = toolsResponse.tools.map((t) => ({
      name: t.name,
      description: t.description
    }));

    // Extract structured content if provided, otherwise parse text content
    let payload: QlooCapabilitiesPayload | undefined;
    if (capabilitiesResponse.structuredContent && typeof capabilitiesResponse.structuredContent === "object") {
      payload = capabilitiesResponse.structuredContent as QlooCapabilitiesPayload;
    } else if (Array.isArray(capabilitiesResponse.content) && capabilitiesResponse.content[0]?.type === "text") {
      try {
        payload = JSON.parse(capabilitiesResponse.content[0].text) as QlooCapabilitiesPayload;
      } catch {
        payload = undefined;
      }
    }

    const adapter = payload?.adapter;
    const isReady = Boolean(adapter?.ready);
    const credentialState = isReady ? "ready" : "missing";
    const supportedOperations = adapter?.supported_operation_ids ?? [];

    return {
      isAvailable: true,
      isReady,
      adapterId: adapter?.id,
      credentialState,
      supportedOperations,
      totalTools: tools.length,
      tools,
      summary: isReady
        ? `Qloo MCP adapter is ready with ${supportedOperations.length} canonical operations and ${tools.length} tools.`
        : "Qloo MCP adapter is active, but credentials (QLOO_API_KEY) are missing or unverified."
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      isAvailable: false,
      isReady: false,
      credentialState: "error",
      supportedOperations: [],
      totalTools: 0,
      tools: [],
      summary: "Failed to query Qloo MCP capabilities.",
      error: message
    };
  }
}
