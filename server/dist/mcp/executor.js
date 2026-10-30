import { getMcpClient } from "./client.js";
const DEFAULT_TIMEOUT_MS = 25000;
/**
 * Safely calls an official Qloo MCP tool and guarantees a well-formed
 * QlooMcpEnvelope response without unhandled exceptions or hidden failures.
 */
export async function executeTool(toolName, args, options = {}) {
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    try {
        const client = await getMcpClient();
        // Enforce execution timeout
        const timeoutPromise = new Promise((_, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`MCP tool execution timed out after ${timeoutMs}ms: ${toolName}`));
            }, timeoutMs);
            timer.unref?.();
        });
        const executionPromise = client.callTool({
            name: toolName,
            arguments: args
        });
        const rawResponse = await Promise.race([executionPromise, timeoutPromise]);
        // Parse structured content if available
        let envelope;
        if (rawResponse.structuredContent && typeof rawResponse.structuredContent === "object") {
            envelope = rawResponse.structuredContent;
        }
        else if (Array.isArray(rawResponse.content) && rawResponse.content[0]?.type === "text") {
            try {
                envelope = JSON.parse(rawResponse.content[0].text);
            }
            catch {
                envelope = undefined;
            }
        }
        // If result was signaled as tool error by MCP SDK
        if (rawResponse.isError && (!envelope || envelope.status !== "error")) {
            const message = Array.isArray(rawResponse.content) && rawResponse.content[0]?.type === "text"
                ? rawResponse.content[0].text
                : `Tool execution failed for ${toolName}`;
            return {
                status: "error",
                summary: message,
                results: [],
                result_count: 0,
                error: {
                    code: "TOOL_EXECUTION_FAILED",
                    retryable: false,
                    recovery: "Inspect the tool arguments or check Qloo API credentials."
                }
            };
        }
        // Normalize envelope if missing fields
        if (envelope && typeof envelope.status === "string") {
            return {
                status: envelope.status,
                summary: envelope.summary || (envelope.status === "ok" ? "Operation succeeded." : "No summary provided."),
                results: Array.isArray(envelope.results) ? envelope.results : [],
                result_count: typeof envelope.result_count === "number" ? envelope.result_count : (Array.isArray(envelope.results) ? envelope.results.length : 0),
                error: envelope.error,
                execution: envelope.execution,
                provenance: envelope.provenance
            };
        }
        // Fallback if envelope shape wasn't standard
        return {
            status: "ok",
            summary: "Tool call completed with non-standard envelope.",
            results: Array.isArray(envelope) ? envelope : [],
            result_count: Array.isArray(envelope) ? envelope.length : 0
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const isAuth = message.includes("QLOO_AUTH") || message.includes("401");
        return {
            status: "error",
            summary: message,
            results: [],
            result_count: 0,
            error: {
                code: isAuth ? "QLOO_AUTH" : "MCP_EXEC_ERROR",
                retryable: !isAuth,
                recovery: isAuth
                    ? "Set a valid event-issued QLOO_API_KEY in the backend environment."
                    : "Verify the Qloo harness process status and retry."
            }
        };
    }
}
