// ============= MOCK DATA LAYER =============
// All external service simulations in one place for easy future API replacement

export interface Destination {
  id: string;
  name: string;
  country: string;
  type: "domestic" | "international";
  image: string;
  description: string;
  budgetRange: { min: number; max: number };
  bestMonths: number[];
  tags: string[];
  rating: number;
  vegFriendly: boolean;
}

export interface VisaInfo {
  destination: string;
  required: boolean;
  type: string;
  processingDays: number;
  documents: string[];
  cost: string;
  notes: string;
}

export interface Flight {
  id: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  layovers: number;
  price: number;
  baggage: string;
  tag?: "cheapest" | "fastest" | "best-value";
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewSummary: string;
  amenities: string[];
  image: string;
  breakfastIncluded: boolean;
  category: "budget" | "mid-range" | "luxury";
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  vegFriendly: boolean;
  veganFriendly: boolean;
  mealType: ("breakfast" | "lunch" | "dinner" | "snack")[];
  specialty: string;
  type: "restaurant" | "cafe" | "street-food";
}

export interface TransportOption {
  id: string;
  type: "airport-transfer" | "metro" | "bus" | "train" | "ferry" | "taxi";
  name: string;
  route: string;
  duration: string;
  price: number;
  bookableOnline: boolean;
  offlineGuidance?: string;
}

// ============= DESTINATIONS =============
export const destinations: Destination[] = [
  {
    id: "goa", name: "Goa", country: "India", type: "domestic",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    description: "Sun-kissed beaches, vibrant nightlife, and Portuguese heritage",
    budgetRange: { min: 15000, max: 80000 }, bestMonths: [10, 11, 12, 1, 2, 3],
    tags: ["beach", "nightlife", "culture"], rating: 4.5, vegFriendly: true,
  },
  {
    id: "manali", name: "Manali", country: "India", type: "domestic",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    description: "Snow-capped mountains, adventure sports, and serene valleys",
    budgetRange: { min: 10000, max: 60000 }, bestMonths: [3, 4, 5, 6, 9, 10],
    tags: ["mountains", "adventure", "nature"], rating: 4.6, vegFriendly: true,
  },
  {
    id: "kerala", name: "Kerala", country: "India", type: "domestic",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    description: "Backwaters, Ayurveda retreats, and lush tropical landscapes",
    budgetRange: { min: 12000, max: 70000 }, bestMonths: [9, 10, 11, 12, 1, 2],
    tags: ["backwaters", "wellness", "nature"], rating: 4.7, vegFriendly: true,
  },
  {
    id: "jaipur", name: "Jaipur", country: "India", type: "domestic",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600",
    description: "Royal palaces, vibrant bazaars, and rich Rajasthani heritage",
    budgetRange: { min: 8000, max: 50000 }, bestMonths: [10, 11, 12, 1, 2, 3],
    tags: ["culture", "history", "food"], rating: 4.4, vegFriendly: true,
  },
  {
    id: "andaman", name: "Andaman", country: "India", type: "domestic",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    description: "Crystal-clear waters, pristine beaches, and coral reefs",
    budgetRange: { min: 20000, max: 100000 }, bestMonths: [10, 11, 12, 1, 2, 3, 4, 5],
    tags: ["beach", "diving", "island"], rating: 4.8, vegFriendly: false,
  },
  {
    id: "thailand", name: "Thailand", country: "Thailand", type: "international",
    image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600",
    description: "Temples, street food, tropical islands, and buzzing nightlife",
    budgetRange: { min: 30000, max: 150000 }, bestMonths: [11, 12, 1, 2, 3],
    tags: ["beach", "food", "culture", "nightlife"], rating: 4.6, vegFriendly: true,
  },
  {
    id: "dubai", name: "Dubai", country: "UAE", type: "international",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    description: "Futuristic skyline, luxury shopping, and desert adventures",
    budgetRange: { min: 50000, max: 300000 }, bestMonths: [10, 11, 12, 1, 2, 3],
    tags: ["luxury", "shopping", "adventure"], rating: 4.5, vegFriendly: true,
  },
  {
    id: "vietnam", name: "Vietnam", country: "Vietnam", type: "international",
    image: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=600",
    description: "Stunning landscapes, rich history, and incredible street food",
    budgetRange: { min: 25000, max: 120000 }, bestMonths: [2, 3, 4, 9, 10, 11],
    tags: ["culture", "food", "nature"], rating: 4.5, vegFriendly: false,
  },
  {
    id: "singapore", name: "Singapore", country: "Singapore", type: "international",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
    description: "Garden city with futuristic architecture and diverse cuisine",
    budgetRange: { min: 40000, max: 200000 }, bestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    tags: ["urban", "food", "family"], rating: 4.7, vegFriendly: true,
  },
  {
    id: "bali", name: "Bali", country: "Indonesia", type: "international",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    description: "Spiritual temples, rice terraces, surfing, and wellness retreats",
    budgetRange: { min: 30000, max: 180000 }, bestMonths: [4, 5, 6, 7, 8, 9],
    tags: ["beach", "wellness", "culture"], rating: 4.7, vegFriendly: true,
  },
  {
    id: "turkey", name: "Turkey", country: "Turkey", type: "international",
    image: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600",
    description: "Ancient ruins, hot air balloons, and East-meets-West culture",
    budgetRange: { min: 40000, max: 200000 }, bestMonths: [4, 5, 6, 9, 10],
    tags: ["culture", "history", "adventure"], rating: 4.6, vegFriendly: false,
  },
];

