import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip, TravelPreferences } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, Calendar, Users, Globe, Utensils, Sparkles, ArrowRight } from "lucide-react";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const plannerNotes = [
  "Seasonal fit is weighted heavily so recommendations feel realistic, not generic.",
  "Food and breakfast preferences shape both destination ranking and stay suggestions.",
  "Duration and traveler count influence pacing, comfort, and itinerary density.",
];

export default function PreferencesPage() {
  const { setPreferences, isLoggedIn } = useTrip();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(50000);
  const [month, setMonth] = useState((new Date().getMonth() + 2) % 12);
  const [duration, setDuration] = useState(5);
  const [travelers, setTravelers] = useState(2);
  const [destType, setDestType] = useState<"domestic" | "international" | "flexible">("flexible");
  const [foodPref, setFoodPref] = useState<"veg" | "non-veg" | "vegan" | "any">("any");
  const [cuisinePref, setCuisinePref] = useState<"indian" | "local" | "both">("both");
  const [breakfastIncluded, setBreakfastIncluded] = useState(true);

  if (!isLoggedIn) { navigate("/login"); return null; }

  const handleSubmit = () => {
    const prefs: TravelPreferences = {
      budget,
      travelMonth: month + 1,
      duration,
      travelers,
      destType,
      foodPref,
      cuisinePref,
      breakfastIncluded,
    };
    setPreferences(prefs);
    toast.success("Preferences saved! Finding perfect destinations...");
    navigate("/destinations");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#07121f_0%,#0d2136_36%,#eff5f8_36%,#f7fafc_100%)]">
      <Navbar />
      <div className="container py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
              <Sparkles className="h-3.5 w-3.5" />
              Planning profile
            </div>
            <div className="max-w-xl space-y-5">
              <h1 className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
                Tune the trip before we map the world.
              </h1>
              <p className="text-lg leading-8 text-white/68">
                This stage should feel like briefing a private travel studio. Share your budget, pace, and taste,
                and we will shape a destination shortlist that feels intentional.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Budget</p>
                <p className="mt-3 font-display text-3xl text-white">Rs. {budget.toLocaleString("en-IN")}</p>
              </div>
              <div className="glass-panel rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Window</p>
                <p className="mt-3 font-display text-3xl text-white">{months[month].slice(0, 3)}</p>
              </div>
              <div className="glass-panel rounded-[28px] p-5">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Travelers</p>
                <p className="mt-3 font-display text-3xl text-white">{travelers}</p>
              </div>
            </div>

            <div className="glass-panel rounded-[32px] p-6">
              <p className="text-xs uppercase tracking-[0.32em] text-white/45">How WandAI thinks</p>
              <div className="mt-5 space-y-3">
                {plannerNotes.map((note) => (
                  <div key={note} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal" />
                    <p className="text-sm leading-7 text-white/68">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[36px] border border-white/60 bg-white/90 shadow-[0_30px_100px_rgba(8,21,37,0.18)]">
            <CardContent className="p-0">
              <div className="border-b border-slate-200/80 bg-[linear-gradient(135deg,rgba(6,17,29,0.98),rgba(12,46,70,0.98))] px-8 py-8 text-white">
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Trip brief</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Build your planning profile</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/65">
                  A stronger brief creates a much better shortlist. Adjust anything now or refine it later after the first set of recommendations.
                </p>
              </div>

              <div className="space-y-8 p-8">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        <Label className="text-base font-semibold text-slate-900">Budget per traveler</Label>
                      </div>
                      <p className="mt-2 text-sm text-slate-500">We use this to balance flights, stays, and the overall ambition of the trip.</p>
                    </div>
                    <div className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                      Rs. {budget.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <Slider value={[budget]} onValueChange={(v) => setBudget(v[0])} min={5000} max={500000} step={5000} className="mt-6" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Travel month</Label>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">We prioritize places that are in season and at their best.</p>
                    <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                      <SelectTrigger className="mt-4 h-12 rounded-2xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((item, index) => <SelectItem key={item} value={String(index)}>{item}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Travelers</Label>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Group size influences flight mix, room types, and pacing.</p>
                    <Input
                      type="number"
                      value={travelers}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                      min={1}
                      max={10}
                      className="mt-4 h-12 rounded-2xl bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Destination style</Label>
                    </div>
                    <Select value={destType} onValueChange={(value) => setDestType(value as typeof destType)}>
                      <SelectTrigger className="mt-4 h-12 rounded-2xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domestic">Domestic only</SelectItem>
                        <SelectItem value="international">International only</SelectItem>
                        <SelectItem value="flexible">Best match anywhere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <Label className="font-semibold">Duration in days</Label>
                    <p className="mt-2 text-sm text-muted-foreground">Longer stays unlock deeper itineraries and richer local recommendations.</p>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min={1}
                      max={30}
                      className="mt-4 h-12 rounded-2xl bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Food preference</Label>
                    </div>
                    <Select value={foodPref} onValueChange={(value) => setFoodPref(value as typeof foodPref)}>
                      <SelectTrigger className="mt-4 h-12 rounded-2xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Anything goes</SelectItem>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non-veg">Non-vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-[28px] border border-slate-200 p-5">
                    <Label className="font-semibold">Cuisine preference</Label>
                    <Select value={cuisinePref} onValueChange={(value) => setCuisinePref(value as typeof cuisinePref)}>
                      <SelectTrigger className="mt-4 h-12 rounded-2xl bg-slate-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indian">Prefer Indian options</SelectItem>
                        <SelectItem value="local">Prefer local flavor</SelectItem>
                        <SelectItem value="both">Blend both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-[28px] border border-slate-200 bg-slate-50/70 p-5">
                  <div>
                    <Label className="font-semibold text-slate-900">Breakfast-first stays</Label>
                    <p className="mt-2 text-sm text-muted-foreground">Bias recommendations toward hotels that smooth out mornings.</p>
                  </div>
                  <Switch checked={breakfastIncluded} onCheckedChange={setBreakfastIncluded} />
                </div>

                <Button
                  className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white shadow-[0_20px_50px_rgba(7,45,71,0.18)] hover:opacity-95"
                  onClick={handleSubmit}
                >
                  Reveal destination matches
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
