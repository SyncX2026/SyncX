import { CONTENT } from "@/lib/content";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12 text-zinc-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white group">
            <div className="relative w-8 h-8 overflow-hidden rounded-lg">
              <Image 
                src="/syncx-pixel-icon.png" 
                alt="SyncX Logo" 
                fill 
                sizes="32px"
                className="object-contain pixelated" 
              />
            </div>
            <span className="font-pixel text-xs tracking-widest text-primary group-hover:text-white transition-colors">
              {CONTENT.shared.nav.logo}
            </span>
          </Link>
          <p className="text-sm text-zinc-500 max-w-xs text-center md:text-left">
            {CONTENT.home.hero.subtitle}
          </p>
        </div>

        <div className="flex gap-8">
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Product</h4>
            <Link href="/workflow" className="text-sm hover:text-primary transition-colors">
              Workflow
            </Link>
            <Link href="/commands" className="text-sm hover:text-primary transition-colors">
              Commands
            </Link>
            <Link href="/platforms" className="text-sm hover:text-primary transition-colors">
              Platforms
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-white">Resources</h4>
            <Link href="/faq" className="text-sm hover:text-primary transition-colors">
              FAQ
            </Link>
            <Link href={CONTENT.shared.links.docs} className="text-sm hover:text-primary transition-colors">
              Documentation
            </Link>
            <Link href="/publisher" className="text-sm hover:text-primary transition-colors">
              Web Publisher
            </Link>
            <Link
              href={CONTENT.shared.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:text-primary transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex gap-4">
            <Link
              href={CONTENT.shared.links.x}
              target="_blank"
              rel="noreferrer"
              aria-label="Open SyncX X profile"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </Link>
            <Link
              href={CONTENT.shared.links.github}
              target="_blank"
              rel="noreferrer"
              aria-label="Open SyncX GitHub repository"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-xs text-zinc-500 text-center md:text-right">
            Official CA:{" "}
            <Link
              href={CONTENT.shared.links.officialCaExplorer}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-zinc-400 hover:text-primary break-all"
            >
              {CONTENT.shared.links.officialCa}
            </Link>
          </p>
          <p className="text-xs text-zinc-600">
            {CONTENT.shared.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
