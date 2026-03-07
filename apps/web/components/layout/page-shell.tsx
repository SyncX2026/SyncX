import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { GridBackground } from "@/components/ui/grid-background";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <GridBackground />
      <Navbar />
      <div className="flex-1 pt-24">{children}</div>
      <Footer />
    </div>
  );
}
