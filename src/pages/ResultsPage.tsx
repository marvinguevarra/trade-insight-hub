import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, ArrowLeft, TrendingUp, TrendingDown, Newspaper, Shield, Brain, AlertTriangle, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { FreshDot, TestedDot, FilledIcon, UnfilledIcon, DirectionBadge } from "@/components/StatusIndicator";
import { useBullBearColors } from "@/hooks/useBullBearColors";
import Navbar from "@/components/Navbar";

const verdictColors: Record<string, string> = {
  STRONG_BULL: "bg-bull/20 text-bull border-bull/30",
  MODERATE_BULL: "bg-bull/10 text-bull border-bull/20",
  NEUTRAL: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  MODERATE_BEAR: "bg-bear/10 text-bear border-bear/20",
  STRONG_BEAR: "bg-bear/20 text-bear border-bear/30",
};

// Pagination hook
function usePagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paged = items.slice(page * perPage, (page + 1) * perPage);
  return { paged, page, totalPages, setPage, hasMultiple: totalPages > 1 };
}

const PaginationControls = ({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) => (
  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border mt-3">
    <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)} className="h-7 w-7 p-0">
      <ChevronLeft className="h-3.5 w-3.5" />
    </Button>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setPage(i)}
        className={`h-7 w-7 text-[10px] font-mono transition-colors ${i === page ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"}`}
      >
        {i + 1}
      </button>
    ))}
    <Button variant="ghost" size="sm" disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} className="h-7 w-7 p-0">
      <ChevronRight className="h-3.5 w-3.5" />
    </Button>
  </div>
);

