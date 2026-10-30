import { AppShell } from "@/components/common/AppShell";
import { GuideView } from "@/components/guide/GuideView";

export default function GuidePage() {
  return (
    <AppShell
      activeNavId="guide"
      title="Platform Guide & Operational Manual"
      description="Field manual, Qloo protocol toolchains, and responsible AI guardrails"
    >
      <GuideView />
    </AppShell>
  );
}
