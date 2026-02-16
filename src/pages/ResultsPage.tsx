import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, ArrowLeft, TrendingUp, TrendingDown, Newspaper, Shield, Brain, AlertTriangle, Sparkles, ChevronLeft, ChevronRight, Info, FileText, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FreshDot, TestedDot, FilledIcon, UnfilledIcon, DirectionBadge } from "@/components/StatusIndicator";
import { useBullBearColors } from "@/hooks/useBullBearColors";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import jsPDF from "jspdf";

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
  const isHistorical = location.state?.isHistorical || false;
  const analysisDate = location.state?.analysisDate;
  const bb = useBullBearColors();
  const { toast } = useToast();

  const handleShare = async () => {
    const symbol = result?.metadata?.symbol || "Analysis";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${symbol} Stock Analysis`,
          text: `Check out this AI analysis for ${symbol}`,
          url: window.location.href,
        });
        return;
      } catch (err: any) {
        if (err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied!", description: "Share link copied to clipboard" });
    } catch {
      toast({ variant: "destructive", title: "Share Failed", description: "Unable to copy link" });
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const symbol = metadata?.symbol || "UNKNOWN";
    let y = 20;

    doc.setFontSize(20);
    doc.text(`${symbol} Stock Analysis`, 20, y);
    y += 12;
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
    y += 7;
    doc.text(`Tier: ${metadata?.tier || "standard"}`, 20, y);
    y += 7;
    if (technical?.current_price) {
      doc.text(`Price: $${technical.current_price}`, 20, y);
      y += 7;
    }
    if (synthesis?.verdict) {
      doc.text(`Verdict: ${synthesis.verdict}`, 20, y);
      y += 12;
    }

    // Technical summary
    if (technical?.support_resistance) {
      doc.setFontSize(14);
      doc.text("Support / Resistance", 20, y);
      y += 8;
      doc.setFontSize(10);
      const sLevels = (technical.support_resistance.support_levels || []).slice(0, 5);
      const rLevels = (technical.support_resistance.resistance_levels || []).slice(0, 5);
      if (sLevels.length) {
        doc.text(`Support: ${sLevels.map((l: any) => "$" + (typeof l === "number" ? l.toFixed(2) : l.price?.toFixed(2))).join(", ")}`, 20, y);
        y += 6;
      }
      if (rLevels.length) {
        doc.text(`Resistance: ${rLevels.map((l: any) => "$" + (typeof l === "number" ? l.toFixed(2) : l.price?.toFixed(2))).join(", ")}`, 20, y);
        y += 10;
      }
    }

    // News headlines
    if (news?.headlines?.length) {
      doc.setFontSize(14);
      doc.text("Recent News", 20, y);
      y += 8;
      doc.setFontSize(10);
      news.headlines.slice(0, 10).forEach((h: any) => {
        const title = typeof h === "string" ? h : h.title || h.headline || "";
        const lines = doc.splitTextToSize(title, 170);
        if (y + lines.length * 5 > 280) { doc.addPage(); y = 20; }
        doc.text(lines, 20, y);
        y += lines.length * 5 + 3;
      });
      y += 5;
    }

    // Synthesis reasoning
    if (synthesis?.reasoning) {
      if (y > 240) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.text("AI Synthesis", 20, y);
      y += 8;
      doc.setFontSize(10);
      const rLines = doc.splitTextToSize(synthesis.reasoning, 170);
      rLines.forEach((line: string) => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(line, 20, y);
        y += 5;
      });
    }

    doc.save(`${symbol}_analysis_${Date.now()}.pdf`);
    toast({ title: "PDF Downloaded", description: `${symbol} analysis report saved` });
  };

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
              <Button variant="outline" size="sm" className="text-xs" aria-label="Download analysis as PDF" onClick={handleDownloadPDF}>
                <FileText className="mr-1 h-3 w-3" aria-hidden="true" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="text-xs" aria-label="Download analysis as JSON" onClick={() => {
                const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${metadata?.symbol || "analysis"}.json`; a.click();
              }}>
                <Download className="mr-1 h-3 w-3" aria-hidden="true" /> JSON
              </Button>
              <Button variant="outline" size="sm" className="text-xs" aria-label="Share analysis results" onClick={handleShare}>
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
        {isHistorical && analysisDate && (
          <Alert className="mb-6 border-primary/30 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-xs text-foreground">
              Historical report from {new Date(analysisDate).toLocaleString()}
            </AlertDescription>
          </Alert>
        )}
        {/* Tabs */}
        <Tabs defaultValue="technical" className="mt-0">
          <TabsList className="bg-card border border-border w-full md:w-auto overflow-x-auto">
            <TabsTrigger value="technical" className="text-xs uppercase tracking-wider whitespace-nowrap">Technical</TabsTrigger>
            <TabsTrigger value="news" className="text-xs uppercase tracking-wider whitespace-nowrap">News</TabsTrigger>
            <TabsTrigger value="fundamental" className="text-xs uppercase tracking-wider whitespace-nowrap">Fundamental</TabsTrigger>
            <TabsTrigger value="synthesis" className="text-xs uppercase tracking-wider whitespace-nowrap">Synthesis</TabsTrigger>
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
                    <div className="text-muted-foreground py-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-success">✓</span>
                        <span className="text-xs">No significant unfilled gaps detected</span>
                      </div>
                      <p className="text-[10px] ml-5">Searched for gaps &gt;1% in the analyzed period</p>
                    </div>
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
                      {supportPag.paged.map((level: any, i: number) => {
                        const price = typeof level === "number" ? level : level.price;
                        const strength = level.strength;
                        const strengthLabel = strength >= 80 ? "Strong" : strength >= 50 ? "Moderate" : strength != null ? "Weak" : null;
                        const strengthColor = strength >= 80 ? "text-success" : strength >= 50 ? "text-accent" : "text-muted-foreground";
                        const dist = level.distance_percent;
                        return (
                          <div key={i} className={`border border-border p-2 border-l-4 ${bb.bullBorder}/40`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-bold text-foreground font-mono">${price?.toFixed(2) || level}</span>
                                {dist != null && (
                                  <span className="text-[10px] text-muted-foreground ml-2">
                                    {dist > 0 ? "+" : ""}{dist.toFixed(1)}% away
                                  </span>
                                )}
                              </div>
                              {strength != null && (
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-medium ${strengthColor}`}>{strengthLabel}</span>
                                    <span className="text-[10px] text-muted-foreground">{strength}</span>
                                  </div>
                                  <Progress value={strength} className="h-1 w-16 mt-0.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
                      {resistPag.paged.map((level: any, i: number) => {
                        const price = typeof level === "number" ? level : level.price;
                        const strength = level.strength;
                        const strengthLabel = strength >= 80 ? "Strong" : strength >= 50 ? "Moderate" : strength != null ? "Weak" : null;
                        const strengthColor = strength >= 80 ? "text-success" : strength >= 50 ? "text-accent" : "text-muted-foreground";
                        const dist = level.distance_percent;
                        return (
                          <div key={i} className={`border border-border p-2 border-l-4 ${bb.bearBorder}/40`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm font-bold text-foreground font-mono">${price?.toFixed(2) || level}</span>
                                {dist != null && (
                                  <span className="text-[10px] text-muted-foreground ml-2">
                                    {dist > 0 ? "+" : ""}{dist.toFixed(1)}% away
                                  </span>
                                )}
                              </div>
                              {strength != null && (
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-medium ${strengthColor}`}>{strengthLabel}</span>
                                    <span className="text-[10px] text-muted-foreground">{strength}</span>
                                  </div>
                                  <Progress value={strength} className="h-1 w-16 mt-0.5" />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {(!technical.support_resistance.resistance_levels?.length) && (
                        <p className="text-xs text-muted-foreground">No resistance levels found.</p>
                      )}
                    </div>
                    {resistPag.hasMultiple && (
                      <PaginationControls page={resistPag.page} totalPages={resistPag.totalPages} setPage={resistPag.setPage} />
                    )}
                  </CardContent>
                </Card>

                {/* S/R Legend */}
                <div className="md:col-span-2 text-[10px] text-muted-foreground border-t border-border pt-2">
                  <span className="font-medium">Legend:</span>{" "}
                  <span className="text-success">Strong (80+)</span> likely to hold • {" "}
                  <span className="text-accent">Moderate (50-79)</span> watch for reaction • {" "}
                  Weak (&lt;50) may break easily
                </div>
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
                      {news.headlines.map((h: any, i: number) => {
                        const title = typeof h === "string" ? h : h.title || h.headline || JSON.stringify(h);
                        const url = typeof h === "object" ? h.url || h.link : null;
                        const source = typeof h === "object" ? h.source || h.publisher : null;
                        const publishedAt = typeof h === "object" ? h.publishedAt || h.published_at || h.date : null;
                        return (
                          <div key={i} className="border border-border p-3 space-y-1">
                            {url ? (
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start justify-between gap-2 text-xs font-medium text-primary hover:underline"
                              >
                                <span>{title}</span>
                                <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 opacity-50 group-hover:opacity-100" />
                              </a>
                            ) : (
                              <p className="text-xs font-medium text-foreground">{title}</p>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              {source && (
                                <span className="bg-secondary px-1.5 py-0.5 font-medium">{source}</span>
                              )}
                              {publishedAt && <span>{publishedAt}</span>}
                              {url && !source && (
                                <span className="bg-secondary px-1.5 py-0.5 font-medium truncate max-w-[200px]">
                                  {new URL(url).hostname.replace("www.", "")}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
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
                      {(() => {
                        const fh = fundamental.financial_health;
                        if (typeof fh === "string") return <p className="text-sm text-foreground">{fh}</p>;
                        const entries: [string, string][] = Object.entries(fh as Record<string, string>);
                        const gradeEntry = entries.find(([k]) => k.includes("grade"));
                        const otherEntries = entries.filter(([k]) => !k.includes("grade"));

                        const getIndicatorColor = (val: string) => {
                          const v = val.toLowerCase();
                          if (["strong", "growing", "expanding", "a", "a+", "b+", "b"].includes(v)) return "text-success";
                          if (["moderate", "stable", "average", "c+", "c"].includes(v)) return "text-accent";
                          if (["weak", "declining", "contracting", "high", "d", "f"].includes(v)) return "text-destructive";
                          return "text-foreground";
                        };

                        const formatKey = (k: string) =>
                          k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

                        return (
                          <div className="space-y-3">
                            {gradeEntry && (
                              <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
                                <span className="text-sm text-muted-foreground">{formatKey(gradeEntry[0])}</span>
                                <span className={`text-2xl font-bold font-mono ${getIndicatorColor(gradeEntry[1])}`}>
                                  {gradeEntry[1]}
                                </span>
                              </div>
                            )}
                            <div className="grid gap-2">
                              {otherEntries.map(([key, val]) => (
                                <div key={key} className="flex items-center justify-between py-1">
                                  <span className="text-xs text-muted-foreground">{formatKey(key)}</span>
                                  <span className={`text-sm font-medium font-mono ${getIndicatorColor(val)}`}>
                                    {val}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
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