// ============= VISA RULES =============
export const visaRules: Record<string, VisaInfo> = {
  goa: { destination: "Goa", required: false, type: "N/A", processingDays: 0, documents: [], cost: "Free", notes: "Domestic travel — no visa required" },
  manali: { destination: "Manali", required: false, type: "N/A", processingDays: 0, documents: [], cost: "Free", notes: "Domestic travel — no visa required" },
  kerala: { destination: "Kerala", required: false, type: "N/A", processingDays: 0, documents: [], cost: "Free", notes: "Domestic travel — no visa required" },
  jaipur: { destination: "Jaipur", required: false, type: "N/A", processingDays: 0, documents: [], cost: "Free", notes: "Domestic travel — no visa required" },
  andaman: { destination: "Andaman", required: false, type: "N/A", processingDays: 0, documents: [], cost: "Free", notes: "Domestic travel — Indian nationals only. Foreign nationals need RAP (Restricted Area Permit)" },
  thailand: { destination: "Thailand", required: true, type: "Visa on Arrival", processingDays: 0, documents: ["Valid passport (6+ months)", "Return flight ticket", "Hotel confirmation", "Passport-size photo", "Proof of funds (20,000 THB)"], cost: "₹1,500", notes: "30-day stay. Extendable by 30 days at immigration office." },
  dubai: { destination: "Dubai", required: true, type: "E-Visa", processingDays: 4, documents: ["Valid passport (6+ months)", "Passport-size photo", "Travel itinerary", "Hotel booking", "Bank statement (3 months)"], cost: "₹5,000", notes: "30-day tourist visa. Apply online through approved portals." },
  vietnam: { destination: "Vietnam", required: true, type: "E-Visa", processingDays: 3, documents: ["Valid passport (6+ months)", "Passport-size photo", "Travel itinerary", "Proof of accommodation"], cost: "₹2,000", notes: "30-day single entry. Apply at least 1 week before travel." },
  singapore: { destination: "Singapore", required: true, type: "Tourist Visa", processingDays: 5, documents: ["Valid passport (6+ months)", "Passport-size photos (2)", "Employment letter", "Bank statement (3 months)", "Hotel booking", "Return flight ticket", "Cover letter"], cost: "₹3,000", notes: "30-day stay. Apply through VFS Global or Singapore Embassy." },
  bali: { destination: "Bali", required: true, type: "Visa on Arrival", processingDays: 0, documents: ["Valid passport (6+ months)", "Return flight ticket", "Proof of funds"], cost: "₹3,500 (500,000 IDR)", notes: "30-day stay. Extendable once for 30 days." },
  turkey: { destination: "Turkey", required: true, type: "E-Visa", processingDays: 1, documents: ["Valid passport (6+ months)", "Return flight ticket", "Proof of accommodation", "Proof of sufficient funds"], cost: "₹4,500", notes: "90-day stay within 180-day period. Apply online at evisa.gov.tr" },
};

