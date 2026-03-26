import { useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { getRecommendedDestinations, Destination } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Star, MapPin, ArrowRight, Sparkles, Globe2, ChevronLeft } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import Globe from "@/components/Globe";

export default function DestinationsPage() {
  const { preferences, setSelectedDestination, setCurrentStep, isLoggedIn } = useTrip();
  const navigate = useNavigate();
  const [hoveredDest, setHoveredDest] = useState<string | undefined>();

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
      <div className="container py-8 md:py-12">
        <FadeIn>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => navigate("/plan")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs mb-1">
                <Sparkles className="h-3 w-3" /> AI Recommendations
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">Your perfect destinations</h1>
            </div>
          </div>
          <p className="text-muted-foreground text-sm ml-11 mb-8">
            ₹{preferences.budget.toLocaleString("en-IN")} budget · {preferences.duration} days · {recommended.length} matches
          </p>
        </FadeIn>

        {recommended.length === 0 ? (
          <FadeIn delay={0.1}>
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">No matches found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your preferences</p>
              <Button variant="outline" onClick={() => navigate("/plan")} className="rounded-full">
                <ChevronLeft className="h-4 w-4 mr-1" /> Adjust Preferences
              </Button>
            </div>
          </FadeIn>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Globe */}
            <FadeIn delay={0.15} className="lg:col-span-2 hidden lg:block">
              <div className="sticky top-24">
                <div className="aspect-square rounded-3xl bg-navy overflow-hidden border border-border/20 shadow-elevated">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <Globe2 className="h-10 w-10 text-primary/30 mx-auto animate-pulse-soft" />
                        <p className="text-xs text-muted-foreground mt-2">Loading globe...</p>
                      </div>
                    </div>
                  }>
                    <Globe
                      destinations={recommended}
                      onSelect={handleSelect}
                      selectedId={hoveredDest}
                      className="w-full h-full"
                    />
                  </Suspense>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">Drag to rotate · Click markers to select</p>
              </div>
            </FadeIn>

            {/* Cards */}
            <StaggerContainer className="lg:col-span-3 space-y-4">
              {recommended.map((dest) => (
                <StaggerItem key={dest.id}>
                  <motion.div
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-elevated transition-all duration-300 cursor-pointer"
                    onClick={() => handleSelect(dest)}
                    onMouseEnter={() => setHoveredDest(dest.id)}
                    onMouseLeave={() => setHoveredDest(undefined)}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="relative sm:w-48 h-44 sm:h-auto overflow-hidden shrink-0">
                        <img src={dest.image} alt={dest.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-3 left-3">
                          <Badge className="gradient-ocean text-primary-foreground border-0 text-xs shadow-card">
                            {dest.type === "domestic" ? "🇮🇳 India" : "🌍 International"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-0.5">
                              <MapPin className="h-3 w-3" /> {dest.country}
                            </div>
                            <h3 className="font-display text-xl font-bold">{dest.name}</h3>
                          </div>
                          <div className="flex items-center gap-1 bg-muted rounded-full px-2 py-1 text-xs shrink-0">
                            <Star className="h-3 w-3 fill-sunset text-sunset" />
                            <span className="font-semibold">{dest.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{dest.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {dest.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs rounded-full border-border/50">{tag}</Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                          <span className="text-sm">
                            From <span className="font-bold text-gradient">₹{dest.budgetRange.min.toLocaleString("en-IN")}</span>
                          </span>
                          <div className="flex items-center gap-1 text-primary text-sm font-medium">
                            Select <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </div>
  );
}
