import { Link, useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Plane, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import { useState } from "react";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useTrip();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="WandAI" className="h-9" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/plan")} className="gap-2">
                <Plane className="h-4 w-4" /> Plan Trip
              </Button>
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
                <span className="text-sm text-muted-foreground">{user?.fullName}</span>
                <Button variant="ghost" size="icon" onClick={() => { logout(); navigate("/"); }}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Log in</Button>
              <Button size="sm" onClick={() => navigate("/register")} className="gradient-ocean text-primary-foreground">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-2">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { navigate("/dashboard"); setMobileOpen(false); }}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { navigate("/plan"); setMobileOpen(false); }}>
                <Plane className="h-4 w-4" /> Plan Trip
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={() => { logout(); navigate("/"); setMobileOpen(false); }}>
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="w-full" onClick={() => { navigate("/login"); setMobileOpen(false); }}>Log in</Button>
              <Button className="w-full gradient-ocean text-primary-foreground" onClick={() => { navigate("/register"); setMobileOpen(false); }}>Get Started</Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
