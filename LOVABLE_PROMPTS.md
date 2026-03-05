# Lovable Prompts — Frontend Module Build-Out

These prompts are designed to be fed into Lovable one at a time, in order.
Each prompt is self-contained and references existing codebase patterns.

**Backend API:** `https://trading-analyzer-production-7513.up.railway.app`
**Existing stack:** React 18 + TypeScript + Vite + shadcn/ui + Tailwind + react-router v6

### Important codebase patterns (applies to ALL prompts)

- **Null handling:** Every tab component accepts `PropType | null` and returns an empty state if null. Pattern:
  ```tsx
  if (!data) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-16 text-center">
          <p className="text-sm text-muted-foreground">No data available for this tier.</p>
        </CardContent>
      </Card>
    );
  }
  ```
- **Bull/bear colors:** Import and use the `useBullBearColors()` hook from `src/hooks/useBullBearColors.ts`. It returns: `bull`, `bear`, `bullBg`, `bearBg`, `bullBorder`, `bearBorder`, `bullIcon`, `bearIcon` (all Tailwind class strings like `"text-bull"`, `"bg-bull/5"`).
- **Polymorphic types:** Some backend fields can be a string OR an object (e.g., `financial_health`, `bull_case`). Always check `typeof x === "object"` before accessing nested fields, and render the string value as a fallback.
- **Multi-field fallbacks:** The backend sometimes returns different field names across versions. The codebase uses patterns like `h.title || h.headline` and `size_percent || size_pct || gap_pct`. When accessing backend fields, use similar fallbacks.
- **Tabs are hardcoded** in `ResultsPage.tsx` — they are not dynamically generated. Adding a new tab requires adding both a `TabsTrigger` and `TabsContent` entry manually.
- **Typography:** Section headers use `text-[10px] font-semibold uppercase tracking-widest text-foreground/70`. Card titles use `text-xs uppercase tracking-widest`.
- **Spacing:** Use `space-y-6` for vertical card stacks. Use `grid gap-6 md:grid-cols-2` for side-by-side layouts on desktop that stack on mobile.
- **Accessibility:** Add `aria-hidden="true"` on decorative icons. Add `role="list"` on `<ul>` elements. Keyboard navigation is handled by Radix primitives.
- **Historical data:** Older analysis records stored in Supabase won't have newer fields (e.g., `options`, ETF fields). All new rendering must use optional chaining (`?.`) and guard with truthiness checks so old records don't crash.

---

## Prompt 1: Options Flow Analysis Tab

Add a new "Options" tab to the results page between Fundamental and Synthesis.

The backend returns an `options` object in the analysis response with this shape:

```json
{
  "sentiment": "bullish | bearish | neutral",
  "sentiment_reasoning": "string",
  "key_observations": ["string", "string"],
  "positioning_summary": "string",
  "implied_levels": {
    "support": "string",
    "resistance": "string",
    "max_pain": "string"
  },
  "unusual_activity": "string",
  "risk_flags": ["string", "string"],
  "cost": 0.001,
  "input_tokens": 500,
  "output_tokens": 300
}
```

### Type changes (`src/types/analysis.ts`)

1. Add an `OptionsAnalysis` type with all the fields above.
2. Add `options?: OptionsAnalysis` to the `AnalysisResponse` type. It's optional because older records won't have it and the lite tier may not include it.

### Component: `src/components/results/OptionsTab.tsx`

Create this new component. It should:

- Accept `options: OptionsAnalysis | null` as its prop.
- If `options` is null or `options.sentiment` is falsy, render the standard empty state Card (see pattern above) with message: "No options data available for this tier."
- Use `useBullBearColors()` for sentiment coloring:
  - Bullish → `bb.bull` text, `bb.bullBg` background
  - Bearish → `bb.bear` text, `bb.bearBg` background
  - Neutral → `text-yellow-300 bg-yellow-500/10`