const ResultsPage = () => {
  const location = useLocation();
  const result = location.state?.result;
  const bb = useBullBearColors();

  // Pagination states
  const supportPag = usePagination(result?.technical?.support_resistance?.support_levels || [], 5);
  const resistPag = usePagination(result?.technical?.support_resistance?.resistance_levels || [], 5);
  const demandPag = usePagination(
    [...(result?.technical?.supply_demand?.demand_zones || [])].sort((a: any, b: any) => {
      const cp = result?.technical?.current_price || 0;
      return Math.abs(a.midpoint - cp) - Math.abs(b.midpoint - cp);
    }),
    3
  );
  const supplyPag = usePagination(
    [...(result?.technical?.supply_demand?.supply_zones || [])].sort((a: any, b: any) => {
      const cp = result?.technical?.current_price || 0;
      return Math.abs(a.midpoint - cp) - Math.abs(b.midpoint - cp);
    }),
    3
  );

  if (!result) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-muted-foreground">No analysis data found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/analyze">Run an Analysis</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { metadata, technical, news, fundamental, synthesis, cost_summary } = result;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Sticky Results Header */}
      <div className="sticky top-12 z-40 border-b border-border bg-gradient-to-r from-background to-card backdrop-blur-md shadow-lg">
        <div className="mx-auto max-w-6xl px-6 py-4">
          {/* Row 1: Symbol + metadata + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{metadata?.symbol || "—"}</h1>
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px] uppercase">
                {metadata?.tier || "standard"}
              </Badge>
              {metadata?.timeframe && (
                <span className="text-xs text-muted-foreground">{metadata.timeframe} &middot; {metadata.bars} bars</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs" aria-label="Download analysis as JSON" onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${metadata?.symbol || "analysis"}.json`; a.click();
              }}>
                <Download className="mr-1 h-3 w-3" aria-hidden="true" /> JSON
              </Button>
              <Button variant="outline" size="sm" className="text-xs" aria-label="Share analysis results">
                <Share2 className="mr-1 h-3 w-3" aria-hidden="true" /> Share
              </Button>
            </div>
          </div>

          {/* Row 2: Price + Verdict inline */}
          <div className="mt-3 flex flex-wrap items-end gap-8">
            {technical?.current_price && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Price</span>
                <p className="text-2xl font-bold text-foreground">${technical.current_price}</p>
              </div>
            )}
            {synthesis?.verdict && (
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Verdict</span>
                <p className={`mt-1 inline-block border px-2 py-0.5 text-xs font-bold ${verdictColors[synthesis.verdict] || "text-foreground"}`}>
                  {synthesis.verdict}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Tabs */}
        <Tabs defaultValue="technical" className="mt-0">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="technical" className="text-xs uppercase tracking-wider">Technical</TabsTrigger>
            <TabsTrigger value="news" className="text-xs uppercase tracking-wider">News</TabsTrigger>
            <TabsTrigger value="fundamental" className="text-xs uppercase tracking-wider">Fundamental</TabsTrigger>
            <TabsTrigger value="synthesis" className="text-xs uppercase tracking-wider">Synthesis</TabsTrigger>
          </TabsList>

          {/* === TECHNICAL === */}
          <TabsContent value="technical" className="mt-6 space-y-6">
            {/* Gaps */}
            {technical?.gaps && (
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xs uppercase tracking-widest">Price Gaps</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">
                      {technical.gaps.total} total &middot; {technical.gaps.unfilled} unfilled
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {technical.gaps.details?.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-[10px] uppercase">Date</TableHead>
                          <TableHead className="text-[10px] uppercase">Direction</TableHead>
                          <TableHead className="text-[10px] uppercase">Size</TableHead>
                          <TableHead className="text-[10px] uppercase">Type</TableHead>
                          <TableHead className="text-[10px] uppercase">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {technical.gaps.details.map((g: any, i: number) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs">{g.date || g.gap_date || "—"}</TableCell>
                            <TableCell>
                              <DirectionBadge direction={g.direction} />
                            </TableCell>
                            <TableCell className={`text-xs font-mono ${g.direction === "up" ? "text-bull" : "text-bear"}`}>
                              {g.size_percent?.toFixed(1) || g.gap_pct?.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-xs">{g.type || "—"}</TableCell>
                            <TableCell>{g.filled ? <FilledIcon /> : <UnfilledIcon />}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-xs text-muted-foreground">No gaps detected with current threshold.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* S/R Levels - equal height grid */}
            {technical?.support_resistance && (
              <div className="grid gap-6 md:grid-cols-2 items-stretch">
                {/* Support */}
                <Card className="border-border bg-card flex flex-col">
                  <CardHeader>
                    <CardTitle className={`text-xs uppercase tracking-widest ${bb.bull}`}>Support Levels</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      {supportPag.paged.map((level: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between border border-border p-2 border-l-4 ${bb.bullBorder}/40`}>
                          <span className="text-sm font-bold text-foreground font-mono">${typeof level === "number" ? level.toFixed(2) : level.price?.toFixed(2) || level}</span>
                          {level.strength != null && (
                            <div className="flex items-center gap-2">
                              <Progress value={level.strength} className="h-1 w-12" />
                              <span className="text-[10px] text-muted-foreground">{level.strength}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!technical.support_resistance.support_levels?.length) && (
                        <p className="text-xs text-muted-foreground">No support levels found.</p>
                      )}
                    </div>
                    {supportPag.hasMultiple && (
                      <PaginationControls page={supportPag.page} totalPages={supportPag.totalPages} setPage={supportPag.setPage} />
                    )}
                  </CardContent>
                </Card>

                {/* Resistance */}
                <Card className="border-border bg-card flex flex-col">
                  <CardHeader>
                    <CardTitle className={`text-xs uppercase tracking-widest ${bb.bear}`}>Resistance Levels</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      {resistPag.paged.map((level: any, i: number) => (
                        <div key={i} className={`flex items-center justify-between border border-border p-2 border-l-4 ${bb.bearBorder}/40`}>
                          <span className="text-sm font-bold text-foreground font-mono">${typeof level === "number" ? level.toFixed(2) : level.price?.toFixed(2) || level}</span>
                          {level.strength != null && (
                            <div className="flex items-center gap-2">
                              <Progress value={level.strength} className="h-1 w-12" />
                              <span className="text-[10px] text-muted-foreground">{level.strength}</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {(!technical.support_resistance.resistance_levels?.length) && (
                        <p className="text-xs text-muted-foreground">No resistance levels found.</p>
                      )}
                    </div>
                    {resistPag.hasMultiple && (
                      <PaginationControls page={resistPag.page} totalPages={resistPag.totalPages} setPage={resistPag.setPage} />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Supply/Demand Zones - equal height grid */}
            {technical?.supply_demand && (
              <div className="grid gap-6 md:grid-cols-2 items-stretch">
                {/* Demand Zones */}
                <Card className="border-bull/20 bg-card flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${bb.bullIcon}`} />
                        <CardTitle className={`text-xs uppercase tracking-widest ${bb.bull}`}>Demand Zones</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {(technical.supply_demand.demand_zones || []).filter((z: any) => z.fresh).length} fresh
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Potential Buy Areas</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      {demandPag.paged.map((zone: any, i: number) => {
                        const currentPrice = technical.current_price || 0;
                        const distPct = currentPrice ? (((zone.midpoint - currentPrice) / currentPrice) * 100) : 0;
                        return (
                          <div key={i} className={`border p-3 transition-colors border-l-4 border-l-bull ${zone.fresh ? "border-bull/30 bg-bull/5" : "border-border bg-secondary/30"}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold font-mono text-foreground">
                                ${zone.price_low?.toFixed(2) ?? zone.range_low?.toFixed(2)} – ${zone.price_high?.toFixed(2) ?? zone.range_high?.toFixed(2)}
                              </span>
                              {zone.fresh ? <FreshDot /> : <TestedDot />}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>Mid: ${zone.midpoint?.toFixed(2)}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{zone.pattern}</Badge>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className="text-muted-foreground">Strength: <span className="text-foreground font-bold">{zone.strength}/10</span></span>
                              <span className={distPct >= 0 ? "text-bull" : "text-bear"}>
                                {distPct >= 0 ? "+" : ""}{distPct.toFixed(1)}% away
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {(!technical.supply_demand.demand_zones?.length) && (
                        <p className="text-xs text-muted-foreground">No significant demand zones detected.</p>
                      )}
                    </div>
                    {demandPag.hasMultiple && (
                      <PaginationControls page={demandPag.page} totalPages={demandPag.totalPages} setPage={demandPag.setPage} />
                    )}
                  </CardContent>
                </Card>

                {/* Supply Zones */}
                <Card className="border-bear/20 bg-card flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingDown className={`h-4 w-4 ${bb.bearIcon}`} />
                        <CardTitle className={`text-xs uppercase tracking-widest ${bb.bear}`}>Supply Zones</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {(technical.supply_demand.supply_zones || []).filter((z: any) => z.fresh).length} fresh
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Potential Sell Areas</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 flex-1">
                      {supplyPag.paged.map((zone: any, i: number) => {
                        const currentPrice = technical.current_price || 0;
                        const distPct = currentPrice ? (((zone.midpoint - currentPrice) / currentPrice) * 100) : 0;
                        return (
                          <div key={i} className={`border p-3 transition-colors border-l-4 border-l-bear ${zone.fresh ? "border-bear/30 bg-bear/5" : "border-border bg-secondary/30"}`}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold font-mono text-foreground">
                                ${zone.price_low?.toFixed(2) ?? zone.range_low?.toFixed(2)} – ${zone.price_high?.toFixed(2) ?? zone.range_high?.toFixed(2)}
                              </span>
                              {zone.fresh ? <FreshDot /> : <TestedDot />}
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>Mid: ${zone.midpoint?.toFixed(2)}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">{zone.pattern}</Badge>
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[10px]">
                              <span className="text-muted-foreground">Strength: <span className="text-foreground font-bold">{zone.strength}/10</span></span>
                              <span className={distPct >= 0 ? "text-bull" : "text-bear"}>
                                {distPct >= 0 ? "+" : ""}{distPct.toFixed(1)}% away
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {(!technical.supply_demand.supply_zones?.length) && (
                        <p className="text-xs text-muted-foreground">No significant supply zones detected.</p>
                      )}
                    </div>
                    {supplyPag.hasMultiple && (
                      <PaginationControls page={supplyPag.page} totalPages={supplyPag.totalPages} setPage={supplyPag.setPage} />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* === NEWS === */}
          <TabsContent value="news" className="mt-6 space-y-6">
            {news ? (
              <>
                {news.sentiment_score != null && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-xs uppercase tracking-widest">Sentiment Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold text-foreground">{news.sentiment_score}</span>
                        <span className="text-xs text-muted-foreground">/ 10</span>
                        <Progress value={news.sentiment_score * 10} className="h-2 flex-1" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {news.headlines?.length > 0 && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Newspaper className="h-4 w-4 text-primary" />
                        <CardTitle className="text-xs uppercase tracking-widest">Headlines</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {news.headlines.map((h: any, i: number) => (
                        <div key={i} className="border border-border p-3 text-xs text-foreground">
                          {typeof h === "string" ? h : h.title || h.headline || JSON.stringify(h)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {news.catalysts?.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader><CardTitle className="text-xs uppercase tracking-widest">Catalysts</CardTitle></CardHeader>
                      <CardContent className="space-y-1">
                        {news.catalysts.map((c: string, i: number) => (
                          <p key={i} className="text-xs text-foreground flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {c}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  {news.themes?.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader><CardTitle className="text-xs uppercase tracking-widest">Themes</CardTitle></CardHeader>
                      <CardContent className="flex flex-wrap gap-2">
                        {news.themes.map((t: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">{t}</Badge>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">No news data available for this tier.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* === FUNDAMENTAL === */}
          <TabsContent value="fundamental" className="mt-6 space-y-6">
            {fundamental ? (
              <>
                {fundamental.financial_health && (
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <CardTitle className="text-xs uppercase tracking-widest">Financial Health</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                        {typeof fundamental.financial_health === "string"
                          ? fundamental.financial_health
                          : JSON.stringify(fundamental.financial_health, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  {fundamental.key_risks?.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-bear">Key Risks</CardTitle></CardHeader>
                      <CardContent className="space-y-1">
                        {fundamental.key_risks.map((r: string, i: number) => (
                          <p key={i} className="text-xs text-foreground flex items-start gap-2">
                            <AlertTriangle className="h-3 w-3 text-bear shrink-0 mt-0.5" />
                            {r}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                  {fundamental.opportunities?.length > 0 && (
                    <Card className="border-border bg-card">
                      <CardHeader><CardTitle className="text-xs uppercase tracking-widest text-bull">Opportunities</CardTitle></CardHeader>
                      <CardContent className="space-y-1">
                        {fundamental.opportunities.map((o: string, i: number) => (
                          <p key={i} className="text-xs text-foreground flex items-start gap-2">
                            <Sparkles className="h-3 w-3 text-bull shrink-0 mt-0.5" />
                            {o}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">No fundamental data available for this tier.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* === SYNTHESIS === */}
          <TabsContent value="synthesis" className="mt-6 space-y-6">
            {synthesis ? (
              <>
                {/* AI Reasoning — top, prominent */}
                {synthesis.reasoning && (
                  <Card className="border-l-4 border-l-primary bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xs uppercase tracking-widest text-primary">AI Reasoning &amp; Verdict</CardTitle>
                        </div>
                        {synthesis.verdict && (
                          <span className={`inline-block border px-2 py-0.5 text-xs font-bold ${verdictColors[synthesis.verdict] || "text-foreground"}`}>
                            {synthesis.verdict}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {synthesis.reasoning}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Bull vs Bear — side by side below */}
                <div className="grid gap-6 md:grid-cols-2">
                  {synthesis.bull_case && (
                    <Card className={`border-l-4 ${bb.bullBorder} bg-card`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`h-4 w-4 ${bb.bullIcon}`} />
                          <CardTitle className={`text-xs uppercase tracking-widest ${bb.bull}`}>Bull Case</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {typeof synthesis.bull_case === "object" && synthesis.bull_case.factors && (
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 mb-2">Factors</h4>
                            <ul className="space-y-1.5" role="list">
                              {synthesis.bull_case.factors.map((f: string, i: number) => (
                                <li key={i} className="flex gap-2 text-xs leading-relaxed text-foreground">
                                  <span className={`${bb.bull} mt-0.5 shrink-0`} aria-hidden="true">&#9650;</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {typeof synthesis.bull_case === "object" && synthesis.bull_case.evidence && (
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 mb-2">Evidence</h4>
                            <ul className="space-y-1.5" role="list">
                              {synthesis.bull_case.evidence.map((e: string, i: number) => (
                                <li key={i} className="flex gap-2 text-xs leading-[1.6] text-foreground/85">
                                  <span className={`${bb.bull} mt-0.5 shrink-0`} aria-hidden="true">&#9650;</span>
                                  <span>{e}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {typeof synthesis.bull_case === "string" && (
                          <p className="text-xs text-foreground whitespace-pre-wrap">{synthesis.bull_case}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {synthesis.bear_case && (
                    <Card className={`border-l-4 ${bb.bearBorder} bg-card`}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <TrendingDown className={`h-4 w-4 ${bb.bearIcon}`} />
                          <CardTitle className={`text-xs uppercase tracking-widest ${bb.bear}`}>Bear Case</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {typeof synthesis.bear_case === "object" && synthesis.bear_case.factors && (
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 mb-2">Factors</h4>
                            <ul className="space-y-1.5" role="list">
                              {synthesis.bear_case.factors.map((f: string, i: number) => (
                                <li key={i} className="flex gap-2 text-xs leading-relaxed text-foreground">
                                  <span className={`${bb.bear} mt-0.5 shrink-0`} aria-hidden="true">&#9660;</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {typeof synthesis.bear_case === "object" && synthesis.bear_case.evidence && (
                          <div>
                            <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground/70 mb-2">Evidence</h4>
                            <ul className="space-y-1.5" role="list">
                              {synthesis.bear_case.evidence.map((e: string, i: number) => (
                                <li key={i} className="flex gap-2 text-xs leading-[1.6] text-foreground/85">
                                  <span className={`${bb.bear} mt-0.5 shrink-0`} aria-hidden="true">&#9660;</span>
                                  <span>{e}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {typeof synthesis.bear_case === "string" && (
                          <p className="text-xs text-foreground whitespace-pre-wrap">{synthesis.bear_case}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">No synthesis available for this tier.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/analyze">
              <ArrowLeft className="mr-2 h-4 w-4" /> Run New Analysis
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
