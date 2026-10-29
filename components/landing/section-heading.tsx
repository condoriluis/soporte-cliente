import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  index: string;
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "default" | "inverted";
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  index,
  kicker,
  title,
  description,
  tone = "default",
  align = "left",
  className,
}: SectionHeadingProps) {
  const inverted = tone === "inverted";

  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          align === "center" && "justify-center",
        )}
      >
        <span
          className={cn(
            "font-mono text-[11px] tracking-[0.2em]",
            inverted ? "text-brand-light" : "text-primary",
          )}
        >
          {index}
        </span>
        <span
          className={cn(
            "h-px w-8",
            inverted ? "bg-white/20" : "bg-border",
          )}
        />
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.2em]",
            inverted ? "text-white/50" : "text-muted-foreground",
          )}
        >
          {kicker}
        </span>
      </div>

      <h2
        className={cn(
          "mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
          inverted ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>

      {description ? (
        <p
          className={cn(
            "mt-4 text-pretty text-sm leading-relaxed sm:text-base",
            inverted ? "text-white/60" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