// ============= FLIGHT GENERATOR =============
const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoFirst", "AirAsia India", "Emirates", "Singapore Airlines", "Thai Airways", "Vietnam Airlines", "Turkish Airlines", "Etihad"];

export function generateFlights(from: string, to: string, budget: number): Flight[] {
  const isInternational = !["Goa", "Manali", "Kerala", "Jaipur", "Andaman"].includes(to);
  const basePrice = isInternational ? 12000 + Math.random() * 25000 : 3000 + Math.random() * 8000;
  
  const flights: Flight[] = [
    {
      id: `f1-${to}`, airline: airlines[Math.floor(Math.random() * (isInternational ? airlines.length : 6))],
      departure: from, arrival: to, departureTime: "06:15", arrivalTime: isInternational ? "12:30" : "08:45",
      duration: isInternational ? "6h 15m" : "2h 30m", layovers: 0,
      price: Math.round(basePrice * 0.85), baggage: "15 kg", tag: "cheapest",
    },
    {
      id: `f2-${to}`, airline: airlines[Math.floor(Math.random() * (isInternational ? airlines.length : 6))],
      departure: from, arrival: to, departureTime: "10:00", arrivalTime: isInternational ? "14:15" : "12:00",
      duration: isInternational ? "4h 15m" : "2h 00m", layovers: 0,
      price: Math.round(basePrice * 1.2), baggage: "20 kg", tag: "fastest",
    },
    {
      id: `f3-${to}`, airline: airlines[Math.floor(Math.random() * (isInternational ? airlines.length : 6))],
      departure: from, arrival: to, departureTime: "14:30", arrivalTime: isInternational ? "20:45" : "17:00",
      duration: isInternational ? "5h 15m" : "2h 30m", layovers: isInternational ? 1 : 0,
      price: Math.round(basePrice), baggage: "25 kg", tag: "best-value",
    },
    {
      id: `f4-${to}`, airline: airlines[Math.floor(Math.random() * (isInternational ? airlines.length : 6))],
      departure: from, arrival: to, departureTime: "19:00", arrivalTime: isInternational ? "03:30" : "21:15",
      duration: isInternational ? "7h 30m" : "2h 15m", layovers: isInternational ? 1 : 0,
      price: Math.round(basePrice * 0.9), baggage: "20 kg",
    },
  ];
  return flights.sort((a, b) => a.price - b.price);
}

// ============= HOTEL GENERATOR =============
const hotelNames: Record<string, string[]> = {
  budget: ["Backpacker's Haven", "The Cozy Nest", "Budget Inn", "Traveller's Lodge", "City Stay"],
  "mid-range": ["The Grand Orchid", "Seaside Retreat", "Heritage Suites", "Paradise View", "The Azure"],
  luxury: ["The Royal Palace", "Platinum Residency", "Five Elements Resort", "The Emerald Crown", "Imperial Grand"],
};

export function generateHotels(destination: string, budget: number, breakfastPref: boolean): Hotel[] {
  const perNight = budget / 5; // assume 5 nights
  const categories: ("budget" | "mid-range" | "luxury")[] = perNight < 3000 ? ["budget", "mid-range"] : perNight < 8000 ? ["budget", "mid-range", "luxury"] : ["mid-range", "luxury"];
  
  return categories.flatMap((cat, ci) => {
    const names = hotelNames[cat];
    return [0, 1].map((i) => ({
      id: `h-${destination}-${ci}-${i}`,
      name: `${names[i % names.length]} ${destination}`,
      location: `${destination} City Center`,
      pricePerNight: Math.round(cat === "budget" ? 1200 + Math.random() * 2000 : cat === "mid-range" ? 3500 + Math.random() * 4000 : 8000 + Math.random() * 12000),
      rating: cat === "budget" ? 3.5 + Math.random() * 0.8 : cat === "mid-range" ? 4.0 + Math.random() * 0.5 : 4.5 + Math.random() * 0.4,
      reviewSummary: cat === "budget" ? "Clean rooms, great value for money. Friendly staff." : cat === "mid-range" ? "Excellent location, comfortable stay. Good breakfast." : "Luxurious experience. World-class amenities and service.",
      amenities: cat === "budget" ? ["Wi-Fi", "AC", "TV"] : cat === "mid-range" ? ["Wi-Fi", "Pool", "AC", "Gym", "Restaurant"] : ["Wi-Fi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Room Service", "Concierge"],
      image: `https://images.unsplash.com/photo-${cat === "budget" ? "1566073771259-6a8506099945" : cat === "mid-range" ? "1582719508461-905c673b5f72" : "1542314831-068cd1dbfeeb"}?w=400`,
      breakfastIncluded: cat !== "budget" || breakfastPref,
      category: cat,
    }));
  });
}

