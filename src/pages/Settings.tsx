import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

const Settings = () => {
  const [apiUrl, setApiUrl] = useState("https://trading-analyzer-production-7513.up.railway.app");
  const [defaultTier, setDefaultTier] = useState("standard");
  const [budgetLimit, setBudgetLimit] = useState("10");
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your preferences have been updated." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground">SETTINGS</h1>

        <div className="mt-8 space-y-6">
          {/* API */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Backend URL
                </label>
                <Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} className="bg-background" />
              </div>
            </CardContent>
          </Card>

          {/* Defaults */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">Analysis Defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Default Tier
                </label>
                <Select value={defaultTier} onValueChange={setDefaultTier}>
                  <SelectTrigger className="bg-background">
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
                <label className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
                  Budget Limit ($)
                </label>
                <Input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-widest">Appearance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground">Dark Mode</span>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} className="w-full h-12 text-sm font-bold uppercase tracking-widest">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
