import { PlatformsHero } from "@/components/platforms/platforms-hero";
import { PlatformGrid } from "@/components/platforms/platform-grid";
import { ModeExplainer } from "@/components/platforms/mode-explainer";

export default function PlatformsPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <PlatformsHero />
      <PlatformGrid />
      <ModeExplainer />
    </main>
  );
}
