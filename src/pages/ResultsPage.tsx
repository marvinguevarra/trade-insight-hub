import { useParams, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Download, Share2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { mockResult } from "@/types/analysis";

const ResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const symbol = location.state?.symbol || "DEMO";
  const tier = location.state?.tier || "standard";
  const result = mockResult;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">{symbol}</h1>
            <Badge variant="outline" className="border-primary/30 text-primary text-[10px] uppercase">
              {tier}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {result.date_range.start} — {result.date_range.end}
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="mr-1 h-3 w-3" /> PDF
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Download className="mr-1 h-3 w-3" /> JSON
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Share2 className="mr-1 h-3 w-3" /> Share
            </Button>
          </div>
        </div>

        {/* Price banner */}
        <div className="mt-4 flex gap-6 text-sm">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Price</span>
            <p className="text-lg font-bold text-foreground">${result.current_price}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Timeframe</span>
            <p className="text-lg font-bold text-foreground">{result.timeframe}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Est. Cost</span>
            <p className="text-lg font-bold text-primary">$2.40</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="technical" className="mt-8">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="technical" className="text-xs uppercase tracking-wider">Technical</TabsTrigger>
            <TabsTrigger value="fundamental" className="text-xs uppercase tracking-wider">Fundamental</TabsTrigger>
            <TabsTrigger value="synthesis" className="text-xs uppercase tracking-wider">Synthesis</TabsTrigger>
          </TabsList>

          <TabsContent value="technical" className="mt-6 space-y-6">
            {/* Gaps */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xs uppercase tracking-widest">Price Gaps</CardTitle>
                  <Badge variant="secondary" className="text-[10px]">{result.gaps.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] uppercase">Date</TableHead>
                      <TableHead className="text-[10px] uppercase">Dir</TableHead>
                      <TableHead className="text-[10px] uppercase">Size</TableHead>
                      <TableHead className="text-[10px] uppercase">Type</TableHead>
                      <TableHead className="text-[10px] uppercase">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.gaps.map((g, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">{g.date}</TableCell>
                        <TableCell>{g.direction === "up" ? "⬆️" : "⬇️"}</TableCell>
                        <TableCell className={`text-xs ${g.direction === "up" ? "text-success" : "text-destructive"}`}>
                          {g.size_percent}%
                        </TableCell>
                        <TableCell className="text-xs">{g.type}</TableCell>
                        <TableCell>{g.filled ? "✅" : "❌"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* S/R Levels */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-xs uppercase tracking-widest">Key Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[10px] uppercase">Price</TableHead>
                      <TableHead className="text-[10px] uppercase">Type</TableHead>
                      <TableHead className="text-[10px] uppercase">Strength</TableHead>
                      <TableHead className="text-[10px] uppercase">Distance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.levels.map((l, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs font-bold">${l.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={l.type === "support" ? "default" : "destructive"} className="text-[10px]">
                            {l.type === "support" ? "🟢 Support" : "🔴 Resistance"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={l.strength} className="h-1 w-16" />
                            <span className="text-[10px] text-muted-foreground">{l.strength}</span>
                          </div>
                        </TableCell>
                        <TableCell className={`text-xs ${l.distance_percent < 0 ? "text-destructive" : "text-success"}`}>
                          {l.distance_percent > 0 ? "+" : ""}{l.distance_percent}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Zones */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xs uppercase tracking-widest">Supply/Demand Zones</CardTitle>
                  <Badge variant="secondary" className="text-[10px]">
                    {result.zones.filter((z) => z.fresh).length} fresh
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.zones.map((z, i) => (
                  <div key={i} className="flex items-center justify-between border border-border p-3">
                    <div className="flex items-center gap-3">
                      {z.fresh && <span>⭐</span>}
                      <Badge variant={z.type === "demand" ? "default" : "destructive"} className="text-[10px]">
                        {z.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-foreground">
                        ${z.range_low} — ${z.range_high}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-muted-foreground">{z.pattern}</span>
                      <div className="flex items-center gap-1">
                        <Progress value={z.strength} className="h-1 w-12" />
                        <span className="text-[10px] text-muted-foreground">{z.strength}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fundamental" className="mt-6">
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  Fundamental analysis will be available when connected to the backend.
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Includes: News summary, SEC filings, sentiment scoring
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="synthesis" className="mt-6">
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  AI synthesis (Bull/Bear cases) coming soon.
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Powered by multi-model reasoning with Claude
                </p>
              </CardContent>
            </Card>
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
