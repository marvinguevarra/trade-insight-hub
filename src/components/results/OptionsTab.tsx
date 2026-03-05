import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { useBullBearColors } from "@/hooks/useBullBearColors";
import type { OptionsAnalysis } from "@/types/analysis";

interface OptionsTabProps {
  options: OptionsAnalysis | null;
}

const OptionsTab = ({ options }: OptionsTabProps) => {
  const bb = useBullBearColors();

  if (!options || !options.sentiment) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-16 text-center">
          <p className="text-sm text-muted-foreground">No options data available for this tier.</p>
        </CardContent>
      </Card>
    );
  }

  const sentimentClasses = (() => {
    switch (options.sentiment) {
      case "bullish":
        return `${bb.bull} ${bb.bullBg} border-bull/30`;
      case "bearish":
        return `${bb.bear} ${bb.bearBg} border-bear/30`;
      default:
        return "text-yellow-300 bg-yellow-500/10 border-yellow-500/30";
    }
  })();

  const hasImpliedLevels =
    options?.implied_levels?.support ||
    options?.implied_levels?.resistance ||
    options?.implied_levels?.max_pain;

  const hasObservations = (options?.key_observations?.length ?? 0) > 0;

  const hasUnusualActivity =
    options?.unusual_activity &&
    options.unusual_activity !== "None detected" &&
    options.unusual_activity !== "None";

  const hasRiskFlags = (options?.risk_flags?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Sentiment Header */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
            Options Sentiment
          </h3>
          <Badge className={`border ${sentimentClasses} text-xs`}>
            {options.sentiment.toUpperCase()}
          </Badge>
          {options.sentiment_reasoning && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {options.sentiment_reasoning}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Implied Levels + Key Observations side-by-side */}
      <div className="grid gap-6 md:grid-cols-2">
        {hasImpliedLevels && (
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
                Implied Levels
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Level</TableHead>
                    <TableHead className="text-xs text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {options.implied_levels?.support && (
                    <TableRow>
                      <TableCell className={`text-xs font-medium ${bb.bull}`}>Support</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.support}</TableCell>
                    </TableRow>
                  )}
                  {options.implied_levels?.resistance && (
                    <TableRow>
                      <TableCell className={`text-xs font-medium ${bb.bear}`}>Resistance</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.resistance}</TableCell>
                    </TableRow>
                  )}
                  {options.implied_levels?.max_pain && (
                    <TableRow>
                      <TableCell className="text-xs font-medium text-muted-foreground">Max Pain</TableCell>
                      <TableCell className="text-xs text-right font-mono">{options.implied_levels.max_pain}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {hasObservations && (
          <Card className="border-border bg-card">
            <CardContent className="p-6 space-y-3">
              <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
                Key Observations
              </h3>
              <ul role="list" className="space-y-2">
                {options.key_observations.map((obs, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1 shrink-0" aria-hidden="true">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Positioning Summary */}
      {options.positioning_summary && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
              Positioning Summary
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {options.positioning_summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Unusual Activity */}
      {hasUnusualActivity && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
              Unusual Activity
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {options.unusual_activity}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Flags */}
      {hasRiskFlags && (
        <Card className="border-border bg-card">
          <CardContent className="p-6 space-y-3">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70">
              Risk Flags
            </h3>
            <div className="flex flex-wrap gap-2">
              {options.risk_flags.map((flag, i) => (
                <Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive bg-destructive/5">
                  <AlertTriangle className="h-3 w-3 mr-1" aria-hidden="true" />
                  {flag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OptionsTab;
