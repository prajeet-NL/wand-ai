import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Plane, MapPin, Calendar, FileText, CreditCard, Plus, ArrowRight, Sparkles, Download } from "lucide-react";

export default function DashboardPage() {
  const { isLoggedIn, user, bookings } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }

  const statItems = [
    { label: "Total Trips", value: bookings.length, icon: Plane, color: "gradient-ocean" },
    { label: "Upcoming", value: bookings.filter(b => b.status === "upcoming").length, icon: Calendar, color: "gradient-sky" },
    { label: "Documents", value: bookings.length * 5, icon: FileText, color: "gradient-warm" },
    { label: "Total Spent", value: `₹${bookings.reduce((s, b) => s + b.totalCost, 0).toLocaleString("en-IN")}`, icon: CreditCard, color: "gradient-aurora" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 md:py-12">
        {/* Header */}
        <FadeIn>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl gradient-ocean flex items-center justify-center text-primary-foreground font-bold text-lg shadow-glow">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">Welcome back, {user?.fullName?.split(" ")[0]}</h1>
                <p className="text-sm text-muted-foreground">Your travel dashboard</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="gradient-ocean text-primary-foreground rounded-full shadow-glow gap-2 px-5" onClick={() => navigate("/plan")}>
                <Plus className="h-4 w-4" /> Plan Trip
              </Button>
            </motion.div>
          </div>
        </FadeIn>

        {/* Stats */}
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {statItems.map(s => (
            <StaggerItem key={s.label}>
              <Card className="shadow-card border-border/50 overflow-hidden hover:shadow-elevated transition-shadow">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shrink-0 shadow-card`}>
                    <s.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="font-display text-lg font-bold truncate">{s.value}</p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bookings */}
        {bookings.length === 0 ? (
          <FadeIn delay={0.15}>
            <Card className="shadow-elevated border-border/50 overflow-hidden">
              <CardContent className="p-12 md:p-16 text-center">
                <div className="w-20 h-20 rounded-3xl bg-muted flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Start planning your first adventure with AI-powered recommendations
                </p>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="gradient-ocean text-primary-foreground rounded-full shadow-glow px-6 gap-2" onClick={() => navigate("/plan")}>
                    Plan Your Trip <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </FadeIn>
        ) : (
          <div className="space-y-4">
            <h2 className="font-display text-lg font-bold">Your trips</h2>
            <StaggerContainer className="space-y-3">
              {bookings.map(b => (
                <StaggerItem key={b.id}>
                  <motion.div whileHover={{ y: -2 }}>
                    <Card className="shadow-card border-border/50 hover:shadow-elevated transition-all overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative sm:w-36 h-28 sm:h-auto overflow-hidden shrink-0">
                            <img src={b.destination.image} alt={b.destination.name} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 hidden sm:block" />
                          </div>
                          <div className="flex-1 p-4 flex items-center justify-between flex-wrap gap-3">
                            <div className="min-w-[200px]">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-display text-base font-bold">{b.destination.name}</h3>
                                <Badge className={`text-[10px] ${b.status === "upcoming" ? "bg-teal/10 text-teal border-teal/20" : "bg-muted text-muted-foreground"}`}>
                                  {b.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
                                <MapPin className="h-3 w-3" /> {b.destination.country}
                                <span>·</span> {b.flight.airline}
                                <span>·</span> {b.hotel.name}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {b.id} · {new Date(b.bookedAt).toLocaleDateString("en-IN")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-display text-lg font-bold">₹{b.totalCost.toLocaleString("en-IN")}</p>
                              <p className="text-[10px] text-muted-foreground capitalize">{b.paymentMethod}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {/* Documents */}
        {bookings.length > 0 && (
          <FadeIn delay={0.1}>
            <div className="mt-10">
              <h2 className="font-display text-lg font-bold mb-4">Documents</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {bookings.flatMap(b => [
                  { name: `Flight — ${b.destination.name}`, type: "PDF" },
                  { name: `Hotel — ${b.hotel.name}`, type: "PDF" },
                  { name: `Visa — ${b.destination.name}`, type: "PDF" },
                  { name: `Transport — ${b.destination.name}`, type: "PDF" },
                  { name: `Itinerary — ${b.destination.name}`, type: "PDF" },
                ]).map((doc, i) => (
                  <Card key={i} className="shadow-card border-border/50 cursor-pointer hover:shadow-elevated transition-all group">
                    <CardContent className="p-3 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                        <FileText className="h-3.5 w-3.5 text-accent-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.type}</p>
                      </div>
                      <Download className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
