# LocalMuse Ops — Architecture Documentation

This document describes the end-to-end technical architecture of **LocalMuse Ops**, a taste-powered Cultural Operations Copilot designed for independent hospitality and retail venues.

---

## 1. System Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client Layer (Next.js 16 • Turbopack)"]
        Browser["Operator Browser<br/>(Desktop / Tablet / Mobile)"]
        UI_Shell["AppShell & Layout<br/>(Classic Latte • Deep Charcoal • System)"]
        UI_Nav["TopNavbar & AppSidebar<br/>(Dynamic Workflow Switcher)"]
        UI_Views["Workflow Views<br/>• CulturePlanView (Flagship Copilot)<br/>• LocationInsightsView<br/>• AudienceComparisonView<br/>• LocalTrendsView<br/>• RecommendationsView<br/>• GuideView (Field Manual)"]
        UI_Contrast["PlanComparisonView<br/>(Generic AI vs Qloo Contrast)"]
        UI_Feedback["PlanFeedbackCard<br/>(Local Device Memory)"]
        LocalStore[("Browser LocalStorage<br/>localmuse_operator_feedback")]
        ApiClient["Typed API Client<br/>(src/services/api-client.ts)"]
    end

    subgraph ServerLayer["Backend Service Layer (Express 4 • Node.js :4000)"]
        Router["Express API Router<br/>(server/src/routes/)"]
        HealthRoute["GET /api/health<br/>(Readiness & Capabilities)"]
        WorkflowsRoute["POST /api/location-insights<br/>POST /api/compare-audiences<br/>POST /api/local-trends<br/>POST /api/recommendations"]
        AgentRoute["POST /api/agent/weekly-plan<br/>(Central Agent Orchestrator)"]
        Orchestrator["Agent Orchestrator Service<br/>(server/src/services/agent-orchestrator.ts)"]
        Synthesizer["Deterministic Grounded Synthesizer<br/>(server/src/services/agent-synthesizer.ts)"]
        EnvelopeBuilder["MCP Envelope Formatter<br/>(server/src/routes/utils.ts)"]
    end

    subgraph ExecutionEngines["Execution Modes & Isolation Boundary"]
        subgraph DemoEngine["Demo Mode (Zero Network • Offline Simulation)"]
            MockService["Mock Service Engine<br/>(server/src/services/mock-service.ts)"]
            MockFixtures["Curated Benchmark Fixtures<br/>• Austin, TX Specialty Coffee<br/>• Austin vs Nashville Comparison<br/>• Adapted Illustrative Generator"]
        end

        subgraph LiveEngine["Live Qloo Mode (Authentic MCP Execution)"]
            McpClient["MCP Protocol Client<br/>(server/src/mcp/client.ts)"]
            McpExecutor["Tool Executor Wrapper<br/>(server/src/mcp/executor.ts)"]
            QlooService["Qloo Domain Service<br/>(server/src/services/qloo-service.ts)"]
        end
    end

    subgraph ExternalProtocol["Qloo Protocol Layer (stdio transport)"]
        McpServer["Official Qloo MCP Server<br/>(stdio subprocess • Node.js)"]
        QlooApi["Official Qloo Taste Engine<br/>(Aggregate Cultural Vectors)"]
    end

    %% Client Interactions
    Browser --> UI_Shell
    UI_Shell --> UI_Nav
    UI_Shell --> UI_Views
    UI_Views --> UI_Contrast
    UI_Views --> UI_Feedback
    UI_Feedback <--> LocalStore
    UI_Views --> ApiClient

    %% Client to Server
    ApiClient -->|HTTP / JSON Fetch| Router
    Router --> HealthRoute
    Router --> WorkflowsRoute
    Router --> AgentRoute

    %% Orchestration Flow
    AgentRoute --> Orchestrator
    WorkflowsRoute --> Orchestrator

    %% Execution Branching
    Orchestrator -->|mode === 'demo'| MockService
    MockService --> MockFixtures
    MockService --> Synthesizer

    Orchestrator -->|mode === 'live'| QlooService
    QlooService --> McpExecutor
    McpExecutor --> McpClient
    McpClient -->|JSON-RPC via stdio| McpServer
    McpServer -->|Encrypted HTTPS (QLOO_API_KEY)| QlooApi

    %% Return Path
    QlooService --> Synthesizer
    Synthesizer --> EnvelopeBuilder
    EnvelopeBuilder -->|HTTP 200 / 400 / 401 / 502 JSON| ApiClient
    ApiClient --> UI_Views