// ============= RESTAURANT GENERATOR =============
const restaurantData: Record<string, Restaurant[]> = {
  thailand: [
    { id: "r-th-1", name: "Pad Thai Street Corner", cuisine: "Thai", rating: 4.6, priceRange: "₹200-500", vegFriendly: true, veganFriendly: true, mealType: ["lunch", "dinner"], specialty: "Classic Pad Thai with tofu option", type: "street-food" },
    { id: "r-th-2", name: "Green Curry House", cuisine: "Thai", rating: 4.8, priceRange: "₹500-1200", vegFriendly: true, veganFriendly: false, mealType: ["lunch", "dinner"], specialty: "Authentic Green Curry", type: "restaurant" },
    { id: "r-th-3", name: "Mango Tango Cafe", cuisine: "Fusion", rating: 4.4, priceRange: "₹300-800", vegFriendly: true, veganFriendly: true, mealType: ["breakfast", "snack"], specialty: "Mango Sticky Rice & Thai Coffee", type: "cafe" },
    { id: "r-th-4", name: "Spice Road BBQ", cuisine: "Thai", rating: 4.5, priceRange: "₹400-1000", vegFriendly: false, veganFriendly: false, mealType: ["dinner"], specialty: "Grilled seafood platter", type: "restaurant" },
    { id: "r-th-5", name: "Indian Zaika Bangkok", cuisine: "Indian", rating: 4.3, priceRange: "₹400-900", vegFriendly: true, veganFriendly: true, mealType: ["lunch", "dinner"], specialty: "North Indian thali", type: "restaurant" },
  ],
  goa: [
    { id: "r-goa-1", name: "Beach Shack Vibes", cuisine: "Goan", rating: 4.5, priceRange: "₹200-600", vegFriendly: true, veganFriendly: false, mealType: ["lunch", "dinner"], specialty: "Fish Curry Rice", type: "restaurant" },
    { id: "r-goa-2", name: "Vindaloo Kitchen", cuisine: "Goan", rating: 4.7, priceRange: "₹300-800", vegFriendly: false, veganFriendly: false, mealType: ["lunch", "dinner"], specialty: "Pork Vindaloo", type: "restaurant" },
    { id: "r-goa-3", name: "Green Leaf Cafe", cuisine: "Continental", rating: 4.4, priceRange: "₹250-700", vegFriendly: true, veganFriendly: true, mealType: ["breakfast", "lunch"], specialty: "Smoothie bowls & salads", type: "cafe" },
    { id: "r-goa-4", name: "Sunset Chai Stall", cuisine: "Indian", rating: 4.2, priceRange: "₹50-200", vegFriendly: true, veganFriendly: true, mealType: ["snack"], specialty: "Masala chai with bhaji", type: "street-food" },
  ],
  dubai: [
    { id: "r-dub-1", name: "Al Hadheerah", cuisine: "Arabic", rating: 4.8, priceRange: "₹1500-3000", vegFriendly: true, veganFriendly: false, mealType: ["dinner"], specialty: "Desert dining experience", type: "restaurant" },
    { id: "r-dub-2", name: "Saravana Bhavan Dubai", cuisine: "Indian", rating: 4.5, priceRange: "₹300-800", vegFriendly: true, veganFriendly: true, mealType: ["breakfast", "lunch", "dinner"], specialty: "South Indian thali", type: "restaurant" },
    { id: "r-dub-3", name: "Shawarma Street", cuisine: "Arabic", rating: 4.3, priceRange: "₹150-400", vegFriendly: false, veganFriendly: false, mealType: ["lunch", "snack"], specialty: "Chicken shawarma wrap", type: "street-food" },
  ],
  bali: [
    { id: "r-bali-1", name: "Warung Bali", cuisine: "Indonesian", rating: 4.6, priceRange: "₹200-500", vegFriendly: true, veganFriendly: true, mealType: ["lunch", "dinner"], specialty: "Nasi Goreng", type: "restaurant" },
    { id: "r-bali-2", name: "Ubud Vegan Kitchen", cuisine: "Vegan", rating: 4.7, priceRange: "₹300-700", vegFriendly: true, veganFriendly: true, mealType: ["breakfast", "lunch"], specialty: "Buddha bowls & raw desserts", type: "cafe" },
    { id: "r-bali-3", name: "Jimbaran Bay Seafood", cuisine: "Indonesian", rating: 4.8, priceRange: "₹500-1500", vegFriendly: false, veganFriendly: false, mealType: ["dinner"], specialty: "Beachside grilled fish", type: "restaurant" },
  ],
};

