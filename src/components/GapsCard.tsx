import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { GapData } from "@/types/analysis";

const GapsCard = ({ gaps }: { gaps: GapData[] }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Price Gaps</CardTitle>
          <Badge variant="secondary">{gaps.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {gaps.length === 0 ? (
          <div className="text-muted-foreground py-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span>No significant unfilled gaps detected</span>
            </div>
            <p className="text-xs ml-6">
              Searched for gaps &gt;1% in the analyzed period
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {gaps.slice(0, 5).map((gap, i) => {
              const isUp = gap.direction === "up";
              return (
                <div
                  key={i}
                  className={`border-l-4 pl-3 py-2 ${
                    isUp ? "border-l-bull bg-bull/5" : "border-l-bear bg-bear/5"
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium text-sm">
                    {isUp ? (
                      <TrendingUp className="h-4 w-4 text-bull" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-bear" />
                    )}
                    <span className={isUp ? "text-bull" : "text-bear"}>
                      Gap {isUp ? "Up" : "Down"}: {gap.size_percent.toFixed(1)}%
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {gap.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 ml-6">
                    Formed: {gap.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs mt-1 ml-6">
                    {gap.filled ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-success" />
                        <span className="text-success">Filled</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3 text-accent" />
                        <span className="text-accent">Unfilled — potential magnet</span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="text-xs text-muted-foreground border-t border-border pt-2 mt-4">
              <div className="flex items-center gap-1 font-medium mb-1">
                <Info className="h-3 w-3" /> How to read this:
              </div>
              <div>• <strong>Breakaway:</strong> Start of new trend (high significance)</div>
              <div>• <strong>Runaway:</strong> Trend continuation (momentum)</div>
              <div>• <strong>Exhaustion:</strong> End of trend (reversal signal)</div>
              <div>• <strong>Common:</strong> Normal volatility (often filled quickly)</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GapsCard;
