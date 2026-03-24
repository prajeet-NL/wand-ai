import React, { createContext, useContext, useState, ReactNode } from "react";
import { Destination, Flight, Hotel, Restaurant, TransportOption, ItineraryDay } from "@/data/mockData";

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  passportNumber: string;
  dob: string;
  nationality: string;
  profilePhoto?: string;
}

export interface TravelPreferences {
  budget: number;
  travelMonth: number;
  duration: number;
  travelers: number;
  destType: "domestic" | "international" | "flexible";
  foodPref: "veg" | "non-veg" | "vegan" | "any";
  cuisinePref: "indian" | "local" | "both";
  breakfastIncluded: boolean;
}

export interface BookingDetails {
  id: string;
  destination: Destination;
  flight: Flight;
  hotel: Hotel;
  restaurants: Restaurant[];
  transport: TransportOption[];
  itinerary: ItineraryDay[];
  totalCost: number;
  platformFee: number;
  paymentMethod: string;
  status: "confirmed" | "upcoming" | "completed";
  bookedAt: string;
}

interface TripContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (profile: UserProfile, password: string) => { success: boolean; error?: string };
  logout: () => void;
  preferences: TravelPreferences | null;
  setPreferences: (p: TravelPreferences) => void;
  selectedDestination: Destination | null;
  setSelectedDestination: (d: Destination | null) => void;
  selectedFlight: Flight | null;
  setSelectedFlight: (f: Flight | null) => void;
  selectedHotel: Hotel | null;
  setSelectedHotel: (h: Hotel | null) => void;
  selectedRestaurants: Restaurant[];
  setSelectedRestaurants: (r: Restaurant[]) => void;
  selectedTransport: TransportOption[];
  setSelectedTransport: (t: TransportOption[]) => void;
  itinerary: ItineraryDay[];
  setItinerary: (it: ItineraryDay[]) => void;
  bookings: BookingDetails[];
  addBooking: (b: BookingDetails) => void;
  currentStep: number;
  setCurrentStep: (s: number) => void;
}

const TripContext = createContext<TripContextType | null>(null);

// Simple mock user store
const mockUsers: Record<string, { profile: UserProfile; password: string }> = {};
const demoProfile: UserProfile = {
  fullName: "Demo Traveler",
  email: "demo@wandai.com",
  phone: "+91 98765 43210",
  passportNumber: "J1234567",
  dob: "1995-06-15",
  nationality: "Indian",
};

export function TripProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRestaurants, setSelectedRestaurants] = useState<Restaurant[]>([]);
  const [selectedTransport, setSelectedTransport] = useState<TransportOption[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const register = (profile: UserProfile, password: string) => {
    const duplicateEmail = mockUsers[profile.email] || profile.email === demoProfile.email;
    const duplicatePassport = Object.values(mockUsers).some(
      (existing) => existing.profile.passportNumber === profile.passportNumber,
    ) || profile.passportNumber === demoProfile.passportNumber;

    if (duplicateEmail || duplicatePassport) {
      return { success: false, error: "User already exists with this passport or email." };
    }

    mockUsers[profile.email] = { profile, password };
    setUser(profile);
    return { success: true };
  };

  const login = (email: string, password: string) => {
    const u = mockUsers[email];
    if (u && u.password === password) { setUser(u.profile); return true; }
    // Demo login
    if (email === "demo@wandai.com" && password === "demo123") {
      setUser(demoProfile);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setPreferences(null);
    setSelectedDestination(null);
    setSelectedFlight(null);
    setSelectedHotel(null);
    setSelectedRestaurants([]);
    setSelectedTransport([]);
    setItinerary([]);
    setCurrentStep(0);
  };

  const addBooking = (b: BookingDetails) => setBookings(prev => [...prev, b]);

  return (
    <TripContext.Provider value={{
      user, setUser, isLoggedIn: !!user, login, register, logout,
      preferences, setPreferences,
      selectedDestination, setSelectedDestination,
      selectedFlight, setSelectedFlight,
      selectedHotel, setSelectedHotel,
      selectedRestaurants, setSelectedRestaurants,
      selectedTransport, setSelectedTransport,
      itinerary, setItinerary,
      bookings, addBooking,
      currentStep, setCurrentStep,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
