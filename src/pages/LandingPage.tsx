import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Utensils, CreditCard, Bot, Shield } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import Navbar from "@/components/Navbar";

const features = [
  { icon: MapPin, title: "Smart Destinations", desc: "AI-powered suggestions based on your budget, season, and preferences" },
  { icon: Plane, title: "Flight & Hotel Deals", desc: "Compare optimized options across providers in seconds" },
  { icon: Shield, title: "Visa Assistance", desc: "Step-by-step visa guidance with document checklists" },
  { icon: Utensils, title: "Food & Transport", desc: "Personalized restaurant picks and local transport planning" },
  { icon: Bot, title: "AI Travel Assistant", desc: "Chat with your travel agent to customize every detail" },
  { icon: CreditCard, title: "One-Click Booking", desc: "Book flights, hotels, and activities in a single checkout" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-sky rounded-full blur-3xl" />
        </div>
        <div className="container relative py-24 md:py-36 text-center space-y-8">
          <div className="animate-fade-in">
            <img src={logo} alt="WandAI" className="h-16 md:h-20 mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Plan Your Dream Trip<br />
              <span className="text-teal">with AI Magic</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              From destination discovery to booking confirmation — WandAI handles everything so you can focus on the adventure.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button size="lg" onClick={() => navigate("/register")}
              className="bg-teal hover:bg-teal/90 text-primary-foreground text-lg px-8 py-6 rounded-xl">
              Start Planning — It's Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/login")}
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6 rounded-xl">
              Log In
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/50 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Demo: demo@wandai.com / demo123
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Everything You Need, One Platform</h2>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            No more switching between 10 tabs. WandAI brings it all together.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={f.title} className="group p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-xl gradient-ocean flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-ocean text-primary-foreground py-16">
        <div className="container text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Ready to explore the world?</h2>
          <p className="text-primary-foreground/80 text-lg">Join thousands of smart travelers who plan with AI.</p>
          <Button size="lg" onClick={() => navigate("/register")}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6 rounded-xl">
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logo} alt="WandAI" className="h-6" />
            <span>© 2026 WandAI. All rights reserved.</span>
          </div>
          <p>Your AI Travel Planner — Prototype Version</p>
        </div>
      </footer>
    </div>
  );
}