- Display these sections in order:
  1. **Sentiment badge** at the top: `<Badge className={sentimentColorClasses}>{options.sentiment.toUpperCase()}</Badge>` with `sentiment_reasoning` as a paragraph below it.
  2. **"Implied Levels" card** with a small table (3 rows: support, resistance, max pain). Use optional chaining: `options?.implied_levels?.support`. If `implied_levels` is missing, hide this card.
  3. **"Key Observations" card** with a bulleted list. Only render if `options?.key_observations?.length > 0`.
  4. **"Positioning Summary"** as a paragraph in a card.
  5. **"Unusual Activity" card** — only render if value is truthy and NOT "None detected" or "None".
  6. **"Risk Flags"** as a list of warning-styled badges. Only render if `options?.risk_flags?.length > 0`.
- Use `grid gap-6 md:grid-cols-2` for the "Implied Levels" and "Key Observations" cards side-by-side on desktop, stacking on mobile.

### ResultsPage.tsx changes

- Add the Options tab between Fundamental and Synthesis. Final tab order: Technical, News, Fundamental, **Options**, Synthesis.
- The `TabsTrigger` for Options should only appear when `result.options?.sentiment` is truthy:
  ```tsx
  {result.options?.sentiment && (
    <TabsTrigger value="options" className="text-xs uppercase tracking-wider whitespace-nowrap">Options</TabsTrigger>
  )}
  ```
- The `TabsContent` should pass the data down:
  ```tsx
  <TabsContent value="options" className="mt-6">
    <OptionsTab options={result.options || null} />
  </TabsContent>
  ```

### AnalysisContainer.tsx change

Add a loading step for options. Insert between "GATHERING NEWS & SENTIMENT..." and "ANALYZING SEC FILINGS...":

```ts
{ label: "SCANNING OPTIONS FLOW...", duration: 3000 },
```

This makes the loading steps: Fetching data → Technical → News → **Options** → SEC Filings → AI Insights.

Follow the existing patterns: shadcn Card, Badge, Table components. Terminal/monospace aesthetic (JetBrains Mono, sharp corners). Semantic color variables `text-bull` / `text-bear`.

---

## Prompt 2: ETF Fundamental Display

The Fundamental tab currently only handles stock data (the `financial_health` shape from SEC filings). The backend now also returns ETF analysis with a **different shape** when the symbol is an ETF (like SPY, QQQ, VTI). The backend auto-detects ETF symbols and routes them to a different agent that uses Yahoo Finance fund data instead of SEC filings. Update the Fundamental tab to handle both shapes.

**How to detect ETF vs stock:** The Fundamental tab receives the same `fundamental` prop for both. An ETF response has a `fund_quality` object. A stock response has `financial_health`. Check: `if ('fund_quality' in fundamental)` → ETF path, otherwise → existing stock path.

**CRITICAL: Do not break the existing stock rendering.** The stock path must remain completely unchanged. Add the ETF branch as a separate conditional block.

### ETF response shape

```json
{
  "fund_quality": {
    "expense_assessment": "low | moderate | high | very_high",
    "diversification": "well_diversified | moderately_concentrated | highly_concentrated",
    "size_assessment": "large | mid | small | micro",
    "overall_grade": "A | B | C | D | F"
  },
  "concentration_risk": "string",
  "sector_analysis": "string",
  "key_strengths": ["string"],
  "key_risks": ["string"],
  "competitive_position": "string",
  "suitability": "string",
  "etf_info": {
    "name": "string",
    "category": "string",
    "fund_family": "string",
    "expense_ratio": 0.0945,
    "total_assets": 500000000000,
    "holdings_count": 503,
    "sector_count": 11
  },
  "cost": 0.001,
  "input_tokens": 500,
  "output_tokens": 300
}
```

### Type changes (`src/types/analysis.ts`)

Add these new types:

