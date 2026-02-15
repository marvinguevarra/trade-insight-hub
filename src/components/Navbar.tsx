import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navLinks = [
  { to: "/analyze", label: "Analyze" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/settings", label: "Settings" },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex h-12 items-center justify-between border-b border-primary/20 bg-background/95 px-6 backdrop-blur transition-shadow duration-200",
        scrolled && "shadow-[0_2px_12px_rgba(0,0,0,0.4)]"
      )}
    >
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
      </div>
    </nav>
  );
};

export default Navbar;
