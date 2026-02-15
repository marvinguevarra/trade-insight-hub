import { Link, useLocation } from "react-router-dom";
import { Activity, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/settings", label: "Settings" },
];

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-12 items-center justify-between border-b border-primary/20 bg-background/95 px-6 backdrop-blur transition-shadow duration-200",
        scrolled && "shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
      )}
      role="banner"
    >
      <Link to="/" className="flex items-center gap-2" aria-label="Trading Analyzer Home">
        <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
        <span className="text-sm font-bold tracking-wider text-foreground">
          TRADING ANALYZER
        </span>
      </Link>

      <nav aria-label="Main navigation" className="flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              "text-xs uppercase tracking-widest transition-colors",
              location.pathname === link.to
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            aria-current={location.pathname === link.to ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5 mr-1" />
            Sign Out
          </Button>
        ) : (
          <Link
            to="/auth"
            className={cn(
              "text-xs uppercase tracking-widest transition-colors",
              location.pathname === "/auth"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