```ts
export interface ETFFundQuality {
  expense_assessment: string;
  diversification: string;
  size_assessment: string;
  overall_grade: string;
}

export interface ETFInfo {
  name: string;
  category: string;
  fund_family: string;
  expense_ratio: number | null;
  total_assets: number | null;
  holdings_count: number;
  sector_count: number;
}
```

Add optional ETF fields to the existing `FundamentalAnalysis` type:

```ts
fund_quality?: ETFFundQuality;
etf_info?: ETFInfo;
concentration_risk?: string;
sector_analysis?: string;
competitive_position?: string;
suitability?: string;
```

### FundamentalTab.tsx ETF rendering

When `fund_quality` is detected, render:

1. **ETF Header card** — Show `etf_info.name`, `etf_info.category`, and `etf_info.fund_family`. If any is missing or "Unknown", skip that field.
2. **Grade badge** — Show `fund_quality.overall_grade` as a large badge. Color mapping: A = green (`text-bull bg-bull/10`), B = blue (`text-blue-400 bg-blue-400/10`), C = yellow (`text-yellow-300 bg-yellow-500/10`), D = orange (`text-orange-400 bg-orange-400/10`), F = red (`text-bear bg-bear/10`).
3. **Metrics table** showing:
   - Expense Assessment: `fund_quality.expense_assessment` (title case)
   - Diversification: `fund_quality.diversification` (replace underscores with spaces, title case)
   - Size Assessment: `fund_quality.size_assessment` (title case)
   - Expense Ratio: format `etf_info.expense_ratio` as percentage (e.g., `0.0945` → "9.45%", `0.0003` → "0.03%"). Show "N/A" if null.
   - Total Assets: format `etf_info.total_assets` as currency abbreviation. Use: `>= 1e12 → "$X.XT"`, `>= 1e9 → "$X.XB"`, `>= 1e6 → "$X.XM"`. Show "N/A" if null.
   - Holdings Count: `etf_info.holdings_count`
   - Sector Count: `etf_info.sector_count`
4. **"Concentration Risk"** paragraph card — only if truthy.
5. **"Sector Analysis"** paragraph card — only if truthy.
6. **"Key Strengths"** as a bulleted list with green tint (`text-bull`) — only if array is non-empty.
7. **"Key Risks"** as a bulleted list with red tint (`text-bear`) — only if array is non-empty.
8. **"Competitive Position"** paragraph card — only if truthy.
9. **"Suitability"** paragraph card — only if truthy.

**Edge cases:**
- `etf_info.expense_ratio` and `etf_info.total_assets` can be `null` when Yahoo Finance doesn't have the data. Show "N/A".
- Old stock analyses won't have `fund_quality`. The existing stock path must remain the default.
- Use optional chaining everywhere: `fundamental?.fund_quality?.overall_grade`.

Use the same Card/Badge patterns as existing components. Use the terminal aesthetic.

---

## Prompt 3: Complete the Synthesis Tab

The Synthesis tab (`SynthesisTab.tsx`) currently only renders `reasoning`, `verdict`, `bull_case`, and `bear_case`. The backend returns several more fields that are already defined in the `SynthesisAnalysis` type but aren't rendered. Add these sections.

The fields already exist in the type — no type changes needed. Just render what's already there.

### Fields to render (in this exact order, after the existing bear case card)

1. **"Risk / Reward" card** (only if `synthesis.risk_reward` exists):
   - Show `risk_reward.ratio` as a large number formatted as `"2.5:1"` (append `:1`). Color: if ratio > 1, tint green (`text-bull`); if < 1, tint red (`text-bear`); if exactly 1, neutral.
   - Show `upside_target` (green, `text-bull`) and `downside_risk` (red, `text-bear`) side by side using `grid gap-6 md:grid-cols-2`.
   - Show `explanation` as a paragraph below.

2. **"Confidence Assessment" card** (only if `synthesis.confidence_explanation` is truthy):
   - Render as a paragraph with a subtle left accent border: `border-l-4 border-primary/30 pl-4`.
   - This is free-form text from the LLM (1-4 sentences). No percentage — just text.

