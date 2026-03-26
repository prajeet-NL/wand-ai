import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login } = useTrip();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login(email, password)) {
      toast.success("Welcome back!");
      navigate("/plan");
    } else {
      toast.error("Invalid credentials. Try demo@wandai.com / demo123");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#07121f_0%,#0d2136_44%,#eef5f8_44%,#f7fafc_100%)]">
      <Navbar />
      <div className="container py-12 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome back
            </div>
            <div className="max-w-xl space-y-5">
              <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                Step back into your next escape.
              </h1>
              <p className="text-lg leading-8 text-white/68">
                Resume planning, refine your shortlist, or pick up right where your concierge-style journey left off.
              </p>
            </div>
            <div className="glass-panel max-w-xl rounded-[32px] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="font-display text-xl text-white">Faster re-entry, same trip context</p>
                  <p className="mt-2 text-sm leading-7 text-white/62">
                    Your planning flow, bookings, and travel context stay organized so every return feels smooth and intentional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[36px] border border-white/60 bg-white/92 shadow-[0_30px_100px_rgba(8,21,37,0.16)]">
            <CardHeader className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(6,17,29,0.98),rgba(12,46,70,0.98))] px-8 py-8 text-white">
              <CardTitle className="font-display text-3xl">Log in to WandAI</CardTitle>
              <CardDescription className="text-white/65">
                Reopen your planning canvas and continue building the perfect trip.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-8">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@wandai.com"
                  className="h-12 rounded-2xl bg-slate-50"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="demo123"
                  className="h-12 rounded-2xl bg-slate-50"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button
                className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                onClick={handleLogin}
              >
                Enter your travel dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button onClick={() => navigate("/register")} className="font-medium text-primary hover:underline">
                  Register
                </button>
              </p>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Demo access</p>
                <p className="mt-2 text-sm text-slate-700">demo@wandai.com / demo123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
