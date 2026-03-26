import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { destinations, visaRules } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { Settings, MapPin, Shield, Star } from "lucide-react";

export default function AdminPage() {
  const { isLoggedIn } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 md:py-12">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center shadow-glow">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage mock datasets</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Tabs defaultValue="destinations">
            <TabsList className="mb-6 rounded-full bg-muted p-1">
              <TabsTrigger value="destinations" className="rounded-full gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" /> Destinations</TabsTrigger>
              <TabsTrigger value="visa" className="rounded-full gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" /> Visa</TabsTrigger>
            </TabsList>

            <TabsContent value="destinations">
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map(d => (
                  <StaggerItem key={d.id}>
                    <Card className="shadow-card border-border/50 overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-28 overflow-hidden">
                          <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-card/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs">
                            <Star className="h-3 w-3 fill-sunset text-sunset" /> {d.rating}
                          </div>
                        </div>
                        <div className="p-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">{d.name}</h3>
                            <Badge variant="outline" className="text-[10px] capitalize rounded-full">{d.type}</Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{d.description}</p>
                          <p className="text-xs">₹{d.budgetRange.min.toLocaleString()} — ₹{d.budgetRange.max.toLocaleString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </TabsContent>

            <TabsContent value="visa">
              <StaggerContainer className="space-y-3">
                {Object.entries(visaRules).map(([id, v]) => (
                  <StaggerItem key={id}>
                    <Card className="shadow-card border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold text-sm">{v.destination}</h3>
                          <div className="flex gap-1.5">
                            <Badge variant={v.required ? "default" : "secondary"} className="text-[10px]">
                              {v.required ? v.type : "Not Required"}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{v.cost}</Badge>
                          </div>
                        </div>
                        {v.notes && <p className="text-[10px] text-muted-foreground mt-1.5 italic">{v.notes}</p>}
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>
    </div>
  );
}
