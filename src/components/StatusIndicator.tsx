import { Check, Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBullBearColors } from "@/hooks/useBullBearColors";

export const FreshDot = () => (
  <span className="inline-flex items-center gap-1.5">
    <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
    <span className="text-[10px] uppercase tracking-wider text-green-400">Fresh</span>
  </span>
);

export const TestedDot = () => (
  <span className="inline-flex items-center gap-1.5">
    <span className="h-2 w-2 rounded-full bg-muted-foreground" />
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Tested</span>
  </span>
);

export const FilledIcon = () => (
  <span className="inline-flex items-center gap-1">
    <Check className="h-3.5 w-3.5 text-green-500" />
    <span className="text-xs text-green-400">Filled</span>
  </span>
);

export const UnfilledIcon = () => (
  <span className="inline-flex items-center gap-1">
    <Clock className="h-3.5 w-3.5 text-yellow-500" />
    <span className="text-xs text-yellow-400">Open</span>
  </span>
);

export const DirectionBadge = ({ direction }: { direction: "up" | "down" }) => {
  const bb = useBullBearColors();
  return direction === "up" ? (
    <span className={`inline-flex items-center gap-1 ${bb.bull}`}>
      <ChevronUp className="h-4 w-4" />
      <span className="text-xs font-medium">Up</span>
    </span>
  ) : (
    <span className={`inline-flex items-center gap-1 ${bb.bear}`}>
      <ChevronDown className="h-4 w-4" />
      <span className="text-xs font-medium">Down</span>
    </span>
  );
};

export const TierBadge = ({ tier }: { tier: string }) => {
  const config: Record<string, { label: string; className: string }> = {
    lite: { label: "FREE", className: "border-green-500/30 text-green-400" },
    standard: { label: "STD", className: "border-primary/30 text-primary" },
    premium: { label: "PRO", className: "border-yellow-500/30 text-yellow-400" },
  };
  const c = config[tier] || config.standard;
  return (
    <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider font-bold", c.className)}>
      {c.label}
    </Badge>
  );
};