3. **"Key Levels" card** (only if `synthesis.key_levels` has data):
   - Two columns: "Support" (green/bull-colored badges) and "Resistance" (red/bear-colored badges).
   - Use `grid gap-6 md:grid-cols-2`.
   - Only render a column if its array has items. If BOTH arrays are empty, hide the entire card.
   - Each level rendered as: `<Badge variant="outline" className={colorClass}>{level}</Badge>`

4. **"Catalysts to Watch" card** (only if `synthesis.catalysts_to_watch?.length > 0`):
   - Bulleted list. Each item is a plain string.

5. **"Action Items" card** (only if `synthesis.action_items?.length > 0`):
   - Numbered list with monospace numbering:
     ```tsx
     {items.map((item, i) => (
       <li key={i} className="flex gap-2 text-xs">
         <span className="text-primary font-mono shrink-0">{i + 1}.</span>
         <span>{item}</span>
       </li>
     ))}
     ```

### Edge cases

- All 5 fields are optional (`?` in the type). Use optional chaining: `synthesis.risk_reward?.ratio`, `synthesis.key_levels?.support?.length`.
- Historical analyses may not have these fields. Each section is independently guarded — if one field is missing, the others still render.
- `bull_case` and `bear_case` can be either a `CaseAnalysis` object (with `factors` and `evidence` arrays) OR a plain string. The existing code already handles this with `typeof synthesis.bull_case === "object"` checks. Don't change this behavior.

Follow the existing card style with the terminal aesthetic. Use `useBullBearColors()` for green/red coloring.

---

## Prompt 4: Complete the Fundamental Tab (Stock Mode)

The Fundamental tab for **stocks** (not ETFs) is missing several fields the backend returns. Add these sections to `FundamentalTab.tsx` in the **stock rendering path only** (when `fund_quality` is NOT present).

These fields already exist in the `FundamentalAnalysis` type but aren't rendered:

- `management_commentary?: string`
- `key_metrics?: Record<string, string>`
- `competitive_position?: string`
- `filing_info?: { filing_type: string, filing_date: string, filing_url: string, accession_number: string }`

**Note about `filing_info` field names:** The backend sends `filing_type` and `filing_date` (with underscores). Make sure the type in `analysis.ts` matches this. If the existing type uses `type` and `date` instead, update it to: `filing_info?: { filing_type: string; filing_date: string; filing_url: string; accession_number: string }`.

### Sections to add (after the existing opportunities card, in this order)

1. **"Key Metrics" card** (only if `fundamental.key_metrics && Object.keys(fundamental.key_metrics).length > 0`):
   - Render as a two-column table using shadcn `Table`:
     ```tsx
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead className="text-[10px] uppercase">Metric</TableHead>
           <TableHead className="text-[10px] uppercase text-right">Value</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
         {Object.entries(fundamental.key_metrics).map(([name, value]) => (
           <TableRow key={name}>
             <TableCell className="text-xs">{name}</TableCell>
             <TableCell className="text-xs text-right font-mono">{value}</TableCell>
           </TableRow>
         ))}
       </TableBody>
     </Table>
     ```
   - Values are pre-formatted strings from the backend (e.g., "$1.2B", "15.3%"). Render as-is.

2. **"Management Commentary" card** (only if `fundamental.management_commentary` is truthy):
   - Render with a left border accent for a quote style:
     ```tsx
     <div className="border-l-4 border-muted-foreground/20 pl-4">
       <p className="text-xs italic text-foreground/80 leading-relaxed">{fundamental.management_commentary}</p>
     </div>
     ```

3. **"Competitive Position" card** (only if `fundamental.competitive_position` is truthy):
   - Simple paragraph in a card:
     ```tsx
     <p className="text-xs text-foreground leading-relaxed">{fundamental.competitive_position}</p>
     ```

