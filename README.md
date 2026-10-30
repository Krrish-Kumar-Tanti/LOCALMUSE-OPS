# LocalMuse Ops

LocalMuse Ops is a modern, scalable operational intelligence platform built for local cultural discovery and taste analytics, designed for hackathon execution and beyond.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linting & Code Quality**: [ESLint](https://eslint.org/) (Next.js Core Web Vitals config)
- **Package Manager**: `npm`

---

## Project Structure

The project follows a clean, modular, and scalable directory structure:

```text
.
├── public/                 # Static assets (favicons, SVG assets, public images)
├── src/
│   ├── app/                # Next.js App Router (pages, layouts, route handlers)
│   │   ├── favicon.ico
│   │   ├── globals.css     # Global CSS and Tailwind directives
│   │   ├── layout.tsx      # Root layout and metadata configuration
│   │   └── page.tsx        # Project initialization entry page
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Cross-feature shared layout/common components
│   │   └── ui/             # Atomic design UI primitives (buttons, cards, badges)
│   ├── constants/          # Application-wide constants and configurations
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Shared utilities and helper functions
│   ├── services/           # Service layer for external APIs & data fetching
│   └── types/              # TypeScript type definitions and domain interfaces
├── .env.example            # Environment configuration template
├── .gitignore              # Git ignore rules for node_modules, build outputs, and env files
├── eslint.config.mjs       # ESLint configuration
├── LICENSE                 # MIT License
├── next.config.ts          # Next.js runtime & bundler configuration
├── package.json            # Dependencies and npm scripts
├── README.md               # Project documentation
└── tsconfig.json           # TypeScript configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or later (tested on Node v22)
- **npm**: `v10.x` or later

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd QLOO
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   *Open `.env.local` and add any necessary credentials (e.g. Qloo API key) when ready.*

---

## Development & Build Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server with Turbopack on `http://localhost:3000` |
| `npm run build` | Compiles and optimizes the project for production |
| `npm run start` | Starts the production server (run after `npm run build`) |
| `npm run lint` | Runs ESLint to verify code quality and style standards |

---

## Security & Best Practices

- **Never Commit Secrets**: Secrets, access keys, and API tokens must never be hardcoded or committed to version control. Always use environment variables in `.env.local`.
- **Verified Integrations**: Only connect against verified endpoints and official SDKs once credentials are configured.

---

## License

This project is licensed under the [MIT License](LICENSE).
