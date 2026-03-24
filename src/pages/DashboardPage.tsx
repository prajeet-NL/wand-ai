import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Plane, MapPin, Calendar, FileText, CreditCard, Plus } from "lucide-react";

export default function DashboardPage() {
  const { isLoggedIn, user, bookings } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome, {user?.fullName} 👋</h1>
            <p className="text-muted-foreground">Your travel dashboard</p>
          </div>
          <Button className="gradient-ocean text-primary-foreground" onClick={() => navigate("/plan")}>
            <Plus className="h-4 w-4 mr-2" /> Plan New Trip
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Trips", value: bookings.length, icon: Plane },
            { label: "Upcoming", value: bookings.filter(b => b.status === "upcoming").length, icon: Calendar },
            { label: "Documents", value: bookings.length * 5, icon: FileText },
            { label: "Total Spent", value: `₹${bookings.reduce((s, b) => s + b.totalCost, 0).toLocaleString("en-IN")}`, icon: CreditCard },
          ].map(s => (
            <Card key={s.label} className="shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="font-display text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings */}
        {bookings.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Plane className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">No trips yet</h3>
              <p className="text-muted-foreground mb-4">Start planning your first adventure!</p>
              <Button className="gradient-ocean text-primary-foreground" onClick={() => navigate("/plan")}>
                Plan Your Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold">Your Trips</h2>
            {bookings.map(b => (
              <Card key={b.id} className="shadow-card hover:shadow-elevated transition-all">
                <CardContent className="p-5 flex items-center gap-5 flex-wrap">
                  <img src={b.destination.image} alt={b.destination.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold">{b.destination.name}</h3>
                      <Badge className={b.status === "upcoming" ? "bg-teal/10 text-teal border-teal/20" : "bg-muted text-muted-foreground"}>
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {b.destination.country}
                      <span className="mx-1">·</span>
                      {b.flight.airline}
                      <span className="mx-1">·</span>
                      {b.hotel.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Booking ID: {b.id} · Booked {new Date(b.bookedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-xl font-bold">₹{b.totalCost.toLocaleString("en-IN")}</p>
                    <p className="text-xs text-muted-foreground capitalize">{b.paymentMethod}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Saved Documents */}
        {bookings.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display text-xl font-bold mb-4">Saved Documents</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.flatMap(b => [
                { name: `Flight Ticket — ${b.destination.name}`, type: "PDF" },
                { name: `Hotel Confirmation — ${b.hotel.name}`, type: "PDF" },
                { name: `Visa Checklist — ${b.destination.name}`, type: "PDF" },
                { name: `Transport Guide — ${b.destination.name}`, type: "PDF" },
                { name: `Full Itinerary — ${b.destination.name}`, type: "PDF" },
              ]).map((doc, i) => (
                <Card key={i} className="shadow-card cursor-pointer hover:shadow-elevated transition-all">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                      <FileText className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} · Simulated</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
