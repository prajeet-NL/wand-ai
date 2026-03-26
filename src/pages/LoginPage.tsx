import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { FadeIn } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Plane } from "lucide-react";

export default function LoginPage() {
  const { login } = useTrip();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (login(email, password)) {
      toast.success("Welcome back! ✈️");
      navigate("/plan");
    } else {
      toast.error("Invalid credentials. Try demo@wandai.com / demo123");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-[420px]">
          <FadeIn>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-5 shadow-glow">
                <Plane className="h-7 w-7 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground mt-2">Continue planning your next adventure</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Card className="shadow-elevated border-border/50 overflow-hidden">
              <CardContent className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="demo@wandai.com" className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-card" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Password</Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••" className="h-11 rounded-xl bg-muted/50 border-border/50 focus:bg-card"
                    onKeyDown={e => e.key === "Enter" && handleLogin()} />
                </div>
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button className="w-full h-11 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold gap-2" onClick={handleLogin}>
                    Log In <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => navigate("/register")} className="text-primary font-medium hover:underline">Register</button>
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="mt-4 flex items-center gap-2 justify-center text-xs text-muted-foreground bg-muted/50 rounded-xl p-3 border border-border/50">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Demo: demo@wandai.com / demo123
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
