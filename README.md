# LocalMuse Ops — Cultural Operations Copilot

> **AI-Powered Taste Intelligence & Weekly Operations Planning for Independent Hospitality**
> *Built with the Qloo Taste AI Engine via the Model Context Protocol (MCP)*

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.21-gray?logo=express)](https://expressjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Qloo MCP](https://img.shields.io/badge/Qloo-MCP%20stdio-emerald)](https://qloo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

---

## 1. Problem Statement

Independent neighborhood venues—specialty coffee roasters, natural wine bars, craft cocktail bistros, listening lounges, and indie bookstore cafés—face severe operational hurdles:
1. **Unpredictable Weekday Lulls**: Tuesday afternoons (1:30–4:30 PM) experience steep footfall drops, leaving expensive espresso machines and hourly staff underutilized.
2. **Margin-Eroding Discounting**: Standard marketing playbooks default to blunt price-cutting (happy hour 2-for-1 cards, 15% discount flyers) that erode thin artisan margins, attract price-sensitive churn, and damage premium third-place positioning.
3. **Generic LLM Advice**: Prompting untethered commercial AI models yields generic clichés (e.g. *"host a networking workshop"*, *"post motivational memes"*, *"play top-40 pop radio"*) completely disconnected from hyper-local neighborhood taste vectors and practical staffing pace.

---

## 2. The Solution: Taste-Driven Operations

**LocalMuse Ops** replaces price discounts and generic AI advice with **aggregate cultural taste intelligence from Qloo**.

By querying aggregate cultural affinities across gastronomy, music, literature, fashion, and social atmosphere, LocalMuse Ops orchestrates an actionable **7-day Monday–Sunday operations rhythm** tailored to your venue's specific neighborhood anchors and target patron segments:
- **High-Margin Specialty Features**: Introduces non-discount premium pairings (e.g. single-origin cascara tonics, yuzu cold foam spritzes, local bakery drops) that patrons happily pay full price for.
- **Calibrated Soundscapes**: Sets genre direction and decibel caps (e.g. Japanese City Pop or chillhop under 68 dB) to protect remote-worker productivity and lengthen stay duration.
- **Micro-Artisan Collaborations**: Structures zero-capex consignment popups with verified high-affinity neighborhood anchors during typical shift lulls.
- **Practical Shift Milestones**: Maps every tactical idea directly into concrete barista/bartender shift checklists with staff briefing notes.

---

## 3. Why Qloo Is Important to This Project

Unlike demographic censuses that merely record age and income, **Qloo provides mathematical correlation vectors between cultural entities across completely disparate domains**.

Qloo allows LocalMuse Ops to answer questions that no search engine or generic LLM can solve:
- *What specific music genres do patrons of specialty coffee roasteries in East Austin (78702) prefer over patrons in Nashville?*
- *What micro-bakeries or ceramic studios share high taste affinity with our natural wine bar patrons?*
- *What culinary ingredients (e.g. cascara, botanical bitters) are demonstrating accelerating 6-quarter momentum curves in our target zip code?*

LocalMuse Ops interacts with Qloo through the official **Model Context Protocol (MCP)** using secure `stdio` communication, executing authentic toolchains (`qloo_find_tags`, `qloo_recommend`, `qloo_entity_tags`, `qloo_describe`, `qloo_compare_audiences`, `qloo_trends`, `qloo_rank`).

---

## 4. Key Platform Features

1. **Flagship Cognitive Copilot (`/culture-plan`)**:
   - Accepts a business profile and strategic operational goal.
   - Coordinates all four Qloo intelligence workflows into a complete 7-day Monday–Sunday operations schedule.
   - Every recommendation displays an interactive **Provenance Drawer** showing exact tool source, grounding entity, and empirical signal.
   - One-click clipboard export (`Export Plan (Markdown)`) for backroom bulletin boards and shift briefing emails.
2. **Practical Generic AI vs. Qloo Contrast (`Step 13`)**:
   - Real side-by-side evaluation tool contrasting the generated Qloo plan against a deterministic generic LLM baseline.
   - Contrasts 5 core dimensions: *Cultural Relevance*, *Local Market Context*, *Evidence & Provenance*, *Operational Recommendations*, and *Implementation Practicality*.
3. **Operator Shift Review & Local Memory (`Step 14`)**:
   - 1-to-5 star operational feasibility rating with diagnostic tags (*Relevant*, *Too expensive*, *Difficult to implement*, etc.) and short shift notes.
   - Stored in local browser memory (`localStorage`). Automatically loads prior operator shift notes in subsequent plan generations on this device.
4. **Discovery Workflows (Modules 01–04)**:
   - **Location Insights (`/location-insights`)**: Discover peer anchor venues, lifestyle tags, and target demographics.
   - **Audience Comparison (`/audience-comparison`)**: Contrast two local markets to uncover shared baselines vs unique traits.
   - **Local Trends (`/local-trends`)**: Track 6-quarter cultural momentum curves and neighborhood density heatmaps.
   - **Recommendations & Ranking (`/recommendations`)**: Two-stage candidate discovery and multi-attribute goal ranking.
5. **Triple Semantic Theme System (`Step 12`)**:
   - **Classic Latte (Light)**: High-contrast parchment and warm espresso tones.
   - **Deep Charcoal (Dark)**: Deep slate with roasted coffee amber accents.
   - **System Theme**: Dynamically matches your operating system's dark/light preferences.
6. **Platform Field Manual (`/guide`)**:
   - Comprehensive interactive user manual documenting every form field, preset, toolchain, and error recovery code.

---

## 5. Technology Stack

- **Frontend**: Next.js 16.4.3 (App Router with Turbopack), React 19, Tailwind CSS v4, TypeScript 5.8.
- **Backend**: Express 4.21, TypeScript 5.8, Node.js v20/v22, `@modelcontextprotocol/sdk`.
- **Protocol**: Model Context Protocol (MCP) using standard input/output streams (`stdio`).
- **Data Persistence**: Lightweight client-side device storage (`localStorage`) with React 19 `useSyncExternalStore`.
- **Development Tooling**: ESLint 9, `tsx` watch mode, Turbopack.

---

## 6. Architecture & System Workflows

Detailed editable Mermaid architecture and workflow diagrams are located in the `docs/` folder:
- **[docs/architecture.md](docs/architecture.md)**: Full architecture diagram showing client, backend, MCP stdio transport, and Demo vs. Live isolation.
- **[docs/system-workflow.md](docs/system-workflow.md)**: Complete operator journey from profile definition to export and memory.
- **[docs/agent-workflow.md](docs/agent-workflow.md)**: Multi-stage orchestrator pipeline, error boundaries, and provenance contract.
- **[docs/qloo-integration.md](docs/qloo-integration.md)**: Technical reference on the 7 Qloo MCP tools, signal resolution, and credential security.

---

## 7. Setup Instructions (Fedora / Linux / macOS)

### Prerequisites
- **Node.js**: `v20.x` or `v22.x` (tested on Node v22.19.0 on Fedora 41 Linux).
- **npm**: `v10.x` or later.
- **Git**: Installed and configured.

### Step 1: Clone Repository & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/localmuse-ops.git
cd localmuse-ops

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Configure Environment Variables

```bash
# 1. Frontend configuration (defaults to http://localhost:4000)
cp .env.example .env.local

# 2. Backend configuration
cp server/.env.example server/.env
```

Open `server/.env` in your text editor:
```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
NODE_ENV=development

# Optional for Demo Mode, Mandatory for Live Qloo Mode:
QLOO_API_KEY=your_qloo_api_key_here
```

### Step 3: Run Development Servers

Open two terminal windows (or use background processes):

**Terminal 1 — Backend Express Server (Port 4000):**
```bash
cd server
npm run dev
# Expected output:
# [LocalMuse Ops Backend] Server listening on port 4000
# [LocalMuse Ops Backend] CORS configured for: http://localhost:3000
```

**Terminal 2 — Frontend Next.js Server (Port 3000):**
```bash
npm run dev
# Expected output:
# ▲ Next.js 16.4.3 (Turbopack)
# - Local: http://localhost:3000
# ✓ Ready in 300ms
```

Open your browser to **`http://localhost:3000`**.

---

## 8. Demo Mode vs. Live Qloo Mode

LocalMuse Ops maintains strict architectural isolation between operating modes:

| Feature | Demo Mode (`mode: "demo"`) | Live Qloo Mode (`mode: "live"`) |
| :--- | :--- | :--- |
| **API Key Required** | No. Zero key required. | Yes. `QLOO_API_KEY` required in `server/.env`. |
| **Network Traffic** | 100% offline. Zero external network calls. | Live encrypted HTTPS to Qloo via MCP stdio. |
| **Data Source** | Pre-calculated benchmark data for Austin, TX (and adapted illustrative fixtures for other cities). | Real Qloo entity URNs and empirical scores. |
| **Disclosures** | Prominent amber disclaimer banners: *Illustrative fixture*. | Green verified signal badges: *origin: qloo_evidence*. |
| **Soundscape Guidance** | Illustrative reference palette. | Static illustrative artist palette is suppressed to prevent fabrication. |
| **Failure Policy** | Provides adapted illustrative fixtures. | Fast-fails with HTTP 401 (`QLOO_AUTH`). Never falls back to mock data silently. |

---

## 9. API Endpoint Documentation

All backend endpoints are hosted on `http://localhost:4000` and return standard MCP data envelopes.

### 1. `GET /api/health`
Inspects backend readiness, MCP connectivity, and available execution modes.
```json
{
  "status": "online",
  "service": "localmuse-ops-backend",
  "mcpConnected": true,
  "modesAvailable": { "demo": true, "live": false },
  "recommendedMode": "demo"
}
```

### 2. `POST /api/location-insights`
Discovers peer anchors and lifestyle concept tags (`qloo_find_tags` &rarr; `qloo_recommend` &rarr; `qloo_entity_tags`).
- **Body**: `{ "mode": "demo" | "live", "location": "Austin, TX", "businessType": "Specialty Coffee" }`

### 3. `POST /api/compare-audiences`
Contrasts cultural affinities between two markets (`qloo_describe` &rarr; `qloo_compare_audiences`).
- **Body**: `{ "mode": "demo" | "live", "locationA": "Austin, TX", "locationB": "Nashville, TN", "targetCategory": "brand" }`

### 4. `POST /api/local-trends`
Measures 6-quarter momentum velocity and density heatmaps (`qloo_recommend` &rarr; `qloo_trends`).
- **Body**: `{ "mode": "demo" | "live", "location": "Austin, TX", "category": "Specialty Coffee", "dateRange": { "startDate": "2025-01-01", "endDate": "2026-06-30" } }`

### 5. `POST /api/recommendations`
Scores and contextually ranks candidate initiatives against a goal (`qloo_recommend` &rarr; `qloo_rank`).
- **Body**: `{ "mode": "demo" | "live", "businessProfile": { "name": "Solstice Coffee", "location": "Austin", "category": "Coffee" }, "goal": { "objective": "Increase footfall" } }`

### 6. `POST /api/agent/weekly-plan`
Central orchestrator synthesizing all 4 workflows into a practical 7-day operations rhythm.
- **Body**:
```json
{
  "mode": "demo",
  "businessProfile": {
    "name": "Flat Track Coffee & Roasters",
    "category": "specialty coffee & roastery",
    "city": "Austin",
    "neighborhood": "East Austin (Cesar Chavez)"
  },
  "operationalGoal": {
    "objective": "Increase weekday afternoon footfall (1:30–4:30 PM) and lift check average",
    "benchmarkCity": "Nashville"
  }
}
```

---

## 10. Project Directory Structure

```text
.
├── docs/                       # Comprehensive Architecture & Protocol Documentation
│   ├── architecture.md         # System architecture and Demo vs Live isolation
│   ├── system-workflow.md      # End-to-end user and data journey
│   ├── agent-workflow.md       # Multi-stage orchestrator pipeline and provenance
│   └── qloo-integration.md     # Qloo MCP protocol and toolchain reference
├── public/                     # Static public assets
├── server/                     # Express 4 Backend Service Layer
│   ├── src/
│   │   ├── mcp/                # MCP protocol client, stdio connector, and executor
│   │   │   ├── client.ts
│   │   │   └── executor.ts
│   │   ├── routes/             # Express API routes
│   │   │   ├── agent.ts        # Weekly plan orchestration route
│   │   │   ├── compare-audiences.ts
│   │   │   ├── local-trends.ts
│   │   │   ├── location-insights.ts
│   │   │   ├── recommendations.ts
│   │   │   ├── health.ts
│   │   │   └── utils.ts        # Status code mapping and input validation
│   │   ├── services/           # Domain business logic
│   │   │   ├── agent-orchestrator.ts # Central 5-stage agent pipeline
│   │   │   ├── agent-synthesizer.ts  # Deterministic grounded weekly plan builder
│   │   │   ├── mock-data.ts    # Curated Austin benchmark fixtures
│   │   │   ├── mock-service.ts # Offline mock dispatch and adapted fixture generator
│   │   │   ├── qloo-service.ts # Official Qloo toolchain chaining
│   │   │   └── qloo-types.ts   # Backend domain contracts and provenance types
│   │   └── index.ts            # Server entry point on port 4000
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── src/                        # Next.js 16 Frontend Application
│   ├── app/                    # App Router pages and layouts
│   │   ├── culture-plan/       # Weekly Culture Plan copilot page
│   │   ├── guide/              # Platform Field Manual page
│   │   ├── location-insights/
│   │   ├── audience-comparison/
│   │   ├── local-trends/
│   │   ├── recommendations/
│   │   ├── globals.css         # Centralized semantic theme system (Tailwind v4)
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page with interactive contrast link
│   ├── components/             # Reusable React components
│   │   ├── common/             # TopNavbar, AppSidebar, AppHeader, AppShell, ThemeSelector
│   │   ├── culture-plan/       # CulturePlanView, PlanComparisonView, PlanFeedbackCard
│   │   ├── guide/              # GuideView (Field Manual)
│   │   └── ui/                 # Atomic primitives (Card, Button, Badge, Input, Select)
│   ├── hooks/                  # Custom React hooks (useAgentWeeklyPlan, useOperationMode)
│   ├── lib/                    # Helper libraries
│   │   ├── feedback.ts         # Local device memory and storage synchronization
│   │   ├── ThemeContext.tsx    # Theme provider (Classic Latte, Deep Charcoal, System)
│   │   └── auth.ts             # Demo operator persona switcher
│   ├── services/               # Frontend API client
│   │   └── api-client.ts       # Typed fetch wrapper with ApiClientError
│   └── types/                  # Shared frontend domain interfaces
├── package.json
└── README.md
```

---

## 11. Known Limitations

1. **Local Device Storage**: Operator shift reviews and feasibility notes are persisted in browser `localStorage`. Feedback is not shared across devices or synced to a centralized cloud database.
2. **Offline Custom Presets**: In Demo Mode, Austin, TX features rich pre-calculated benchmark datasets. For custom locations without Qloo credentials, the engine synthesizes adapted illustrative fixtures.
3. **Soundscape Playlists**: Due to strict data integrity guardrails, live streaming playlist integration requires an authenticated live Qloo session; illustrative artist palettes are suppressed in Live Mode to prevent unverified endorsement claims.

---

## 12. Future Improvements

1. **POS & Shift System Integrations**: Direct webhooks into Square, Toast, or 7shifts to automatically match recommended menu features with inventory availability.
2. **Spotify / Sonos Direct Sync**: Automated creation of soundscape playlists directly within the venue's Sonos or Spotify Business accounts.
3. **Multi-Unit Group Benchmarking**: Automated rollout of weekly cultural plans across regional multi-location hospitality groups.

---

## 13. License

This project is licensed under the [MIT License](LICENSE).