```

---

## 2. Architectural Layers

### 2.1 Frontend Client Layer
- **Framework**: Next.js 16.4 (App Router) with Turbopack for sub-second development iteration and production asset bundling.
- **Styling & Theming**: Tailwind CSS v4 featuring semantic CSS variables for three distinct theme modes:
  - **Classic Latte (Light)**: High-contrast parchment and warm espresso tones.
  - **Deep Charcoal (Dark)**: Deep slate backgrounds with roasted amber accents.
  - **System Theme**: Dynamic matching with the operating system's `prefers-color-scheme`.
- **API Communication**: Dedicated typed client (`src/services/api-client.ts`) that maps Express backend responses to standard TypeScript interfaces with strict error boundary discrimination.
- **Local Device Memory**: Persistent client-side shift review storage (`src/lib/feedback.ts`) backed by `localStorage` using React 19 `useSyncExternalStore` for reactive UI updates without cascading re-renders.

### 2.2 Backend Service Layer
- **Runtime**: Express 4 running on Node.js v20/v22 at `http://localhost:4000`.
- **API Contract**: Standardized JSON envelopes conforming to the Model Context Protocol (MCP) data envelope specification (`status`, `summary`, `results`, `result_count`, `metadata`).
- **Validation & Fast-Fail**: Rigid input validation (`server/src/routes/utils.ts`). Missing parameters trigger HTTP 400 (`needs_input`); missing or invalid `QLOO_API_KEY` in Live Mode triggers immediate HTTP 401 (`QLOO_AUTH`) without fallback to mock fixtures.
- **Deterministic Synthesizer**: A rule-based cultural operations engine (`server/src/services/agent-synthesizer.ts`) that bridges verified Qloo entities, tags, and momentum scores into actionable hospitality schedules without hallucination.

### 2.3 Execution Isolation: Demo Mode vs. Live Qloo Mode

| Architectural Dimension | Demo Mode (`mode: "demo"`) | Live Qloo Mode (`mode: "live"`) |
| :--- | :--- | :--- |
| **API Key Requirement** | None. Runs completely offline. | Mandatory `QLOO_API_KEY` in `server/.env`. |
| **Execution Path** | Dispatches to `server/src/services/mock-service.ts`. | Dispatches to `server/src/mcp/executor.ts` via `stdio`. |
| **Data Provenance** | Labeled as `curated_mock_fixture` or `illustrative`. | Real Qloo entity URNs and empirical scores. |
| **Failure Handling** | Generates dynamic illustrative adapted fixtures for any location. | Fast fails with HTTP 401 (`QLOO_AUTH`) or HTTP 502 (`QLOO_MCP_ERROR`). |
| **External Network** | Zero outgoing network packets. | Encrypted HTTPS requests between MCP server and Qloo API. |
| **Soundscape Guidance** | Illustrative reference palette. | Static illustrative artist palette is suppressed to prevent fabrication. |

---

## 3. Technology Stack Reference

- **Frontend**: Next.js 16.4.3, React 19, Tailwind CSS v4, TypeScript 5.8.
- **Backend**: Express 4.21, TypeScript 5.8, Node.js v20/v22, `@modelcontextprotocol/sdk`.
- **Development Tooling**: `tsx` (TypeScript execution and file-watching), Turbopack, ESLint 9.
- **Operating Environment**: Tested on Fedora Linux 41 / Red Hat Enterprise Linux / Ubuntu (8 GB RAM compatible).
