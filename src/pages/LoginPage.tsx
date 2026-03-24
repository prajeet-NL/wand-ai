import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

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
      <div className="container max-w-md py-20">
        <Card className="shadow-elevated border-border">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">Welcome Back</CardTitle>
            <CardDescription>Log in to continue planning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="demo@wandai.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="demo123"
                onKeyDown={e => e.key === "Enter" && handleLogin()} />
            </div>
            <Button className="w-full gradient-ocean text-primary-foreground" onClick={handleLogin}>
              Log In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")} className="text-primary hover:underline">Register</button>
            </p>
            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground bg-muted rounded-lg p-3">
                Demo credentials: demo@wandai.com / demo123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