4. **"Filing Source" card** (only if `fundamental.filing_info` exists):
   - Show filing type with a human-readable label. Map: `"10-K" → "10-K Annual Report"`, `"10-Q" → "10-Q Quarterly Report"`, `"20-F" → "20-F Foreign Annual Report"`, `"6-K" → "6-K Foreign Report"`. For unknown types, show as-is.
   - Show filing date.
   - Link to the SEC filing URL: `<a href={filing_info.filing_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View on SEC EDGAR <ExternalLink className="inline h-3 w-3 ml-1" /></a>`
   - Show accession number in small muted monospace: `<span className="text-[10px] font-mono text-muted-foreground">{filing_info.accession_number}</span>`

### Edge cases

- **`financial_health` is polymorphic** — it can be an object OR a string. The existing code handles this with `typeof financial_health === "object"`. Don't change the existing rendering. Add the new sections AFTER the existing code, not interleaved with it.
- All 4 new fields are optional. Each section is independently guarded.
- Historical analyses may not have these fields — they just won't render, which is correct.

Keep the existing card style and terminal aesthetic.

---

## Prompt 5: Cost Summary and Error Display

The backend returns `cost_summary` and `errors` in every analysis response, but neither is displayed. Add both to the results page.

### Types

The `CostSummary` type already exists in `analysis.ts` with these fields:

```ts
export interface CostSummary {
  total_cost: number;
  breakdown: Record<string, number>;  // model name → cost
  budget: number;
  budget_remaining: number;
  execution_time_ms: number;
  total_calls: number;
  timings?: Record<string, number>;   // step name → ms
}
```

No type changes needed. `errors: string[]` is already on `AnalysisResponse`.

### 1. Error Alert (top of results page)

If `result.errors` is a non-empty array, show a warning alert **above** the tabs sticky header so it's always visible:

```tsx
{result.errors?.length > 0 && (
  <Alert className="border-yellow-500/30 bg-yellow-500/5 mb-4">
    <AlertTriangle className="h-4 w-4 text-yellow-400" />
    <AlertTitle className="text-xs uppercase tracking-widest text-yellow-300">Partial Results</AlertTitle>
    <AlertDescription className="text-xs text-foreground/70">
      <p className="mb-2">Some analysis components encountered issues. Results may be incomplete.</p>
      <ul className="list-disc list-inside space-y-1">
        {[...new Set(result.errors)].map((err, i) => (
          <li key={i}>{err}</li>
        ))}
      </ul>
    </AlertDescription>
  </Alert>
)}
```

Note the `[...new Set(result.errors)]` to deduplicate — the backend may return duplicate error messages.

### 2. Collapsible "Analysis Details" section (bottom of results page)

Add below all tab content. Use the shadcn `Collapsible` component (from Radix). Default state: collapsed.

Guard the entire section: only render if `result.cost_summary` exists (historical records may not have it).

**Collapsed view** (always visible):

```tsx
<CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
  <ChevronRight className={`h-3 w-3 transition-transform ${isOpen ? "rotate-90" : ""}`} />
  <span className="uppercase tracking-widest text-[10px]">Analysis Details</span>
  <span className="font-mono">— ${result.cost_summary.total_cost.toFixed(4)} · {formatTime(result.cost_summary.execution_time_ms)} · {result.cost_summary.total_calls} calls</span>
</CollapsibleTrigger>
```

**Time formatting helper:**

```ts
function formatTime(ms: number): string {
  if (ms >= 60000) {
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}
```

**Expanded view** (inside `CollapsibleContent`):

- **Tier & Budget row:** Show tier badge and budget remaining as a fraction: `"$0.32 / $1.00 budget"`. If `budget` is 0 or falsy, hide the budget display.
- **Breakdown table:** `breakdown` is `Record<string, number>` (model name → cost). Render as a simple table:
  | Model | Cost |
  |-------|------|
  | haiku | $0.0100 |
  | sonnet | $0.0800 |
