import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Brain, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const features = [
  {
    icon: BarChart3,
    title: "Technical Analysis",
    description: "Gaps, support/resistance levels, supply/demand zones — all detected automatically from your chart data.",
  },
  {
    icon: FileText,
    title: "Fundamental Analysis",
    description: "News sentiment, SEC filings, earnings data — aggregated and summarized by AI.",
  },
  {
    icon: Brain,
    title: "AI Synthesis",
    description: "Multi-model reasoning using Haiku, Sonnet, and Opus for comprehensive bull/bear analysis.",
  },
];

const tiers = [
  {
    name: "Lite",
    price: "~$0.01",
    description: "Quick technical + news",
    features: ["Gap detection", "S/R levels", "News summary"],
  },
  {
    name: "Standard",
    price: "~$0.28",
    description: "Full analysis with SEC filings",
    features: ["Everything in Lite", "SEC filings analysis", "Sentiment scoring", "Supply/demand zones"],
    popular: true,
  },
  {
    name: "Premium",
    price: "~$0.45",
    description: "Deep reasoning with extended thinking",
    features: ["Everything in Standard", "Opus deep reasoning", "Extended thinking", "Bull/bear synthesis"],
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-24 pb-16 text-center">
        <Badge variant="outline" className="mb-6 border-primary/30 text-primary">
          ALPHA v0.1
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          AI-Powered Trading Analysis
        </h1>
        <p className="mt-4 max-w-xl text-base text-muted-foreground">
          Evidence-based technical &amp; fundamental analysis using Claude AI.
          Upload your chart, get institutional-grade insights.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/analyze">
            Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Analysis Modules
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-border bg-card">
              <CardHeader>
                <f.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-sm uppercase tracking-wider">
                  {f.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="mb-8 text-center text-xs uppercase tracking-widest text-muted-foreground">
          Pricing
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`border-border bg-card ${tier.popular ? "ring-1 ring-primary" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm uppercase tracking-wider">
                    {tier.name}
                  </CardTitle>
                  {tier.popular && (
                    <Badge className="bg-primary text-primary-foreground text-[10px]">
                      POPULAR
                    </Badge>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{tier.price}</p>
                <p className="text-xs text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="h-1 w-1 bg-primary" />
                      {feat}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex justify-center px-6 py-16">
        <Button asChild size="lg">
          <Link to="/analyze">
            Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
};

export default Landing;
