import { useNavigate } from "react-router-dom";
import { useTrip } from "@/contexts/TripContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Plane, MapPin, Calendar, FileText, CreditCard, Plus, Sparkles, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { isLoggedIn, user, bookings } = useTrip();
  const navigate = useNavigate();

  if (!isLoggedIn) { navigate("/login"); return null; }

  const stats = [
    { label: "Total trips", value: bookings.length, icon: Plane },
    { label: "Upcoming", value: bookings.filter((booking) => booking.status === "upcoming").length, icon: Calendar },
    { label: "Documents", value: bookings.length * 5, icon: FileText },
    { label: "Total spent", value: `Rs. ${bookings.reduce((sum, booking) => sum + booking.totalCost, 0).toLocaleString("en-IN")}`, icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#04111d_0%,#0a1f33_32%,#eef5f8_32%,#f8fbfc_100%)]">
      <Navbar />
      <div className="container py-10 md:py-14">
        <div className="rounded-[40px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(143,243,224,0.12),_transparent_18%),linear-gradient(135deg,rgba(5,15,26,0.98),rgba(9,29,47,0.96))] px-6 py-8 text-white shadow-[0_30px_120px_rgba(3,10,18,0.3)] md:px-10 md:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/60">
                <Sparkles className="h-3.5 w-3.5" />
                Personal dashboard
              </div>
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  Welcome back, {user?.fullName}.
                </h1>
                <p className="mt-4 text-lg leading-8 text-white/66">
                  Your planning world now has a proper command center. Track live trips, revisit documents, and launch your next itinerary with momentum.
                </p>
              </div>
            </div>
            <Button
              className="h-14 rounded-full bg-white px-8 text-base font-semibold text-navy hover:bg-white/95"
              onClick={() => navigate("/plan")}
            >
              Plan new trip
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="rounded-[30px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(8,21,37,0.08)]">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#06203a,#0e8578)] text-white">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-2xl font-semibold tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {bookings.length === 0 ? (
          <Card className="mt-10 rounded-[36px] border border-slate-200 bg-white shadow-[0_26px_90px_rgba(8,21,37,0.08)]">
            <CardContent className="p-12 text-center">
              <Plane className="mx-auto h-12 w-12 text-muted-foreground" />
              <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight">No journeys yet</h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Your dashboard is ready. Start shaping the first itinerary and we&apos;ll turn this into a living travel archive.
              </p>
              <Button
                className="mt-8 h-14 rounded-full bg-[linear-gradient(135deg,#06203a,#0e8578)] px-8 text-base font-semibold text-white hover:opacity-95"
                onClick={() => navigate("/plan")}
              >
                Start planning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl font-semibold tracking-tight">Your trips</h2>
                  <p className="text-sm text-muted-foreground">Designed as a premium travel ledger</p>
                </div>
                {bookings.map((booking) => (
                  <Card key={booking.id} className="overflow-hidden rounded-[34px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(8,21,37,0.08)]">
                    <CardContent className="grid gap-5 p-0 md:grid-cols-[220px_1fr]">
                      <img src={booking.destination.image} alt={booking.destination.name} className="h-full min-h-[220px] w-full object-cover" />
                      <div className="flex flex-col justify-between p-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display text-3xl font-semibold tracking-tight">{booking.destination.name}</h3>
                            <Badge className={booking.status === "upcoming" ? "border-0 bg-teal/10 text-teal" : "border-0 bg-slate-100 text-slate-600"}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            {booking.destination.country}
                            <span className="mx-1">•</span>
                            {booking.flight.airline}
                            <span className="mx-1">•</span>
                            {booking.hotel.name}
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Booking ID: {booking.id} • Booked {new Date(booking.bookedAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-slate-200 pt-5">
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Travelers</p>
                              <p className="mt-2 text-sm font-medium text-slate-700">{booking.itinerary.length} day plan</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Payment</p>
                              <p className="mt-2 text-sm font-medium capitalize text-slate-700">{booking.paymentMethod}</p>
                            </div>
                            <div>
                              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Status</p>
                              <p className="mt-2 text-sm font-medium capitalize text-slate-700">{booking.status}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-display text-3xl font-semibold tracking-tight">Rs. {booking.totalCost.toLocaleString("en-IN")}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">Trip value</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-3xl font-semibold tracking-tight">Saved documents</h2>
                  <p className="text-sm text-muted-foreground">Everything in one place</p>
                </div>
                <div className="grid gap-4">
                  {bookings.flatMap((booking) => [
                    { name: `Flight Ticket - ${booking.destination.name}`, type: "PDF" },
                    { name: `Hotel Confirmation - ${booking.hotel.name}`, type: "PDF" },
                    { name: `Visa Checklist - ${booking.destination.name}`, type: "PDF" },
                    { name: `Transport Guide - ${booking.destination.name}`, type: "PDF" },
                    { name: `Full Itinerary - ${booking.destination.name}`, type: "PDF" },
                  ]).map((document, index) => (
                    <Card key={`${document.name}-${index}`} className="rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(8,21,37,0.06)]">
                      <CardContent className="flex items-center gap-4 p-5">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                          <FileText className="h-5 w-5 text-slate-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">{document.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">{document.type} • simulated</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