// Default restaurants for destinations without specific data
const defaultRestaurants: Restaurant[] = [
  { id: "r-def-1", name: "Local Kitchen", cuisine: "Local", rating: 4.4, priceRange: "₹200-600", vegFriendly: true, veganFriendly: false, mealType: ["lunch", "dinner"], specialty: "Traditional local cuisine", type: "restaurant" },
  { id: "r-def-2", name: "Heritage Cafe", cuisine: "Fusion", rating: 4.3, priceRange: "₹300-800", vegFriendly: true, veganFriendly: true, mealType: ["breakfast", "lunch"], specialty: "Artisan coffee & pastries", type: "cafe" },
  { id: "r-def-3", name: "Street Bites", cuisine: "Local", rating: 4.1, priceRange: "₹50-300", vegFriendly: true, veganFriendly: true, mealType: ["snack"], specialty: "Local street food favorites", type: "street-food" },
];

export function getRestaurants(destinationId: string, vegPref: string, cuisinePref: string): Restaurant[] {
  let list = restaurantData[destinationId] || defaultRestaurants;
  if (vegPref === "veg") list = list.filter(r => r.vegFriendly);
  if (vegPref === "vegan") list = list.filter(r => r.veganFriendly);
  if (cuisinePref === "indian") list = list.filter(r => r.cuisine === "Indian" || r.cuisine === "Fusion");
  return list.length ? list : defaultRestaurants;
}

// ============= TRANSPORT GENERATOR =============
export function getTransport(destinationId: string): TransportOption[] {
  const isInternational = !["goa", "manali", "kerala", "jaipur", "andaman"].includes(destinationId);
  return [
    { id: `t-${destinationId}-1`, type: "airport-transfer", name: "Airport Shuttle", route: "Airport → Hotel", duration: "45 min", price: isInternational ? 1500 : 500, bookableOnline: true },
    { id: `t-${destinationId}-2`, type: "taxi", name: "Private Taxi", route: "On-demand city travel", duration: "Varies", price: isInternational ? 800 : 300, bookableOnline: true },
    { id: `t-${destinationId}-3`, type: "metro", name: "Metro / Local Transit", route: "City-wide coverage", duration: "Varies", price: isInternational ? 150 : 30, bookableOnline: false, offlineGuidance: "Purchase tickets at metro station counters. Day passes available." },
    { id: `t-${destinationId}-4`, type: "bus", name: "Local Bus", route: "Inter-city routes", duration: "1-3 hours", price: isInternational ? 300 : 100, bookableOnline: false, offlineGuidance: "Board at bus stations. Ask hotel reception for route info." },
  ];
}

// ============= ITINERARY GENERATOR =============
export interface ItineraryDay {
  day: number;
  date: string;
  activities: { time: string; title: string; type: "transport" | "hotel" | "attraction" | "food" | "rest" | "flight"; description: string }[];
}

