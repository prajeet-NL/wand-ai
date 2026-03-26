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
import { IndianRupee, Calendar, Users, Globe, Utensils, Sparkles, ArrowRight, Coffee } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion } from "framer-motion";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

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
    const prefs: TravelPreferences = { budget, travelMonth: month + 1, duration, travelers, destType, foodPref, cuisinePref, breakfastIncluded };
    setPreferences(prefs);
    toast.success("Finding perfect destinations...");
    navigate("/destinations");
  };

  const budgetLabel = budget < 20000 ? "Budget-friendly" : budget < 80000 ? "Mid-range" : budget < 200000 ? "Premium" : "Luxury";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-10 md:py-16">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-sm mb-4">
              <Sparkles className="h-3.5 w-3.5" /> AI-powered matching
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold">Tell us about your trip</h1>
            <p className="text-muted-foreground mt-2">We'll find the perfect destination for you</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card className="shadow-elevated border-border/50 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <StaggerContainer className="space-y-8">
                {/* Budget */}
                <StaggerItem>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl gradient-ocean flex items-center justify-center">
                          <IndianRupee className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                          <Label className="text-sm font-semibold">Budget per person</Label>
                          <p className="text-xs text-muted-foreground">{budgetLabel}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-display font-bold text-gradient">₹{budget.toLocaleString("en-IN")}</p>
                    </div>
                    <Slider value={[budget]} onValueChange={v => setBudget(v[0])} min={5000} max={500000} step={5000}
                      className="[&_[role=slider]]:shadow-glow" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹5,000</span><span>₹5,00,000</span>
                    </div>
                  </div>
                </StaggerItem>

                {/* Month & Duration */}
                <StaggerItem>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Travel Month</Label>
                      </div>
                      <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {months.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Duration (days)</Label>
                      <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} max={30}
                        className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                  </div>
                </StaggerItem>

                {/* Travelers & Dest Type */}
                <StaggerItem>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Travelers</Label>
                      </div>
                      <Input type="number" value={travelers} onChange={e => setTravelers(Number(e.target.value))} min={1} max={10}
                        className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Destination Type</Label>
                      </div>
                      <Select value={destType} onValueChange={v => setDestType(v as any)}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="domestic">🇮🇳 Domestic</SelectItem>
                          <SelectItem value="international">🌍 International</SelectItem>
                          <SelectItem value="flexible">✨ Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </StaggerItem>

                {/* Food Preferences */}
                <StaggerItem>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Food Preference</Label>
                      </div>
                      <Select value={foodPref} onValueChange={v => setFoodPref(v as any)}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="veg">🌿 Vegetarian</SelectItem>
                          <SelectItem value="non-veg">🍖 Non-Vegetarian</SelectItem>
                          <SelectItem value="vegan">🌱 Vegan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Cuisine Style</Label>
                      <Select value={cuisinePref} onValueChange={v => setCuisinePref(v as any)}>
                        <SelectTrigger className="h-10 rounded-xl bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indian">Indian</SelectItem>
                          <SelectItem value="local">Local</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </StaggerItem>

                {/* Breakfast */}
                <StaggerItem>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
                        <Coffee className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <Label className="font-medium text-sm">Breakfast included</Label>
                        <p className="text-xs text-muted-foreground">Prefer hotels with breakfast</p>
                      </div>
                    </div>
                    <Switch checked={breakfastIncluded} onCheckedChange={setBreakfastIncluded} />
                  </div>
                </StaggerItem>

                {/* Submit */}
                <StaggerItem>
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button className="w-full h-12 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold text-base gap-2" onClick={handleSubmit}>
                      Find Destinations <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </StaggerItem>
              </StaggerContainer>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
