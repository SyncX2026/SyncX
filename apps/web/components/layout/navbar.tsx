"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useNavbarScroll } from "@/hooks/use-navbar-scroll";
import { CONTENT } from "@/lib/content";
import { buttonVariants } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const scrolled = useNavbarScroll();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: CONTENT.shared.nav.home },
    { href: "/workflow", label: CONTENT.shared.nav.workflow },
    { href: "/commands", label: CONTENT.shared.nav.commands },
    { href: "/publisher", label: CONTENT.shared.nav.publisher },
    { href: "/platforms", label: CONTENT.shared.nav.platforms },
    { href: "/faq", label: CONTENT.shared.nav.faq },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
          <div className="relative w-8 h-8 overflow-hidden rounded-lg">
            <Image
              src="/syncx-pixel-icon.png"
              alt="SyncX Logo"
              fill
              sizes="32px"
              className="object-contain pixelated"
            />
          </div>
          <span className="hidden sm:inline-block font-pixel text-xs tracking-widest text-primary group-hover:text-white transition-colors">
            {CONTENT.shared.nav.logo}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-zinc-400"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/workflow" className={buttonVariants({ variant: "binance", size: "sm" })}>
            {CONTENT.shared.nav.cta}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden absolute top-full left-0 right-0 bg-zinc-950 border-b border-zinc-800 p-4 flex flex-col gap-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium py-2 transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-zinc-400"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/workflow"
            className={cn(buttonVariants({ variant: "binance" }), "w-full")}
            onClick={() => setMobileMenuOpen(false)}
          >
            {CONTENT.shared.nav.cta}
          </Link>
        </div>
      )}
    </header>
  );
}
