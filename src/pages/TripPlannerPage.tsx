import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { visaRules, generateFlights, generateHotels, getRestaurants, getTransport, generateItinerary, Flight, Hotel } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import {
  Shield, Plane, Building2, Bus, Utensils, CalendarDays,
  CheckCircle2, Clock, DollarSign, Star, Wifi, ArrowRight,
  ChevronDown, ChevronUp, AlertCircle, MapPin, Info,
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
      toast.success("Itinerary generated! Review and proceed to booking.");
    }
  }, [step]);

  if (!dest || !prefs) return null;

  const visa = visaRules[dest.id];
  const flights = generateFlights("Delhi", dest.name, prefs.budget);
  const hotels = generateHotels(dest.name, prefs.budget, prefs.breakfastIncluded);
  const restaurants = getRestaurants(dest.id, prefs.foodPref, prefs.cuisinePref);
  const transport = getTransport(dest.id);

  const selectFlight = (f: Flight) => {
    trip.setSelectedFlight(f);
    toast.success(`Flight selected: ${f.airline}`);
    setStep(2);
  };

  const selectHotel = (h: Hotel) => {
    trip.setSelectedHotel(h);
    toast.success(`Hotel selected: ${h.name}`);
    setStep(3);
  };

  const confirmTransport = () => {
    trip.setSelectedTransport(transport);
    toast.success("Transport plan saved");
    setStep(4);
  };

  const confirmFood = () => {
    trip.setSelectedRestaurants(restaurants);
    toast.success("Food recommendations saved");
    setStep(5);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <img src={dest.image} alt={dest.name} className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h1 className="font-display text-2xl font-bold">{dest.name} Trip</h1>
            <p className="text-muted-foreground">{prefs.duration} days · {prefs.travelers} travelers · ₹{prefs.budget.toLocaleString("en-IN")} budget</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <button key={s.label} onClick={() => i <= step && setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${i === step ? "gradient-ocean text-primary-foreground" : i < step ? "bg-teal-light text-teal" : "bg-muted text-muted-foreground"}`}>
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              {s.label}
            </button>
          ))}
        </div>

        {/* STEP 0: Visa */}
        {step === 0 && visa && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Visa Requirements — {dest.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-sm text-muted-foreground">Required</p>
                  <p className="font-bold text-lg">{visa.required ? "Yes" : "No"}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-bold">{visa.type}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-sm text-muted-foreground">Processing</p>
                  <p className="font-bold">{visa.processingDays === 0 ? "Instant" : `${visa.processingDays} days`}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted text-center">
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-bold">{visa.cost}</p>
                </div>
              </div>
              {visa.documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Required Documents:</h4>
                  <ul className="space-y-1.5">
                    {visa.documents.map(doc => (
                      <li key={doc} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {visa.notes && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-accent text-accent-foreground text-sm">
                  <Info className="h-4 w-4 mt-0.5 shrink-0" /> {visa.notes}
                </div>
              )}
              <Button className="gradient-ocean text-primary-foreground" onClick={() => setStep(1)}>
                Continue to Flights <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* STEP 1: Flights */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" /> Select Your Flight
            </h2>
            {flights.map(f => (
              <Card key={f.id} className={`shadow-card cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-0.5 ${trip.selectedFlight?.id === f.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => selectFlight(f)}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Plane className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{f.airline}</p>
                        <p className="text-sm text-muted-foreground">{f.departureTime} → {f.arrivalTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <Clock className="h-4 w-4 mx-auto text-muted-foreground" />
                        <p>{f.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Stops</p>
                        <p>{f.layovers === 0 ? "Non-stop" : `${f.layovers} stop`}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground">Baggage</p>
                        <p>{f.baggage}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold font-display">₹{f.price.toLocaleString("en-IN")}</p>
                      {f.tag && (
                        <Badge className={f.tag === "cheapest" ? "bg-teal/10 text-teal border-teal/20" : f.tag === "fastest" ? "bg-sunset/10 text-sunset border-sunset/20" : "bg-primary/10 text-primary border-primary/20"}>
                          {f.tag === "cheapest" ? "💰 Cheapest" : f.tag === "fastest" ? "⚡ Fastest" : "⭐ Best Value"}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* STEP 2: Hotels */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Choose Your Hotel
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {(showMore ? hotels : hotels.slice(0, 4)).map(h => (
                <Card key={h.id} className={`shadow-card cursor-pointer transition-all hover:shadow-elevated ${trip.selectedHotel?.id === h.id ? "ring-2 ring-primary" : ""}`}
                  onClick={() => selectHotel(h)}>
                  <CardContent className="p-0">
                    <img src={h.image} alt={h.name} className="w-full h-40 object-cover rounded-t-lg" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">{h.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                          <span className="font-semibold">{h.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <h3 className="font-semibold">{h.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {h.location}
                      </p>
                      <p className="text-xs text-muted-foreground">{h.reviewSummary}</p>
                      <div className="flex flex-wrap gap-1">
                        {h.amenities.slice(0, 4).map(a => (
                          <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <p className="text-xl font-bold font-display">₹{h.pricePerNight.toLocaleString("en-IN")}</p>
                          <p className="text-xs text-muted-foreground">per night</p>
                        </div>
                        {h.breakfastIncluded && <Badge className="bg-teal/10 text-teal border-teal/20">🍳 Breakfast</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {hotels.length > 4 && (
              <Button variant="outline" className="w-full" onClick={() => setShowMore(!showMore)}>
                {showMore ? <><ChevronUp className="h-4 w-4 mr-2" /> Show Less</> : <><ChevronDown className="h-4 w-4 mr-2" /> Show More Options</>}
              </Button>
            )}
          </div>
        )}

        {/* STEP 3: Transport */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" /> Local Transport Options
            </h2>
            {transport.map(t => (
              <Card key={t.id} className="shadow-card">
                <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-muted-foreground">{t.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{t.duration}</span>
                    <span className="font-bold">₹{t.price}</span>
                    {t.bookableOnline ? (
                      <Badge className="bg-teal/10 text-teal border-teal/20">Online</Badge>
                    ) : (
                      <Badge variant="outline">Offline only</Badge>
                    )}
                  </div>
                </CardContent>
                {t.offlineGuidance && (
                  <div className="px-4 pb-4">
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent text-sm text-accent-foreground">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {t.offlineGuidance}
                    </div>
                  </div>
                )}
              </Card>
            ))}
            <Button className="gradient-ocean text-primary-foreground" onClick={confirmTransport}>
              Continue to Food <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP 4: Food */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" /> Food Recommendations
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {restaurants.map(r => (
                <Card key={r.id} className="shadow-card">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">{r.type.replace("-", " ")}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                        <span className="font-semibold">{r.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold">{r.name}</h3>
                    <p className="text-sm text-muted-foreground">{r.cuisine} · {r.priceRange}</p>
                    <p className="text-sm italic text-muted-foreground">✨ {r.specialty}</p>
                    <div className="flex flex-wrap gap-1">
                      {r.mealType.map(m => <Badge key={m} variant="outline" className="text-xs capitalize">{m}</Badge>)}
                      {r.vegFriendly && <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">🌿 Veg</Badge>}
                      {r.veganFriendly && <Badge className="bg-teal/10 text-teal border-teal/20 text-xs">🌱 Vegan</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button className="gradient-ocean text-primary-foreground" onClick={confirmFood}>
              Generate Itinerary <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* STEP 5: Itinerary */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="font-display text-xl font-bold flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" /> Your Itinerary
            </h2>
            {trip.itinerary.map(day => (
              <Card key={day.day} className="shadow-card">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-lg">Day {day.day} — {day.date}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative pl-6 space-y-4">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-border" />
                    {day.activities.map((act, i) => (
                      <div key={i} className="relative flex gap-3">
                        <div className={`absolute -left-[18px] w-3 h-3 rounded-full border-2 border-card z-10
                          ${act.type === "flight" ? "bg-primary" : act.type === "hotel" ? "bg-teal" : act.type === "food" ? "bg-sunset" : act.type === "attraction" ? "bg-sky" : "bg-muted-foreground"}`} />
                        <div className="min-w-[50px] text-sm font-mono text-muted-foreground">{act.time}</div>
                        <div>
                          <p className="font-semibold text-sm">{act.title}</p>
                          <p className="text-xs text-muted-foreground">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full gradient-ocean text-primary-foreground text-lg py-6 rounded-xl"
              onClick={() => navigate("/payment")}>
              Proceed to Booking 🎉
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
