/**
 * Inspects Qloo MCP capabilities and reports adapter readiness without contacting
 * the remote Qloo API or consuming API quota.
 */
export async function checkCapabilities(client) {
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
        let payload;
        if (capabilitiesResponse.structuredContent && typeof capabilitiesResponse.structuredContent === "object") {
            payload = capabilitiesResponse.structuredContent;
        }
        else if (Array.isArray(capabilitiesResponse.content) && capabilitiesResponse.content[0]?.type === "text") {
            try {
                payload = JSON.parse(capabilitiesResponse.content[0].text);
            }
            catch {
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
    }
    catch (error) {
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
