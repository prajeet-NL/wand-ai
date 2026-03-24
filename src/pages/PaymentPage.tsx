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
import { CreditCard, Building, Smartphone, CheckCircle2, Loader2 } from "lucide-react";

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
        destination: trip.selectedDestination!,
        flight: trip.selectedFlight!,
        hotel: trip.selectedHotel!,
        restaurants: trip.selectedRestaurants,
        transport: trip.selectedTransport,
        itinerary: trip.itinerary,
        totalCost: total,
        platformFee,
        paymentMethod: method,
        status: "upcoming",
        bookedAt: new Date().toISOString(),
      };
      trip.addBooking(booking);
      setProcessing(false);
      toast.success("Payment successful! Booking confirmed 🎉");
      navigate("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-3xl py-12">
        <h1 className="font-display text-3xl font-bold text-center mb-8">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Summary */}
          <Card className="md:col-span-2 shadow-card h-fit">
            <CardHeader><CardTitle className="font-display text-lg">Booking Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Destination</span><span className="font-semibold">{trip.selectedDestination.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Flight ({trip.preferences!.travelers}x)</span><span>₹{flightCost.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Hotel ({trip.preferences!.duration} nights)</span><span>₹{hotelCost.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span>₹{transportCost.toLocaleString("en-IN")}</span></div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Platform Fee (1%)</span><span>₹{platformFee.toLocaleString("en-IN")}</span></div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                <span>Total</span><span className="text-gradient">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="md:col-span-3 shadow-card">
            <CardHeader><CardTitle className="font-display text-lg">Payment Method</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-3">
                {[
                  { value: "credit", label: "Credit Card", icon: CreditCard },
                  { value: "debit", label: "Debit Card", icon: CreditCard },
                  { value: "netbanking", label: "Net Banking", icon: Building },
                  { value: "upi", label: "UPI", icon: Smartphone },
                ].map(m => (
                  <Label key={m.value} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all
                    ${method === m.value ? "border-primary bg-accent" : "border-border hover:border-primary/50"}`}>
                    <RadioGroupItem value={m.value} className="sr-only" />
                    <m.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{m.label}</span>
                  </Label>
                ))}
              </RadioGroup>

              {(method === "credit" || method === "debit") && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" />
                    </div>
                  </div>
                </div>
              )}

              {method === "upi" && (
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
              )}

              {method === "netbanking" && (
                <div className="p-4 rounded-xl bg-muted text-sm text-muted-foreground text-center">
                  You'll be redirected to your bank's portal (simulated)
                </div>
              )}

              <Button className="w-full gradient-ocean text-primary-foreground text-lg py-6 rounded-xl"
                disabled={processing} onClick={handlePayment}>
                {processing ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Processing Payment...</>
                ) : (
                  <><CheckCircle2 className="h-5 w-5 mr-2" /> Pay ₹{total.toLocaleString("en-IN")}</>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                🔒 This is a simulated payment. No real charges will be made.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
