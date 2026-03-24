import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TripProvider } from "@/contexts/TripContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PreferencesPage from "./pages/PreferencesPage";
import DestinationsPage from "./pages/DestinationsPage";
import TripPlannerPage from "./pages/TripPlannerPage";
import PaymentPage from "./pages/PaymentPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TripProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/plan" element={<PreferencesPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/trip-planner" element={<TripPlannerPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TripProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
