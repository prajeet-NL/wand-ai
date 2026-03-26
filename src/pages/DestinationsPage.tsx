import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { getRecommendedDestinations, Destination } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import DestinationGlobe from "@/components/DestinationGlobe";
import { Star, ArrowRight, Sparkles, Compass, CalendarDays, WalletCards } from "lucide-react";

const destinationCoordinates: Record<string, { lat: number; lon: number }> = {
  goa: { lat: 15.3, lon: 74.1 },
  manali: { lat: 32.2, lon: 77.2 },
  kerala: { lat: 10.85, lon: 76.27 },
  jaipur: { lat: 26.91, lon: 75.79 },
  andaman: { lat: 11.74, lon: 92.65 },
  thailand: { lat: 13.75, lon: 100.5 },
  dubai: { lat: 25.2, lon: 55.27 },
  vietnam: { lat: 21.03, lon: 105.85 },
  singapore: { lat: 1.35, lon: 103.82 },
  bali: { lat: -8.41, lon: 115.19 },
  turkey: { lat: 41.01, lon: 28.97 },
};

export default function DestinationsPage() {
  const { preferences, setSelectedDestination, setCurrentStep, isLoggedIn } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }
  if (!preferences) { navigate("/plan"); return null; }

  const recommended = getRecommendedDestinations(
    preferences.budget,
    preferences.travelMonth,
    preferences.duration,
    preferences.destType,
    preferences.foodPref,
  );

  const enrichedDestinations = useMemo(
    () =>
      recommended.map((destination) => ({
        ...destination,
        coordinates: destinationCoordinates[destination.id] || { lat: 0, lon: 0 },
      })),
    [recommended],
  );
  const [selectedId, setSelectedId] = useState<string | null>(enrichedDestinations[0]?.id || null);

  const activeDestination = enrichedDestinations.find((destination) => destination.id === selectedId) || enrichedDestinations[0];

  const handleSelect = (destination: Destination) => {
    setSelectedDestination(destination);
    setCurrentStep(1);
    navigate("/trip-planner");
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#04111d_0%,#0a1f33_30%,#eef5f8_30%,#f8fbfc_100%)]">
      <Navbar />
      <div className="container py-10 md:py-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,243,224,0.12),_transparent_18%),linear-gradient(135deg,rgba(5,15,26,0.98),rgba(9,29,47,0.96))] px-6 py-8 text-white shadow-[0_30px_120px_rgba(3,10,18,0.3)] md:px-10 md:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Matched destinations
              </div>
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  Rotate the world until your next chapter clicks.
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/66">
                  We ranked destinations around your brief, then placed them on a navigable globe so discovery feels exploratory instead of list-based.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-panel rounded-[28px] p-5">
                  <WalletCards className="h-5 w-5 text-teal" />
                  <p className="mt-4 text-sm text-white/55">Budget anchor</p>
                  <p className="mt-1 font-display text-2xl text-white">Rs. {preferences.budget.toLocaleString("en-IN")}</p>
                </div>
                <div className="glass-panel rounded-[28px] p-5">
                  <CalendarDays className="h-5 w-5 text-teal" />
                  <p className="mt-4 text-sm text-white/55">Trip duration</p>
                  <p className="mt-1 font-display text-2xl text-white">{preferences.duration} days</p>
                </div>
                <div className="glass-panel rounded-[28px] p-5">
                  <Compass className="h-5 w-5 text-teal" />
                  <p className="mt-4 text-sm text-white/55">Search mode</p>
                  <p className="mt-1 font-display text-2xl capitalize text-white">{preferences.destType}</p>
                </div>
              </div>
            </div>

            {enrichedDestinations.length > 0 ? (
              <DestinationGlobe
                destinations={enrichedDestinations}
                selectedId={selectedId}
                onSelect={(destination) => setSelectedId(destination.id)}
              />
            ) : null}
          </div>
        </div>

        {recommended.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-muted-foreground">No destinations match your current profile.</p>
            <Button variant="outline" onClick={() => navigate("/plan")} className="mt-4 rounded-full">
              Refine preferences
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-4">
              {enrichedDestinations.map((destination) => {
                const active = destination.id === activeDestination?.id;
                return (
                  <button
                    key={destination.id}
                    type="button"
                    onClick={() => setSelectedId(destination.id)}
                    className={`destination-list-item w-full text-left ${active ? "destination-list-item-active" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-display text-2xl font-semibold tracking-tight">{destination.name}</h2>
                          <Badge className={active ? "bg-white text-navy" : "border-0 bg-primary/10 text-primary"}>
                            {destination.type}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{destination.description}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                        {destination.rating.toFixed(1)}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {destination.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.24em]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            {activeDestination && (
              <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-[0_28px_100px_rgba(8,21,37,0.12)]">
                <div className="relative h-72 overflow-hidden">
                  <img src={activeDestination.image} alt={activeDestination.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,10,18,0.08),rgba(3,10,18,0.68))]" />
                  <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                    <p className="text-xs uppercase tracking-[0.32em] text-white/60">Featured match</p>
                    <div className="mt-3 flex items-end justify-between gap-4">
                      <div>
                        <h2 className="font-display text-4xl font-semibold tracking-tight">{activeDestination.name}</h2>
                        <p className="mt-2 text-base text-white/68">{activeDestination.country}</p>
                      </div>
                      <div className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/78">
                        curated
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 p-8">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Starting budget</p>
                      <p className="mt-3 font-display text-2xl text-slate-900">Rs. {activeDestination.budgetRange.min.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Best season fit</p>
                      <p className="mt-3 font-display text-2xl text-slate-900">{preferences.duration} day pace</p>
                    </div>
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Food compatibility</p>
                      <p className="mt-3 font-display text-2xl text-slate-900">{activeDestination.vegFriendly ? "High" : "Mixed"}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Why it works</p>
                    <div className="mt-4 grid gap-3">
                      {[
                        `Optimized for a ${preferences.duration}-day itinerary with strong signal quality.`,
                        `Aligned to a budget of Rs. ${preferences.budget.toLocaleString("en-IN")} and a ${preferences.destType} search style.`,
                        `Tags like ${activeDestination.tags.slice(0, 3).join(", ")} make it a strong emotional and practical fit.`,
                      ].map((reason) => (
                        <div key={reason} className="flex gap-3 rounded-[24px] border border-slate-200 p-4">
                          <span className="mt-2 h-2.5 w-2.5 rounded-full bg-primary" />
                          <p className="text-sm leading-7 text-slate-600">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      onClick={() => handleSelect(activeDestination)}
                      className="h-14 flex-1 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                    >
                      Design this trip
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate("/plan")}
                      className="h-14 rounded-full border-slate-200 px-6"
                    >
                      Refine brief
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
