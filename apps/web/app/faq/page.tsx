import { FaqHero } from "@/components/faq/faq-hero";
import { FaqList } from "@/components/faq/faq-list";

export default function FaqPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <FaqHero />
      <FaqList />
    </main>
  );
}
