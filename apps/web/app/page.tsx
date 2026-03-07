import { Hero } from "@/components/home/hero";
import { Overview } from "@/components/home/overview";
import { WorkflowPreview } from "@/components/home/workflow-preview";
import { CommandPreview } from "@/components/home/command-preview";
import { CtaBanner } from "@/components/home/cta-banner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Overview />
      <WorkflowPreview />
      <CommandPreview />
      <CtaBanner />
    </main>
  );
}
