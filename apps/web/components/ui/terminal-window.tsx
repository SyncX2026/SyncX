"use client";

import { cn } from "@/lib/utils";
import { Terminal, Copy, Check } from "lucide-react";
import { useRef, useState } from "react";

interface TerminalWindowProps {
  title?: string;
  tabs?: { id: string; label: string }[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  children: React.ReactNode;
  className?: string;
  copyText?: string;
}

export function TerminalWindow({
  title = "bash",
  tabs,
  activeTab,
  onTabChange,
  children,
  className,
  copyText,
}: TerminalWindowProps) {
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    const text = copyText ?? contentRef.current?.innerText ?? "";
    if (!text.trim()) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-800 bg-[#0c0c0e] overflow-hidden shadow-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          {tabs ? (
            <div className="flex gap-1 ml-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange?.(tab.id)}
                  type="button"
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-pixel ml-2">
              <Terminal className="w-3 h-3" />
              {title}
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          type="button"
          aria-label="Copy terminal content"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-4 md:p-6 font-mono text-sm overflow-x-auto">
        {children}
      </div>
    </div>
  );
}
