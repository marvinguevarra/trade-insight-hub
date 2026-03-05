

# Implementation Plan: 7 LOVABLE_PROMPTS.md Prompts + Progress Log

I'll work through all 7 prompts sequentially and create a `BUILD_LOG.md` file in the repo root so you (and Claude Code) can review exactly what was done.

## Execution Order

### Prompt 7: Loading Steps Update (simplest, do first)
- Update `getLoadingSteps` in `AnalysisContainer.tsx` — add "SCANNING OPTIONS FLOW..." step, rename SEC/Insights labels

### Prompt 1: Options Flow Analysis Tab
- Add `OptionsAnalysis` type to `src/types/analysis.ts`
- Create `src/components/results/OptionsTab.tsx` component
- Add Options tab trigger + content to `ResultsPage.tsx` (between Fundamental and Synthesis)

### Prompt 2: ETF Fundamental Display
- Add `ETFFundQuality`, `ETFInfo` types and optional ETF fields to `FundamentalAnalysis` in `analysis.ts`
- Add ETF detection branch in `ResultsPage.tsx` fundamental tab (stock path untouched)

### Prompt 3: Synthesis Tab Completion
- Add risk/reward, confidence, key levels, catalysts, action items sections after existing bear case in `ResultsPage.tsx`

### Prompt 4: Stock Fundamental Completion
- Add key metrics table, management commentary, competitive position, filing source cards after existing opportunities card
- Update `filing_info` type if needed

### Prompt 5: Cost Summary & Error Display
- Add error alert above tabs in `ResultsPage.tsx`
- Add collapsible "Analysis Details" section below all tab content with cost breakdown, timings

### Prompt 6: PDF Export Updates
- Add Options, Fundamental (stock + ETF), and enhanced Synthesis sections to `handleDownloadPDF`

### Final: BUILD_LOG.md
- Create `BUILD_LOG.md` documenting all changes made, files touched, and any decisions/edge cases encountered

## Key Patterns to Follow
- All new sections guarded with optional chaining and truthiness checks
- `useBullBearColors()` for sentiment coloring
- Empty state card pattern for null data
- Terminal aesthetic: `text-[10px] uppercase tracking-widest`, monospace, sharp corners
- No changes to existing rendering paths

## Files Modified
- `src/types/analysis.ts` — new types (OptionsAnalysis, ETFFundQuality, ETFInfo, filing_info update)
- `src/components/results/OptionsTab.tsx` — new file
- `src/pages/ResultsPage.tsx` — Options tab, ETF branch, Synthesis additions, Fundamental additions, error alert, cost summary
- `src/components/AnalysisContainer.tsx` — loading steps
- `BUILD_LOG.md` — new file, progress documentation

