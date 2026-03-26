import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { visaRules, generateFlights, generateHotels, getRestaurants, getTransport, generateItinerary, Flight, Hotel } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Plane, Building2, Bus, Utensils, CalendarDays,
  CheckCircle2, Clock, Star, ArrowRight,
  ChevronDown, ChevronUp, AlertCircle, MapPin, Info, Sparkles,
} from "lucide-react";

const steps = [
  { icon: Shield, label: "Visa" },
  { icon: Plane, label: "Flights" },
  { icon: Building2, label: "Hotels" },
  { icon: Bus, label: "Transport" },
  { icon: Utensils, label: "Food" },
  { icon: CalendarDays, label: "Itinerary" },
];

export default function TripPlannerPage() {
  const trip = useTrip();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showMore, setShowMore] = useState(false);

  const dest = trip.selectedDestination;
  const prefs = trip.preferences;

  useEffect(() => {
    if (!trip.isLoggedIn) navigate("/login");
    else if (!dest || !prefs) navigate("/plan");
  }, [trip.isLoggedIn, dest, prefs, navigate]);

  useEffect(() => {
    if (step === 5 && dest && prefs && trip.itinerary.length === 0 && trip.selectedHotel) {
      const restaurants = getRestaurants(dest.id, prefs.foodPref, prefs.cuisinePref);
      const it = generateItinerary(dest.id, prefs.duration, trip.selectedHotel, restaurants);
      trip.setItinerary(it);
      toast.success("Itinerary generated!");
    }
  }, [step]);

  if (!dest || !prefs) return null;

  const visa = visaRules[dest.id];
  const flights = generateFlights("Delhi", dest.name, prefs.budget);
  const hotels = generateHotels(dest.name, prefs.budget, prefs.breakfastIncluded);
  const restaurants = getRestaurants(dest.id, prefs.foodPref, prefs.cuisinePref);
  const transport = getTransport(dest.id);

  const selectFlight = (f: Flight) => { trip.setSelectedFlight(f); toast.success(`Flight: ${f.airline}`); setStep(2); };
  const selectHotel = (h: Hotel) => { trip.setSelectedHotel(h); toast.success(`Hotel: ${h.name}`); setStep(3); };
  const confirmTransport = () => { trip.setSelectedTransport(transport); toast.success("Transport saved"); setStep(4); };
  const confirmFood = () => { trip.setSelectedRestaurants(restaurants); toast.success("Food saved"); setStep(5); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-6 md:py-8 max-w-5xl">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-card shrink-0">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-display text-xl md:text-2xl font-bold">{dest.name} Trip</h1>
              <p className="text-sm text-muted-foreground">{prefs.duration} days · {prefs.travelers} travelers · ₹{prefs.budget.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </FadeIn>

        {/* Step indicator */}
        <FadeIn delay={0.05}>
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2 scrollbar-none">
            {steps.map((s, i) => (
              <button key={s.label} onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300
                  ${i === step ? "gradient-ocean text-primary-foreground shadow-glow" : i < step ? "bg-teal-light text-teal" : "bg-muted text-muted-foreground"}`}>
                {i < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                {s.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {/* STEP 0: Visa */}
          {step === 0 && visa && (
            <motion.div key="visa" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <Card className="shadow-elevated border-border/50">
                <CardHeader className="pb-4">
                  <CardTitle className="font-display flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 rounded-xl gradient-ocean flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary-foreground" />
                    </div>
                    Visa Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Required", value: visa.required ? "Yes" : "No" },
                      { label: "Type", value: visa.type },
                      { label: "Processing", value: visa.processingDays === 0 ? "Instant" : `${visa.processingDays} days` },
                      { label: "Cost", value: visa.cost },
                    ].map(v => (
                      <div key={v.label} className="p-3 rounded-xl bg-muted/50 border border-border/50 text-center">
                        <p className="text-xs text-muted-foreground">{v.label}</p>
                        <p className="font-bold text-sm mt-0.5">{v.value}</p>
                      </div>
                    ))}
                  </div>
                  {visa.documents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Required Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                        {visa.documents.map(doc => (
                          <div key={doc} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/30">
                            <CheckCircle2 className="h-3.5 w-3.5 text-teal shrink-0" /> {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {visa.notes && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/50 border border-accent text-sm text-accent-foreground">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" /> {visa.notes}
                    </div>
                  )}
                  <Button className="gradient-ocean text-primary-foreground rounded-xl shadow-glow gap-2" onClick={() => setStep(1)}>
                    Continue to Flights <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 1: Flights */}
          {step === 1 && (
            <motion.div key="flights" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-ocean flex items-center justify-center">
                  <Plane className="h-4 w-4 text-primary-foreground" />
                </div>
                Select your flight
              </h2>
              {flights.map(f => (
                <motion.div key={f.id} whileHover={{ y: -2 }} whileTap={{ scale: 0.995 }}>
                  <Card className={`cursor-pointer transition-all duration-200 ${trip.selectedFlight?.id === f.id ? "ring-2 ring-primary shadow-glow" : "shadow-card hover:shadow-elevated border-border/50"}`}
                    onClick={() => selectFlight(f)}>
                    <CardContent className="p-4 md:p-5">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Plane className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{f.airline}</p>
                            <p className="text-xs text-muted-foreground">{f.departureTime} → {f.arrivalTime}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 text-xs">
                          <div className="text-center"><Clock className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" /><p>{f.duration}</p></div>
                          <div className="text-center"><p className="text-muted-foreground">Stops</p><p>{f.layovers === 0 ? "Non-stop" : `${f.layovers} stop`}</p></div>
                          <div className="text-center"><p className="text-muted-foreground">Bag</p><p>{f.baggage}</p></div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold font-display">₹{f.price.toLocaleString("en-IN")}</p>
                          {f.tag && (
                            <Badge className={`text-xs ${f.tag === "cheapest" ? "bg-teal/10 text-teal border-teal/20" : f.tag === "fastest" ? "bg-sunset/10 text-sunset border-sunset/20" : "bg-primary/10 text-primary border-primary/20"}`}>
                              {f.tag === "cheapest" ? "💰 Cheapest" : f.tag === "fastest" ? "⚡ Fastest" : "⭐ Best Value"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* STEP 2: Hotels */}
          {step === 2 && (
            <motion.div key="hotels" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-ocean flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary-foreground" />
                </div>
                Choose your hotel
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {(showMore ? hotels : hotels.slice(0, 4)).map(h => (
                  <motion.div key={h.id} whileHover={{ y: -2 }}>
                    <Card className={`cursor-pointer transition-all overflow-hidden ${trip.selectedHotel?.id === h.id ? "ring-2 ring-primary shadow-glow" : "shadow-card hover:shadow-elevated border-border/50"}`}
                      onClick={() => selectHotel(h)}>
                      <CardContent className="p-0">
                        <div className="relative h-36 overflow-hidden">
                          <img src={h.image} alt={h.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
                            <Star className="h-3 w-3 fill-sunset text-sunset" />
                            <span className="font-semibold">{h.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <Badge variant="outline" className="capitalize text-xs rounded-full">{h.category}</Badge>
                          <h3 className="font-semibold text-sm">{h.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {h.location}</p>
                          <div className="flex flex-wrap gap-1">
                            {h.amenities.slice(0, 3).map(a => <Badge key={a} variant="outline" className="text-[10px] rounded-full">{a}</Badge>)}
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-border/50">
                            <div>
                              <p className="text-lg font-bold font-display">₹{h.pricePerNight.toLocaleString("en-IN")}</p>
                              <p className="text-[10px] text-muted-foreground">per night</p>
                            </div>
                            {h.breakfastIncluded && <Badge className="bg-teal/10 text-teal border-teal/20 text-[10px]">🍳 Breakfast</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              {hotels.length > 4 && (
                <Button variant="ghost" className="w-full rounded-xl text-sm" onClick={() => setShowMore(!showMore)}>
                  {showMore ? <><ChevronUp className="h-4 w-4 mr-1" /> Show less</> : <><ChevronDown className="h-4 w-4 mr-1" /> Show more</>}
                </Button>
              )}
            </motion.div>
          )}

          {/* STEP 3: Transport */}
          {step === 3 && (
            <motion.div key="transport" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-ocean flex items-center justify-center">
                  <Bus className="h-4 w-4 text-primary-foreground" />
                </div>
                Local transport
              </h2>
              {transport.map(t => (
                <Card key={t.id} className="shadow-card border-border/50">
                  <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <Bus className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.route}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span>{t.duration}</span>
                      <span className="font-bold">₹{t.price}</span>
                      <Badge className={`text-[10px] ${t.bookableOnline ? "bg-teal/10 text-teal border-teal/20" : ""}`} variant={t.bookableOnline ? "default" : "outline"}>
                        {t.bookableOnline ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  </CardContent>
                  {t.offlineGuidance && (
                    <div className="px-4 pb-3">
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-accent/50 text-xs text-accent-foreground">
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {t.offlineGuidance}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              <Button className="gradient-ocean text-primary-foreground rounded-xl shadow-glow gap-2" onClick={confirmTransport}>
                Continue to Food <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 4: Food */}
          {step === 4 && (
            <motion.div key="food" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-4">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-warm flex items-center justify-center">
                  <Utensils className="h-4 w-4 text-primary-foreground" />
                </div>
                Food recommendations
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {restaurants.map(r => (
                  <Card key={r.id} className="shadow-card border-border/50">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize text-[10px] rounded-full">{r.type.replace("-", " ")}</Badge>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-sunset text-sunset" />
                          <span className="font-semibold">{r.rating}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm">{r.name}</h3>
                      <p className="text-xs text-muted-foreground">{r.cuisine} · {r.priceRange}</p>
                      <p className="text-xs italic text-muted-foreground">✨ {r.specialty}</p>
                      <div className="flex flex-wrap gap-1">
                        {r.mealType.map(m => <Badge key={m} variant="outline" className="text-[10px] capitalize rounded-full">{m}</Badge>)}
                        {r.vegFriendly && <Badge className="bg-teal/10 text-teal border-teal/20 text-[10px]">🌿 Veg</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button className="gradient-ocean text-primary-foreground rounded-xl shadow-glow gap-2" onClick={confirmFood}>
                Generate Itinerary <Sparkles className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 5: Itinerary */}
          {step === 5 && (
            <motion.div key="itinerary" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
              <h2 className="font-display text-lg font-bold flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl gradient-ocean flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-primary-foreground" />
                </div>
                Your itinerary
              </h2>
              {trip.itinerary.map(day => (
                <Card key={day.day} className="shadow-card border-border/50 overflow-hidden">
                  <CardHeader className="pb-2 bg-muted/30">
                    <CardTitle className="font-display text-base flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg gradient-ocean flex items-center justify-center text-xs text-primary-foreground font-bold">{day.day}</span>
                      {day.date}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="relative pl-6 space-y-3">
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border rounded-full" />
                      {day.activities.map((act, i) => (
                        <div key={i} className="relative flex gap-3">
                          <div className={`absolute -left-[18px] w-3 h-3 rounded-full border-2 border-card z-10 shadow-sm
                            ${act.type === "flight" ? "bg-primary" : act.type === "hotel" ? "bg-teal" : act.type === "food" ? "bg-sunset" : act.type === "attraction" ? "bg-sky" : "bg-muted-foreground"}`} />
                          <div className="min-w-[45px] text-xs font-mono text-muted-foreground pt-0.5">{act.time}</div>
                          <div>
                            <p className="font-medium text-sm">{act.title}</p>
                            <p className="text-xs text-muted-foreground">{act.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button className="w-full h-12 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold text-base gap-2"
                  onClick={() => navigate("/payment")}>
                  Proceed to Booking <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
