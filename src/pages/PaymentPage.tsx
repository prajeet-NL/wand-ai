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
import { CreditCard, Building, Smartphone, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";

export default function PaymentPage() {
  const trip = useTrip();
  const navigate = useNavigate();
  const [method, setMethod] = useState("credit");
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [upiId, setUpiId] = useState("");

  if (!trip.isLoggedIn || !trip.selectedDestination || !trip.selectedFlight || !trip.selectedHotel) {
    navigate("/plan");
    return null;
  }

  const flightCost = trip.selectedFlight.price * trip.preferences!.travelers;
  const hotelCost = trip.selectedHotel.pricePerNight * trip.preferences!.duration;
  const transportCost = trip.selectedTransport.reduce((sum, option) => sum + option.price, 0);
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
      toast.success("Payment successful! Booking confirmed.");
      navigate("/dashboard");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#04111d_0%,#0a1f33_34%,#eef5f8_34%,#f8fbfc_100%)]">
      <Navbar />
      <div className="container py-10 md:py-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,243,224,0.12),_transparent_18%),linear-gradient(135deg,rgba(5,15,26,0.98),rgba(9,29,47,0.96))] px-6 py-8 text-white shadow-[0_30px_120px_rgba(3,10,18,0.3)] md:px-10 md:py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.88fr] lg:items-end">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Final confirmation
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                Confirm a trip that already feels complete.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-white/66">
                The booking screen should feel calm, trustworthy, and premium. Review the final structure, choose a payment method, and lock in the journey.
              </p>
            </div>
            <div className="glass-panel rounded-[32px] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <p className="font-display text-xl text-white">Protected checkout layer</p>
                  <p className="mt-2 text-sm leading-7 text-white/62">
                    This is still a simulated payment flow, but the experience is structured like a real premium booking confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Card className="h-fit rounded-[36px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(8,21,37,0.08)]">
            <CardHeader className="border-b border-slate-200/80 p-8">
              <CardTitle className="font-display text-2xl">Booking summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-8">
              <div className="overflow-hidden rounded-[28px] border border-slate-200">
                <img src={trip.selectedDestination.image} alt={trip.selectedDestination.name} className="h-48 w-full object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Destination</p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight">{trip.selectedDestination.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{trip.selectedFlight.airline} • {trip.selectedHotel.name}</p>
              </div>
              <div className="space-y-3 rounded-[28px] border border-slate-200 bg-slate-50 p-5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Flight ({trip.preferences!.travelers}x)</span><span>Rs. {flightCost.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hotel ({trip.preferences!.duration} nights)</span><span>Rs. {hotelCost.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Transport</span><span>Rs. {transportCost.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-3"><span className="text-muted-foreground">Subtotal</span><span>Rs. {subtotal.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Platform fee (1%)</span><span>Rs. {platformFee.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-semibold">
                  <span>Total</span><span className="font-display text-2xl">Rs. {total.toLocaleString("en-IN")}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[36px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(8,21,37,0.08)]">
            <CardHeader className="border-b border-slate-200/80 p-8">
              <CardTitle className="font-display text-2xl">Payment method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <RadioGroup value={method} onValueChange={setMethod} className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: "credit", label: "Credit card", icon: CreditCard },
                  { value: "debit", label: "Debit card", icon: CreditCard },
                  { value: "netbanking", label: "Net banking", icon: Building },
                  { value: "upi", label: "UPI", icon: Smartphone },
                ].map((option) => (
                  <Label
                    key={option.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-[24px] border p-4 transition-all ${
                      method === option.value ? "border-primary bg-accent" : "border-slate-200 hover:border-primary/40 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} className="sr-only" />
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <option.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{option.label}</p>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">secure</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              {(method === "credit" || method === "debit") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input
                      placeholder="4242 4242 4242 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="h-12 rounded-2xl bg-slate-50"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" className="h-12 rounded-2xl bg-slate-50" />
                    </div>
                  </div>
                </div>
              )}

              {method === "upi" && (
                <div className="space-y-2">
                  <Label>UPI ID</Label>
                  <Input
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-12 rounded-2xl bg-slate-50"
                  />
                </div>
              )}

              {method === "netbanking" && (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-muted-foreground">
                  You&apos;ll be redirected to your bank&apos;s portal as part of the simulated checkout handoff.
                </div>
              )}

              <Button
                className="h-14 w-full rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] text-base font-semibold text-white hover:opacity-95"
                disabled={processing}
                onClick={handlePayment}
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing payment...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Pay Rs. {total.toLocaleString("en-IN")}
                  </>
                )}
              </Button>

              <p className="text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Simulated payment • no real charges
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
