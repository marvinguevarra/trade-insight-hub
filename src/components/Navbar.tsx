import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/settings", label: "Settings" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-primary/20 bg-background/95 px-6 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <span className="text-sm font-bold tracking-wider text-foreground">
          TRADING ANALYZER
        </span>
      </Link>

      <div className="flex items-center gap-6">
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
          >
            {link.label}
          </Link>
        ))}
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-success animate-pulse-glow" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Online
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
