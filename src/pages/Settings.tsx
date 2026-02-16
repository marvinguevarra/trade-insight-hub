import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Accessibility, Eye, Type, Zap, Focus } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { getSettings, saveSettings } from "@/lib/userSettings";
import Navbar from "@/components/Navbar";

const Settings = () => {
  const saved = getSettings();
  const [defaultTier, setDefaultTier] = useState(saved.defaultTier);
  const [budgetLimit, setBudgetLimit] = useState(saved.budgetLimit);
  const { toast } = useToast();
  const a11y = useAccessibility();

  const handleSave = () => {
    saveSettings({ defaultTier, budgetLimit });
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">SETTINGS</h1>

        <div className="mt-8 space-y-6">
          {/* Sign-up banner */}
          <div className="flex items-center gap-3 border border-primary/20 bg-primary/5 px-4 py-3" role="status">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-xs text-foreground">
              Sign up to save preferences across sessions
            </span>
          </div>

          {/* Analysis Defaults */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">Analysis Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="default-tier" className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Default Tier
                </Label>
                <Select value={defaultTier} onValueChange={setDefaultTier}>
                  <SelectTrigger id="default-tier" className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lite">Lite</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="budget-limit" className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Budget Limit ($)
                </Label>
                <Input
                  id="budget-limit"
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-primary" aria-hidden="true" />
                <CardTitle className="text-xs uppercase tracking-widest">Accessibility</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme */}
              <fieldset>
                <legend className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3 w-3" aria-hidden="true" /> Theme
                </legend>
                <RadioGroup value={a11y.theme} onValueChange={(v) => a11y.setTheme(v as any)} className="grid grid-cols-2 gap-2">
                  {[
                    { value: "dark", label: "Dark (Default)" },
                    { value: "light", label: "Light" },
                    { value: "high-contrast-dark", label: "High Contrast Dark" },
                    { value: "high-contrast-light", label: "High Contrast Light" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={`theme-${opt.value}`}
                      className="flex items-center gap-2 border border-border p-2.5 cursor-pointer hover:bg-secondary/50 transition-colors text-xs text-foreground [&:has(:checked)]:border-primary/50 [&:has(:checked)]:bg-primary/5"
                    >
                      <RadioGroupItem value={opt.value} id={`theme-${opt.value}`} />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              {/* Color Vision */}
              <fieldset>
                <legend className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3 w-3" aria-hidden="true" /> Color Vision
                </legend>
                <RadioGroup value={a11y.colorVision} onValueChange={(v) => a11y.setColorVision(v as any)} className="grid grid-cols-2 gap-2">
                  {[
                    { value: "standard", label: "Standard" },
                    { value: "protanopia", label: "Protanopia (Red-Blind)" },
                    { value: "deuteranopia", label: "Deuteranopia (Green-Blind)" },
                    { value: "tritanopia", label: "Tritanopia (Blue-Blind)" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={`cv-${opt.value}`}
                      className="flex items-center gap-2 border border-border p-2.5 cursor-pointer hover:bg-secondary/50 transition-colors text-xs text-foreground [&:has(:checked)]:border-primary/50 [&:has(:checked)]:bg-primary/5"
                    >
                      <RadioGroupItem value={opt.value} id={`cv-${opt.value}`} />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              {/* Text Size */}
              <fieldset>
                <legend className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Type className="h-3 w-3" aria-hidden="true" /> Text Size
                </legend>
                <RadioGroup value={a11y.textSize} onValueChange={(v) => a11y.setTextSize(v as any)} className="grid grid-cols-4 gap-2">
                  {[
                    { value: "small", label: "Small" },
                    { value: "normal", label: "Normal" },
                    { value: "large", label: "Large" },
                    { value: "xl", label: "Extra Large" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={`ts-${opt.value}`}
                      className="flex items-center gap-2 border border-border p-2.5 cursor-pointer hover:bg-secondary/50 transition-colors text-xs text-foreground [&:has(:checked)]:border-primary/50 [&:has(:checked)]:bg-primary/5"
                    >
                      <RadioGroupItem value={opt.value} id={`ts-${opt.value}`} />
                      {opt.label}
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between border border-border p-3">
                <Label htmlFor="reduce-motion" className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <Zap className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  Reduce Motion
                </Label>
                <Switch id="reduce-motion" checked={a11y.reduceMotion} onCheckedChange={a11y.setReduceMotion} />
              </div>

              {/* Enhanced Focus */}
              <div className="flex items-center justify-between border border-border p-3">
                <Label htmlFor="enhanced-focus" className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <Focus className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                  Enhanced Focus Outlines
                </Label>
                <Switch id="enhanced-focus" checked={a11y.enhancedFocus} onCheckedChange={a11y.setEnhancedFocus} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full h-12 text-sm font-bold uppercase tracking-widest">
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
