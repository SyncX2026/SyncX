import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-12",
        align === "center" ? "text-center items-center" : "text-left items-start",
        className
      )}
    >
      {eyebrow && (
        <span className="text-sm font-medium text-primary uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
