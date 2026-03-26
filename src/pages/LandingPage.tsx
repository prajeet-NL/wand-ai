import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Utensils, CreditCard, Bot, Shield, ArrowRight, Sparkles, Globe2, Star } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import Navbar from "@/components/Navbar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion } from "framer-motion";

const features = [
  { icon: MapPin, title: "Smart Destinations", desc: "AI-powered suggestions based on your budget, season, and preferences", color: "from-primary to-ocean-deep" },
  { icon: Plane, title: "Flight & Hotel Deals", desc: "Compare optimized options across providers in seconds", color: "from-sky to-teal" },
  { icon: Shield, title: "Visa Assistance", desc: "Step-by-step visa guidance with document checklists", color: "from-teal to-secondary" },
  { icon: Utensils, title: "Food & Transport", desc: "Personalized restaurant picks and local transport planning", color: "from-sunset to-sunset-warm" },
  { icon: Bot, title: "AI Travel Assistant", desc: "Chat with your travel agent to customize every detail", color: "from-lavender to-primary" },
  { icon: CreditCard, title: "One-Click Booking", desc: "Book flights, hotels, and activities in a single checkout", color: "from-ocean-deep to-navy-soft" },
];

const stats = [
  { value: "50K+", label: "Trips Planned" },
  { value: "99%", label: "Happy Travelers" },
  { value: "150+", label: "Destinations" },
  { value: "24/7", label: "AI Support" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        {/* Animated bg elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-teal/10 blur-[120px]" />
          <motion.div animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
          <motion.div animate={{ x: [0, 15, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-lavender/5 blur-[100px]" />
        </div>

        <div className="container relative py-28 md:py-40 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark text-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 text-teal" />
              <span className="text-primary-foreground/80">AI-powered travel planning</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] max-w-4xl mx-auto">
              Your next adventure,{" "}
              <span className="text-gradient-aurora">designed by AI</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
              From destination discovery to booking confirmation — WandAI handles everything
              so you can focus on the adventure.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <Button size="lg" onClick={() => navigate("/register")}
                className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 text-base px-8 py-6 rounded-full shadow-elevated gap-2 font-semibold">
                Start Planning Free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/login")}
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 py-6 rounded-full">
                Log In
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-sm text-primary-foreground/40 mt-5">
              Demo: demo@wandai.com / demo123
            </p>
          </FadeIn>

          {/* Stats bar */}
          <FadeIn delay={0.5}>
            <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="glass-dark rounded-2xl p-4 text-center">
                  <p className="font-display text-2xl md:text-3xl font-bold">{s.value}</p>
                  <p className="text-xs text-primary-foreground/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24 md:py-32">
        <FadeIn>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm mb-4">
              <Globe2 className="h-3.5 w-3.5" /> Everything in one place
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold">
              Plan smarter, travel better
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              No more switching between 10 tabs. WandAI brings it all together.
            </p>
          </div>
        </FadeIn>
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-shadow duration-300">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* How it works */}
      <section className="bg-muted/50 py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold">How it works</h2>
              <p className="mt-4 text-muted-foreground text-lg">Three steps to your dream trip</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Set preferences", desc: "Tell us your budget, dates, food choices, and travel style." },
              { step: "02", title: "Explore destinations", desc: "AI finds the best matches on an interactive globe." },
              { step: "03", title: "Book everything", desc: "Flights, hotels, food, transport — one seamless checkout." },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl gradient-ocean flex items-center justify-center mx-auto mb-5 shadow-glow">
                    <span className="font-display text-xl font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative gradient-hero text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-teal/10 blur-[100px]" />
        </div>
        <div className="container relative text-center space-y-6">
          <FadeIn>
            <h2 className="font-display text-3xl md:text-5xl font-bold max-w-2xl mx-auto">Ready to explore the world?</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-primary-foreground/70 text-lg max-w-lg mx-auto">
              Join thousands of smart travelers who plan with AI.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Button size="lg" onClick={() => navigate("/register")}
              className="bg-primary-foreground text-navy hover:bg-primary-foreground/90 text-base px-8 py-6 rounded-full shadow-elevated gap-2 font-semibold">
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-card">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="WandAI" className="h-6 opacity-70" />
            <span>© 2026 WandAI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-sunset text-sunset" />
            <span>AI-Powered Travel Planning</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
