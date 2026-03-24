import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip, TravelPreferences } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Slider } from "@/components/ui/slider";
import { IndianRupee, Calendar, Users, Globe, Utensils } from "lucide-react";

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
    toast.success("Preferences saved! Finding perfect destinations...");
    navigate("/destinations");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-2xl py-12">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Plan Your Trip</h1>
          <p className="text-muted-foreground mt-2">Tell us your preferences and we'll find the perfect destination</p>
        </div>

        <Card className="shadow-elevated">
          <CardContent className="p-6 space-y-8">
            {/* Budget */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <Label className="text-base font-semibold">Budget (per person)</Label>
              </div>
              <Slider value={[budget]} onValueChange={v => setBudget(v[0])} min={5000} max={500000} step={5000} />
              <p className="text-2xl font-display font-bold text-gradient">₹{budget.toLocaleString("en-IN")}</p>
            </div>

            {/* Month & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <Label>Travel Month</Label>
                </div>
                <Select value={String(month)} onValueChange={v => setMonth(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m, i) => <SelectItem key={i} value={String(i)}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (days)</Label>
                <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} max={30} />
              </div>
            </div>

            {/* Travelers & Dest Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <Label>Travelers</Label>
                </div>
                <Input type="number" value={travelers} onChange={e => setTravelers(Number(e.target.value))} min={1} max={10} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <Label>Destination Type</Label>
                </div>
                <Select value={destType} onValueChange={v => setDestType(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Food Preferences */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  <Label>Food Preference</Label>
                </div>
                <Select value={foodPref} onValueChange={v => setFoodPref(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cuisine Preference</Label>
                <Select value={cuisinePref} onValueChange={v => setCuisinePref(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Breakfast */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted">
              <div>
                <Label className="font-semibold">Include Breakfast</Label>
                <p className="text-sm text-muted-foreground">Prefer hotels with breakfast included</p>
              </div>
              <Switch checked={breakfastIncluded} onCheckedChange={setBreakfastIncluded} />
            </div>

            <Button className="w-full gradient-ocean text-primary-foreground text-lg py-6 rounded-xl" onClick={handleSubmit}>
              Find Destinations ✨
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
