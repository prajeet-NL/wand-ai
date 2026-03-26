import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Plane, LogOut, LayoutDashboard, Menu, X, Compass, Sparkles } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLanding = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navClasses = `sticky top-0 z-50 transition-all duration-500 ${
    scrolled
      ? "glass border-b border-border/50 shadow-card"
      : isLanding
        ? "bg-transparent border-b border-transparent"
        : "glass border-b border-border/50"
  }`;

  return (
    <nav className={navClasses}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="WandAI" className="h-8 transition-transform duration-300 group-hover:scale-105" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}
                className={`gap-2 rounded-full px-4 ${location.pathname === "/dashboard" ? "bg-accent text-accent-foreground" : ""}`}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/plan")}
                className={`gap-2 rounded-full px-4 ${location.pathname === "/plan" ? "bg-accent text-accent-foreground" : ""}`}>
                <Compass className="h-4 w-4" /> Plan Trip
              </Button>
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-border">
                <div className="w-8 h-8 rounded-full gradient-ocean flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user?.fullName?.charAt(0) || "U"}
                </div>
                <span className="text-sm font-medium text-foreground">{user?.fullName?.split(" ")[0]}</span>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}
                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}
                className="rounded-full px-5">Log in</Button>
              <Button size="sm" onClick={() => navigate("/register")}
                className="gradient-ocean text-primary-foreground rounded-full px-5 shadow-glow hover:shadow-elevated transition-shadow gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden rounded-full" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border glass overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 pb-3 mb-2 border-b border-border">
                    <div className="w-10 h-10 rounded-full gradient-ocean flex items-center justify-center text-primary-foreground font-bold">
                      {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl" onClick={() => { navigate("/plan"); setMobileOpen(false); }}>
                    <Compass className="h-4 w-4" /> Plan Trip
                  </Button>
                  <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-destructive hover:text-destructive" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full rounded-xl" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Log in</Button>
                  <Button className="w-full gradient-ocean text-primary-foreground rounded-xl" onClick={() => { navigate("/register"); setMobileOpen(false); }}>Get Started</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
