import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { visaRules, generateFlights, generateHotels, getRestaurants, getTransport, generateItinerary, Flight, Hotel } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import {
  Shield, Plane, Building2, Bus, Utensils, CalendarDays,
  CheckCircle2, Clock, Star, ArrowRight,
  ChevronDown, ChevronUp, AlertCircle, MapPin, Info, Sparkles,
} from "lucide-react";

const steps = [
  { icon: Shield, label: "Visa", eyebrow: "Entry readiness" },
  { icon: Plane, label: "Flights", eyebrow: "Air routing" },
  { icon: Building2, label: "Hotels", eyebrow: "Stay curation" },
  { icon: Bus, label: "Transport", eyebrow: "Local movement" },
  { icon: Utensils, label: "Food", eyebrow: "Taste planning" },
  { icon: CalendarDays, label: "Itinerary", eyebrow: "Day-by-day flow" },
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
      const itinerary = generateItinerary(dest.id, prefs.duration, trip.selectedHotel, restaurants);
      trip.setItinerary(itinerary);
      toast.success("Itinerary generated! Review and proceed to booking.");
    }
  }, [step, dest, prefs, trip]);

  if (!dest || !prefs) return null;

  const visa = visaRules[dest.id];
  const flights = generateFlights("Delhi", dest.name, prefs.budget);
  const hotels = generateHotels(dest.name, prefs.budget, prefs.breakfastIncluded);
  const restaurants = getRestaurants(dest.id, prefs.foodPref, prefs.cuisinePref);
  const transport = getTransport(dest.id);

  const selectFlight = (flight: Flight) => {
    trip.setSelectedFlight(flight);
    toast.success(`Flight selected: ${flight.airline}`);
    setStep(2);
  };

  const selectHotel = (hotel: Hotel) => {
    trip.setSelectedHotel(hotel);
    toast.success(`Hotel selected: ${hotel.name}`);
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#04111d_0%,#0a1f33_34%,#eef5f8_34%,#f8fbfc_100%)]">
      <Navbar />
      <div className="container py-10 md:py-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,243,224,0.12),_transparent_18%),linear-gradient(135deg,rgba(5,15,26,0.98),rgba(9,29,47,0.96))] px-6 py-8 text-white shadow-[0_30px_120px_rgba(3,10,18,0.3)] md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr]">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Guided planner
              </div>
              <div className="flex items-center gap-4">
                <img src={dest.image} alt={dest.name} className="h-20 w-20 rounded-[24px] object-cover shadow-lg shadow-black/30" />
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/45">Selected destination</p>
                  <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">{dest.name}</h1>
                  <p className="mt-2 text-base text-white/62">
                    {prefs.duration} days • {prefs.travelers} travelers • Rs. {prefs.budget.toLocaleString("en-IN")} total intent
                  </p>
                </div>
              </div>
              <p className="max-w-3xl text-lg leading-8 text-white/66">
                This is where WandAI turns recommendation into execution. Move through the steps like a curated travel studio: review entry needs, pick transport and stays, then let the itinerary fall into place.
              </p>
            </div>

            <div className="glass-panel rounded-[32px] p-6">
              <p className="text-xs uppercase tracking-[0.28em] text-white/50">Current phase</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white">{steps[step].label}</h2>
              <p className="mt-2 text-sm leading-7 text-white/62">
                {steps[step].eyebrow} is being shaped now, so the rest of the trip can inherit stronger decisions and cleaner tradeoffs.
              </p>
              <div className="mt-6 flex items-center gap-2">
                {steps.map((item, index) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`h-2.5 w-10 rounded-full ${index <= step ? "bg-teal" : "bg-white/10"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2">
          {steps.map((item, index) => (
            <button
              key={item.label}
              onClick={() => index <= step && setStep(index)}
              className={`planner-step ${index === step ? "planner-step-active" : index < step ? "planner-step-complete" : ""}`}
            >
              {index < step ? <CheckCircle2 className="h-4 w-4" /> : <item.icon className="h-4 w-4" />}
              <span>
                <span className="block text-[11px] uppercase tracking-[0.24em] opacity-60">{item.eyebrow}</span>
                <span className="block font-medium">{item.label}</span>
              </span>
            </button>
          ))}
        </div>

        {step === 0 && visa && (
          <Card className="planner-shell mt-8">
            <CardContent className="space-y-8 p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Entry readiness</p>
                  <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Visa requirements for {dest.name}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                    We surface the essentials first so the trip feels practical from the beginning, not just aspirational.
                  </p>
                </div>
                <Badge className="rounded-full border-0 bg-primary/10 px-4 py-2 text-primary">
                  {visa.required ? visa.type : "No visa needed"}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "Required", value: visa.required ? "Yes" : "No" },
                  { label: "Type", value: visa.type },
                  { label: "Processing", value: visa.processingDays === 0 ? "Instant" : `${visa.processingDays} days` },
                  { label: "Cost", value: visa.cost },
                ].map((item) => (
                  <div key={item.label} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</p>
                    <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              {visa.documents.length > 0 && (
                <div className="rounded-[28px] border border-slate-200 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Required documents</p>
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {visa.documents.map((document) => (
                      <div key={document} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                        <p className="text-sm leading-7 text-slate-600">{document}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {visa.notes && (
                <div className="flex gap-3 rounded-[28px] border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
                  <Info className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="leading-7">{visa.notes}</p>
                </div>
              )}

              <Button
                className="h-14 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] px-8 text-base font-semibold text-white hover:opacity-95"
                onClick={() => setStep(1)}
              >
                Continue to flights
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <div className="mt-8 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Air routing</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Choose the flight that best fits the rhythm of the trip.</h2>
            </div>
            {flights.map((flight) => (
              <Card
                key={flight.id}
                className={`planner-shell cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                  trip.selectedFlight?.id === flight.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => selectFlight(flight)}
              >
                <CardContent className="flex flex-wrap items-center justify-between gap-5 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#06203a,#0e8578)] text-white">
                      <Plane className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display text-2xl font-semibold tracking-tight">{flight.airline}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{flight.departureTime} to {flight.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8 text-sm text-slate-600">
                    <div className="text-center">
                      <Clock className="mx-auto h-4 w-4 text-slate-400" />
                      <p className="mt-2">{flight.duration}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Stops</p>
                      <p className="mt-2">{flight.layovers === 0 ? "Non-stop" : `${flight.layovers} stop`}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Baggage</p>
                      <p className="mt-2">{flight.baggage}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-3xl font-semibold tracking-tight">Rs. {flight.price.toLocaleString("en-IN")}</p>
                    {flight.tag && (
                      <Badge className="mt-3 rounded-full border-0 bg-primary/10 px-3 py-1 text-primary">
                        {flight.tag === "cheapest" ? "Cheapest" : flight.tag === "fastest" ? "Fastest" : "Best Value"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Stay curation</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Choose the stay that defines the tone of the trip.</h2>
              </div>
              {hotels.length > 4 && (
                <Button variant="outline" className="rounded-full" onClick={() => setShowMore((open) => !open)}>
                  {showMore ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showMore ? "Show less" : "Show more"}
                </Button>
              )}
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {(showMore ? hotels : hotels.slice(0, 4)).map((hotel) => (
                <Card
                  key={hotel.id}
                  className={`overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(8,21,37,0.08)] transition-all duration-300 hover:-translate-y-1 ${
                    trip.selectedHotel?.id === hotel.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => selectHotel(hotel)}
                >
                  <CardContent className="p-0">
                    <img src={hotel.image} alt={hotel.name} className="h-52 w-full object-cover" />
                    <div className="space-y-4 p-5">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">{hotel.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                          <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-semibold tracking-tight">{hotel.name}</h3>
                        <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {hotel.location}
                        </p>
                      </div>
                      <p className="text-sm leading-7 text-muted-foreground">{hotel.reviewSummary}</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                        <div>
                          <p className="font-display text-3xl font-semibold tracking-tight">Rs. {hotel.pricePerNight.toLocaleString("en-IN")}</p>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">per night</p>
                        </div>
                        {hotel.breakfastIncluded && <Badge className="rounded-full border-0 bg-teal/10 px-3 py-1 text-teal">Breakfast included</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mt-8 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Local movement</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Create the transfer and city-mobility layer.</h2>
            </div>
            <div className="grid gap-4">
              {transport.map((option) => (
                <Card key={option.id} className="planner-shell">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                          <Bus className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{option.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{option.route}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{option.duration}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-900">Rs. {option.price}</span>
                        <Badge variant={option.bookableOnline ? "default" : "outline"} className={option.bookableOnline ? "border-0 bg-teal/10 text-teal" : ""}>
                          {option.bookableOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                    {option.offlineGuidance && (
                      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <p className="leading-7">{option.offlineGuidance}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              className="h-14 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] px-8 text-base font-semibold text-white hover:opacity-95"
              onClick={confirmTransport}
            >
              Continue to food
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Taste planning</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Curate meals that match the trip&apos;s mood and preferences.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {restaurants.map((restaurant) => (
                <Card key={restaurant.id} className="planner-shell rounded-[30px]">
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">{restaurant.type.replace("-", " ")}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                        <span className="font-semibold">{restaurant.rating}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tight">{restaurant.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{restaurant.cuisine} • {restaurant.priceRange}</p>
                    </div>
                    <p className="text-sm italic leading-7 text-muted-foreground">{restaurant.specialty}</p>
                    <div className="flex flex-wrap gap-2">
                      {restaurant.mealType.map((meal) => <Badge key={meal} variant="outline" className="rounded-full capitalize">{meal}</Badge>)}
                      {restaurant.vegFriendly && <Badge className="rounded-full border-0 bg-teal/10 text-teal">Veg</Badge>}
                      {restaurant.veganFriendly && <Badge className="rounded-full border-0 bg-teal/10 text-teal">Vegan</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              className="h-14 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] px-8 text-base font-semibold text-white hover:opacity-95"
              onClick={confirmFood}
            >
              Generate itinerary
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 5 && (
          <div className="mt-8 space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Day-by-day flow</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Your trip is now structured into a complete itinerary.</h2>
              </div>
              <Button
                className="h-14 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] px-8 text-base font-semibold text-white hover:opacity-95"
                onClick={() => navigate("/payment")}
              >
                Proceed to booking
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {trip.itinerary.map((day) => (
              <Card key={day.day} className="planner-shell rounded-[34px]">
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Day {day.day}</p>
                      <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight">{day.date}</h3>
                    </div>
                    <Badge className="rounded-full border-0 bg-primary/10 px-4 py-2 text-primary">
                      {day.activities.length} moments planned
                    </Badge>
                  </div>
                  <div className="relative mt-6 space-y-5 pl-7">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-slate-200" />
                    {day.activities.map((activity, index) => (
                      <div key={`${activity.time}-${index}`} className="relative flex gap-4">
                        <div
                          className={`absolute -left-[18px] top-2 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            activity.type === "flight"
                              ? "bg-primary"
                              : activity.type === "hotel"
                                ? "bg-teal"
                                : activity.type === "food"
                                  ? "bg-sunset"
                                  : activity.type === "attraction"
                                    ? "bg-sky"
                                    : "bg-slate-400"
                          }`}
                        />
                        <div className="min-w-[64px] text-sm font-medium text-slate-500">{activity.time}</div>
                        <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                          <p className="font-medium text-slate-900">{activity.title}</p>
                          <p className="mt-1 text-sm leading-7 text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
