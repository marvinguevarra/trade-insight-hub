

# Frontend Polish & Results Page Improvements

## Summary
After auditing the codebase, many edge cases from your list are already handled. This plan covers the remaining gaps, organized into 3 focused batches you can approve one at a time.

---

## What's Already Done (No Work Needed)
- File size validation (10MB limit, client-side)
- Multiple file drop rejection with toast
- Friendly error message mapping
- Cancel button during loading
- Mode toggle locked during loading
- API timeout (30 seconds) with AbortController
- Empty results state on ResultsPage (redirects to /analyze)
- Empty tab states for News, Fundamental, Synthesis
- Historical report banner (shows date, links to re-analyze)
- Ticker auto-uppercase and max 5 chars
- Pill toggle has ARIA roles, keyboard arrow support
- Form data persists when switching tabs (state lives in parent)

---

## Batch 1: Results Page Fixes (News Links, Share, PDF)

### 1A. Clickable News Headlines with Sources
**File:** `src/pages/ResultsPage.tsx` (lines 405-408)

Currently headlines render as plain divs. Change to:
- Wrap in `<a>` tag if `h.url` exists, with `target="_blank"` and `rel="noopener noreferrer"`
- Show source name and timestamp below headline in muted text
- Use `text-primary` for link color with `hover:underline`

### 1B. Working Share Button
**File:** `src/pages/ResultsPage.tsx` (line 118)

Add an `onClick` handler that:
- Tries `navigator.share()` first (mobile)
- Falls back to `navigator.clipboard.writeText()` (desktop)
- Shows toast confirmation on copy
- Handles errors gracefully

### 1C. PDF Export (Replace JSON)
**File:** `src/pages/ResultsPage.tsx` (lines 110-116)

- Install `jspdf` dependency
- Replace JSON download with a formatted PDF containing: header (symbol, date, tier), technical summary, news headlines, synthesis/verdict
- Keep JSON as a secondary option or remove entirely

---

## Batch 2: Form Input & Mobile Fixes

### 2A. Allow Dots and Numbers in Ticker Input
**File:** `src/components/QuickAnalysisForm.tsx` (line 55)

Current regex `/[^A-Za-z]/g` blocks dots and numbers, making tickers like `BRK.A` or `BRK.B` impossible. Change to `/[^A-Za-z0-9.]/g` and increase max length to 6.

### 2B. Mobile-Friendly Upload Text
**File:** `src/components/AdvancedDataForm.tsx`

Detect mobile via the existing `useIsMobile` hook. Show "Tap to upload" instead of "Drag & Drop CSV File" on mobile devices.

### 2C. Scrollable Tabs on Mobile
**File:** `src/pages/ResultsPage.tsx` (lines 155-160)

Add `overflow-x-auto` and `whitespace-nowrap` to the TabsList so the 4 tabs scroll horizontally on small screens instead of wrapping or overflowing.

---

## Batch 3: Accessibility & Polish

### 3A. Visible Focus Indicators
Ensure all interactive elements (buttons, inputs, tabs, toggle) have visible focus rings using Tailwind's `focus-visible:ring-2 focus-visible:ring-primary`.

### 3B. Screen Reader Announcements for Loading
**File:** `src/components/AnalysisContainer.tsx`

Add `aria-live="polite"` region around the loading steps so screen readers announce progress changes.

### 3C. Form Label Associations
Verify all inputs have proper `htmlFor`/`id` pairings. Currently labels use `<label>` elements but without explicit `for` attributes -- add `id` to inputs and `htmlFor` to labels.

---

## Recommended Approach

Send me **"Implement Batch 1"** to start with the results page fixes (news links, share, PDF). Each batch is independent and testable on its own. After each batch, you can verify in the preview before moving to the next.

---

## Technical Details

### New Dependency
- `jspdf` -- for PDF generation (Batch 1C only)

### Files Modified Per Batch
| Batch | Files |
|-------|-------|
| 1 | `ResultsPage.tsx` |
| 2 | `QuickAnalysisForm.tsx`, `AdvancedDataForm.tsx`, `ResultsPage.tsx` |
| 3 | `AnalysisContainer.tsx`, `QuickAnalysisForm.tsx`, `AdvancedDataForm.tsx` |

### Risk Assessment
- Batch 1: Low risk -- isolated to results display
- Batch 2: Low risk -- small input changes
- Batch 3: Low risk -- additive accessibility attributes only
