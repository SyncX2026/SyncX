import { WorkflowHero } from "@/components/workflow/workflow-hero";
import { WorkflowSteps } from "@/components/workflow/workflow-steps";
import { WorkflowDetail } from "@/components/workflow/workflow-detail";

export default function WorkflowPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <WorkflowHero />
      <WorkflowSteps />
      <WorkflowDetail />
    </main>
  );
}
