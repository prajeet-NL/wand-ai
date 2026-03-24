import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { getRecommendedDestinations, Destination } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Star, MapPin, ArrowRight } from "lucide-react";

export default function DestinationsPage() {
  const { preferences, setSelectedDestination, setCurrentStep, isLoggedIn } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }
  if (!preferences) { navigate("/plan"); return null; }

  const recommended = getRecommendedDestinations(
    preferences.budget, preferences.travelMonth, preferences.duration,
    preferences.destType, preferences.foodPref,
  );

  const handleSelect = (dest: Destination) => {
    setSelectedDestination(dest);
    setCurrentStep(1);
    navigate("/trip-planner");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold">Recommended Destinations</h1>
          <p className="text-muted-foreground mt-2">
            Based on your ₹{preferences.budget.toLocaleString("en-IN")} budget for {preferences.duration} days
          </p>
        </div>

        {recommended.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No destinations match your criteria.</p>
            <Button variant="outline" onClick={() => navigate("/plan")} className="mt-4">Adjust Preferences</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((dest, i) => (
              <div key={dest.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                onClick={() => handleSelect(dest)}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <Badge className="gradient-ocean text-primary-foreground border-0">
                      {dest.type === "domestic" ? "🇮🇳 Domestic" : "🌍 International"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm">
                    <Star className="h-3.5 w-3.5 fill-sunset text-sunset" />
                    <span className="font-semibold">{dest.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{dest.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{dest.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">
                      From <span className="font-bold text-foreground">₹{dest.budgetRange.min.toLocaleString("en-IN")}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => navigate("/plan")}>← Change Preferences</Button>
        </div>
      </div>
    </div>
  );
}
