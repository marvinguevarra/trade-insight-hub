import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { SupplyDemandZone } from "@/types/analysis";

const patternDescriptions: Record<string, { label: string; description: string }> = {
  RBR: {
    label: "Rally-Base-Rally",
    description: "Price rallied, consolidated, then rallied again. Strong demand zone where buyers historically stepped in.",
  },
  RBD: {
    label: "Rally-Base-Drop",
    description: "Price rallied, consolidated, then dropped. A reversal zone where selling pressure overcame buyers.",
  },
  DBR: {
    label: "Drop-Base-Rally",
    description: "Price dropped, consolidated, then rallied. A bounce zone where buyers absorbed selling pressure.",
  },
  DBD: {
    label: "Drop-Base-Drop",
    description: "Price dropped, consolidated, then dropped again. Strong supply zone where sellers remain in control.",
  },
};

const ZonesCard = ({ zones }: { zones: SupplyDemandZone[] }) => {
  const freshCount = zones.filter((z) => z.fresh).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Zones</CardTitle>
          <Badge variant="secondary">{freshCount} fresh</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {zones.slice(0, 3).map((zone, i) => (
            <div
              key={i}
              className={`rounded-lg border p-3 transition-colors ${
                zone.fresh
                  ? "border-primary/30 bg-primary/5"
                  : "border-border bg-secondary/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      zone.type === "demand"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {zone.type === "demand" ? "📈 Demand" : "📉 Supply"}
                  </span>
                  {zone.fresh && <span className="text-xs">⭐</span>}
                </div>
                <span className="text-xs text-muted-foreground">
                  Strength: {zone.strength}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-muted-foreground">
                  ${zone.range_low.toFixed(2)} – ${zone.range_high.toFixed(2)}
                </span>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="text-xs cursor-help gap-1">
                        {zone.pattern}
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px]">
                      <p className="font-semibold text-xs mb-1">
                        {patternDescriptions[zone.pattern]?.label ?? zone.pattern}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patternDescriptions[zone.pattern]?.description ?? "Zone formation pattern."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZonesCard;
