import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, Utensils, CreditCard, Bot, Shield, Sparkles, ArrowRight, Orbit } from "lucide-react";
import logo from "@/assets/wandai-logo.png";
import Navbar from "@/components/Navbar";

const features = [
  { icon: MapPin, title: "Signal-driven discovery", desc: "Balance budget, season, cuisine, and vibe in one cinematic destination feed." },
  { icon: Plane, title: "Concierge-grade planning", desc: "Flights, stays, transport, and itinerary come together as a single guided system." },
  { icon: Shield, title: "Passport intelligence", desc: "OCR-assisted onboarding and visa guidance reduce friction before the trip begins." },
  { icon: Utensils, title: "Taste-aware recommendations", desc: "Food planning feels curated, not generic, with preference-aware local picks." },
  { icon: Bot, title: "AI-led confidence", desc: "The experience explains itself like a luxury travel advisor with real-time polish." },
  { icon: CreditCard, title: "One graceful checkout", desc: "Bring the trip together without breaking the flow or losing context." },
];

const stats = [
  { value: "48 hrs", label: "from dream to confirmed itinerary" },
  { value: "6 layers", label: "of planning unified into one flow" },
  { value: "100%", label: "editable recommendations and trip details" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(136,243,223,0.16),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(94,180,255,0.22),_transparent_22%),linear-gradient(180deg,_rgba(5,10,18,0.4),_rgba(5,10,18,0.96))]" />
        <div className="absolute left-[-8%] top-24 h-72 w-72 rounded-full bg-sky/20 blur-[140px]" />
        <div className="absolute right-[-6%] top-12 h-96 w-96 rounded-full bg-teal/20 blur-[150px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,_transparent,_rgba(244,247,250,1))]" />

        <div className="container relative grid gap-16 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70">
              <Orbit className="h-3.5 w-3.5" />
              WandAI concierge system
            </div>

            <div className="space-y-6">
              <img src={logo} alt="WandAI" className="h-12 opacity-95 md:h-14" />
              <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                Trips that feel
                <span className="block bg-[linear-gradient(135deg,#ffffff_5%,#9cf7ea_45%,#89c8ff_100%)] bg-clip-text text-transparent">
                  designed around you.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
                WandAI turns planning into a premium guided experience. Discover where to go, why it fits,
                and how every part of the journey connects before you ever leave home.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="h-14 rounded-full bg-white px-8 text-base font-semibold text-navy hover:bg-white/95"
              >
                Start the experience
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/login")}
                className="h-14 rounded-full border-white/20 bg-white/5 px-8 text-base text-white hover:bg-white/10 hover:text-white"
              >
                Continue planning
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-panel rounded-[28px] p-5">
                  <p className="font-display text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm leading-6 text-white/58">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="floating-orb absolute left-4 top-6 h-24 w-24 rounded-full bg-white/12 blur-sm" />
            <div className="floating-orb absolute right-8 top-20 h-16 w-16 rounded-full bg-sky/35 blur-sm [animation-delay:1.6s]" />

            <div className="relative rounded-[36px] border border-white/10 bg-white/8 p-5 shadow-[0_40px_120px_rgba(3,10,18,0.45)] backdrop-blur-2xl">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.16),_rgba(255,255,255,0.03)_34%,_rgba(6,15,28,0.85)_100%)] p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/55">
                    <span>Live planning canvas</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="mt-8 space-y-5">
                    <div className="rounded-3xl border border-white/10 bg-white/6 p-5">
                      <p className="text-sm text-white/55">Suggested escape</p>
                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <p className="font-display text-3xl text-white">Bali</p>
                          <p className="mt-1 text-sm text-white/55">wellness, coastlines, rituals</p>
                        </div>
                        <div className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-100">
                          top match
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Visa timing aligned",
                        "Breakfast-first hotels",
                        "Veg-friendly shortlist",
                        "Flights within budget",
                      ].map((item) => (
                        <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-sm text-white/72">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/55">Trip confidence</p>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-navy/70">
                        <div className="absolute inset-2 rounded-full border border-teal/40 border-t-white/90 animate-[spin_9s_linear_infinite]" />
                        <span className="font-display text-3xl text-white">94</span>
                      </div>
                      <p className="text-sm leading-7 text-white/62">
                        Every stage is curated to feel complete, from passport extraction to destination rationale.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/55">Why people stay in flow</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Animated decision support at every step",
                        "One visual system across itinerary, booking, and docs",
                        "A premium travel tone instead of utilitarian forms",
                      ].map((item) => (
                        <div key={item} className="flex gap-3 rounded-2xl border border-white/8 bg-white/5 p-3">
                          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal" />
                          <p className="text-sm leading-6 text-white/70">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,_rgba(94,180,255,0.12),_transparent_25%),radial-gradient(circle_at_80%_10%,_rgba(96,241,205,0.14),_transparent_24%)]" />
        <div className="container relative">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-primary/60">Designed for momentum</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Every interaction should feel like a travel brand, not a spreadsheet.
            </h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              The product now needs editorial structure, richer motion, and deeper emotional contrast. These are
              the building blocks that make planning feel irresistible.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="feature-shell group rounded-[32px] p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal text-white shadow-lg shadow-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-8 font-display text-2xl font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#04101c,#072339,#0c4d57)] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_rgba(255,255,255,0.18),_transparent_20%),radial-gradient(circle_at_90%_30%,_rgba(164,255,236,0.18),_transparent_24%)]" />
        <div className="container relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-white/55">Ready when you are</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Turn destination curiosity into a trip with conviction.
            </h2>
            <p className="mt-4 text-lg leading-8 text-white/65">
              Let the product do the heavy lifting, then refine every detail with the confidence of a luxury concierge.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate("/register")}
            className="h-14 rounded-full bg-white px-8 text-base font-semibold text-navy hover:bg-white/95"
          >
            Begin the journey
          </Button>
        </div>
      </section>
    </div>
  );
}
