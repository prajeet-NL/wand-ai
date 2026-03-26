import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Plane, LogOut, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import { useState } from "react";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useTrip();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = isLoggedIn
    ? [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Plan Trip", icon: Plane, path: "/plan" },
      ]
    : [{ label: "Why WandAI", icon: Sparkles, path: "/" }];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-navy/70 backdrop-blur-2xl">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="glass-panel flex h-11 w-11 items-center justify-center rounded-2xl border-white/15 bg-white/10">
            <img src={logo} alt="WandAI" className="h-6" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-semibold tracking-tight text-white">WandAI</p>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">AI travel concierge</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`rounded-full px-4 text-sm ${
                  active ? "bg-white text-navy hover:bg-white/95" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <div className="glass-panel hidden items-center gap-3 rounded-full border-white/15 px-4 py-2 lg:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                  {user?.fullName?.charAt(0) || "W"}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{user?.fullName}</p>
                  <p className="text-xs text-white/50">Ready for the next escape</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="rounded-full border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
              >
                Log in
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/register")}
                className="rounded-full bg-white text-navy hover:bg-white/95"
              >
                Start Planning
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border border-white/10 text-white md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-navy/95 p-4 md:hidden">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start rounded-2xl text-white/80 hover:bg-white/10 hover:text-white"
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Button>
            ))}
            {isLoggedIn ? (
              <Button
                variant="ghost"
                className="w-full justify-start rounded-2xl text-rose-200 hover:bg-white/10"
                onClick={() => {
                  logout();
                  navigate("/");
                  setMobileOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="w-full rounded-2xl text-white/80 hover:bg-white/10 hover:text-white"
                  onClick={() => {
                    navigate("/login");
                    setMobileOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button
                  className="w-full rounded-2xl bg-white text-navy hover:bg-white/95"
                  onClick={() => {
                    navigate("/register");
                    setMobileOpen(false);
                  }}
                >
                  Start Planning
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
