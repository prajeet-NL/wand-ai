import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrip, BookingDetails } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { FadeIn } from "@/components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Building, Smartphone, CheckCircle2, Loader2, Shield, Lock, MapPin, Plane as PlaneIcon, Building2 } from "lucide-react";

export default function PaymentPage() {
  const trip = useTrip();
  const navigate = useNavigate();
  const [method, setMethod] = useState("credit");
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");

  if (!trip.isLoggedIn || !trip.selectedDestination || !trip.selectedFlight || !trip.selectedHotel) {
    navigate("/plan"); return null;
  }

  const flightCost = trip.selectedFlight.price * trip.preferences!.travelers;
  const hotelCost = trip.selectedHotel.pricePerNight * trip.preferences!.duration;
  const transportCost = trip.selectedTransport.reduce((s, t) => s + t.price, 0);
  const subtotal = flightCost + hotelCost + transportCost;
  const platformFee = Math.round(subtotal * 0.01);
  const total = subtotal + platformFee;

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      const booking: BookingDetails = {
        id: `WA-${Date.now().toString(36).toUpperCase()}`,
        destination: trip.selectedDestination!, flight: trip.selectedFlight!,
        hotel: trip.selectedHotel!, restaurants: trip.selectedRestaurants,
        transport: trip.selectedTransport, itinerary: trip.itinerary,
        totalCost: total, platformFee, paymentMethod: method,
        status: "upcoming", bookedAt: new Date().toISOString(),
      };
      trip.addBooking(booking);
      setProcessing(false);
      toast.success("Booking confirmed! 🎉");
      navigate("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-4xl py-8 md:py-12">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold">Complete your booking</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and pay to confirm your trip</p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Summary */}
          <FadeIn delay={0.05} className="md:col-span-2">
            <div className="sticky top-24 space-y-4">
              <Card className="shadow-elevated border-border/50 overflow-hidden">
                <div className="relative h-32 overflow-hidden">
                  <img src={trip.selectedDestination.image} alt={trip.selectedDestination.name}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-primary-foreground">
                    <div className="flex items-center gap-1 text-xs opacity-80"><MapPin className="h-3 w-3" />{trip.selectedDestination.country}</div>
                    <h3 className="font-display font-bold text-lg">{trip.selectedDestination.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PlaneIcon className="h-3 w-3" /> {trip.selectedFlight.airline}
                    <span className="mx-1">·</span>
                    <Building2 className="h-3 w-3" /> {trip.selectedHotel.name}
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex justify-between"><span className="text-muted-foreground">Flight ({trip.preferences!.travelers}×)</span><span>₹{flightCost.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Hotel ({trip.preferences!.duration}n)</span><span>₹{hotelCost.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span>₹{transportCost.toLocaleString("en-IN")}</span></div>
                  </div>
                  <div className="border-t border-border/50 pt-2 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground"><span>Platform Fee (1%)</span><span>₹{platformFee.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between text-lg font-bold pt-1">
                      <span>Total</span><span className="text-gradient">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" /> 256-bit SSL encrypted
              </div>
            </div>
          </FadeIn>

          {/* Payment Form */}
          <FadeIn delay={0.1} className="md:col-span-3">
            <Card className="shadow-elevated border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-2">
                  {[
                    { value: "credit", label: "Credit Card", icon: CreditCard },
                    { value: "debit", label: "Debit Card", icon: CreditCard },
                    { value: "netbanking", label: "Net Banking", icon: Building },
                    { value: "upi", label: "UPI", icon: Smartphone },
                  ].map(m => (
                    <Label key={m.value} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                      ${method === m.value ? "border-primary bg-accent shadow-glow" : "border-border/50 hover:border-primary/30"}`}>
                      <RadioGroupItem value={m.value} className="sr-only" />
                      <m.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </Label>
                  ))}
                </RadioGroup>

                <AnimatePresence mode="wait">
                  {(method === "credit" || method === "debit") && (
                    <motion.div key="card" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Card Number</Label>
                        <Input placeholder="4242 4242 4242 4242" value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5"><Label className="text-xs">Expiry</Label><Input placeholder="MM/YY" className="h-10 rounded-xl bg-muted/50 border-border/50" /></div>
                        <div className="space-y-1.5"><Label className="text-xs">CVV</Label><Input placeholder="123" type="password" className="h-10 rounded-xl bg-muted/50 border-border/50" /></div>
                      </div>
                    </motion.div>
                  )}
                  {method === "upi" && (
                    <motion.div key="upi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-1.5">
                      <Label className="text-xs">UPI ID</Label>
                      <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} className="h-10 rounded-xl bg-muted/50 border-border/50" />
                    </motion.div>
                  )}
                  {method === "netbanking" && (
                    <motion.div key="net" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground text-center">
                      You'll be redirected to your bank (simulated)
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button className="w-full h-12 gradient-ocean text-primary-foreground rounded-xl shadow-glow font-semibold text-base gap-2"
                    disabled={processing} onClick={handlePayment}>
                    {processing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      <><CheckCircle2 className="h-5 w-5" /> Pay ₹{total.toLocaleString("en-IN")}</>
                    )}
                  </Button>
                </motion.div>

                <p className="text-[10px] text-center text-muted-foreground">
                  🔒 Simulated payment — no real charges
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