- **Timings:** If `cost_summary.timings` exists, show per-step timing as horizontal badges: `<Badge variant="outline" className="text-[10px]">Technical: 2.1s</Badge>`

Use muted/secondary text styling throughout — this is informational, not primary content.

---

## Prompt 6: PDF Export Updates

The PDF export (`src/lib/pdfExport.ts`) currently only includes Support/Resistance levels, News headlines, and Synthesis reasoning. Update it to include the new modules.

**Existing code pattern:** The file uses `jspdf` directly. It has a `splitTextToFitWidth()` helper for wrapping long text and manages page breaks by checking `yPos` against page height. Each section starts with `doc.setFontSize(16)` for the header, then `doc.setFontSize(10)` for body text.

### Add these sections (in order, after existing sections)

1. **Options Flow section** (only if `result.options?.sentiment`):
   - Header: "OPTIONS FLOW ANALYSIS"
   - Sentiment: `"Sentiment: BULLISH"` (uppercase)
   - Implied Levels: `"Support: $X | Resistance: $X | Max Pain: $X"` (one line)
   - Key Observations: bulleted list
   - Risk Flags: comma-separated list (if non-empty)

2. **Fundamental section** (stock or ETF):
   - If `result.fundamental?.fund_quality` (ETF):
     - Header: "ETF FUNDAMENTAL ANALYSIS"
     - Grade: `"Overall Grade: A"`
     - Key info: name, category, expense ratio, total assets
   - If `result.fundamental?.financial_health` (stock):
     - Header: "FUNDAMENTAL ANALYSIS"
     - If `financial_health` is an object, show grade and key metrics
     - If string, show as-is

3. **Full Synthesis section** (enhance existing):
   - Add risk/reward ratio if available: `"Risk/Reward: 2.5:1 (Upside: $X, Downside: $X)"`
   - Add action items as a numbered list if available

### Edge cases

- Check for null/undefined before adding any section.
- Use the existing `splitTextToFitWidth()` for long text.
- Check page space before adding each section — call the existing page-break logic.
- Keep it clean and data-focused. No styling — just readable text.

---

## Prompt 7: Loading Steps Update

Update the loading steps in `src/components/AnalysisContainer.tsx` to reflect all analysis modules, including the new Options agent.

### Current steps (5)

```ts
const getLoadingSteps = (ticker: string) => [
  { label: `FETCHING ${ticker || "MARKET"} DATA...`, duration: 3000 },
  { label: "ANALYZING TECHNICAL INDICATORS...", duration: 5000 },
  { label: "GATHERING NEWS & SENTIMENT...", duration: 4000 },
  { label: "ANALYZING SEC FILINGS...", duration: 5000 },
  { label: "GENERATING AI INSIGHTS...", duration: 5000 },
];
```

### Updated steps (6)

```ts
const getLoadingSteps = (ticker: string) => [
  { label: `FETCHING ${ticker || "MARKET"} DATA...`, duration: 3000 },
  { label: "ANALYZING TECHNICAL INDICATORS...", duration: 5000 },
  { label: "SCANNING OPTIONS FLOW...", duration: 3000 },
  { label: "GATHERING NEWS & SENTIMENT...", duration: 4000 },
  { label: "ANALYZING FUNDAMENTALS...", duration: 5000 },
  { label: "GENERATING AI SYNTHESIS...", duration: 5000 },
];
```

Changes:
- Added `"SCANNING OPTIONS FLOW..."` as step 3 (options run in parallel with news + fundamentals, but showing the step gives users visibility)
- Renamed `"ANALYZING SEC FILINGS..."` → `"ANALYZING FUNDAMENTALS..."` (the backend now handles both stock SEC filings and ETF fund data under "fundamentals")
- Renamed `"GENERATING AI INSIGHTS..."` → `"GENERATING AI SYNTHESIS..."` (matches the actual tab name)

This is a simple find-and-replace in the `getLoadingSteps` function. No other changes needed.
