import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";
import type { SupportResistanceLevel } from "@/types/analysis";

const getStrengthLabel = (strength: number) => {
  if (strength >= 80) return { label: "Strong", color: "text-success" };
  if (strength >= 50) return { label: "Moderate", color: "text-accent" };
  return { label: "Weak", color: "text-muted-foreground" };
};

const LevelsCard = ({ levels }: { levels: SupportResistanceLevel[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Key Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {levels.slice(0, 5).map((level, i) => {
            const isSupport = level.type === "support";
            const { label, color } = getStrengthLabel(level.strength);

            return (
              <div
                key={i}
                className={`border-l-4 pl-3 py-2 ${
                  isSupport ? "border-l-bull bg-bull/5" : "border-l-bear bg-bear/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono font-semibold text-base">
                      ${level.price.toFixed(2)}
                    </div>
                    <div className="text-xs mt-0.5">
                      <span className={isSupport ? "text-bull" : "text-bear"}>
                        {isSupport ? "▲ Support" : "▼ Resistance"}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {level.distance_percent > 0 ? "+" : ""}
                        {level.distance_percent.toFixed(1)}% from price
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${color}`}>
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Score: {level.strength}/100
                    </div>
                    <Progress
                      value={level.strength}
                      className="h-1.5 w-20 mt-1"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-4">
            <div className="flex items-center gap-1 font-medium mb-1">
              <Info className="h-3 w-3" /> How to read this:
            </div>
            <div>• <strong>Strong (80+):</strong> High-confidence level, likely to hold</div>
            <div>• <strong>Moderate (50-79):</strong> Established level, watch for reaction</div>
            <div>• <strong>Weak (&lt;50):</strong> Minor level, may break easily</div>
            <div>• <strong>Distance %:</strong> How far price is from this level</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelsCard;
