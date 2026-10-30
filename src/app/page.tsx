import { APP_CONFIG } from "@/constants";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-100">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Foundation Initialized
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
            {APP_CONFIG.name}
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-lg mx-auto">
            {APP_CONFIG.description}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-left">
            <span className="text-xs text-zinc-400">Framework</span>
            <p className="text-sm font-semibold text-zinc-200 mt-0.5">Next.js 16 (App Router)</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-left">
            <span className="text-xs text-zinc-400">Language</span>
            <p className="text-sm font-semibold text-zinc-200 mt-0.5">TypeScript 5</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-left">
            <span className="text-xs text-zinc-400">Styling</span>
            <p className="text-sm font-semibold text-zinc-200 mt-0.5">Tailwind CSS 4</p>
          </div>
          <div className="p-3.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-left">
            <span className="text-xs text-zinc-400">Linter</span>
            <p className="text-sm font-semibold text-zinc-200 mt-0.5">ESLint 9</p>
          </div>
        </div>

        <p className="text-xs text-zinc-400">
          Ready for architecture and feature development.
        </p>
      </div>
    </main>
  );
}
