import { CommandsHero } from "@/components/commands/commands-hero";
import { CommandTabs } from "@/components/commands/command-tabs";

export default function CommandsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <CommandsHero />
      <CommandTabs />
    </main>
  );
}
