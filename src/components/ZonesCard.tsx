import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupplyDemandZone } from "@/types/analysis";

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
                <Badge variant="outline" className="text-xs">
                  {zone.pattern}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ZonesCard;
