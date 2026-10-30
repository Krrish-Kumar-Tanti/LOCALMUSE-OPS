import { AppShell } from "@/components/common/AppShell";
import { CulturePlanView } from "@/components/culture-plan/CulturePlanView";

export default function CulturePlanPage() {
  return (
    <AppShell
      activeNavId="culture-plan"
      title="Weekly Cultural Operations Plan"
      description="Coordinated weekly operations plan synthesized across Qloo location insights, audience contrast, local trends, and candidate ranking"
    >
      <CulturePlanView />
    </AppShell>
  );
}