export function generateItinerary(destination: string, days: number, hotel: Hotel | null, restaurants: Restaurant[]): ItineraryDay[] {
  const attractions: Record<string, string[]> = {
    goa: ["Baga Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls", "Anjuna Flea Market", "Chapora Fort"],
    manali: ["Rohtang Pass", "Solang Valley", "Hadimba Temple", "Old Manali", "Jogini Falls", "Mall Road"],
    kerala: ["Alleppey Backwaters", "Munnar Tea Gardens", "Fort Kochi", "Periyar Wildlife Sanctuary", "Kovalam Beach", "Athirappilly Falls"],
    jaipur: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar", "Nahargarh Fort", "Jal Mahal"],
    andaman: ["Radhanagar Beach", "Cellular Jail", "Elephant Beach", "Ross Island", "Scuba Diving", "Limestone Caves"],
    thailand: ["Grand Palace", "Wat Pho", "Chatuchak Market", "Phi Phi Islands", "Floating Market", "Chiang Mai Night Bazaar"],
    dubai: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Desert Safari", "Dubai Marina", "Gold Souk"],
    vietnam: ["Ha Long Bay", "Hoi An Old Town", "Cu Chi Tunnels", "Marble Mountains", "Mekong Delta", "Temple of Literature"],
    singapore: ["Marina Bay Sands", "Gardens by the Bay", "Sentosa Island", "Chinatown", "Little India", "Universal Studios"],
    bali: ["Ubud Rice Terraces", "Tanah Lot Temple", "Kuta Beach", "Monkey Forest", "Mount Batur Sunrise", "Uluwatu Temple"],
    turkey: ["Hagia Sophia", "Cappadocia Balloons", "Blue Mosque", "Ephesus Ruins", "Pamukkale", "Grand Bazaar"],
  };

  const destAttractions = attractions[destination] || ["City Tour", "Local Market", "Cultural Center", "Nature Walk", "Historic Site"];
  
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 7);
    const dayAttractions = destAttractions.slice((i * 2) % destAttractions.length, ((i * 2) % destAttractions.length) + 2);
    const mealRestaurant = restaurants[i % restaurants.length];

    const activities: ItineraryDay["activities"] = [];
    
    if (i === 0) {
      activities.push({ time: "06:00", title: "Flight Arrival", type: "flight", description: "Arrive at destination airport" });
      activities.push({ time: "08:00", title: "Airport Transfer", type: "transport", description: "Shuttle to hotel" });
      activities.push({ time: "09:30", title: `Check-in: ${hotel?.name || "Hotel"}`, type: "hotel", description: "Check in and freshen up" });
    }

    activities.push({ time: i === 0 ? "11:00" : "09:00", title: "Breakfast", type: "food", description: hotel?.breakfastIncluded ? "Breakfast at hotel" : `${mealRestaurant?.name || "Local cafe"}` });
    
    if (dayAttractions[0]) {
      activities.push({ time: i === 0 ? "12:00" : "10:30", title: dayAttractions[0], type: "attraction", description: `Explore ${dayAttractions[0]}` });
    }
    
    activities.push({ time: "13:00", title: "Lunch", type: "food", description: mealRestaurant?.name || "Local restaurant" });

    if (dayAttractions[1]) {
      activities.push({ time: "15:00", title: dayAttractions[1], type: "attraction", description: `Visit ${dayAttractions[1]}` });
    }

    activities.push({ time: "17:00", title: "Rest & Relaxation", type: "rest", description: "Free time at hotel or local exploration" });
    activities.push({ time: "19:30", title: "Dinner", type: "food", description: `Dinner at ${restaurants[(i + 1) % restaurants.length]?.name || "local restaurant"}` });

    if (i === days - 1) {
      activities.push({ time: "22:00", title: "Check-out & Airport", type: "transport", description: "Transfer to airport for return flight" });
    }

    return {
      day: i + 1,
      date: date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
      activities,
    };
  });
}

// ============= RECOMMENDATION ENGINE =============
export function getRecommendedDestinations(
  budget: number, month: number, duration: number, destType: string, foodPref: string
): Destination[] {
  return destinations
    .filter(d => {
      if (destType === "domestic" && d.type !== "domestic") return false;
      if (destType === "international" && d.type !== "international") return false;
      if (budget < d.budgetRange.min) return false;
      if (foodPref === "veg" && !d.vegFriendly) return false;
      return true;
    })
    .sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.bestMonths.includes(month)) scoreA += 3;
      if (b.bestMonths.includes(month)) scoreB += 3;
      if (budget >= a.budgetRange.min && budget <= a.budgetRange.max) scoreA += 2;
      if (budget >= b.budgetRange.min && budget <= b.budgetRange.max) scoreB += 2;
      scoreA += a.rating;
      scoreB += b.rating;
      return scoreB - scoreA;
    })
    .slice(0, 6);
}
