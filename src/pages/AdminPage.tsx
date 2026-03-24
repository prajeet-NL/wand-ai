import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { destinations, visaRules } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { Settings, MapPin, Shield, Plane, Building2, Utensils } from "lucide-react";

export default function AdminPage() {
  const { isLoggedIn } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage mock datasets</p>
          </div>
        </div>

        <Tabs defaultValue="destinations">
          <TabsList className="mb-6">
            <TabsTrigger value="destinations"><MapPin className="h-4 w-4 mr-1" /> Destinations</TabsTrigger>
            <TabsTrigger value="visa"><Shield className="h-4 w-4 mr-1" /> Visa Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="destinations">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {destinations.map(d => (
                <Card key={d.id} className="shadow-card">
                  <CardContent className="p-4 space-y-2">
                    <img src={d.image} alt={d.name} className="w-full h-32 object-cover rounded-lg" />
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{d.name}</h3>
                      <Badge variant="secondary">{d.type}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{d.description}</p>
                    <p className="text-sm">Budget: ₹{d.budgetRange.min.toLocaleString()} — ₹{d.budgetRange.max.toLocaleString()}</p>
                    <p className="text-sm">Rating: ⭐ {d.rating}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="visa">
            <div className="space-y-4">
              {Object.entries(visaRules).map(([id, v]) => (
                <Card key={id} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="font-semibold">{v.destination}</h3>
                      <div className="flex gap-2">
                        <Badge variant={v.required ? "default" : "secondary"}>
                          {v.required ? v.type : "Not Required"}
                        </Badge>
                        <Badge variant="outline">{v.cost}</Badge>
                      </div>
                    </div>
                    {v.documents.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Documents: {v.documents.join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1 italic">{v.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
